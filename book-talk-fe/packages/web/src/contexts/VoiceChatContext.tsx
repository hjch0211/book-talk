import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {VoiceChatManager, type VoiceChatParticipant,} from '../apis/webrtc/VoiceChatManager';
import type {WebSocketMessage} from '../apis/websocket';

interface VoiceChatContextValue {
    participants: VoiceChatParticipant[];
    isJoined: boolean;
    isMuted: boolean;
    isConnecting: boolean;
    hasMicPermission: boolean;
    joinVoiceChat: () => Promise<void>;
    leaveVoiceChat: () => Promise<void>;
    toggleMute: () => void;
    setParticipantVolume: (participantId: string, volume: number) => void;
    getRemoteStream: (participantId: string) => MediaStream | null;
    getLocalStream: () => MediaStream | null;
    handleIncomingSignalingMessage: (message: WebSocketMessage) => void;
    requestMicPermission: () => Promise<boolean>;
}

const VoiceChatContext = createContext<VoiceChatContextValue | null>(null);

interface VoiceChatProviderProps {
    children: React.ReactNode;
    debateId: string;
    myAccountId: string;
    onSignalingMessage: (message: WebSocketMessage) => void;
    voiceChatHandlerRef: React.RefObject<((message: WebSocketMessage) => void) | null | undefined>
    participantsList: Array<{ id: string; name: string }>;
}

