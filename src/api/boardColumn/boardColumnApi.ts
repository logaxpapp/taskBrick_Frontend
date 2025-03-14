// File: src/api/boardColumn/boardColumnApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface BoardColumn {
  _id: string;
  boardId: string;
  name?: string | null;
  order?: number | null;
  createdAt?: string;
  updatedAt?: string;
  wipLimit?: number | null; // WIP limit per column (optional)
}

// For creating a column
export interface CreateBoardColumnPayload {
  boardId: string;
  name?: string;
  order?: number;
}

// For updating a column
export interface UpdateBoardColumnPayload {
  name?: string | null;
  order?: number | null;
  wipLimit?: number | null;
}

export const boardColumnApi = createApi({
  reducerPath: 'boardColumnApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['BoardColumn'],

  endpoints: (builder) => ({
    // CREATE => POST /board-columns
    createBoardColumn: builder.mutation<BoardColumn, CreateBoardColumnPayload>({
      query: (body) => ({
        url: '/board-columns',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BoardColumn'],
    }),

    // LIST => GET /board-columns?boardId=...
    listBoardColumns: builder.query<BoardColumn[], { boardId?: string }>({
      query: ({ boardId }) => {
        if (boardId) {
          return `/board-columns?boardId=${boardId}`;
        }
        return '/board-columns';
      },
      providesTags: (result) =>
        result
          ? [...result.map((c) => ({ type: 'BoardColumn' as const, id: c._id })), 'BoardColumn']
          : ['BoardColumn'],
    }),

    // GET => GET /board-columns/:id
    getBoardColumn: builder.query<BoardColumn, string>({
      query: (id) => `/board-columns/${id}`,
      providesTags: (result, error, id) => [{ type: 'BoardColumn', id }],
    }),

    // UPDATE => PATCH /board-columns/:id
    updateBoardColumn: builder.mutation<
      BoardColumn,
      { id: string; updates: { name?: string; order?: number; wipLimit?: number | null } }
    >({
      query: ({ id, updates }) => ({
        url: `/board-columns/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'BoardColumn', id: arg.id },
        'BoardColumn',
      ],
    }),

    // DELETE => DELETE /board-columns/:id
    deleteBoardColumn: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/board-columns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BoardColumn'],
    }),
  }),
});

export const {
  useCreateBoardColumnMutation,
  useListBoardColumnsQuery,
  useGetBoardColumnQuery,
  useUpdateBoardColumnMutation,
  useDeleteBoardColumnMutation,
} = boardColumnApi;
