/*****************************************************************
 * File: src/api/projectApi.ts
 * Description: RTK Query API slice for Projects
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** ----------------------
 * Project Types
 * --------------------- */
export interface Project {
  _id: string;
  organizationId: string; 
  name: string;
  key: string;
  description?: string | null;
  leadUserId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  organizationId: string; 
  name: string;
  key: string;
  description?: string | null;
  leadUserId?: string | null;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  key?: string | null;
  leadUserId?: string | null;
}

export interface AddProjectMemberPayload {
  id: string; // project _id (path param)
  userId: string;
  roleInProject?: string | null;
}

export interface RemoveProjectMemberPayload {
  id: string;  // project _id (path param)
  userId: string;
}

/** ----------------------
 * Project API Slice
 * --------------------- */
export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project', 'ProjectMember'],

  endpoints: (builder) => ({
    // POST /projects
    createProject: builder.mutation<Project, CreateProjectPayload>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),

    // GET /projects?organizationId=xxx
    listProjects: builder.query<Project[], string | void>({
      query: (orgId) => {
        if (!orgId) {
          return '/projects';
        }
        return `/projects?organizationId=${orgId}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: 'Project' as const, id: p._id })), 'Project']
          : ['Project'],
    }),

    // GET /projects/:id
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // PATCH /projects/:id
    updateProject: builder.mutation<Project, { id: string; updates: UpdateProjectPayload }>({
      query: ({ id, updates }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Project', id: arg.id }],
    }),

    // DELETE /projects/:id
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),

    // POST /projects/:id/members
    addProjectMember: builder.mutation<any, AddProjectMemberPayload>({
      query: ({ id, userId, roleInProject }) => ({
        url: `/projects/${id}/members`,
        method: 'POST',
        body: { userId, roleInProject },
      }),
      invalidatesTags: ['ProjectMember', 'Project'],
    }),

    // DELETE /projects/:id/members (body: { userId })
    removeProjectMember: builder.mutation<{ message: string }, RemoveProjectMemberPayload>({
      query: ({ id, userId }) => ({
        url: `/projects/${id}/members`,
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: ['ProjectMember', 'Project'],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useListProjectsQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectApi;
