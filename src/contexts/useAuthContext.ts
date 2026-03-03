/**
 * Authentication Context Utilities
 *
 * Contains the context and hooks for authentication
 */

import { createContext, useContext } from "react";
import type { AuthContextType } from "#src/contexts/types";

// Create the context with undefined default
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/**
 * Hook to use authentication context
 *
 * @returns Authentication state and methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { isAuthenticated } = useAuthContext();
 *
 *   return (
 *     <nav>
 *       {isAuthenticated ? <LogoutButton /> : <LoginButton />}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
