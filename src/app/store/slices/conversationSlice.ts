import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypingPayload {
  userId: string;
  conversationId: string;
  isTyping: boolean;
}

interface PresenceState {
  onlineUserIds: string[];
}

interface ConversationState {
  typingByConvo: Record<string, string[]>; // key=conversationId, value=array of userIds currently typing
  presence: PresenceState;
}

const initialState: ConversationState = {
  typingByConvo: {},
  presence: {
    onlineUserIds: [],
  },
};

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setTyping: (state, action: PayloadAction<{ userId: string; conversationId: string; isTyping: boolean }>) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingByConvo[conversationId]) {
        state.typingByConvo[conversationId] = [];
      }
      const currentList = state.typingByConvo[conversationId];
      if (isTyping) {
        // add if not present
        if (!currentList.includes(userId)) {
          currentList.push(userId);
        }
      } else {
        // remove if present
        state.typingByConvo[conversationId] = currentList.filter((u) => u !== userId);
      }
    },
    setUserOnline: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (!state.presence.onlineUserIds.includes(userId)) {
        state.presence.onlineUserIds.push(userId);
      }
    },
    setUserOffline: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.presence.onlineUserIds = state.presence.onlineUserIds.filter((id) => id !== userId);
    },
  },
});

export const { setTyping, setUserOnline, setUserOffline } = conversationSlice.actions;
export const conversationActions = conversationSlice.actions;

export default conversationSlice.reducer;
