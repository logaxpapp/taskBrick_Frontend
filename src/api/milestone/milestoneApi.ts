/*****************************************************************
 * File: src/api/milestoneApi.ts
 * Description: RTK Query API slice for Milestones
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Milestone Types
 * --------------------- */
export interface IMilestone {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;  // store as string, parse as Date in UI
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  createdAt?: string;
  updatedAt?: string;
}

// For creating a milestone
export interface CreateMilestonePayload {
  projectId: string;
  title: string;
  description?: string;
  dueDate: string;
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
}

// For updating a milestone
export interface UpdateMilestonePayload {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
}

// Example aggregator result
export interface MilestoneProgress {
  totalMilestones: number;
  completedMilestones: number;
  completionPercentage: number;
}

/** ----------------------
 * Milestone API Slice
 * --------------------- */
export const milestoneApi = createApi({
  reducerPath: 'milestoneApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Milestone'],

  endpoints: (builder) => ({
    // POST /milestones
    createMilestone: builder.mutation<IMilestone, CreateMilestonePayload>({
      query: (body) => ({
        url: '/milestones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Milestone'],
    }),

    // GET /milestones/:id
    getMilestone: builder.query<IMilestone, string>({
      query: (id) => `/milestones/${id}`,
      providesTags: (result, error, id) => [{ type: 'Milestone', id }],
    }),

    // GET /milestones/project/:projectId
    listMilestonesForProject: builder.query<IMilestone[], string>({
      query: (projectId) => `/milestones/project/${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({ type: 'Milestone' as const, id: m._id })),
              'Milestone',
            ]
          : ['Milestone'],
    }),

    // PATCH /milestones/:id
    updateMilestone: builder.mutation<IMilestone, { id: string; updates: UpdateMilestonePayload }>({
      query: ({ id, updates }) => ({
        url: `/milestones/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Milestone', id: arg.id }],
    }),

    // DELETE /milestones/:id
    deleteMilestone: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Milestone'],
    }),

    // GET /milestones/project/:projectId/progress
    getMilestoneProgress: builder.query<MilestoneProgress, string>({
      query: (projectId) => `/milestones/project/${projectId}/progress`,
    }),
  }),
});

export const {
  useCreateMilestoneMutation,
  useGetMilestoneQuery,
  useListMilestonesForProjectQuery,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetMilestoneProgressQuery,
} = milestoneApi;
