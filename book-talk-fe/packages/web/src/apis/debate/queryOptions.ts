import {queryOptions} from '@tanstack/react-query';
import {findOneDebate, getChats} from './api';

export const findOneDebateQueryOptions = (debateId?: string) => queryOptions({
    queryKey: ['debates', debateId],
    queryFn: () => findOneDebate(debateId!),
    enabled: !!debateId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
});

export const getChatsQueryOptions = (debateId?: string, isFreeRound?: boolean, isAlreadyMember?: boolean) => queryOptions({
    queryKey: ['debates', debateId, 'chats'],
    queryFn: () => getChats(debateId!),
    enabled: !!debateId && isFreeRound && isAlreadyMember,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
})