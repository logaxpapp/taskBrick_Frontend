// src/api/conversation/conversationApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

// Our two interfaces:
import { ConversationRequest, ConversationPopulated } from '../../types/conversationTypes';

interface ListUserConversationsParams {
  orgId: string;
  userId: string;
}

interface CreateConversationPayload {
  orgId: string;
  participants: string[]; // array of userIds
}

interface UpdateParticipantPayload {
  conversationId: string;
  userId: string;
}

interface RenameConversationPayload {
  conversationId: string;
  name: string;
}

export const conversationApi = createApi({
  reducerPath: 'conversationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Conversation'],
  endpoints: (builder) => ({
    // 1) List all conversations => returns ConversationPopulated[]
    listUserConversations: builder.query<ConversationPopulated[], ListUserConversationsParams>({
      query: ({ orgId, userId }) => ({
        url: `/conversations/org/${orgId}/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: 'Conversation' as const, id: c._id })),
              { type: 'Conversation', id: 'LIST' },
            ]
          : [{ type: 'Conversation', id: 'LIST' }],
    }),

    // 2) Create => we send string[] of user IDs; response might be populated or not
    // If your server also returns a populated conversation, use ConversationPopulated
    createConversation: builder.mutation<ConversationPopulated, CreateConversationPayload>({
      query: (body) => ({
        url: '/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],
    }),

    // 3) Get single => returns ConversationPopulated
    getConversation: builder.query<ConversationPopulated, string>({
      query: (id) => `/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Conversation', id }],
    }),

    // 4) Add participant => request is userId string, response might be populated
    addParticipant: builder.mutation<ConversationPopulated, UpdateParticipantPayload>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/add-participant`,
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Conversation', id: arg.conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    // 5) Remove participant => same as above
    removeParticipant: builder.mutation<ConversationPopulated, UpdateParticipantPayload>({
      query: ({ conversationId, userId }) => ({
        url: `/conversations/${conversationId}/remove-participant`,
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Conversation', id: arg.conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),

    // 6) Rename conversation => optional
    renameConversation: builder.mutation<ConversationPopulated, RenameConversationPayload>({
      query: ({ conversationId, name }) => ({
        url: `/conversations/${conversationId}/rename`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Conversation', id: arg.conversationId },
        { type: 'Conversation', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListUserConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useRenameConversationMutation,
} = conversationApi;
