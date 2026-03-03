/**
 * Authentication Context Types
 */

export type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  checkAuth: () => void;
  updateAuthState: () => void;
};
