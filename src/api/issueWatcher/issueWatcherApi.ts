// File: src/api/issueWatcher/issueWatcherApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IssueWatcher {
  _id: string;
  issueId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IIssueWatcherDoc {
  _id: string;
  issueId: {
    _id: string;
    title: string;
    status: string;
    priority?: string;
    createdAt?: string;
    updatedAt?: string;
    // or more fields from Issue
  };
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}


// For adding/removing watchers
export interface AddRemoveWatcherPayload {
  issueId: string;
  userId: string;
}

export interface IssueWatcherData {
  _id: string;
  issueId: string;
  userId: {
    _id: string;
    email?: string;
    // any user fields
  };
  createdAt?: string;
  updatedAt?: string;
}

export const issueWatcherApi = createApi({
  reducerPath: 'issueWatcherApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['IssueWatcher'],

  endpoints: (builder) => ({
    // ADD => POST /issue-watcher/add
    addWatcher: builder.mutation<{ message: string }, AddRemoveWatcherPayload>({
      query: (body) => ({
        url: '/issue-watcher/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueWatcher'],
    }),

    // REMOVE => POST /issue-watcher/remove
    removeWatcher: builder.mutation<{ message: string }, AddRemoveWatcherPayload>({
      query: (body) => ({
        url: '/issue-watcher/remove',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['IssueWatcher'],
    }),

    // LIST watchers for an issue => GET /issue-watcher/issue/:issueId/watchers
    listWatchersForIssue: builder.query<IssueWatcherData[], string>({
      query: (issueId) => `/issue-watcher/${issueId}/watchers`,
      providesTags: (result, error, issueId) =>
        result
          ? [
              ...result.map((w) => ({ type: 'IssueWatcher' as const, id: w._id })),
              'IssueWatcher',
            ]
          : ['IssueWatcher'],
    }),
     // NEW: list watched issues for a user
     listWatchedIssuesByUser: builder.query<IIssueWatcherDoc[], string>({
      query: (userId) => `/issue-watcher/user/${userId}/watched-issues`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map((doc) => ({
                type: 'IssueWatcher' as const,
                id: doc._id,
              })),
              'IssueWatcher',
            ]
          : ['IssueWatcher'],
    }),
  }),
});

export const {
  useAddWatcherMutation,
  useRemoveWatcherMutation,
  useListWatchersForIssueQuery,
  useListWatchedIssuesByUserQuery,
} = issueWatcherApi;
