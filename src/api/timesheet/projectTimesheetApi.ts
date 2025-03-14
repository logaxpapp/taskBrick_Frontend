/*****************************************************************
 * File: src/api/projectTimesheetApi.ts
 * Description: RTK Query API slice for Project-Level Timesheets
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Project Timesheet Types
 * --------------------- */
export interface IProjectTimesheet {
  _id: string;
  projectId: string;
  startDate: string;        // store as string in the frontend
  endDate?: string;         // optional
  totalHours: number;
  description?: string;
  timeline?: {
    milestoneName: string;
    start?: string;
    end?: string;
    notes?: string;
  }[];
  deliverables?: {
    name: string;
    dueDate?: string;
    status?: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
    notes?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new Project Timesheet entry.
 * Adjust or simplify as needed.
 */
export interface CreateProjectTimesheetPayload {
  projectId: string;
  startDate: string;
  endDate?: string;
  totalHours: number;
  description?: string;
  timeline?: IProjectTimesheet['timeline'];
  deliverables?: IProjectTimesheet['deliverables'];
}

/**
 * Payload for updating a Project Timesheet entry.
 * Omit certain fields if you don't allow them to be updated.
 */
export interface UpdateProjectTimesheetPayload {
  startDate?: string;
  endDate?: string;
  totalHours?: number;
  description?: string;
  timeline?: IProjectTimesheet['timeline'];
  deliverables?: IProjectTimesheet['deliverables'];
}

/** Example aggregator result */
export interface TotalHoursResult {
  totalHours: number;
}

/** ----------------------
 * Project Timesheet API
 * --------------------- */
export const projectTimesheetApi = createApi({
  reducerPath: 'projectTimesheetApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ProjectTimesheet'],

  endpoints: (builder) => ({
    /**
     * POST /projectTimesheets
     * Create a new project timesheet
     */
    createProjectTimesheet: builder.mutation<
      IProjectTimesheet,
      CreateProjectTimesheetPayload
    >({
      query: (body) => ({
        url: '/projectTimesheets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectTimesheet'],
    }),

    /**
     * GET /projectTimesheets/:id
     * Retrieve a single timesheet by ID
     */
    getProjectTimesheet: builder.query<IProjectTimesheet, string>({
      query: (id) => `/projectTimesheets/${id}`,
      providesTags: (result, error, id) => [{ type: 'ProjectTimesheet', id }],
    }),

    /**
     * GET /projectTimesheets/project/:projectId?startDate=...&endDate=...
     * List timesheets for a given project, optional date filter
     */
    listTimesheetsByProject: builder.query<
      IProjectTimesheet[],
      { projectId: string; startDate?: string; endDate?: string }
    >({
      query: ({ projectId, startDate, endDate }) => {
        let url = `/projectTimesheets/project/${projectId}`;
        const params = new URLSearchParams();
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
              ...result.map((t) => ({
                type: 'ProjectTimesheet' as const,
                id: t._id,
              })),
              'ProjectTimesheet',
            ]
          : ['ProjectTimesheet'],
    }),

    /**
     * PUT or PATCH /projectTimesheets/:id
     * Update a project timesheet
     * (In your controller, you might use PUT or PATCH. Adjust here accordingly.)
     */
    updateProjectTimesheet: builder.mutation<
      IProjectTimesheet,
      { id: string; updates: UpdateProjectTimesheetPayload }
    >({
      query: ({ id, updates }) => ({
        url: `/projectTimesheets/${id}`,
        method: 'PUT', // or 'PATCH' if that's what you prefer
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'ProjectTimesheet', id: arg.id },
      ],
    }),

    /**
     * DELETE /projectTimesheets/:id
     * Remove a timesheet by ID
     */
    deleteProjectTimesheet: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projectTimesheets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProjectTimesheet'],
    }),

    /**
     * GET /projectTimesheets/project/:projectId/total-hours?startDate=...&endDate=...
     * Example aggregator for total hours in a date range
     */
    getTotalHoursForProject: builder.query<
      TotalHoursResult,
      { projectId: string; startDate?: string; endDate?: string }
    >({
      query: ({ projectId, startDate, endDate }) => {
        let url = `/projectTimesheets/project/${projectId}/total-hours`;
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const queryStr = params.toString();
        if (queryStr) url += `?${queryStr}`;
        return url;
      },
    }),
  }),
});

export const {
  useCreateProjectTimesheetMutation,
  useGetProjectTimesheetQuery,
  useListTimesheetsByProjectQuery,
  useUpdateProjectTimesheetMutation,
  useDeleteProjectTimesheetMutation,
  useGetTotalHoursForProjectQuery,
} = projectTimesheetApi;
