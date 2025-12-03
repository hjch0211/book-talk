import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import type React from 'react';

/**
 * @name QueryClientProvider
 * @description 서버 상태 관리 (캐싱, 동기화, 에러 처리) 제공
 * @external @tanstack/react-query
 */
export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
      },
    },
  });

  return <TanStackQueryClientProvider client={queryClient}>{children}</TanStackQueryClientProvider>;
}
