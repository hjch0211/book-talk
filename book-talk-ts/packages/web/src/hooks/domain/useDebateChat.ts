import { createChat, getChatsQueryOptions } from '@src/apis/debate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface Props {
  /** 토론 ID */
  debateId: string | undefined;
  /** 채팅 메시지 전송 콜백 */
  sendChatMessage: ((chatId: number) => void) | undefined;
  /** FREE 라운드 여부 */
  isFreeRound: boolean;
  /** 멤버 정보 존재 여부 */
  hasMyMemberInfo: boolean;
}

/**
 * 토론 채팅 관리 (내부 전용)
 * FREE 라운드에서만 동작
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateChat = (props: Props) => {
  const { debateId, sendChatMessage, isFreeRound, hasMyMemberInfo } = props;
  const queryClient = useQueryClient();

  // FREE 라운드이고 멤버일 때만 채팅 데이터 로드
  const { data: chats = [] } = useQuery(
    getChatsQueryOptions(debateId, isFreeRound, hasMyMemberInfo)
  );
  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: (newChat) => {
      void queryClient.invalidateQueries({
        queryKey: getChatsQueryOptions(debateId, isFreeRound, hasMyMemberInfo).queryKey,
      });
      sendChatMessage?.(newChat.id);
    },
  });

  const sendChat = useCallback(
    (content: string) => {
      if (!isFreeRound || !content.trim() || !debateId || !hasMyMemberInfo) return;

      createChatMutation.mutate({ debateId, content: content.trim() });
    },
    [debateId, createChatMutation, isFreeRound, hasMyMemberInfo]
  );

  return {
    chats: isFreeRound && hasMyMemberInfo ? chats : [],
    sendChat,
    isSending: createChatMutation.isPending,
  };
};
