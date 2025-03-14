/*****************************************************************
 * File: src/api/statusReportApi.ts
 * Description: RTK Query API slice for Status Reports
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IStatusReport {
  _id: string;
  projectId: string;
  reportDate: string;        // store as string, parse as Date in UI
  progressSummary: string;
  risks: string;
  issues: string;
  nextSteps: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStatusReportPayload {
  projectId: string;
  reportDate: string;
  progressSummary: string;
  risks?: string;
  issues?: string;
  nextSteps?: string;
}

export interface UpdateStatusReportPayload {
  reportDate?: string;
  progressSummary?: string;
  risks?: string;
  issues?: string;
  nextSteps?: string;
}

export const statusReportApi = createApi({
  reducerPath: 'statusReportApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['StatusReport'],

  endpoints: (builder) => ({
    // POST /status-reports
    createStatusReport: builder.mutation<IStatusReport, CreateStatusReportPayload>({
      query: (body) => ({
        url: '/status-reports',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StatusReport'],
    }),

    // GET /status-reports/:id
    getStatusReport: builder.query<IStatusReport, string>({
      query: (id) => `/status-reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'StatusReport', id }],
    }),

    // GET /status-reports/project/:projectId
    listStatusReportsByProject: builder.query<IStatusReport[], string>({
      query: (projectId) => `/status-reports/project/${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'StatusReport' as const, id: r._id })),
              'StatusReport',
            ]
          : ['StatusReport'],
    }),

    // PATCH /status-reports/:id
    updateStatusReport: builder.mutation<IStatusReport, { id: string; updates: UpdateStatusReportPayload }>({
      query: ({ id, updates }) => ({
        url: `/status-reports/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'StatusReport', id: arg.id }],
    }),

    // DELETE /status-reports/:id
    deleteStatusReport: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/status-reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StatusReport'],
    }),
  }),
});

export const {
  useCreateStatusReportMutation,
  useGetStatusReportQuery,
  useListStatusReportsByProjectQuery,
  useUpdateStatusReportMutation,
  useDeleteStatusReportMutation,
} = statusReportApi;
