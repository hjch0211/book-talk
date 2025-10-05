import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {VoiceChatManager, type VoiceChatParticipant,} from '../apis/webrtc/VoiceChatManager';
import type {WebSocketMessage} from '../apis/websocket';

interface VoiceChatContextValue {
    participants: VoiceChatParticipant[];
    isJoined: boolean;
    isMuted: boolean;
    isConnecting: boolean;
    joinVoiceChat: () => Promise<void>;
    leaveVoiceChat: () => Promise<void>;
    toggleMute: () => void;
    setParticipantVolume: (participantId: string, volume: number) => void;
    getRemoteStream: (participantId: string) => MediaStream | null;
    getLocalStream: () => MediaStream | null;
    handleIncomingSignalingMessage: (message: WebSocketMessage) => void;
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
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

    const voiceChatManagerRef = useRef<VoiceChatManager | null>(null);

    // Define handleIncomingSignalingMessage - participants를 직접 참조하지 않도록 수정
    const handleIncomingSignalingMessage = React.useCallback((message: WebSocketMessage) => {
        const manager = voiceChatManagerRef.current;
        if (!manager || !message.fromId) return;

        switch (message.type) {
            case 'VOICE_JOIN': {
                const participant = participantsList.find(p => p.id === message.fromId);
                if (participant) {
                    void manager.handleParticipantJoined(message.fromId, participant.name);
                }
                break;
            }
            case 'VOICE_LEAVE': {
                void manager.handleParticipantLeft(message.fromId);
                break;
            }
            case 'VOICE_OFFER': {
                if (message.offer && message.toId === myAccountId) {
                    void manager.handleOffer(message.fromId, message.offer);
                }
                break;
            }
            case 'VOICE_ANSWER': {
                if (message.answer && message.toId === myAccountId) {
                    void manager.handleAnswer(message.fromId, message.answer);
                }
                break;
            }
            case 'VOICE_ICE': {
                if (message.iceCandidate && message.toId === myAccountId) {
                    void manager.handleIceCandidate(message.fromId, message.iceCandidate);
                }
                break;
            }
            case 'VOICE_STATE': {
                // participants 상태를 함수형 업데이트로 변경하여 의존성 제거
                if (message.isMuted !== undefined) {
                    setParticipants(prev => {
                        const targetParticipant = prev.find(p => p.accountId === message.fromId);
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

    const joinVoiceChat = async () => {
        if (!voiceChatManagerRef.current || isConnecting) return;

        setIsConnecting(true);
        try {
            await voiceChatManagerRef.current.joinVoiceChat();
            setIsJoined(true);

            // Only initiate connections to participants with lower IDs to prevent conflicts
            // This ensures deterministic connection initiation
            participantsList.forEach(participant => {
                if (participant.id !== myAccountId) {
                    const shouldInitiate = myAccountId < participant.id;
                    voiceChatManagerRef.current?.handleParticipantJoined(
                        participant.id,
                        participant.name,
                        shouldInitiate
                    );
                }
            });
        } catch (error) {
            console.error('Failed to join voice chat:', error);
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
        joinVoiceChat,
        leaveVoiceChat,
        toggleMute,
        setParticipantVolume,
        getRemoteStream,
        getLocalStream,
        handleIncomingSignalingMessage
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