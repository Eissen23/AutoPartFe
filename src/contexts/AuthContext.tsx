/**
 * Authentication Provider Component
 *
 * Provides authentication state and methods throughout the application
 */

import type { ReactNode } from "react";
import { useAuth as useAuthHook } from "#src/hooks/auth";
import { AuthContext } from "#src/contexts/useAuthContext";

/**
 * AuthProvider component
 * Wraps the application to provide authentication state
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
