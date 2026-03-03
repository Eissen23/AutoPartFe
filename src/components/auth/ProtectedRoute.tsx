/**
 * Protected Route Guard Component
 *
 * Ensures that only authenticated users can access certain routes.
 * Redirects unauthenticated users to the login page.
 */

import { Navigate } from "react-router";
import { useAuthContext } from "#src/contexts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Wraps components that require authentication
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthContext();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
