import { User } from './userTypes';

export interface ConversationRequest {
  _id: string;
  orgId: string;
  participants: string[]; // user IDs
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationPopulated {
  _id: string;
  orgId: string;
  participants: User[]; // actual user objects
  createdAt?: string;
  updatedAt?: string;
}
