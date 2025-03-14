// File: src/api/label/labelApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface Label {
  _id: string;
  organizationId: string;
  name: string;
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabelPayload {
  organizationId: string;
  name: string;
  color?: string | null;
}

export interface UpdateLabelPayload {
  name?: string;
  color?: string | null;
}

export const labelApi = createApi({
  reducerPath: 'labelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Label'],

  endpoints: (builder) => ({
    // CREATE => POST /labels
    createLabel: builder.mutation<Label, CreateLabelPayload>({
      query: (body) => ({
        url: '/labels',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Label'],
    }),

    // LIST => GET /labels?organizationId=...
    listLabels: builder.query<Label[], string>({
      query: (orgId) => `/labels?organizationId=${orgId}`,
      providesTags: (result) =>
        result
          ? [...result.map((lbl) => ({ type: 'Label' as const, id: lbl._id })), 'Label']
          : ['Label'],
    }),

    // UPDATE => PATCH /labels/:id
    updateLabel: builder.mutation<Label, { id: string; updates: UpdateLabelPayload }>({
      query: ({ id, updates }) => ({
        url: `/labels/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Label', id: arg.id }],
    }),

    // DELETE => DELETE /labels/:id
    deleteLabel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/labels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Label'],
    }),
  }),
});

export const {
  useCreateLabelMutation,
  useListLabelsQuery,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} = labelApi;
