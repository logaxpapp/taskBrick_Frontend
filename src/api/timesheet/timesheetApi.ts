/*****************************************************************
 * File: src/api/timesheetApi.ts
 * Description: RTK Query API slice for Timesheets
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Timesheet Types
 * --------------------- */
export interface ITimesheet {
  _id: string;
  projectId: string;
  userId: string;
  date: string;       // store as string
  hoursSpent: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTimesheetEntryPayload {
  projectId: string;
  userId: string;
  date: string;
  hoursSpent: number;
  description?: string;
}

export interface UpdateTimesheetEntryPayload {
  date?: string;
  hoursSpent?: number;
  description?: string;
}

// Example aggregator result
export interface TotalHoursResult {
  totalHours: number;
}

/** ----------------------
 * Timesheet API Slice
 * --------------------- */
export const timesheetApi = createApi({
  reducerPath: 'timesheetApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Timesheet'],

  endpoints: (builder) => ({
    // POST /timesheets
    createTimesheet: builder.mutation<ITimesheet, CreateTimesheetEntryPayload>({
      query: (body) => ({
        url: '/timesheets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Timesheet'],
    }),

    // GET /timesheets/:id
    getTimesheet: builder.query<ITimesheet, string>({
      query: (id) => `/timesheets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Timesheet', id }],
    }),

    /**
     * GET /timesheets/project/:projectId?userId=xyz&startDate=...&endDate=...
     * (We can pass query params as needed)
     */
    listTimesheetsByProject: builder.query<ITimesheet[], 
      { projectId: string; userId?: string; startDate?: string; endDate?: string }>({
      query: ({ projectId, userId, startDate, endDate }) => {
        let url = `/timesheets/project/${projectId}`;
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((t) => ({ type: 'Timesheet' as const, id: t._id })),
              'Timesheet',
            ]
          : ['Timesheet'],
    }),

    // PATCH /timesheets/:id
    updateTimesheet: builder.mutation<ITimesheet, { id: string; updates: UpdateTimesheetEntryPayload }>({
      query: ({ id, updates }) => ({
        url: `/timesheets/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Timesheet', id: arg.id }],
    }),

    // DELETE /timesheets/:id
    deleteTimesheet: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/timesheets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Timesheet'],
    }),

    // GET /timesheets/project/:projectId/total-hours?userId=xxx&startDate=yyy&endDate=zzz
    getTotalHoursByUser: builder.query<
      TotalHoursResult,
      { projectId: string; userId: string; startDate?: string; endDate?: string }
    >({
      query: ({ projectId, userId, startDate, endDate }) => {
        let url = `/timesheets/project/${projectId}/total-hours?userId=${userId}`;
        if (startDate) {
          url += `&startDate=${startDate}`;
        }
        if (endDate) {
          url += `&endDate=${endDate}`;
        }
        return url;
      },
    }),
  }),
});

export const {
  useCreateTimesheetMutation,
  useGetTimesheetQuery,
  useListTimesheetsByProjectQuery,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
  useGetTotalHoursByUserQuery,
} = timesheetApi;
