/**
 * VoiceChatContext - Voice Chat React Context
 *
 * Presence 상태 기반으로 VoiceChatManager 생명주기 관리
 * 단일 useEffect로 모든 presence 전환을 깔끔하게 처리
 */

import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {VoiceChatManager} from '../apis/webrtc/VoiceChatManager';
import type {ConnectionState} from '../apis/webrtc/types';
import {VoiceChatJoinModal} from '../routes/Debate/_components/VoiceChatJoinModal';

interface VoiceChatContextValue {
    connectionState: ConnectionState;
    isActive: boolean;
    isMuted: boolean;
    remoteStream: MediaStream | null;
    toggleMute: () => void;
    handleSignalingMessage: (message: any) => void;
    requestJoinConfirmation: () => void;
}

const VoiceChatContext = createContext<VoiceChatContextValue | null>(null);

interface VoiceChatProviderProps {
    children: React.ReactNode;
    debateId: string;
    myAccountId: string;
    remotePeerId: string | null;
    onSendSignaling: (message: any) => void;
    isWebSocketConnected: boolean;
    isDebateJoined: boolean;
    isRemotePeerOnline: boolean;
}

/**
 * Presence 전환 타입
 */
type PresenceTransition =
    | 'offline->offline'
    | 'offline->online'
    | 'online->offline'
    | 'online->online';

function getPresenceTransition(was: boolean, is: boolean): PresenceTransition {
    if (!was && !is) return 'offline->offline';
    if (!was && is) return 'offline->online';
    if (was && !is) return 'online->offline';
    return 'online->online';
}

export const VoiceChatProvider: React.FC<VoiceChatProviderProps> = ({
                                                                        children,
                                                                        debateId,
                                                                        myAccountId,
                                                                        remotePeerId,
                                                                        onSendSignaling,
                                                                        isWebSocketConnected,
                                                                        isDebateJoined,
                                                                        isRemotePeerOnline
                                                                    }) => {
    // 상태
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [isMuted, setIsMuted] = useState(true);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);

    // 참조
    const managerRef = useRef<VoiceChatManager | null>(null);
    const prevRemotePeerOnlineRef = useRef(isRemotePeerOnline);

    /**
     * 모든 presence 상태 변경을 처리하는 단일 useEffect
     */
    useEffect(() => {
        // 사전 조건 확인
        if (!remotePeerId) {
            console.log('⚠️ No remote peer, skipping voice chat');
            return;
        }

        if (!isWebSocketConnected) {
            console.log('⏳ Waiting for WebSocket connection...');
            return;
        }

        if (!isDebateJoined) {
            console.log('⏳ Waiting for debate join...');
            return;
        }

        // Presence 전환 가져오기
        const wasOnline = prevRemotePeerOnlineRef.current;
        const isOnline = isRemotePeerOnline;
        const transition = getPresenceTransition(wasOnline, isOnline);

        console.log(`🔄 Presence transition: ${transition}`);

        // 전환 처리
        switch (transition) {
            case 'offline->online':
                handlePeerOnline();
                break;

            case 'online->offline':
                handlePeerOffline();
                break;

            case 'offline->offline':
            case 'online->online':
                // 액션 필요 없음
                break;
        }

        // 이전 상태 업데이트
        prevRemotePeerOnlineRef.current = isOnline;

    }, [remotePeerId, isWebSocketConnected, isDebateJoined, isRemotePeerOnline]);

    /**
     * Unmount 시 정리
     */
    useEffect(() => {
        return () => {
            if (managerRef.current) {
                console.log('🧹 Unmount 시 voice chat 정리');
                void managerRef.current.disconnect();
                managerRef.current = null;
            }
        };
    }, []);

    /**
     * Peer 온라인 전환 처리
     */
    const handlePeerOnline = () => {
        console.log('✅ Remote peer가 온라인 상태');

        // Manager가 존재하면 먼저 정리 (재연결 시나리오)
        if (managerRef.current) {
            console.log('🔄 기존 연결 정리 후 새로 시작');
            void managerRef.current.disconnect();
            managerRef.current = null;
        }

        // 새 연결 시작
        void startVoiceChat();
    };

    /**
     * Peer 오프라인 전환 처리
     */
    const handlePeerOffline = () => {
        console.log('🔌 Remote peer가 오프라인 상태');

        if (managerRef.current) {
            void managerRef.current.disconnect();
            managerRef.current = null;
        }

        setConnectionState('idle');
        setRemoteStream(null);
    };

    /**
     * Voice chat 시작
     */
    const startVoiceChat = async () => {
        if (managerRef.current) {
            console.log('⚠️ Voice chat already initialized');
            return;
        }

        try {
            console.log(`🎤 Starting voice chat with ${remotePeerId}`);

            const manager = new VoiceChatManager({
                debateId,
                myId: myAccountId,
                remotePeerId: remotePeerId!,
                onSendSignaling
            });

            // 이벤트 리스너 등록
            manager.on('stateChange', (state: ConnectionState) => {
                console.log(`📊 상태 변경: ${state}`);
                setConnectionState(state);
            });

            manager.on('remoteStream', (stream: MediaStream | null) => {
                console.log(`🎵 Remote stream 업데이트:`, stream ? '수신됨' : '제거됨');
                setRemoteStream(stream);
            });

            manager.on('error', (error: Error) => {
                console.error(`❌ Voice chat 에러:`, error);
            });

            // 연결 (마이크 획득, 연결 생성 등)
            await manager.connect();

            // 성공적으로 연결된 후에만 managerRef 설정
            managerRef.current = manager;
            setIsMuted(manager.isMutedState());

            console.log('✅ Voice chat 시작됨');

        } catch (error) {
            console.error('❌ Voice chat 시작 실패:', error);
            managerRef.current = null;
            setConnectionState('failed');
        }
    };

    /**
     * 음소거 토글
     */
    const toggleMute = () => {
        if (!managerRef.current) {
            console.warn('⚠️ 음소거 토글 불가: manager 없음');
            return;
        }

        const muted = managerRef.current.toggleMute();
        setIsMuted(muted);
    };

    /**
     * 시그널링 메시지 처리
     */
    const handleSignalingMessage = (message: any) => {
        if (!managerRef.current) {
            // Manager가 준비되지 않았으면 조용히 무시 (에러 아님)
            if (message.type !== 'VOICE_JOIN') {
                console.warn(`⚠️ Voice chat 비활성, 무시: ${message.type}`);
            }
            return;
        }

        const manager = managerRef.current;

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
                // 무시 - Presence 사용
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

    // isActive: 연결되었거나 재연결 중일 때 true
    const isActive = connectionState === 'connected' || connectionState === 'reconnecting';

    const contextValue: VoiceChatContextValue = {
        connectionState,
        isActive,
        isMuted,
        remoteStream,
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
