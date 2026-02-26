import { findOneAiChatQueryOptions } from '@src/externals/aiChat';
import { AiChatWebSocketClient } from '@src/externals/websocket';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

/**
 * AI 채팅 실시간 연결 관리
 * - WebSocket 연결/해제 및 하트비트
 * - AI 채팅 메시지 송수신
 */
export const useAiChatRealtimeConnection = () => {
  const queryClient = useQueryClient();

  const [isConnected, setIsConnected] = useState(false);
  const wsClientRef = useRef<AiChatWebSocketClient | null>(null);

  /** 유저 메시지 저장 완료 핸들러 */
  const onUserMessageSaved = useEffectEvent((chatId: string) => {
    void queryClient.invalidateQueries({
      queryKey: findOneAiChatQueryOptions(chatId).queryKey,
    });
  });

  /** AI 채팅 완료 핸들러 */
  const onAiChatCompleted = useEffectEvent((chatId: string) => {
    void queryClient.invalidateQueries({
      queryKey: findOneAiChatQueryOptions(chatId).queryKey,
    });
  });

  /** WebSocket 연결 */
  const connect = useEffectEvent(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
    }

    const wsClient = new AiChatWebSocketClient();
    wsClientRef.current = wsClient;

    wsClient.connect({
      onConnectionStatus: (connected: boolean) => {
        setIsConnected(connected);
      },
      onAiChatCompleted,
      onUserMessageSaved,
    });
  });

  /** 하트비트 (5초 간격) */
  useEffect(() => {
    if (!isConnected || !wsClientRef.current) return;

    const intervalId = window.setInterval(() => {
      wsClientRef.current?.sendHeartbeat();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isConnected]);

  /** AI 채팅 메시지 전송 */
  const sendAiChat = useEffectEvent((chatId: string, message: string) => {
    if (!wsClientRef.current?.isConnected()) return;
    wsClientRef.current.sendAiChat(chatId, message);
  });

  /** 마운트 시 WebSocket 자동 연결, 언마운트 시 자동 해제 */
  useEffect(() => {
    connect();
    return () => {
      wsClientRef.current?.disconnect();
      wsClientRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return {
    /** WebSocket 연결 상태 */
    isConnected,
    /** AI 채팅 메시지 전송 */
    sendAiChat,
  };
};
