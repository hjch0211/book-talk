import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useQueryClient} from "@tanstack/react-query";
import {
    DebateWebSocketClient,
    type RaisedHandInfo,
    type WebSocketMessage,
    type WS_DebateRoundUpdateResponse,
    type WS_SpeakerUpdateResponse
} from "../../apis/websocket";
import {findOneDebateQueryOptions, getChatsQueryOptions, type MemberInfo} from "../../apis/debate";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface UseDebateWebSocketOptions {
    onRoundStartBackdrop?: (roundType: RoundType) => void;
    onVoiceSignaling?: (message: WebSocketMessage) => void;
}

export interface MemberWithPresence extends MemberInfo {
    isMe: boolean;
}

/**
 * WebSocket 연결 및 실시간 통신 관리
 * - WebSocket 연결/해제
 * - 메시지 송수신
 * - 상태 관리 (온라인, 손들기)
 * - 비즈니스 로직 (Query 갱신, UI 이벤트)
 * - 온라인 멤버 목록 계산
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateWebSocket = (
    debateId: string | null,
    members: MemberInfo[],
    myAccountId: string | undefined,
    isFreeRound: boolean,
    options?: UseDebateWebSocketOptions
) => {
    const queryClient = useQueryClient();
    const [onlineAccountIds, setOnlineAccountIds] = useState<Set<string>>(new Set());
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isDebateJoined, setIsDebateJoined] = useState<boolean>(false);
    const [raisedHands, setRaisedHands] = useState<RaisedHandInfo[]>([]);
    const wsClientRef = useRef<DebateWebSocketClient | null>(null);
    const heartbeatIntervalRef = useRef<number | null>(null);

    // options를 ref로 관리하여 재생성 방지
    const optionsRef = useRef(options);
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    /** 발언자 업데이트 콜백*/
    const handleSpeakerUpdate = useCallback((speakerInfo: WS_SpeakerUpdateResponse) => {
        console.log('Speaker updated via WebSocket:', speakerInfo);
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }
    }, [debateId, queryClient]);

    /** 토론 라운드 업데이트 콜백*/
    const handleDebateRoundUpdate = useCallback((roundInfo: WS_DebateRoundUpdateResponse) => {
        console.log('Debate round updated via WebSocket:', roundInfo);
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }

        const roundType = roundInfo.round.type as RoundType;
        if (roundType === "PRESENTATION" || roundType === "FREE") {
            optionsRef.current?.onRoundStartBackdrop?.(roundType);
        }
    }, [debateId, queryClient]);

    /** 음성 시그널링 - 상위로 이벤트 전달만 */
    const handleVoiceSignaling = useCallback((message: WebSocketMessage) => {
        console.log('Voice signaling message received:', message);
        optionsRef.current?.onVoiceSignaling?.(message);
    }, []);

    const combinedHandlers = useMemo(() => ({
        onPresenceUpdate: (onlineIds: Set<string>) => {
            console.log('Received online account IDs:', onlineIds);
            setOnlineAccountIds(onlineIds);

            if (debateId) {
                void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
            }
        },
        onConnectionStatus: (connected: boolean) => {
            console.log('Connection status changed:', connected);
            setIsConnected(connected);

            // WebSocket 연결 끊김 시 debate join 상태 리셋
            if (!connected) {
                console.log('🔌 WebSocket disconnected - resetting debate join status');
                setIsDebateJoined(false);
            }
        },
        onJoinSuccess: () => {
            console.log('Debate join success - ready for voice chat');
            setIsDebateJoined(true);
        },
        onHandRaiseUpdate: (hands: RaisedHandInfo[]) => {
            console.log('Received raised hands update:', hands);
            setRaisedHands(hands);
        },
        onSpeakerUpdate: handleSpeakerUpdate,
        onDebateRoundUpdate: handleDebateRoundUpdate,
        onVoiceSignaling: handleVoiceSignaling,
        onChatMessage: (chatId: number) => {
            console.log('Received chat message:', chatId);
            if (debateId) {
                void queryClient.invalidateQueries({
                    queryKey: getChatsQueryOptions(debateId, isFreeRound, true).queryKey
                });
            }
        }
    }), [handleSpeakerUpdate, handleDebateRoundUpdate, handleVoiceSignaling, debateId, isFreeRound, queryClient]);

    /** WebSocket 연결 및 관리 */
    useEffect(() => {
        if (!debateId) return;
        const wsClient = new DebateWebSocketClient();
        wsClientRef.current = wsClient;

        wsClient.connect(debateId, combinedHandlers);

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

    /** WebSocket 하트비트 관리 */
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

    /** 온라인 멤버 목록 계산 */
    const membersWithPresence = useMemo((): MemberWithPresence[] => {
        return members
            .filter(member => onlineAccountIds.has(member.id))
            .map(member => ({
                ...member,
                isMe: member.id === myAccountId
            }));
    }, [members, onlineAccountIds, myAccountId]);

    /** 손들기 기능 */
    const toggleHand = useCallback(() => {
        wsClientRef.current?.toggleHand();
    }, []);

    const isHandRaised = useCallback((accountId: string): boolean => {
        return raisedHands.some(hand => hand.accountId === accountId);
    }, [raisedHands]);

    /** 음성 메시지 전송 */
    const sendVoiceMessage = useCallback((message: WebSocketMessage) => {
        if (wsClientRef.current?.isConnected()) {
            wsClientRef.current.sendVoiceMessage(message);
        }
    }, []);

    /** 채팅 메시지 전송 */
    const sendChatMessage = useCallback((chatId: number) => {
        if (wsClientRef.current?.isConnected()) {
            wsClientRef.current.sendChatMessage(chatId);
        }
    }, []);

    return {
        onlineAccountIds,
        isConnected,
        isDebateJoined,
        wsClient: wsClientRef.current,
        raisedHands,
        toggleHand,
        isHandRaised,
        handleVoiceSignaling,
        sendVoiceMessage,
        sendChatMessage,
        membersWithPresence
    };
};