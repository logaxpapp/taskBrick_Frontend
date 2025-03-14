// File: src/api/teamApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface Team {
  _id: string;
  name: string;
  organizationId: string;  // or object if populated
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTeamPayload {
  name: string;
  organizationId: string;
  description?: string | null;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string | null;
}

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Team'],

  endpoints: (builder) => ({
    // Create a team
    createTeam: builder.mutation<Team, CreateTeamPayload>({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),

    // If we want to list only teams for the selected org, pass orgId as string
    listTeams: builder.query<Team[], string | void>({
      query: (orgId) => {
        // If no orgId, or 'undefined', just do '/teams' or some fallback
        if (!orgId) {
          return '/teams';
        }
        return `/teams?orgId=${orgId}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map((t) => ({ type: 'Team' as const, id: t._id })), 'Team']
          : ['Team'],
    }),

    // GET /teams/:id
    getTeam: builder.query<Team, string>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    // PATCH /teams/:id
    updateTeam: builder.mutation<
      Team,
      { id: string; updates: UpdateTeamPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/teams/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Team', id: arg.id }],
    }),

    // DELETE /teams/:id
    deleteTeam: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useListTeamsQuery,
  useGetTeamQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi;
