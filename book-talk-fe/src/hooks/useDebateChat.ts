import {useCallback} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
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
    isFreeRound: boolean,
    isAlreadyMember: boolean
) => {
    const queryClient = useQueryClient();

    // FREE 라운드이고 멤버일 때만 채팅 데이터 로드
    const {data: chats = []} = useQuery(getChatsQueryOptions(debateId, isFreeRound, isAlreadyMember));
    const createChatMutation = useMutation({
        mutationFn: createChat,
        onSuccess: (newChat) => {
            void queryClient.invalidateQueries({queryKey: getChatsQueryOptions(debateId, isFreeRound, isAlreadyMember).queryKey});
            sendChatMessage?.(newChat.id);
        }
    });

    const sendChat = useCallback((content: string) => {
        if (!isFreeRound || !content.trim() || !debateId || !isAlreadyMember) return;

        createChatMutation.mutate({debateId, content: content.trim()});
    }, [debateId, createChatMutation, isFreeRound, isAlreadyMember]);

    return {
        chats: isFreeRound && isAlreadyMember ? chats : [],
        sendChat,
        isSending: createChatMutation.isPending
    };
};
