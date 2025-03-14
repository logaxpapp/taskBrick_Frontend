// File: src/api/userTeamApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth'; 
import { User } from '../../types/userTypes';

/**
 * The pivot row linking a user to a team.
 */
export interface UserTeamPivot {
  _id: string;
  userId: User; // or object if populated
  teamId: string;           // or object if populated
  roleInTeam?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** For adding a user to a team */
export interface AddUserToTeamPayload {
  userId: User  | string; // or object if populated
  teamId: string;
  roleInTeam?: string;
}

/** For removing a user from a team */
export interface RemoveUserFromTeamPayload {
  userId: User
  teamId: string;
}

export const userTeamApi = createApi({
  reducerPath: 'userTeamApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserTeam'],

  endpoints: (builder) => ({
    /**
     * POST /user-team/add
     * Body: { userId, teamId, roleInTeam? }
     */
    addUserToTeam: builder.mutation<UserTeamPivot, AddUserToTeamPayload>({
      query: (body) => ({
        url: '/user-team/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserTeam'],
    }),

    /**
     * POST /user-team/remove
     * Body: { userId, teamId }
     */
    removeUserFromTeam: builder.mutation<{ success: boolean }, RemoveUserFromTeamPayload>({
      query: (body) => ({
        url: '/user-team/remove',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserTeam'],
    }),

    /**
     * GET /user-team/user/:userId
     * returns array of UserTeamPivot
     */
    listTeamsForUser: builder.query<UserTeamPivot[], string>({
      query: (userId) => `/user-team/user/${userId}`,
      providesTags: ['UserTeam'],
    }),

    /**
     * GET /user-team/team/:teamId
     * returns array of UserTeamPivot
     */
    listUsersInTeam: builder.query<UserTeamPivot[], string>({
      query: (teamId) => `/user-team/team/${teamId}`,
      providesTags: ['UserTeam'],
    }),
  }),
});

// Auto-generated hooks
export const {
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  useListTeamsForUserQuery,
  useListUsersInTeamQuery,
} = userTeamApi;
