import {
  type TokenApiApiV1TokenPostRequest,
  type UserApiApiV1UserPostRequest,
  type TokenResponseApiResponse,
  type GuidApiResponse,
  type StringApiResponse,
} from "#src/openapi";
import { apiClients } from "#src/utils/api";

// ===========================
// Types
// ===========================

// Login/Token info
export type LoginInfo = TokenApiApiV1TokenPostRequest["tokenRequest"];

// User signup info
export type SignupInfo = UserApiApiV1UserPostRequest["createUserRequest"];

// Login response
export type LoginResponse = TokenResponseApiResponse;

// Signup response
export type SignupResponse = GuidApiResponse;

// Logout response
export type LogoutResponse = StringApiResponse;

// ===========================
// Authentication Functions
// ===========================

/**
 * Login - Create authentication token
 * POST /api/v1/token
 */
export const login = async (request: LoginInfo) => {
  const result = await apiClients.token.apiV1TokenPost({
    tokenRequest: request,
  });
  return result.data;
};

/**
 * Logout - Invalidate current token
 * POST /api/v1/token/logout
 */
export const logout = async () => {
  const result = await apiClients.token.apiV1TokenLogoutPost();
  return result.data;
};

/**
 * Sign up - Create new user account
 * POST /api/v1/user
 */
export const signup = async (request: SignupInfo) => {
  const result = await apiClients.user.apiV1UserPost({
    createUserRequest: request,
  });
  return result.data;
};
