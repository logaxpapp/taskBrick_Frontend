/*****************************************************************
 * File: src/api/resourceAllocationApi.ts
 * Description: RTK Query API slice for Resource Allocations
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface IResourceAllocation {
  _id: string;
  projectId: string;
  resourceName: string;
  allocationPercentage: number;
  role?: string;
  startDate: string; // store as string
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAllocationPayload {
  projectId: string;
  resourceName: string;
  allocationPercentage: number;
  role?: string;
  startDate: string;
  endDate?: string | null;
}

export interface UpdateAllocationPayload {
  resourceName?: string;
  allocationPercentage?: number;
  role?: string;
  startDate?: string;
  endDate?: string | null;
}

// Example aggregator result
export interface AllocationTotal {
  projectId: string;
  totalAllocationPercentage: number;
}

export const resourceAllocationApi = createApi({
  reducerPath: 'resourceAllocationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ResourceAllocation'],

  endpoints: (builder) => ({
    // POST /resources
    createAllocation: builder.mutation<IResourceAllocation, CreateAllocationPayload>({
      query: (body) => ({
        url: '/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ResourceAllocation'],
    }),

    // GET /resources/:id
    getAllocation: builder.query<IResourceAllocation, string>({
      query: (id) => `/resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'ResourceAllocation', id }],
    }),

    // GET /resources/project/:projectId
    listAllocationsByProject: builder.query<IResourceAllocation[], string>({
      query: (projectId) => `/resources/project/${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: 'ResourceAllocation' as const, id: r._id })),
              'ResourceAllocation',
            ]
          : ['ResourceAllocation'],
    }),

    // PATCH /resources/:id
    updateAllocation: builder.mutation<IResourceAllocation, { id: string; updates: UpdateAllocationPayload }>({
      query: ({ id, updates }) => ({
        url: `/resources/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'ResourceAllocation', id: arg.id }],
    }),

    // DELETE /resources/:id
    deleteAllocation: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ResourceAllocation'],
    }),

    // GET /resources/project/:projectId/total-allocation
    getTotalAllocation: builder.query<AllocationTotal, string>({
      query: (projectId) => `/resources/project/${projectId}/total-allocation`,
    }),
  }),
});

export const {
  useCreateAllocationMutation,
  useGetAllocationQuery,
  useListAllocationsByProjectQuery,
  useUpdateAllocationMutation,
  useDeleteAllocationMutation,
  useGetTotalAllocationQuery,
} = resourceAllocationApi;
