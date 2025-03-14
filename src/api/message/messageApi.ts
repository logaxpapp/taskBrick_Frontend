// File: src/api/message/messageApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { Message } from '../../types/messageTypes';

interface ListMessagesParams {
  conversationId: string;
  limit?: number;
  skip?: number;
}

interface CreateMessagePayload {
  conversationId: string;
  senderId: string;
  text: string;
  type?: string;
  attachmentUrl?: string;
}

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    // 1) List messages for a conversation
    listMessages: builder.query<Message[], ListMessagesParams>({
      query: ({ conversationId, limit = 50, skip = 0 }) => ({
        url: `/messages/${conversationId}?limit=${limit}&skip=${skip}`,
        method: 'GET',
      }),
      providesTags: (result, error, { conversationId }) =>
        result
          ? [
              ...result.map((msg) => ({ type: 'Message' as const, id: msg._id })),
              { type: 'Message', id: `LIST-${conversationId}` },
            ]
          : [{ type: 'Message', id: `LIST-${conversationId}` }],
    }),

    // 2) Create a message (OPTIONAL if you also do this by socket)
    createMessage: builder.mutation<Message, CreateMessagePayload>({
      query: (body) => ({
        url: '/messages',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: `LIST-${conversationId}` },
      ],
    }),

    // 3) Mark message read
    markMessageRead: builder.mutation<Message, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}/read`,
        method: 'PATCH',
      }),
      // Possibly invalidates message or conversation
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),

    // 4) Delete a message
    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, messageId) => [{ type: 'Message', id: messageId }],
    }),
    
  }),
});

export const {
  useListMessagesQuery,
  useCreateMessageMutation,
  useMarkMessageReadMutation,
  useDeleteMessageMutation,
} = messageApi;
