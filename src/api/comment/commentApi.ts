// File: src/api/comment/commentApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

// The shape of a single comment document
export interface Comment {
  _id: string;
  issueId: string;       // references Issue
  userId: string;        // references User
  commentText: string;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a comment
export interface CreateCommentPayload {
  issueId: string;
  commentText: string;
  // The server side might infer userId from req.user
}

// For listing comments
// (We can reuse `Comment[]`, or define a separate interface if needed.)

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Comment'],

  endpoints: (builder) => ({
    // CREATE => POST /comments
    createComment: builder.mutation<Comment, CreateCommentPayload>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),

    // LIST => GET /comments?issueId=...
    listComments: builder.query<Comment[], { issueId?: string }>({
      query: ({ issueId }) => {
        // pass ?issueId=xxx if provided
        if (issueId) {
          return `/comments?issueId=${issueId}`;
        }
        return '/comments';
      },
      providesTags: (result) =>
        result
          ? [...result.map((c) => ({ type: 'Comment' as const, id: c._id })), 'Comment']
          : ['Comment'],
    }),

    // DELETE => DELETE /comments/:id
    deleteComment: builder.mutation<{ message: string }, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useListCommentsQuery,
  useDeleteCommentMutation,
} = commentApi;
