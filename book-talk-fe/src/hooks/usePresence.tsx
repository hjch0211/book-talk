import {useCallback, useMemo, useState} from 'react';
import {useWebSocket} from './useWebSocket';

/**
 * 토론방의 실시간 온라인 사용자 추적을 위한 훅
 * WebSocket을 통해 토론방 참여자들의 온라인/오프라인 상태를 실시간으로 관리합니다.
 */
export const useDebateOnlineUsers = (debateId: string | null) => {
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

    const presenceWebSocketUrl = useMemo(() => {
        if (!debateId) return null;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
        const wsBaseUrl = baseUrl.replace(/^http/, 'ws');
        const token = localStorage.getItem('accessToken');
        return `${wsBaseUrl}/ws/presence?debateId=${debateId}&token=${encodeURIComponent(token || '')}`;
    }, [debateId]);

    const handlePresenceMessage = useCallback((event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data);
            console.log('Presence message received:', message);

            if (message.type === 'PRESENCE_UPDATE' && Array.isArray(message.onlineUsers)) {
                const onlineIds = new Set<string>(
                    message.onlineUsers.map((user: { userId: string }) => user.userId)
                );
                setOnlineUserIds(onlineIds);
            }
        } catch (error) {
            console.error('Failed to parse presence message:', error);
        }
    }, []);

    const {sendMessage, isConnected} = useWebSocket(presenceWebSocketUrl, {
        onOpen: () => {
            console.log('Presence WebSocket connected, joining debate');
            const token = localStorage.getItem('accessToken');
            if (debateId && token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const joinMessage = {
                        type: 'JOIN_DEBATE',
                        debateId: debateId,
                        userId: payload.sub,
                        userName: 'User'
                    };
                    console.log('Sending JOIN_DEBATE message:', joinMessage);

                    // 약간의 지연 후 메시지 전송
                    setTimeout(() => {
                        sendMessage(joinMessage);
                    }, 100);
                } catch (error) {
                    console.error('JWT token parsing failed:', error);
                }
            }
        },
        onMessage: handlePresenceMessage,
        onClose: (event) => {
            console.log('Presence WebSocket closed:', event.code, event.reason);
        },
        shouldReconnect: true,
        maxReconnectAttempts: 2,
        reconnectDelay: 3000
    });

    const checkUserOnlineStatus = useCallback((userId: string): boolean => {
        return onlineUserIds.has(userId);
    }, [onlineUserIds]);

    return {
        isUserOnline: checkUserOnlineStatus,
        onlineUserIds,
        isPresenceConnected: isConnected()
    };
};