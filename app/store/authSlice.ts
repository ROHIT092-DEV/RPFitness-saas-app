import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name?: string;
  fullName?: string; // optional - some responses use `name`
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
