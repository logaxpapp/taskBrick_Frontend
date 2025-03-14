// File: src/features/theme/themeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Mode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemeState {
  mode: Mode;          // <-- now includes 'system'
  fontSize: FontSize;  
  bgColor: string;
  notifications: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  fontSize: 'medium',
  bgColor: '#ffffff',
  notifications: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Set just the mode
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    // Set just the font size
    setFontSize: (state, action: PayloadAction<FontSize>) => {
      state.fontSize = action.payload;
    },
    // Set just the bg color
    setBgColor: (state, action: PayloadAction<string>) => {
      state.bgColor = action.payload;
    },
    // Set notifications toggle
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    // Combined action for multiple fields at once
    setTheme: (
      state,
      action: PayloadAction<Partial<Pick<ThemeState, 'mode' | 'fontSize' | 'bgColor' | 'notifications'>>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setMode,
  setFontSize,
  setBgColor,
  setNotifications,
  setTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
