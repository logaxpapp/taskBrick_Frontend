/*****************************************************************
 * File: src/api/projectRiskApi.ts
 * Description: RTK Query API slice for Project Risks
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IProjectRisk {
  _id: string;
  projectId: string;
  description: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigationPlan?: string;
  status: 'Open' | 'Mitigated' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRiskPayload {
  projectId: string;
  description: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigationPlan?: string;
  status?: 'Open' | 'Mitigated' | 'Closed';
}

export interface UpdateRiskPayload {
  description?: string;
  likelihood?: 'Low' | 'Medium' | 'High';
  impact?: 'Low' | 'Medium' | 'High';
  mitigationPlan?: string;
  status?: 'Open' | 'Mitigated' | 'Closed';
}

// Example aggregator result
export interface ProjectRiskSummary {
  _id: string;   // "Open", "Mitigated", or "Closed"
  count: number; // how many
}

export const projectRiskApi = createApi({
  reducerPath: 'projectRiskApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ProjectRisk'],

  endpoints: (builder) => ({
    // POST /risks
    createRisk: builder.mutation<IProjectRisk, CreateRiskPayload>({
      query: (body) => ({
        url: '/risks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectRisk'],
    }),

    // GET /risks/:id
    getRisk: builder.query<IProjectRisk, string>({
      query: (id) => `/risks/${id}`,
      providesTags: (result, error, id) => [{ type: 'ProjectRisk', id }],
    }),

    // GET /risks/project/:projectId
    listRisksByProject: builder.query<IProjectRisk[], string>({
      query: (projectId) => `/risks/project/${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'ProjectRisk' as const, id: r._id })),
              'ProjectRisk',
            ]
          : ['ProjectRisk'],
    }),

    // PATCH /risks/:id
    updateRisk: builder.mutation<IProjectRisk, { id: string; updates: UpdateRiskPayload }>({
      query: ({ id, updates }) => ({
        url: `/risks/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'ProjectRisk', id: arg.id }],
    }),

    // DELETE /risks/:id
    deleteRisk: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/risks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProjectRisk'],
    }),

    // GET /risks/project/:projectId/summary
    getProjectRiskSummary: builder.query<ProjectRiskSummary[], string>({
      query: (projectId) => `/risks/project/${projectId}/summary`,
    }),
  }),
});

export const {
  useCreateRiskMutation,
  useGetRiskQuery,
  useListRisksByProjectQuery,
  useUpdateRiskMutation,
  useDeleteRiskMutation,
  useGetProjectRiskSummaryQuery,
} = projectRiskApi;
