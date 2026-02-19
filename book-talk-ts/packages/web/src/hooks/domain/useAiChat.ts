import { removeAiChat } from '@src/externals/aiChat';
import { useAiChatRealtimeConnection } from '@src/hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffectEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  chatId: string;
}

/**
 * AI 채팅방 관리
 * - WebSocket 자동 연결/해제 (useAiChatRealtimeConnection)
 * - 메시지 전송
 * - 채팅방 삭제
 */
export const useAiChat = ({ chatId }: Props) => {
  const connection = useAiChatRealtimeConnection();
  const navigate = useNavigate();

  /** 채팅방 삭제 */
  const deleteMutation = useMutation({
    mutationFn: removeAiChat,
    onSuccess: () => {
      navigate('/ai-chat');
    },
  });

  /** AI 메시지 전송 */
  const handleSendMessage = useEffectEvent((message: string) => {
    connection.sendAiChat(chatId, message);
  });

  /** 채팅방 삭제 */
  const handleDeleteChat = useEffectEvent(() => {
    deleteMutation.mutate(chatId);
  });

  return {
    /** AI 채팅 웹소켓 연결 상태 */
    isConnected: connection.isConnected,
    /** AI 메시지 전송 */
    handleSendMessage,
    /** 채팅방 삭제 */
    handleDeleteChat,
  };
};
