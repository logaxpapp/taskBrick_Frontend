/*****************************************************************
 * File: src/api/projectMemberApi.ts
 * Description: RTK Query API slice for Project Members
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

import { User } from '../../types/userTypes';

export interface ProjectMember {
  _id: string;
  projectId: string; 
  userId: string;
  roleInProject?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user: User; // Assuming you have a User type defined
}

interface AddMemberPayload {
  projectId: string;
  userId: string;
  roleInProject?: string | null;
}

interface RemoveMemberPayload {
  projectId: string;
  userId: string;
}

export const projectMemberApi = createApi({
  reducerPath: 'projectMemberApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ProjectMember'],

  endpoints: (builder) => ({
    // POST /project-members/add
    addMemberToProject: builder.mutation<ProjectMember, AddMemberPayload>({
      query: (body) => ({
        url: '/project-members/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectMember'],
    }),

    // POST /project-members/remove
    removeMemberFromProject: builder.mutation<{ message: string }, RemoveMemberPayload>({
      query: (body) => ({
        url: '/project-members/remove',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProjectMember'],
    }),

    // GET /project-members/:projectId
    listProjectMembers: builder.query<ProjectMember[], string>({
      query: (projectId) => `/project-members/${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((m) => ({ type: 'ProjectMember' as const, id: m._id })),
              'ProjectMember',
            ]
          : ['ProjectMember'],
    }),
  }),
});

export const {
  useAddMemberToProjectMutation,
  useRemoveMemberFromProjectMutation,
  useListProjectMembersQuery,
} = projectMemberApi;
