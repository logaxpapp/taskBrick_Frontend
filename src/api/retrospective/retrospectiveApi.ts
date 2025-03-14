// File: src/api/retro/retroApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** RetrospectiveItem interface matching your backend */
export interface RetrospectiveItem {
  _id: string;
  sprintId: string;            // or an object if populated
  description: string;
  assigneeId?: string | null;  // or an object if you're populating user
  status: 'OPEN' | 'DONE';
  createdAt?: string;
  updatedAt?: string;
}

/** For creating a retro item */
export interface CreateRetroItemPayload {
  sprintId: string;
  description: string;
  assigneeId?: string | null;
}

/** For updating a retro item */
export interface UpdateRetroItemPayload {
  description?: string;
  assigneeId?: string | null;
  status?: 'OPEN' | 'DONE';
}

/** 
 * For listing retro items, the route might be:
 *  GET /retros/:sprintId
 */

/** RTK Query slice for retro items */
export const retroApi = createApi({
  reducerPath: 'retroApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['RetrospectiveItem'],

  endpoints: (builder) => ({
    // CREATE => POST /retros
    createRetroItem: builder.mutation<RetrospectiveItem, CreateRetroItemPayload>({
      query: (body) => ({
        url: '/retros',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RetrospectiveItem'],
    }),

    // LIST => GET /retros/:sprintId
    listRetroItems: builder.query<RetrospectiveItem[], string>({
      query: (sprintId) => `/retros/${sprintId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'RetrospectiveItem' as const,
                id: item._id,
              })),
              'RetrospectiveItem',
            ]
          : ['RetrospectiveItem'],
    }),

    // UPDATE => PATCH /retros/:retroItemId
    updateRetroItem: builder.mutation<
      RetrospectiveItem,
      { retroItemId: string; updates: UpdateRetroItemPayload }
    >({
      query: ({ retroItemId, updates }) => ({
        url: `/retros/${retroItemId}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'RetrospectiveItem', id: arg.retroItemId },
        'RetrospectiveItem',
      ],
    }),

    // DELETE => DELETE /retros/:retroItemId
    deleteRetroItem: builder.mutation<{ message: string }, string>({
      query: (retroItemId) => ({
        url: `/retros/${retroItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RetrospectiveItem'],
    }),
  }),
});

export const {
  useCreateRetroItemMutation,
  useListRetroItemsQuery,
  useUpdateRetroItemMutation,
  useDeleteRetroItemMutation,
} = retroApi;
