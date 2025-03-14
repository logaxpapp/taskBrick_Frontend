// File: src/api/issue/issueApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface Issue {
  _id: string;
  boardColumnId?: string | null;
  order?: number | null; // <-- Confirming we have "order" in the Issue interface
  sprintId?: string | null;
  projectId?: string | null;
  issueTypeId?: string | null;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assigneeId?: string | null;
  reporterId?: string | null;
  storyPoints?: number | null;
  parentIssueId?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Date fields
  startDate?: string | null;
  dueDate?: string | null;
}

/**
 * For creating an Issue, allow boardColumnId + order to be
 * string|null|undefined or number|null|undefined.
 */
export interface CreateIssuePayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  reporterId?: string;
  projectId?: string;
  storyPoints?: number;
  parentIssueId?: string;
  issueTypeId?: string;
  boardColumnId?: string | null;
  order?: number | null;        // <-- Add "order" here
  sprintId?: string | null;

  // Date fields
  startDate?: string | null;
  dueDate?: string | null;
}

export interface UpdateIssuePayload {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  assigneeId?: string | null;
  reporterId?: string | null;
  storyPoints?: number | null;
  parentIssueId?: string | null;
  boardColumnId?: string | null;
  order?: number | null;        // <-- Add "order" here too
  sprintId?: string | null;

  // Date fields
  startDate?: string | null;
  dueDate?: string | null;
}

export const issueApi = createApi({
  reducerPath: 'issueApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Issue'],
  endpoints: (builder) => ({
    // CREATE => POST /issues
    createIssue: builder.mutation<Issue, CreateIssuePayload>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),

    // LIST => GET /issues?projectId=...
    listIssues: builder.query<Issue[], { projectId?: string }>({
      query: ({ projectId }) => {
        if (projectId) {
          return `/issues?projectId=${projectId}`;
        }
        return '/issues';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((iss) => ({ type: 'Issue' as const, id: iss._id })),
              'Issue',
            ]
          : ['Issue'],
    }),

    // GET => GET /issues/:id
    getIssue: builder.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Issue', id }],
    }),

    // UPDATE => PATCH /issues/:id
    updateIssue: builder.mutation<
      Issue,
      { id: string; updates: UpdateIssuePayload }
    >({
      query: ({ id, updates }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Issue', id: arg.id }],
    }),

    // DELETE => DELETE /issues/:id
    deleteIssue: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issue'],
    }),

    // (Optional) Add label => POST /issues/label/add
    addLabelToIssue: builder.mutation<
      { message: string },
      { issueId: string; labelId: string }
    >({
      query: ({ issueId, labelId }) => ({
        url: '/issues/label/add',
        method: 'POST',
        body: { issueId, labelId },
      }),
      invalidatesTags: ['Issue'],
    }),

    // (Optional) Remove label => POST /issues/label/remove
    removeLabelFromIssue: builder.mutation<
      { message: string },
      { issueId: string; labelId: string }
    >({
      query: ({ issueId, labelId }) => ({
        url: '/issues/label/remove',
        method: 'POST',
        body: { issueId, labelId },
      }),
      invalidatesTags: ['Issue'],
    }),

    // (Optional) Add watcher => POST /issues/watcher/add
    addWatcher: builder.mutation<
      { message: string },
      { issueId: string; userId: string }
    >({
      query: ({ issueId, userId }) => ({
        url: '/issues/watcher/add',
        method: 'POST',
        body: { issueId, userId },
      }),
      invalidatesTags: ['Issue'],
    }),

    // (Optional) Remove watcher => POST /issues/watcher/remove
    removeWatcher: builder.mutation<
      { message: string },
      { issueId: string; userId: string }
    >({
      query: ({ issueId, userId }) => ({
        url: '/issues/watcher/remove',
        method: 'POST',
        body: { issueId, userId },
      }),
      invalidatesTags: ['Issue'],
    }),

    // (Optional) Filter issues => GET /issues/filter?...
    filterIssues: builder.query<
      Issue[],
      { projectId?: string; assignedTo?: string; reporterId?: string }
    >({
      query: ({ projectId, assignedTo, reporterId }) => {
        const params = new URLSearchParams();
        if (projectId) params.append('projectId', projectId);
        if (assignedTo) params.append('assignedTo', assignedTo);
        if (reporterId) params.append('reporterId', reporterId);

        let url = '/issues/filter';
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((iss) => ({ type: 'Issue' as const, id: iss._id })),
              'Issue',
            ]
          : ['Issue'],
    }),
  }),
});

export const {
  useCreateIssueMutation,
  useListIssuesQuery,
  useGetIssueQuery,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useAddLabelToIssueMutation,
  useRemoveLabelFromIssueMutation,
  useAddWatcherMutation,
  useRemoveWatcherMutation,
  useFilterIssuesQuery,
} = issueApi;