export const VoiceChatProvider: React.FC<VoiceChatProviderProps> = ({
                                                                        children,
                                                                        debateId,
                                                                        myAccountId,
                                                                        onSignalingMessage,
                                                                        voiceChatHandlerRef,
                                                                        participantsList
                                                                    }) => {
    const [participants, setParticipants] = useState<VoiceChatParticipant[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

    const voiceChatManagerRef = useRef<VoiceChatManager | null>(null);

    // Define handleIncomingSignalingMessage - participants를 직접 참조하지 않도록 수정
    const handleIncomingSignalingMessage = React.useCallback((message: WebSocketMessage) => {
        const manager = voiceChatManagerRef.current;
        if (!manager) return;

        // 음성 채팅 메시지가 아니면 무시
        const voiceMessageTypes = ['VOICE_JOIN', 'VOICE_LEAVE', 'VOICE_OFFER', 'VOICE_ANSWER', 'VOICE_ICE', 'VOICE_STATE'];
        if (!voiceMessageTypes.includes(message.type)) return;

        // fromId가 있는 메시지만 처리 (타입 가드)
        if (!('fromId' in message) || !message.fromId) return;

        // 자기 자신의 메시지는 무시
        if (message.fromId === myAccountId) return;

        const fromId = message.fromId;  // fromId를 변수로 추출하여 타입 체크 통과

        switch (message.type) {
            case 'VOICE_JOIN': {
                const participant = participantsList.find(p => p.id === fromId);
                if (participant) {
                    // shouldInitiate: 내 ID가 더 작으면 내가 Offer 전송
                    const shouldInitiate = myAccountId < fromId;
                    void manager.handleParticipantJoined(fromId, participant.name, shouldInitiate);
                }
                break;
            }
            case 'VOICE_LEAVE': {
                void manager.handleParticipantLeft(fromId);
                break;
            }
            case 'VOICE_OFFER': {
                if ('offer' in message && message.offer && 'toId' in message && message.toId === myAccountId) {
                    void manager.handleOffer(fromId, message.offer);
                }
                break;
            }
            case 'VOICE_ANSWER': {
                if ('answer' in message && message.answer && 'toId' in message && message.toId === myAccountId) {
                    void manager.handleAnswer(fromId, message.answer);
                }
                break;
            }
            case 'VOICE_ICE': {
                if ('iceCandidate' in message && message.iceCandidate && 'toId' in message && message.toId === myAccountId) {
                    void manager.handleIceCandidate(fromId, message.iceCandidate);
                }
                break;
            }
            case 'VOICE_STATE': {
                // participants 상태를 함수형 업데이트로 변경하여 의존성 제거
                if ('isMuted' in message && message.isMuted !== undefined) {
                    setParticipants(prev => {
                        const targetParticipant = prev.find(p => p.accountId === fromId);
                        if (targetParticipant) {
                            targetParticipant.isMuted = message.isMuted!;
                            return [...prev];
                        }
                        return prev;
                    });
                }
                break;
            }
        }
    }, [myAccountId, participantsList]);

    // VoiceChatManager 초기화 - onSignalingMessage를 ref로 관리하여 재생성 방지
    const onSignalingMessageRef = useRef(onSignalingMessage);

    useEffect(() => {
        onSignalingMessageRef.current = onSignalingMessage;
    }, [onSignalingMessage]);

    useEffect(() => {
        const handleParticipantUpdate = (updatedParticipants: VoiceChatParticipant[]) => {
            setParticipants(updatedParticipants);
        };

        const handleRemoteStreamUpdate = (accountId: string, stream: MediaStream | null) => {
            setRemoteStreams(prev => {
                const newMap = new Map(prev);
                if (stream) {
                    newMap.set(accountId, stream);
                } else {
                    newMap.delete(accountId);
                }
                return newMap;
            });
        };

        const handleSignalingMessage = (message: WebSocketMessage) => {
            onSignalingMessageRef.current(message);
        };

        voiceChatManagerRef.current = new VoiceChatManager(
            debateId,
            myAccountId,
            handleSignalingMessage,
            handleParticipantUpdate,
            handleRemoteStreamUpdate
        );

        return () => {
            if (voiceChatManagerRef.current) {
                void voiceChatManagerRef.current.leaveVoiceChat();
                voiceChatManagerRef.current = null;
            }
        };
    }, [debateId, myAccountId]);

    // Set up voice chat handler ref - WebSocket에서 받은 음성 메시지를 처리하도록 등록
    useEffect(() => {
        voiceChatHandlerRef.current = handleIncomingSignalingMessage;
    }, [handleIncomingSignalingMessage, voiceChatHandlerRef]);

    // 마이크 권한 요청 함수
    const requestMicPermission = async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // 권한 확인용이므로 즉시 스트림 정리
            stream.getTracks().forEach(track => track.stop());
            setHasMicPermission(true);
            return true;
        } catch (error) {
            console.error('Failed to get microphone permission:', error);
            setHasMicPermission(false);
            return false;
        }
    };

    // 마이크 권한 초기 확인
    useEffect(() => {
        const checkPermission = async () => {
            if (!navigator.permissions || !navigator.permissions.query) {
                // permissions API 미지원 브라우저는 권한 없음으로 가정
                setHasMicPermission(false);
                return;
            }

            try {
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                setHasMicPermission(permissionStatus.state === 'granted');

                // 권한 상태 변경 감지
                permissionStatus.onchange = () => {
                    setHasMicPermission(permissionStatus.state === 'granted');
                };
            } catch (error) {
                // permissions API 지원하지만 microphone 쿼리 실패 시
                setHasMicPermission(false);
            }
        };

        void checkPermission();
    }, []);

    // 자동으로 음성 채팅 참여 (VoiceChatManager 초기화 후, 마이크 권한 있을 때만)
    useEffect(() => {
        // VoiceChatManager가 초기화되고 마이크 권한이 있을 때만 자동 참여 시도
        if (!voiceChatManagerRef.current || isJoined || isConnecting || !hasMicPermission) {
            return;
        }

        const timer = setTimeout(async () => {
            console.log('Auto-joining voice chat...');
            try {
                await joinVoiceChat();
            } catch (error) {
                // 마이크 권한 거부 시 조용히 무시 (사용자가 수동으로 참여 가능)
                if (error instanceof Error) {
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        console.warn('Microphone permission denied. User can join manually via mic button.');
                        setHasMicPermission(false);
                    } else {
                        console.error('Failed to auto-join voice chat:', error);
                    }
                }
            }
        }, 1000);  // 1초 지연 (WebSocket 연결 및 초기 메시지 수신 대기)

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceChatManagerRef.current, hasMicPermission]);

    const joinVoiceChat = async () => {
        if (!voiceChatManagerRef.current || isConnecting) return;

        setIsConnecting(true);
        try {
            await voiceChatManagerRef.current.joinVoiceChat();
            setIsJoined(true);
            setHasMicPermission(true);  // 성공적으로 참여하면 권한 있음으로 설정

            // VOICE_JOIN 브로드캐스트 전송됨
            // 기존 참가자들(ID가 작은 사람)이 나에게 Offer를 보냄
            // 나는 Offer를 받으면 Answer를 보냄
        } catch (error) {
            console.error('Failed to join voice chat:', error);
            // 권한 오류인 경우 hasMicPermission을 false로 설정
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    setHasMicPermission(false);
                }
            }
            throw error;  // 에러를 상위로 전파
        } finally {
            setIsConnecting(false);
        }
    };

    const leaveVoiceChat = async () => {
        if (!voiceChatManagerRef.current) return;

        await voiceChatManagerRef.current.leaveVoiceChat();
        setIsJoined(false);
        setIsMuted(false);
        setParticipants([]);
        setRemoteStreams(new Map());
    };

    const toggleMute = () => {
        if (!voiceChatManagerRef.current) return;

        voiceChatManagerRef.current.toggleMute();
        // Get the actual mute state from manager instead of toggling local state
        setIsMuted(voiceChatManagerRef.current.isMicMuted());
    };

    const setParticipantVolume = (participantId: string, volume: number) => {
        voiceChatManagerRef.current?.setParticipantVolume(participantId, volume);
    };

    const getRemoteStream = (participantId: string): MediaStream | null => {
        return remoteStreams.get(participantId) || null;
    };

    const getLocalStream = (): MediaStream | null => {
        return voiceChatManagerRef.current?.getLocalStream() || null;
    };

    const contextValue: VoiceChatContextValue = {
        participants,
        isJoined,
        isMuted,
        isConnecting,
        hasMicPermission,
        joinVoiceChat,
        leaveVoiceChat,
        toggleMute,
        setParticipantVolume,
        getRemoteStream,
        getLocalStream,
        handleIncomingSignalingMessage,
        requestMicPermission
    };

    return (
        <VoiceChatContext.Provider value={contextValue}>
            {children}
        </VoiceChatContext.Provider>
    );
};

export const useVoiceChatContext = () => {
    const context = useContext(VoiceChatContext);
    if (!context) {
        throw new Error('useVoiceChatContext must be used within a VoiceChatProvider');
    }
    return context;
};