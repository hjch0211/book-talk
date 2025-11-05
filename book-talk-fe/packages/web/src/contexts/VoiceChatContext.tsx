/**
 * VoiceChatContext - Voice Chat React Context
 *
 * Multi-peer mesh topology 지원
 * 각 참여자마다 독립적인 VoiceChatManager 생성 및 관리
 */

import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {VoiceChatManager} from '../apis/webrtc/VoiceChatManager';
import type {ConnectionState} from '../apis/webrtc/types';
import {VoiceChatJoinModal} from '../routes/Debate/_components/VoiceChatJoinModal';

interface VoiceChatContextValue {
    connectionStates: Map<string, ConnectionState>;
    isActive: boolean;
    isMuted: boolean;
    remoteStreams: Map<string, MediaStream>;
    toggleMute: () => void;
    handleSignalingMessage: (message: any) => void;
    requestJoinConfirmation: () => void;
}

const VoiceChatContext = createContext<VoiceChatContextValue | null>(null);

interface VoiceChatProviderProps {
    children: React.ReactNode;
    debateId: string;
    myAccountId: string;
    participantIds: string[];  // 모든 참여자 ID (자신 제외)
    onlineParticipants: Set<string>;  // 온라인 참여자 ID Set
    onSendSignaling: (message: any) => void;
    isWebSocketConnected: boolean;
    isDebateJoined: boolean;
}

