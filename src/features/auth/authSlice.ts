// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
  _id: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;

  // 🔹 Add these new optional fields 
  profileImage?: string | null; 
  googleId?: string | null;     
  appleId?: string | null;      
  // etc.

  // If you store more
  passwordHistory?: string | null;
  organizationId?: number | null;
  isActive?: boolean;
  // ...
}

interface AuthState {
  accessToken: string | null;
  user: UserInfo | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
    },
    setUser(state, action: PayloadAction<UserInfo | null>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setTokens, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
