import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DebateWebSocketClient, type WebSocketHandlers} from "../apis/websocket";

/**
 * 토론방의 실시간 WebSocket 연결을 관리하는 훅
 * WebSocket을 통해 토론방의 모든 실시간 이벤트를 처리합니다.
 */
export const useDebateWebSocket = (debateId: string | null, handlers: WebSocketHandlers) => {
    const [onlineAccountIds, setOnlineAccountIds] = useState<Set<string>>(new Set());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [raisedHands, setRaisedHands] = useState<Array<{
        accountId: string;
        accountName: string;
        raisedAt: number;
    }>>([]);
    const wsClientRef = useRef<DebateWebSocketClient | null>(null);
    const heartbeatIntervalRef = useRef<number | null>(null);

    // 핸들러와 내부 상태 관리를 결합 (메모이제이션)
    const combinedHandlers = useMemo(() => ({
        onPresenceUpdate: (onlineIds: Set<string>) => {
            console.log('Received online account IDs:', onlineIds);
            setOnlineAccountIds(onlineIds);
            handlers.onPresenceUpdate?.(onlineIds);
        },
        onConnectionStatus: (connected: boolean) => {
            console.log('Connection status changed:', connected);
            setIsConnected(connected);
            handlers.onConnectionStatus?.(connected);
        },
        onHandRaiseUpdate: (hands: Array<{accountId: string; accountName: string; raisedAt: number}>) => {
            console.log('Received raised hands update:', hands);
            setRaisedHands(hands);
            handlers.onHandRaiseUpdate?.(hands);
        },
        onSpeakerUpdate: handlers.onSpeakerUpdate,
        onDebateRoundUpdate: handlers.onDebateRoundUpdate,
        onVoiceSignaling: handlers.onVoiceSignaling
    }), [handlers]);

    // WebSocket 연결 및 관리
    useEffect(() => {
        if (!debateId) return;

        // DebateWebSocketClient 인스턴스 생성
        const wsClient = new DebateWebSocketClient();
        wsClientRef.current = wsClient;

        // 연결 시작
        wsClient.connect(debateId, combinedHandlers);

        // 정리 함수
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }

            if (wsClientRef.current) {
                wsClientRef.current.disconnect();
                wsClientRef.current = null;
            }
        };
    }, [debateId, combinedHandlers]);

    // 하트비트 관리
    useEffect(() => {
        if (isConnected && wsClientRef.current) {
            // 30초마다 하트비트 전송
            heartbeatIntervalRef.current = setInterval(() => {
                console.log('Sending heartbeat...');
                wsClientRef.current?.sendHeartbeat();
            }, 30000);
        } else {
            // 연결이 끊어지면 하트비트 중단
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        }

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
        };
    }, [isConnected]);

    const checkAccountOnlineStatus = useCallback((accountId: string): boolean => {
        const result = onlineAccountIds.has(accountId);
        console.log(`Checking online status for ${accountId}:`, result, 'from set:', Array.from(onlineAccountIds));
        return result;
    }, [onlineAccountIds]);

    const toggleHand = useCallback(() => {
        wsClientRef.current?.toggleHand();
    }, []);

    const isHandRaised = useCallback((accountId: string): boolean => {
        return raisedHands.some(hand => hand.accountId === accountId);
    }, [raisedHands]);

    return {
        isAccountOnline: checkAccountOnlineStatus,
        onlineAccountIds,
        isConnected,
        wsClient: wsClientRef.current,
        raisedHands,
        toggleHand,
        isHandRaised
    };
};