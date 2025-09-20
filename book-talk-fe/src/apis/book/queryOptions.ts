import {queryOptions} from '@tanstack/react-query';
import {searchBooks} from './api';
import type {SearchBookRequest} from './schema';

export const searchBooksQueryOptions = (params: SearchBookRequest) => queryOptions({
    queryKey: ['books', 'search', params.query, params.page, params.size],
    queryFn: () => searchBooks(params),
    enabled: !!params.query && params.query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
});