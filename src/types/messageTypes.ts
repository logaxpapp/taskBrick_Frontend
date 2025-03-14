// File: src/types/messageTypes.ts
export interface Message {
    _id: string;
    conversationId: string;
    senderId: string;
    text: string;
    type: string;
    attachmentUrl?: string | null;
    readBy: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  