import { createApi } from '@reduxjs/toolkit/query/react';
import type { PermissionMapping } from '../../types/permissionMappingTypes';
import { baseQueryWithReauth  } from '../baseQueryWithReauth';

export const permissionMappingApi = createApi({
  reducerPath: 'permissionMappingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['PermissionMapping'],
  endpoints: (builder) => ({

    createMapping: builder.mutation<PermissionMapping, Partial<PermissionMapping>>({
      query: (body) => ({
        url: '/permission-mappings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PermissionMapping'],
    }),

    listMappings: builder.query<PermissionMapping[], void>({
      query: () => '/permission-mappings',
      providesTags: ['PermissionMapping'],
    }),

    getMapping: builder.query<PermissionMapping, string>({
      query: (id) => `/permission-mappings/${id}`,
      providesTags: (result, error, id) => [{ type: 'PermissionMapping', id }],
    }),

    updateMapping: builder.mutation<PermissionMapping, { id: string; data: Partial<PermissionMapping> }>({
      query: ({ id, data }) => ({
        url: `/permission-mappings/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'PermissionMapping', id: arg.id },
        'PermissionMapping',
      ],
    }),

    deleteMapping: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/permission-mappings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PermissionMapping', id },
        'PermissionMapping',
      ],
    }),
  }),
});

export const {
  useCreateMappingMutation,
  useListMappingsQuery,
  useGetMappingQuery,
  useUpdateMappingMutation,
  useDeleteMappingMutation,
} = permissionMappingApi;
