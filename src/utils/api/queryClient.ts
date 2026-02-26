/**
 * React Query Client Configuration
 * 
 * Separated from the provider component to avoid Fast Refresh issues.
 */

import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 60 * 1000, // 1 minute
      
      // Time before inactive queries are garbage collected
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      
      // Number of retry attempts for failed queries
      retry: 1,
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Number of retry attempts for failed mutations
      retry: 0,
      
      // Retry delay for mutations
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
