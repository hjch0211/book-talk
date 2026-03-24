import { queryOptions } from '@tanstack/react-query';
import { findOneAiChat } from './api';

export const findOneAiChatQueryOptions = (chatId?: string) =>
  queryOptions({
    queryKey: ['ai-chats', chatId],
    queryFn: () => findOneAiChat(chatId!),
    enabled: !!chatId,
    staleTime: 0,
    retry: 3,
  });
