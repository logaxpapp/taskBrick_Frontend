// File: src/api/invitation/invitationApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface Invitation {
  _id: string;
  email: string;
  teamId: string; // or object
  roleInTeam?: string | null;
  invitationToken: string;
  status: 'pending' | 'accepted' | 'expired' | 'declined' | 'cancelled';
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface AcceptInvitationArgs {
  token: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

interface AcceptInvitationResponse {
  message: string;
  invitation: Invitation;
  user?: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // etc...
  };
}

export interface CreateInvitationPayload {
  email: string;
  teamId: string;
  roleInTeam?: string | null;
}

export interface UpdateInvitationPayload {
  email?: string;
  roleInTeam?: string | null;
  status?: 'pending' | 'accepted' | 'expired' | 'declined' | 'cancelled';
  expiresAt?: string | null;
}

export const invitationApi = createApi({
  reducerPath: 'invitationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Invitation'],

  endpoints: (builder) => ({
    // 1) CREATE
    createInvitation: builder.mutation<Invitation, CreateInvitationPayload>({
      query: (body) => ({
        url: '/invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitation'],
    }),

    // 2) LIST
    listInvitations: builder.query<Invitation[], { teamId?: string } | void>({
      query: (arg) => {
        const teamParam = arg?.teamId ? `?teamId=${arg.teamId}` : '';
        return `/invitations${teamParam}`;
      },
      providesTags: ['Invitation'],
    }),

    // 3) GET
    getInvitation: builder.query<Invitation, string>({
      query: (id) => `/invitations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invitation', id }],
    }),

    // 4) UPDATE
    updateInvitation: builder.mutation<
      Invitation,
      { id: string; updates: UpdateInvitationPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/invitations/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Invitation', id: arg.id }],
    }),

    // 5) DELETE
    deleteInvitation: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/invitations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invitation'],
    }),

    // 6) RESEND
    resendInvitation: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/invitations/resend/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),

    // 7) ACCEPT
    acceptInvitation: builder.mutation<AcceptInvitationResponse, AcceptInvitationArgs>({
      query: ({ token, firstName, lastName, password }) => ({
        url: `/invitations/accept/${token}`,
        method: 'POST',
        // We put any user fields in the POST body:
        body: {
          firstName,
          lastName,
          password,
        },
      }),
      invalidatesTags: ['Invitation'],
    }),
    // 8) DECLINE
    declineInvitation: builder.mutation<{ message: string }, string>({
      query: (token) => ({
        url: `/invitations/decline/${token}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),
  }),
});

export const {
  useCreateInvitationMutation,
  useListInvitationsQuery,
  useGetInvitationQuery,
  useUpdateInvitationMutation,
  useDeleteInvitationMutation,
  useResendInvitationMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} = invitationApi;
