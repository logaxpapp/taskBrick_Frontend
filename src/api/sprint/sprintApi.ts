// File: src/api/sprint/sprintApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** Sprint interface matching your backend */
export interface Sprint {
  _id: string;
  projectId: string;    // or object if you're populating
  name: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  velocity?: number | null;
  capacity?: number | null;
  reviewFeedback?: string | null;
  retrospectiveNotes?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/** Payload for creating a sprint */
export interface CreateSprintPayload {
  projectId: string;
  name: string;
  goal?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  velocity?: number;
  capacity?: number;
}

/** Payload for updating a sprint */
export interface UpdateSprintPayload {
  name?: string;
  goal?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: 'PLANNED' | 'ACTIVE' | 'CLOSED';
  velocity?: number | null;
  capacity?: number | null;

  reviewFeedback?: string | null;
  retrospectiveNotes?: string | null;
}

/** Our RTK Query slice for Sprints */
export const sprintApi = createApi({
  reducerPath: 'sprintApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Sprint'],

  endpoints: (builder) => ({
    // 1) CREATE => POST /sprints
    createSprint: builder.mutation<Sprint, CreateSprintPayload>({
      query: (body) => ({
        url: '/sprints',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sprint'],
    }),

    // 2) LIST => GET /sprints?projectId=someId
    listSprints: builder.query<Sprint[], { projectId: string }>({
      query: ({ projectId }) => `/sprints?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: 'Sprint' as const, id: s._id })), 'Sprint']
          : ['Sprint'],
    }),

    // 3) GET => GET /sprints/:id
    getSprint: builder.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id }],
    }),

    // 4) UPDATE => PATCH /sprints/:id
    updateSprint: builder.mutation<Sprint, { id: string; updates: UpdateSprintPayload }>({
      query: ({ id, updates }) => ({
        url: `/sprints/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Sprint', id: arg.id }, 'Sprint'],
    }),

    // 5) DELETE => DELETE /sprints/:id
    deleteSprint: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sprint'],
    }),

    // 6) START => POST /sprints/:id/start
    startSprint: builder.mutation<Sprint, string>({
      query: (sprintId) => ({
        url: `/sprints/${sprintId}/start`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, sprintId) => [{ type: 'Sprint', id: sprintId }, 'Sprint'],
    }),

    // 7) COMPLETE => POST /sprints/:id/complete
    completeSprint: builder.mutation<Sprint, string>({
      query: (sprintId) => ({
        url: `/sprints/${sprintId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, sprintId) => [{ type: 'Sprint', id: sprintId }, 'Sprint'],
    }),

    // 8) ADD ISSUE => POST /sprints/:id/add-issue
    addIssueToSprint: builder.mutation<
      any,
      { sprintId: string; issueId: string }
    >({
      query: ({ sprintId, issueId }) => ({
        url: `/sprints/${sprintId}/add-issue`,
        method: 'POST',
        body: { issueId },
      }),
      invalidatesTags: ['Sprint'],
    }),

    // 9) REMOVE ISSUE => POST /sprints/:id/remove-issue
    removeIssueFromSprint: builder.mutation<
      any,
      { sprintId: string; issueId: string }
    >({
      query: ({ sprintId, issueId }) => ({
        url: `/sprints/${sprintId}/remove-issue`,
        method: 'POST',
        body: { issueId },
      }),
      invalidatesTags: ['Sprint'],
    }),

    // 10) SAVE REVIEW/RETRO => POST /sprints/:id/review
    saveSprintReviewOrRetro: builder.mutation<
      Sprint,
      { sprintId: string; reviewFeedback?: string; retrospectiveNotes?: string }
    >({
      query: ({ sprintId, reviewFeedback, retrospectiveNotes }) => ({
        url: `/sprints/${sprintId}/review`,
        method: 'POST',
        body: { reviewFeedback, retrospectiveNotes },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Sprint', id: arg.sprintId }, 'Sprint'],
    }),
  }),
});

export const {
  useCreateSprintMutation,
  useListSprintsQuery,
  useGetSprintQuery,
  useUpdateSprintMutation,
  useDeleteSprintMutation,

  // The advanced hooks
  useStartSprintMutation,
  useCompleteSprintMutation,
  useAddIssueToSprintMutation,
  useRemoveIssueFromSprintMutation,
  useSaveSprintReviewOrRetroMutation,
} = sprintApi;
