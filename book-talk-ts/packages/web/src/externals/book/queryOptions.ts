import { infiniteQueryOptions } from '@tanstack/react-query';
import { searchBooks } from './api';

export const infiniteSearchBooksQueryOptions = (query: string, size = 20) =>
  infiniteQueryOptions({
    queryKey: ['books', 'search', 'infinite', query, size],
    queryFn: ({ pageParam }) => searchBooks({ query, page: pageParam, size }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.isLastPage ? undefined : lastPageParam + 1,
    enabled: !!query && query.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
