import {useCallback} from "react";
import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {createChat, getChatsQueryOptions} from "../apis/debate";

/**
 * 토론 채팅 관리 (내부 전용)
 * FREE 라운드에서만 동작
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateChat = (
    debateId: string | undefined,
    sendChatMessage: ((chatId: number) => void) | undefined,
    isFreeRound: boolean
) => {
    const queryClient = useQueryClient();

    // FREE 라운드일 때만 채팅 데이터 로드
    const {data: chats = []} = useSuspenseQuery(
        isFreeRound
            ? getChatsQueryOptions(debateId || '')
            : {
                queryKey: ['debates', debateId, 'chats', 'disabled'],
                queryFn: async () => []
            }
    );

    const createChatMutation = useMutation({
        mutationFn: createChat,
        onSuccess: (newChat) => {
            queryClient.invalidateQueries({
                queryKey: ['debates', debateId, 'chats']
            });
            sendChatMessage?.(newChat.id);
        }
    });

    const sendChat = useCallback((content: string) => {
        if (!isFreeRound || !content.trim() || !debateId) return;

        createChatMutation.mutate({
            debateId,
            content: content.trim()
        });
    }, [debateId, createChatMutation, isFreeRound]);

    return {
        chats: isFreeRound ? chats : [],
        sendChat,
        isSending: createChatMutation.isPending
    };
};
