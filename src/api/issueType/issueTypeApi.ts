// File: src/api/issueType/issueTypeApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IssueType {
  _id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIssueTypePayload {
  organizationId: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface UpdateIssueTypePayload {
  name?: string;
  description?: string;
  iconUrl?: string;
}

export const issueTypeApi = createApi({
  reducerPath: 'issueTypeApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['IssueType'],

  endpoints: (builder) => ({
    // CREATE => POST /issue-types
    createIssueType: builder.mutation<IssueType, CreateIssueTypePayload>({
      query: (body) => ({
        url: '/issue-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueType'],
    }),

    // LIST => GET /issue-types?organizationId=...
    listIssueTypes: builder.query<IssueType[], string>({
      query: (orgId) => `/issue-types?organizationId=${orgId}`,
      providesTags: (result) =>
        result
          ? [...result.map((it) => ({ type: 'IssueType' as const, id: it._id })), 'IssueType']
          : ['IssueType'],
    }),

    // GET => GET /issue-types/:id
    getIssueType: builder.query<IssueType, string>({
      query: (id) => `/issue-types/${id}`,
      providesTags: (result, error, id) => [{ type: 'IssueType', id }],
    }),

    // UPDATE => PATCH /issue-types/:id
    updateIssueType: builder.mutation<IssueType, { id: string; updates: UpdateIssueTypePayload }>({
      query: ({ id, updates }) => ({
        url: `/issue-types/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'IssueType', id: arg.id }],
    }),

    // DELETE => DELETE /issue-types/:id
    deleteIssueType: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/issue-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['IssueType'],
    }),
  }),
});

export const {
  useCreateIssueTypeMutation,
  useListIssueTypesQuery,
  useGetIssueTypeQuery,
  useUpdateIssueTypeMutation,
  useDeleteIssueTypeMutation,
} = issueTypeApi;
