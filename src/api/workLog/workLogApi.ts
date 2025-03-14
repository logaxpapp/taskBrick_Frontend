// File: src/api/workLog/workLogApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** The shape of a single WorkLog document */
export interface WorkLog {
  _id: string;
  issueId: string; // or an ObjectId string
  userId: string;  // or an ObjectId string
  hours: number;
  comment?: string | null;
  loggedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** For creating/updating a work log */
interface CreateOrUpdateWorkLogPayload {
  issueId: string; // needed when creating
  userId?: string; // might be optional if your backend infers the user
  hours: number;
  comment?: string;
  loggedAt?: string; // or a date string
}

/** For listing by an issue */
interface ListWorkLogsArgs {
  issueId: string;
}

export const workLogApi = createApi({
  reducerPath: 'workLogApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['WorkLog'],

  endpoints: (builder) => ({
    /**
     * LIST => GET /worklogs/issue/:issueId
     * We'll pass { issueId } and build a path "/worklogs/issue/<issueId>"
     */
    listWorkLogs: builder.query<WorkLog[], ListWorkLogsArgs>({
      query: ({ issueId }) => `/worklogs/issue/${issueId}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((wl) => ({ type: 'WorkLog' as const, id: wl._id })),
              { type: 'WorkLog', id: `LIST-ISSUE-${arg.issueId}` },
            ]
          : [{ type: 'WorkLog', id: `LIST-ISSUE-${arg.issueId}` }],
    }),

    /**
     * CREATE => POST /worklogs
     * Body: { issueId, userId, hours, comment?, loggedAt? }
     */
    createWorkLog: builder.mutation<WorkLog, CreateOrUpdateWorkLogPayload>({
      query: (body) => ({
        url: '/worklogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        // we can invalidate the "LIST-ISSUE" so it refetches
        { type: 'WorkLog', id: `LIST-ISSUE-${arg.issueId}` },
      ],
    }),

    /**
     * UPDATE => PATCH /worklogs/:id
     * We need the doc _id + partial data
     */
    updateWorkLog: builder.mutation<
      WorkLog,
      { id: string; issueId: string; updates: Partial<CreateOrUpdateWorkLogPayload> }
    >({
      query: ({ id, updates }) => ({
        url: `/worklogs/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'WorkLog', id: arg.id },
        { type: 'WorkLog', id: `LIST-ISSUE-${arg.issueId}` },
      ],
    }),

    /**
     * DELETE => DELETE /worklogs/:id
     */
    deleteWorkLog: builder.mutation<{ message: string }, { id: string; issueId: string }>({
      query: ({ id }) => ({
        url: `/worklogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'WorkLog', id: arg.id },
        { type: 'WorkLog', id: `LIST-ISSUE-${arg.issueId}` },
      ],
    }),
  }),
});

export const {
  useListWorkLogsQuery,
  useCreateWorkLogMutation,
  useUpdateWorkLogMutation,
  useDeleteWorkLogMutation,
} = workLogApi;
