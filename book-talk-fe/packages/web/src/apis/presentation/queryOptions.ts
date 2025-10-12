import {queryOptions} from '@tanstack/react-query';
import {findOnePresentation} from './api';

export const findOnePresentationQueryOptions = (presentationId?: string) => queryOptions({
    queryKey: ['presentation', presentationId],
    queryFn: () => findOnePresentation(presentationId!),
    enabled: !!presentationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
});