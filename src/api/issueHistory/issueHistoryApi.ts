// File: src/api/issueHistory/issueHistoryApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

// Mongoose model fields
export interface IssueHistory {
  _id: string;
  issueId: string;
  changedByUserId: string; // or user object
  field: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// For adding a history record
export interface CreateHistoryPayload {
  issueId: string;
  changedByUserId: string;
  field: string;
  oldValue?: string | null;
  newValue?: string | null;
}

// For listing history
export interface IssueHistoryData extends IssueHistory {
  // if your backend populates `changedByUserId` with user data, 
  // define it here
}

export const issueHistoryApi = createApi({
  reducerPath: 'issueHistoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['IssueHistory'],

  endpoints: (builder) => ({
    // ADD => POST /history
    addHistoryRecord: builder.mutation<IssueHistory, CreateHistoryPayload>({
      query: (body) => ({
        url: '/history',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueHistory'],
    }),

    // LIST => GET /history/:issueId
    listIssueHistory: builder.query<IssueHistoryData[], string>({
      query: (issueId) => `/history/${issueId}`,
      providesTags: (result, error, issueId) =>
        result
          ? [
              ...result.map((rec) => ({ type: 'IssueHistory' as const, id: rec._id })),
              'IssueHistory',
            ]
          : ['IssueHistory'],
    }),

    // DELETE => DELETE /history/record/:id
    deleteHistoryRecord: builder.mutation<{ message: string }, string>({
      query: (recordId) => ({
        url: `/history/record/${recordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['IssueHistory'],
    }),
  }),
});

export const {
  useAddHistoryRecordMutation,
  useListIssueHistoryQuery,
  useDeleteHistoryRecordMutation,
} = issueHistoryApi;
