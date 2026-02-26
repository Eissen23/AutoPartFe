/**
 * React Query Configuration and Provider Setup
 * 
 * This file contains the React Query setup that should be added to your main App file.
 */

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from './queryClient';

/**
 * API Provider Component
 * Wrap your app with this component to enable React Query
 */
export function ApiProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Include React Query Devtools in development 
          Install: pnpm add -D @tanstack/react-query-devtools
          Then uncomment the line below:
      */}
      {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

/**
 * Usage in your main App file (main.tsx or App.tsx):
 * 
 * ```tsx
 * import { ApiProvider } from './utils/api/provider';
 * 
 * function App() {
 *   return (
 *     <ApiProvider>
 *       <YourApp />
 *     </ApiProvider>
 *   );
 * }
 * ```
 */
