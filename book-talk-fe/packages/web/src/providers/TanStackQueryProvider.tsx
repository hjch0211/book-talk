import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';

export function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
