// File: src/api/issueLabel/issueLabelApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IssueLabel {
  _id: string;
  issueId: string;
  labelId: string;
  createdAt?: string;
  updatedAt?: string;
}

// For adding/removing a label
export interface AddRemoveLabelPayload {
  issueId: string;
  labelId: string;
}

// For listing labels of an issue
export interface IssueLabelData {
  _id: string;
  issueId: string;
  labelId: {
    _id: string;
    name: string;
    // any other label fields like color, description, etc.
  };
  createdAt?: string;
  updatedAt?: string;
}

export const issueLabelApi = createApi({
  reducerPath: 'issueLabelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['IssueLabel'],

  endpoints: (builder) => ({
    // ADD => POST /issue-label/add
    addLabel: builder.mutation<{ message: string }, AddRemoveLabelPayload>({
      query: (body) => ({
        url: '/issue-label/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueLabel'], // or maybe 'Issue' if you want to refresh issues
    }),

    // REMOVE => POST /issue-label/remove
    removeLabel: builder.mutation<{ message: string }, AddRemoveLabelPayload>({
      query: (body) => ({
        url: '/issue-label/remove',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueLabel'],
    }),

    // LIST => GET /issue-label/issue/:issueId/labels
    listLabelsForIssue: builder.query<IssueLabelData[], string>({
      query: (issueId) => `/issue-label/issue/${issueId}/labels`,
      providesTags: (result, error, issueId) =>
        result
          ? [
              ...result.map((lbl) => ({ type: 'IssueLabel' as const, id: lbl._id })),
              'IssueLabel',
            ]
          : ['IssueLabel'],
    }),
  }),
});

export const {
  useAddLabelMutation,
  useRemoveLabelMutation,
  useListLabelsForIssueQuery,
} = issueLabelApi;
