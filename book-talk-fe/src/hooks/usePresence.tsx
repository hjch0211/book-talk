import {useCallback, useEffect, useRef, useState} from 'react';
import {PresenceWebSocket} from "../apis/presence";

/**
 * 토론방의 실시간 온라인 사용자 추적을 위한 훅
 * WebSocket을 통해 토론방 참여자들의 온라인/오프라인 상태를 실시간으로 관리합니다.
 */
export const useDebateOnlineAccounts = (debateId: string | null) => {
    const [onlineAccountIds, setOnlineAccountIds] = useState<Set<string>>(new Set());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const presenceWSRef = useRef<PresenceWebSocket | null>(null);
    const heartbeatIntervalRef = useRef<number | null>(null);

    // WebSocket 연결 및 관리
    useEffect(() => {
        if (!debateId) return;

        // PresenceWebSocket 인스턴스 생성
        const presenceWS = new PresenceWebSocket();
        presenceWSRef.current = presenceWS;

        // 연결 시작
        presenceWS.connect(
            debateId,
            (onlineIds) => {
                console.log('Received online account IDs:', onlineIds);
                setOnlineAccountIds(onlineIds);
            },
            (connected) => {
                console.log('Connection status changed:', connected);
                setIsConnected(connected);
            }
        );

        // 정리 함수
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }

            if (presenceWSRef.current) {
                presenceWSRef.current.disconnect();
                presenceWSRef.current = null;
            }
        };
    }, [debateId]);

    // 하트비트 관리
    useEffect(() => {
        if (isConnected && presenceWSRef.current) {
            // 30초마다 하트비트 전송
            heartbeatIntervalRef.current = setInterval(() => {
                console.log('Sending heartbeat...');
                presenceWSRef.current?.sendHeartbeat();
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

    return {
        isAccountOnline: checkAccountOnlineStatus,
        onlineAccountIds,
        isPresenceConnected: isConnected
    };
};