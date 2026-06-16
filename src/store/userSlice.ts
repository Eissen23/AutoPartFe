import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { tokenManager } from "#src/utils/api";

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  isAuthenticated: tokenManager.hasToken(),
  token: tokenManager.getToken(),
  refreshToken: tokenManager.getRefreshToken(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>,
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
    },
    clearCredentials(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
    },
    syncAuth(state) {
      state.isAuthenticated = tokenManager.hasToken();
      state.token = tokenManager.getToken();
    },
  },
});

export const { setCredentials, clearCredentials, syncAuth } = userSlice.actions;
export const userReducer = userSlice.reducer;
