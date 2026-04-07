/**
 * Authentication Context Utilities
 *
 * Provides the useAuthContext hook backed by Redux userStore
 */

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import type { RootState, AppDispatch } from "#src/store";
import { syncAuth } from "#src/store/userSlice";

/**
 * Hook to access authentication state from the Redux user store
 *
 * @returns Authentication state and helper methods
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
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.user,
  );

  const checkAuth = useCallback(() => {
    dispatch(syncAuth());
  }, [dispatch]);

  const updateAuthState = useCallback(() => {
    dispatch(syncAuth());
  }, [dispatch]);

  return { isAuthenticated, token, checkAuth, updateAuthState };
}
