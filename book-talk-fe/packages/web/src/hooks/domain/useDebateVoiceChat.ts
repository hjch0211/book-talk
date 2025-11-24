import {useCallback, useEffect, useRef, useState} from 'react';
import {type RemoteStream, useWebRTC} from '../infra/useWebRTC';
import type {
    WebSocketMessage,
    WS_VoiceAnswerMessage,
    WS_VoiceIceMessage,
    WS_VoiceJoinMessage,
    WS_VoiceOfferMessage,
} from '../../apis/websocket/schema';

export type {RemoteStream};

/** Voice 메시지 타입 (전송용) */
type VoiceMessage =
    | Omit<WS_VoiceJoinMessage, 'debateId'>
    | Omit<WS_VoiceOfferMessage, 'debateId'>
    | Omit<WS_VoiceAnswerMessage, 'debateId'>
    | Omit<WS_VoiceIceMessage, 'debateId'>;

export interface UseDebateVoiceChatOptions {
    /** 내 ID */
    myId: string;
    /** 토론 ID */
    debateId: string;
    /** Voice 메시지 전송 함수 */
    sendVoiceMessage: (message: VoiceMessage) => void;
    /** 에러 콜백 */
    onError?: (error: Error) => void;
}

export interface UseDebateVoiceChatReturn {
    /** 음성 채팅 참여 여부 */
    isJoined: boolean;
    /** 음소거 상태 */
    isMuted: boolean;
    /** 로컬 스트림 */
    localStream: MediaStream | null;
    /** 원격 스트림 목록 */
    remoteStreams: RemoteStream[];
    /** 병합된 오디오 스트림 */
    mergedAudioStream: MediaStream | null;
    /** 음성 채팅 퇴장 */
    leave: () => void;
    /** 음소거 토글 */
    toggleMute: () => void;
    /** WebSocket 메시지 핸들러 (onVoiceSignaling에 연결) */
    handleVoiceMessage: (message: WebSocketMessage) => void;
}

export const useDebateVoiceChat = (options: UseDebateVoiceChatOptions): UseDebateVoiceChatReturn => {
    const {myId, sendVoiceMessage, onError} = options;

    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [mergedAudioStream, setMergedAudioStream] = useState<MediaStream | null>(null);

    /** AudioContext for merging streams */
    const audioContextRef = useRef<AudioContext | null>(null);
    const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const sourceNodesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(new Map());

    const {
        localStream,
        remoteStreams,
        startLocalStream,
        createOffer,
        handleOffer,
        handleAnswer,
        handleIceCandidate,
        disconnect
    } = useWebRTC({
        onIceCandidate: (peerId, candidate) => {
            sendVoiceMessage({
                type: 'VOICE_ICE',
                provider: 'CLIENT',
                fromId: myId,
                toId: peerId,
                iceCandidate: candidate
            });
        },
        onError
    });

    /** 오디오 스트림 병합 */
    const mergeAudioStreams = useCallback(() => {
        // AudioContext 초기화
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
            destinationRef.current = audioContextRef.current.createMediaStreamDestination();
            setMergedAudioStream(destinationRef.current.stream);
        }

        const ctx = audioContextRef.current;
        const destination = destinationRef.current!;
        const existingNodes = sourceNodesRef.current;

        // 현재 연결된 peer ID 목록
        const currentPeerIds = new Set(remoteStreams.map(rs => rs.peerId));

        // 제거된 peer의 source node 정리
        existingNodes.forEach((node, peerId) => {
            if (!currentPeerIds.has(peerId)) {
                node.disconnect();
                existingNodes.delete(peerId);
            }
        });

        // 새 peer의 source node 생성
        remoteStreams.forEach(({peerId, stream}) => {
            if (!existingNodes.has(peerId)) {
                const source = ctx.createMediaStreamSource(stream);
                source.connect(destination);
                existingNodes.set(peerId, source);
            }
        });
    }, [remoteStreams]);

    /** 음성 채팅 참여 */
    const join = useCallback(async () => {
        if (isJoined) return;

        const stream = await startLocalStream({audio: true, video: false});
        if (!stream) return;

        setIsJoined(true);
        sendVoiceMessage({
            type: 'VOICE_JOIN',
            provider: 'CLIENT',
            accountId: myId
        });
    }, [isJoined, myId, sendVoiceMessage, startLocalStream]);

    /** 음성 채팅 퇴장 */
    const leave = useCallback(() => {
        if (!isJoined) return;

        disconnect();
        setIsJoined(false);

        // AudioContext 정리
        sourceNodesRef.current.forEach(node => node.disconnect());
        sourceNodesRef.current.clear();
        audioContextRef.current?.close();
        audioContextRef.current = null;
        destinationRef.current = null;
        setMergedAudioStream(null);
    }, [isJoined, disconnect]);

    /** 음소거 토글 */
    const toggleMute = useCallback(() => {
        if (!localStream) return;

        const newMuted = !isMuted;
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !newMuted;
        });
        setIsMuted(newMuted);
    }, [localStream, isMuted]);

    /** WebSocket 메시지 핸들러 */
    const handleVoiceMessage = useCallback(async (message: WebSocketMessage) => {
        switch (message.type) {
            case 'VOICE_JOIN': {
                // 다른 사람이 참여 → 내가 참여 중이면 offer 전송
                const fromId = message.fromId ?? message.accountId;
                if (fromId === myId || !isJoined) return;

                const offer = await createOffer(fromId);
                if (offer) {
                    sendVoiceMessage({
                        type: 'VOICE_OFFER',
                        provider: 'CLIENT',
                        fromId: myId,
                        toId: fromId,
                        offer
                    });
                }
                break;
            }

            case 'VOICE_OFFER': {
                // Offer 수신 → Answer 생성 후 전송
                if (message.toId !== myId) return;

                const answer = await handleOffer(message.fromId, message.offer);
                if (answer) {
                    sendVoiceMessage({
                        type: 'VOICE_ANSWER',
                        provider: 'CLIENT',
                        fromId: myId,
                        toId: message.fromId,
                        answer
                    });
                }
                break;
            }

            case 'VOICE_ANSWER': {
                // Answer 수신 → 연결 완료
                if (message.toId !== myId) return;
                await handleAnswer(message.fromId, message.answer);
                break;
            }

            case 'VOICE_ICE': {
                // ICE Candidate 수신
                if (message.toId !== myId) return;
                await handleIceCandidate(message.fromId, message.iceCandidate);
                break;
            }
        }
    }, [myId, isJoined, createOffer, handleOffer, handleAnswer, handleIceCandidate, sendVoiceMessage]);

    // 자동 참여 (마운트 시)
    useEffect(() => {
        join();
        return () => leave();
    }, []);

    // remoteStreams 변경 시 오디오 병합
    useEffect(() => {
        if (remoteStreams.length > 0) {
            mergeAudioStreams();
        }
    }, [remoteStreams, mergeAudioStreams]);

    return {
        isJoined,
        isMuted,
        localStream,
        remoteStreams,
        mergedAudioStream,
        leave,
        toggleMute,
        handleVoiceMessage
    };
};