/**
 * Authentication Hooks and Helpers
 * 
 * Centralized authentication logic including login, logout,
 * and authentication state management with React hooks
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { tokenManager, handleApiError, api } from '../../utils/api/index.js';
import type { ApiError } from '#src/utils/api';
import * as authApi from '#src/apis/auth';

// ===========================
// Re-export from apis/auth
// ===========================

export type { LoginInfo, SignupInfo } from '../../apis/auth/index.js';

// ===========================
// Auth Response Type
// ===========================

interface AuthTokenResponse {
  token?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

// ===========================
// Enhanced Authentication Functions
// ===========================

/**
 * Login with automatic token management
 * 
 * @param credentials - User login credentials
 * @returns Promise with authentication response
 * 
 * @example
 * ```ts
 * const authData = await loginWithToken({
 *   loginCredentials: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const loginWithToken = async (credentials: authApi.LoginInfo) => {
  try {
    const authData = await authApi.login(credentials);
    
    // Store tokens if present in response (adjust based on your API response structure)
    const responseData = authData as unknown as AuthTokenResponse;
    if (responseData?.token) {
      tokenManager.setToken(responseData.token);
    }
    if (responseData?.refreshToken) {
      tokenManager.setRefreshToken(responseData.refreshToken);
    }

    // Update API configuration with new token
    api.updateConfiguration();
    
    return authData;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Logout with automatic token cleanup
 * 
 * @example
 * ```ts
 * await logoutWithCleanup();
 * ```
 */
export const logoutWithCleanup = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch (error) {
    // Log error but don't throw - always clear local tokens
    console.error('Logout API call failed:', error);
  } finally {
    tokenManager.clearTokens();
    api.updateConfiguration();
  }
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
  options?: Omit<UseMutationOptions<unknown, ApiError, authApi.LoginInfo>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, authApi.LoginInfo>({
    mutationFn: loginWithToken,
    onSuccess: (...args) => {
      // Invalidate all queries on successful login
      queryClient.invalidateQueries();
      options?.onSuccess?.(...args);
    },
    ...options,
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
  options?: Omit<UseMutationOptions<void, ApiError, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: logoutWithCleanup,
    onSuccess: (...args) => {
      // Clear all queries on logout
      queryClient.clear();
      options?.onSuccess?.(...args);
    },
    ...options,
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
  options?: Omit<UseMutationOptions<unknown, ApiError, authApi.SignupInfo>, 'mutationFn'>
) {
  return useMutation<unknown, ApiError, authApi.SignupInfo>({
    mutationFn: async (signupInfo) => {
      try {
        return await authApi.signup(signupInfo);
      } catch (error) {
        throw handleApiError(error);
      }
    },
    ...options,
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
  const [authenticated, setAuthenticated] = useState(isAuthenticated);

  const checkAuth = useCallback(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const updateAuthState = useCallback(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return {
    isAuthenticated: authenticated,
    token: tokenManager.getToken(),
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<unknown | null>(null);

  const performLogin = useCallback(async (credentials: authApi.LoginInfo): Promise<unknown> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginWithToken(credentials);
      setData(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

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
export { login, logout, signup } from '../../apis/auth/index.js';

// Re-export token manager for convenience
export { tokenManager };

// Re-export types
export type { ApiError };