// File: src/app/store/slices/messageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MessageData {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  type: string;
  attachmentUrl?: string | null;
  readBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface MessageState {
  // For each conversation, store an array of messages
  messagesByConvo: Record<string, MessageData[]>;
}

const initialState: MessageState = {
  messagesByConvo: {},
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // Receive a single new message in real-time (Socket.IO)
    socketMessageReceived: (state, action: PayloadAction<MessageData>) => {
      const msg = action.payload;
      const convoId = msg.conversationId;
      if (!state.messagesByConvo[convoId]) {
        state.messagesByConvo[convoId] = [];
      }
      // Push new message
      state.messagesByConvo[convoId].push(msg);
    },

    // When we fetch messages from the server, set them all at once
    setMessagesForConvo: (
      state,
      action: PayloadAction<{ conversationId: string; messages: MessageData[] }>
    ) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConvo[conversationId] = messages;
    },

    // e.g. update read receipts
    updateReadReceipt: (state, action: PayloadAction<{ messageId: string; readBy: string[] }>) => {
      const { messageId, readBy } = action.payload;
      // find the message across all conversation arrays
      for (const convoId in state.messagesByConvo) {
        const msgIndex = state.messagesByConvo[convoId].findIndex((m) => m._id === messageId);
        if (msgIndex !== -1) {
          state.messagesByConvo[convoId][msgIndex].readBy = readBy;
          break;
        }
      }
    },
  },
});

// Destructure individual actions
export const {
  socketMessageReceived,
  setMessagesForConvo,
  updateReadReceipt,
} = messageSlice.actions;

// Re-export them all together under a single object
export const messageActions = messageSlice.actions;

// Default export of the reducer
export default messageSlice.reducer;
