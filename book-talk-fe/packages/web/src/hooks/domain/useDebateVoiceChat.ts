import {useCallback, useEffect, useRef, useState} from 'react';
import {useWebRTC} from '../infra/useWebRTC';
import type {
    WebSocketMessage,
    WS_VoiceAnswerRequest,
    WS_VoiceIceRequest,
    WS_VoiceJoinRequest,
    WS_VoiceOfferRequest,
} from '../../apis/websocket/schema';

/** Voice 메시지 타입 (전송용) */
type VoiceMessage =
    | WS_VoiceJoinRequest
    | WS_VoiceOfferRequest
    | WS_VoiceAnswerRequest
    | WS_VoiceIceRequest;

export interface UseDebateVoiceChatOptions {
    /** 내 ID */
    myId: string;
    /** 토론 ID */
    debateId: string;
    /** Voice 메시지 전송 함수 */
    sendVoiceMessage: (message: VoiceMessage) => void;
    /** 수신된 음성 시그널링 메시지 (WebSocket에서 전달) */
    voiceMessage: WebSocketMessage | null;
    /** 활성화 여부 (기본: true) */
    enabled?: boolean;
    /** 에러 콜백 */
    onError?: (error: Error) => void;
}

/**
 * 토론 음성 채팅 관리 (내부 전용)
 * - 토론방 입장 시 자동 참여
 * - WebRTC P2P 연결 관리
 * - 원격 오디오 스트림 병합
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateVoiceChat = (options: UseDebateVoiceChatOptions) => {
    const {myId, sendVoiceMessage, voiceMessage, enabled = true, onError} = options;

    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isAudioActive, setIsAudioActive] = useState(false); // autoplay policy 대응

    /** 최신 상태를 ref로 유지 (useEffect 내에서 사용) */
    const isJoinedRef = useRef(isJoined);
    isJoinedRef.current = isJoined;

    /** 마지막 처리된 메시지 추적 (중복 처리 방지) */
    const lastProcessedMessageRef = useRef<WebSocketMessage | null>(null);

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
                type: 'C_VOICE_ICE',
                provider: 'CLIENT',
                fromId: myId,
                toId: peerId,
                iceCandidate: candidate
            });
        },
        onError
    });


    /** 음성 채팅 참여 */
    const join = useCallback(async () => {
        if (isJoinedRef.current || !myId) return;

        const stream = await startLocalStream({audio: true, video: false});
        if (!stream) {
            console.error('로컬 스트림 생성 실패');
            return;
        }

        // ref를 먼저 업데이트하여 즉시 Offer를 받을 수 있도록 함
        isJoinedRef.current = true;
        setIsJoined(true);

        sendVoiceMessage({
            type: 'C_VOICE_JOIN',
            provider: 'CLIENT',
            accountId: myId
        });
    }, [myId, sendVoiceMessage, startLocalStream]);

    /** 음성 채팅 퇴장 */
    const leave = useCallback(() => {
        if (!isJoinedRef.current) return;

        disconnect();
        isJoinedRef.current = false;
        setIsJoined(false);
    }, [disconnect]);

    /** 음소거 토글 */
    const toggleMute = useCallback(() => {
        const stream = localStream;
        if (!stream) return;

        const newMuted = !isMuted;
        stream.getAudioTracks().forEach(track => {
            track.enabled = !newMuted;
        });
        setIsMuted(newMuted);
    }, [localStream, isMuted]);

    /** 오디오 활성화 (사용자 제스처로 autoplay policy 해제) */
    const activateAudio = useCallback(() => {
        setIsAudioActive(true);
    }, []);

    /** 음성 메시지 처리 (내부 함수) - isJoinedRef 사용으로 의존성 최소화 */
    const processVoiceMessage = useCallback(async (message: WebSocketMessage) => {
        switch (message.type) {
            case 'S_VOICE_JOIN': {
                // 다른 사람이 참여 → 내가 참여 중이면 offer 전송
                const fromId = message.fromId ?? message.accountId;
                if (fromId === myId || !isJoinedRef.current) return;

                const offer = await createOffer(fromId);
                if (offer) {
                    sendVoiceMessage({
                        type: 'C_VOICE_OFFER',
                        provider: 'CLIENT',
                        fromId: myId,
                        toId: fromId,
                        offer
                    });
                }
                break;
            }

            case 'S_VOICE_OFFER': {
                // Offer 수신 → Answer 생성 후 전송
                if (message.toId !== myId || !isJoinedRef.current) return;

                const answer = await handleOffer(message.fromId, message.offer);
                if (answer) {
                    sendVoiceMessage({
                        type: 'C_VOICE_ANSWER',
                        provider: 'CLIENT',
                        fromId: myId,
                        toId: message.fromId,
                        answer
                    });
                }
                break;
            }

            case 'S_VOICE_ANSWER': {
                // Answer 수신 → 연결 완료
                if (message.toId !== myId) return;
                await handleAnswer(message.fromId, message.answer);
                break;
            }

            case 'S_VOICE_ICE': {
                // ICE Candidate 수신
                if (message.toId !== myId) return;
                await handleIceCandidate(message.fromId, message.iceCandidate);
                break;
            }
        }
    }, [myId, createOffer, handleOffer, handleAnswer, handleIceCandidate, sendVoiceMessage]);

    // voiceMessage가 변경되면 처리 (중복 처리 방지)
    useEffect(() => {
        if (voiceMessage && voiceMessage !== lastProcessedMessageRef.current) {
            lastProcessedMessageRef.current = voiceMessage;
            processVoiceMessage(voiceMessage);
        }
    }, [voiceMessage, processVoiceMessage]);

    // enabled 상태에 따라 자동 참여/퇴장
    useEffect(() => {
        if (enabled) {
            join();
        } else {
            leave();
        }
        return () => leave();
    }, [enabled]);

    return {
        /** 음성 채팅 참여 여부 */
        isJoined,
        /** 음소거 상태 */
        isMuted,
        /** 오디오 재생 가능 상태 (사용자 제스처 후 true) */
        isAudioActive,
        /** 로컬 오디오 스트림 */
        localStream,
        /** 원격 오디오 스트림 목록 */
        remoteStreams,
        /** 음성 채팅 퇴장 */
        leave,
        /** 음소거 토글 */
        toggleMute,
        /** 오디오 활성화 (사용자 클릭 필요) */
        activateAudio
    };
};
