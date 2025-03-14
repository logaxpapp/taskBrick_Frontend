/*****************************************************************
 * File: src/api/projectBudgetApi.ts
 * Description: RTK Query API slice for Project Budgets
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Types & Interfaces
 * --------------------- */
export interface IProjectBudget {
  _id: string;
  projectId: string;
  allocatedBudget: number;
  spentBudget: number;
  forecastBudget: number;
  currency: string;
  requestedChange?: number;
  approvalStatus?: 'None' | 'Pending' | 'Approved' | 'Rejected';
  approvalComment?: string;

  /** 
   * New fields (if using request/approval)
   * requestedChange?: number;
   * approvalStatus?: 'None' | 'Pending' | 'Approved' | 'Rejected';
   * approvalComment?: string;
   */

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBudgetPayload {
  projectId: string;
  allocatedBudget: number;
  spentBudget?: number;
  forecastBudget?: number;
  currency?: string;
}

export interface UpdateBudgetPayload {
  allocatedBudget?: number;
  spentBudget?: number;
  forecastBudget?: number;
  currency?: string;
}

/** For request-change, we only need an ID and changeAmount. */
export interface RequestChangePayload {
  id: string;
  changeAmount: number;
}

/** For approve/reject, optional comment. */
export interface ApproveRejectPayload {
  id: string;
  comment?: string;
}

/** ----------------------
 * RTK Query: projectBudgetApi
 * --------------------- */
export const projectBudgetApi = createApi({
  reducerPath: 'projectBudgetApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ProjectBudget'],

  endpoints: (builder) => ({
    // -------------------------
    // Create Budget
    // -------------------------
    createBudget: builder.mutation<IProjectBudget, CreateBudgetPayload>({
      query: (body) => ({
        url: '/budgets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectBudget'],
    }),

    // -------------------------
    // Get Budget by ID
    // -------------------------
    getBudget: builder.query<IProjectBudget, string>({
      query: (id) => `/budgets/${id}`,
      providesTags: (result, error, id) => [{ type: 'ProjectBudget', id }],
    }),

    // -------------------------
    // Get Budget by Project
    // -------------------------
    getBudgetByProject: builder.query<IProjectBudget, string>({
      query: (projectId) => `/budgets/project/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: 'ProjectBudget', id: projectId },
      ],
    }),

    // -------------------------
    // Update Budget (PATCH)
    // -------------------------
    updateBudget: builder.mutation<
      IProjectBudget,
      { id: string; updates: UpdateBudgetPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/budgets/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ProjectBudget', id: arg.id },
      ],
    }),

    // -------------------------
    // Delete Budget
    // -------------------------
    deleteBudget: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/budgets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProjectBudget'],
    }),

    // -------------------------
    // Request Budget Change
    // POST /budgets/:id/request-change
    // Body: { changeAmount: number }
    // -------------------------
    requestBudgetChange: builder.mutation<IProjectBudget, RequestChangePayload>({
      query: ({ id, changeAmount }) => ({
        url: `/budgets/${id}/request-change`,
        method: 'POST',
        body: { changeAmount },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ProjectBudget', id: arg.id },
      ],
    }),

    // -------------------------
    // Approve Budget Change
    // POST /budgets/:id/approve-change
    // Body: { comment?: string }
    // -------------------------
    approveBudgetChange: builder.mutation<IProjectBudget, ApproveRejectPayload>({
      query: ({ id, comment }) => ({
        url: `/budgets/${id}/approve-change`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ProjectBudget', id: arg.id },
      ],
    }),

    // -------------------------
    // Reject Budget Change
    // POST /budgets/:id/reject-change
    // Body: { comment?: string }
    // -------------------------
    rejectBudgetChange: builder.mutation<IProjectBudget, ApproveRejectPayload>({
      query: ({ id, comment }) => ({
        url: `/budgets/${id}/reject-change`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ProjectBudget', id: arg.id },
      ],
    }),
  }),
});

/** 
 * Exports: (auto-generated React hooks)
 * e.g. useCreateBudgetMutation(), useGetBudgetQuery(), etc.
 */
export const {
  useCreateBudgetMutation,
  useGetBudgetQuery,
  useGetBudgetByProjectQuery,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  useRequestBudgetChangeMutation,
  useApproveBudgetChangeMutation,
  useRejectBudgetChangeMutation,
} = projectBudgetApi;
