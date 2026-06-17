/**
 * Authentication Hooks and Helpers
 *
 * Centralized authentication logic including login, logout,
 * and authentication state management with React hooks
 */

import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { ApiError, UseApiMutationOptions } from "#src/utils/api";
import {
  tokenManager,
  handleApiError,
  useApiMutation,
  api,
} from "#src/utils/api";
import * as authApi from "#src/apis/auth";
import type { RefreshTokenRequest } from "#src/openapi";
import type { RootState, AppDispatch } from "#src/store";
import {
  setCredentials,
  clearCredentials,
  syncAuth,
} from "#src/store/userSlice";

// ===========================
// Re-export from apis/auth
// ===========================

export type {
  LoginInfo,
  SignupInfo,
  LoginResponse,
  SignupResponse,
  LogoutResponse,
} from "#src/apis/auth";

// ===========================
// Enhanced Authentication Functions
// ===========================

/**
 * Helper function to store authentication tokens
 *
 * @param response - Login response containing tokens
 */
const storeAuthTokens = (response: authApi.LoginResponse): void => {
  // TokenResponseApiResponse has tokens in response.data
  if (response.data?.token) {
    tokenManager.setToken(response.data.token);
  }
  if (response.data?.refreshToken) {
    tokenManager.setRefreshToken(response.data.refreshToken);
  }
  api.updateConfiguration();
};

/**
 * Helper function to clear authentication tokens
 */
const clearAuthTokens = (): void => {
  tokenManager.clearTokens();
  api.updateConfiguration();
};

/**
 * Check if user is authenticated
 *
 * @returns true if user has a valid token
 *
 * @example
 * ```ts
 * if (isAuthenticated()) {
 *   // User is logged in
 * }
 * ```
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.hasToken();
};

// ===========================
// React Hooks
// ===========================

/**
 * Hook for login with React Query mutation
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { mutate: login, isPending, error } = useLogin({
 *     onSuccess: () => navigate('/dashboard')
 *   });
 *
 *   return (
 *     <button onClick={() => login({
 *       loginCredentials: 'user@example.com',
 *       password: 'pass'
 *     })}>
 *       {isPending ? 'Logging in...' : 'Login'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useLogin(
  options?: UseApiMutationOptions<authApi.LoginResponse, authApi.LoginInfo>,
) {
  const dispatch = useDispatch<AppDispatch>();

  return useApiMutation<authApi.LoginResponse, authApi.LoginInfo>({
    ...options,
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials);
      storeAuthTokens(response);
      if (response.data?.token) {
        dispatch(
          setCredentials({
            token: response.data.token,
            refreshToken: response.data.refreshToken ?? undefined,
          }),
        );
      }
      return response;
    },
  });
}

/**
 * Hook for logout with React Query mutation
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { mutate: logout, isPending } = useLogout({
 *     onSuccess: () => navigate('/login')
 *   });
 *
 *   return (
 *     <button onClick={() => logout()} disabled={isPending}>
 *       {isPending ? 'Logging out...' : 'Logout'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useLogout(
  options?: UseApiMutationOptions<authApi.LogoutResponse, void>,
) {
  const dispatch = useDispatch<AppDispatch>();

  return useApiMutation<authApi.LogoutResponse, void>({
    ...options,
    mutationFn: async () => {
      const response = await authApi.logout();
      clearAuthTokens();
      dispatch(clearCredentials());
      return response;
    },
  });
}

/**
 * Hook for token refresh with React Query mutation.
 * Stores the new tokens and updates Redux state on success.
 *
 * @example
 * ```tsx
 * function SomeComponent() {
 *   const { mutate: refresh } = useRefreshToken();
 *
 *   // Manually trigger a token refresh
 *   refresh({ refreshToken: storedRefreshToken });
 * }
 * ```
 */
export function useRefreshToken(
  options?: UseApiMutationOptions<authApi.LoginResponse, RefreshTokenRequest>,
) {
  const dispatch = useDispatch<AppDispatch>();

  return useApiMutation<authApi.LoginResponse, RefreshTokenRequest>({
    ...options,
    mutationFn: async (payload) => {
      const response = await authApi.refreshLogin(payload);
      storeAuthTokens(response);
      if (response.data?.token) {
        dispatch(
          setCredentials({
            token: response.data.token,
            refreshToken: response.data.refreshToken ?? undefined,
          }),
        );
      }
      return response;
    },
  });
}

/**
 * Hook for signup with React Query mutation
 *
 * @example
 * ```tsx
 * function SignupForm() {
 *   const { mutate: signup, isPending, error } = useSignup({
 *     onSuccess: () => navigate('/login')
 *   });
 *
 *   return (
 *     <button onClick={() => signup({
 *       username: 'newuser',
 *       email: 'user@example.com',
 *       password: 'pass'
 *     })}>
 *       {isPending ? 'Creating account...' : 'Sign Up'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useSignup(
  options?: UseApiMutationOptions<authApi.SignupResponse, authApi.SignupInfo>,
) {
  return useApiMutation<authApi.SignupResponse, authApi.SignupInfo>({
    ...options,
    mutationFn: (payload) => authApi.signup(payload),
  });
}

/**
 * Hook for managing authentication state
 *
 * @returns Auth state and helper functions
 *
 * @example
 * ```tsx
 * function AuthStatus() {
 *   const { isAuthenticated, checkAuth } = useAuth();
 *
 *   return (
 *     <div>
 *       {isAuthenticated ? 'Logged in' : 'Not logged in'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth() {
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

  return {
    isAuthenticated,
    token,
    checkAuth,
    updateAuthState,
  };
}

/**
 * Hook for manual login with loading/error states
 * Alternative to useLogin mutation hook
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { performLogin, isLoading, error } = useLoginManual();
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     try {
 *       await performLogin({ loginCredentials: email, password });
 *       navigate('/dashboard');
 *     } catch (err) {
 *       // Error is already in error state
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useLoginManual() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<authApi.LoginResponse | null>(null);

  const performLogin = useCallback(
    async (credentials: authApi.LoginInfo): Promise<authApi.LoginResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login(credentials);
        storeAuthTokens(response);
        if (response.data?.token) {
          dispatch(
            setCredentials({
              token: response.data.token,
              refreshToken: response.data.refreshToken ?? undefined,
            }),
          );
        }
        setData(response);
        return response;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    performLogin,
    isLoading,
    error,
    data,
    reset,
  };
}

// ===========================
// Re-exports
// ===========================

// Re-export base API functions
export { login, logout, signup, refreshLogin } from "#src/apis/auth";

// Re-export token manager for convenience
export { tokenManager };

// Re-export types
export type { ApiError };

export { clearAuthTokens };

export * from "./roles";
export * from "./permissions";
