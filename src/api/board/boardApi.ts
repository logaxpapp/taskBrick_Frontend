// File: src/api/board/boardApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

// Board model from your Mongoose schema
export interface Board {
  _id: string;
  projectId: string;
  name: string;
  type?: string; // "KANBAN", "SCRUM", etc.
  config?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a board
export interface CreateBoardPayload {
  projectId: string;
  name: string;
  type?: string;         // optional
  config?: Record<string, any> | null;
}

// For updating a board
export interface UpdateBoardPayload {
  name?: string;
  config?: Record<string, any> | null;
}

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Board'],

  endpoints: (builder) => ({
    // CREATE => POST /boards
    createBoard: builder.mutation<Board, CreateBoardPayload>({
      query: (body) => ({
        url: '/boards',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Board'],
    }),

    // LIST => GET /boards?projectId=...
    listBoards: builder.query<Board[], { projectId?: string }>({
      query: ({ projectId }) => {
        if (projectId) {
          return `/boards?projectId=${projectId}`;
        }
        return '/boards'; // or handle no projectId
      },
      providesTags: (result) =>
        result
          ? [...result.map((b) => ({ type: 'Board' as const, id: b._id })), 'Board']
          : ['Board'],
    }),

    // GET => GET /boards/:id
    getBoard: builder.query<Board, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: 'Board', id }],
    }),

    // UPDATE => PATCH /boards/:id
    updateBoard: builder.mutation<
      Board,
      { id: string; updates: UpdateBoardPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/boards/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Board', id: arg.id }],
    }),

    // DELETE => DELETE /boards/:id
    deleteBoard: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Board'],
    }),
  }),
});

export const {
  useCreateBoardMutation,
  useListBoardsQuery,
  useGetBoardQuery,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardApi;