export const VoiceChatProvider: React.FC<VoiceChatProviderProps> = ({
                                                                        children,
                                                                        debateId,
                                                                        myAccountId,
                                                                        participantIds,
                                                                        onlineParticipants,
                                                                        onSendSignaling,
                                                                        isWebSocketConnected,
                                                                        isDebateJoined
                                                                    }) => {
    // 상태
    const [connectionStates, setConnectionStates] = useState<Map<string, ConnectionState>>(new Map());
    const [isMuted, setIsMuted] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);

    // 참조
    const managersRef = useRef<Map<string, VoiceChatManager>>(new Map());
    const prevOnlineParticipantsRef = useRef<Set<string>>(new Set());

    /**
     * 참여자 온라인/오프라인 상태 변화 감지 및 Manager 생명주기 관리
     */
    useEffect(() => {
        // 사전 조건 확인
        if (!isWebSocketConnected) {
            console.log('⏳ Waiting for WebSocket connection...');
            return;
        }

        if (!isDebateJoined) {
            console.log('⏳ Waiting for debate join...');
            return;
        }

        const prevOnline = prevOnlineParticipantsRef.current;
        const currentOnline = onlineParticipants;

        // 새로 온라인된 참여자 찾기
        const newlyOnline = Array.from(currentOnline).filter(id =>
            participantIds.includes(id) && !prevOnline.has(id)
        );

        // 오프라인된 참여자 찾기
        const newlyOffline = Array.from(prevOnline).filter(id =>
            !currentOnline.has(id)
        );

        // 새로 온라인된 참여자에 대해 Manager 생성
        newlyOnline.forEach(peerId => {
            console.log(`✅ Peer ${peerId} 온라인 → Manager 생성`);
            void createManagerForPeer(peerId);
        });

        // 오프라인된 참여자의 Manager 정리
        newlyOffline.forEach(peerId => {
            console.log(`🔌 Peer ${peerId} 오프라인 → Manager 정리`);
            cleanupManagerForPeer(peerId);
        });

        // 이전 상태 업데이트
        prevOnlineParticipantsRef.current = new Set(currentOnline);

    }, [participantIds, onlineParticipants, isWebSocketConnected, isDebateJoined]);

    /**
     * Unmount 시 모든 Manager 정리
     */
    useEffect(() => {
        return () => {
            console.log('🧹 Unmount 시 모든 voice chat 정리');
            managersRef.current.forEach((manager, peerId) => {
                void manager.disconnect();
            });
            managersRef.current.clear();
        };
    }, []);

    /**
     * 특정 peer에 대한 Manager 생성
     */
    const createManagerForPeer = async (peerId: string) => {
        // 이미 존재하면 스킵
        if (managersRef.current.has(peerId)) {
            console.log(`⚠️ Manager for ${peerId} already exists`);
            return;
        }

        try {
            console.log(`🎤 Starting voice chat with ${peerId}`);

            const manager = new VoiceChatManager({
                debateId,
                myId: myAccountId,
                remotePeerId: peerId,
                onSendSignaling
            });

            // 이벤트 리스너 등록
            manager.on('stateChange', (state: ConnectionState) => {
                console.log(`📊 [${peerId}] 상태 변경: ${state}`);
                setConnectionStates(prev => {
                    const next = new Map(prev);
                    next.set(peerId, state);
                    return next;
                });
            });

            manager.on('remoteStream', (stream: MediaStream | null) => {
                console.log(`🎵 [${peerId}] Remote stream 업데이트:`, stream ? '수신됨' : '제거됨');
                setRemoteStreams(prev => {
                    const next = new Map(prev);
                    if (stream) {
                        next.set(peerId, stream);
                    } else {
                        next.delete(peerId);
                    }
                    return next;
                });
            });

            manager.on('error', (error: Error) => {
                console.error(`❌ [${peerId}] Voice chat 에러:`, error);
            });

            // 연결 (마이크 획득, 연결 생성 등)
            await manager.connect();

            // 성공적으로 연결된 후에만 Map에 추가
            managersRef.current.set(peerId, manager);

            // 첫 Manager가 생성될 때 음소거 상태 동기화
            if (managersRef.current.size === 1) {
                setIsMuted(manager.isMutedState());
            }

            console.log(`✅ Voice chat with ${peerId} 시작됨`);

        } catch (error) {
            console.error(`❌ Voice chat with ${peerId} 시작 실패:`, error);
            managersRef.current.delete(peerId);
            setConnectionStates(prev => {
                const next = new Map(prev);
                next.set(peerId, 'failed');
                return next;
            });
        }
    };

    /**
     * 특정 peer의 Manager 정리
     */
    const cleanupManagerForPeer = (peerId: string) => {
        const manager = managersRef.current.get(peerId);
        if (manager) {
            void manager.disconnect();
            managersRef.current.delete(peerId);
        }

        // 상태 정리
        setConnectionStates(prev => {
            const next = new Map(prev);
            next.delete(peerId);
            return next;
        });

        setRemoteStreams(prev => {
            const next = new Map(prev);
            next.delete(peerId);
            return next;
        });
    };

    /**
     * 음소거 토글 (모든 Manager에 적용)
     */
    const toggleMute = () => {
        if (managersRef.current.size === 0) {
            console.warn('⚠️ 음소거 토글 불가: manager 없음');
            return;
        }

        // 첫 번째 manager의 상태를 토글하고 나머지에도 적용
        const firstManager = Array.from(managersRef.current.values())[0];
        const muted = firstManager.toggleMute();

        // 나머지 manager들도 동일하게 설정
        managersRef.current.forEach((manager, peerId) => {
            if (manager !== firstManager) {
                if (muted && !manager.isMutedState()) {
                    manager.toggleMute();
                } else if (!muted && manager.isMutedState()) {
                    manager.toggleMute();
                }
            }
        });

        setIsMuted(muted);
    };

    /**
     * 시그널링 메시지 처리
     */
    const handleSignalingMessage = (message: any) => {
        const fromId = message.fromId;

        // 해당 peer의 manager 찾기
        const manager = managersRef.current.get(fromId);

        if (!manager) {
            // Manager가 아직 없으면 조용히 무시 (아직 연결 전이거나 오프라인)
            if (message.type !== 'VOICE_JOIN' && message.type !== 'VOICE_LEAVE') {
                console.warn(`⚠️ No manager for peer ${fromId}, ignoring ${message.type}`);
            }
            return;
        }

        switch (message.type) {
            case 'VOICE_OFFER':
                if (message.toId === myAccountId) {
                    void manager.handleOffer(message.offer);
                }
                break;

            case 'VOICE_ANSWER':
                if (message.toId === myAccountId) {
                    void manager.handleAnswer(message.answer);
                }
                break;

            case 'VOICE_ICE':
                if (message.toId === myAccountId) {
                    void manager.handleIceCandidate(message.iceCandidate);
                }
                break;

            case 'VOICE_JOIN':
            case 'VOICE_LEAVE':
                // Presence 기반으로 처리하므로 무시
                break;

            default:
                console.log(`❓ 알 수 없는 voice 메시지: ${message.type}`);
        }
    };

    /**
     * Join 확인 요청 (autoplay 차단 시)
     */
    const requestJoinConfirmation = () => {
        if (hasShownModal) {
            console.log('⏭️ Modal 이미 표시됨, 스킵');
            return;
        }

        console.log('🔊 Join 확인 요청');
        setShowJoinModal(true);
        setHasShownModal(true);
    };

    /**
     * Modal 확인 처리
     */
    const handleModalConfirm = () => {
        setShowJoinModal(false);
        // 사용자 상호작용으로 autoplay 가능
        console.log('✅ 사용자가 join 확인');
    };

    // isActive: 하나라도 연결되었거나 재연결 중일 때 true
    const isActive = Array.from(connectionStates.values()).some(
        state => state === 'connected' || state === 'reconnecting'
    );

    const contextValue: VoiceChatContextValue = {
        connectionStates,
        isActive,
        isMuted,
        remoteStreams,
        toggleMute,
        handleSignalingMessage,
        requestJoinConfirmation
    };

    return (
        <VoiceChatContext.Provider value={contextValue}>
            {children}
            <VoiceChatJoinModal
                open={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onConfirm={handleModalConfirm}
            />
        </VoiceChatContext.Provider>
    );
};

export const useVoiceChat = () => {
    const context = useContext(VoiceChatContext);
    if (!context) {
        throw new Error('useVoiceChat must be used within VoiceChatProvider');
    }
    return context;
};
