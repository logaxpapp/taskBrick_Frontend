// File: src/api/userOrganization/userOrganizationApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

interface OrganizationRef {
  _id: string;
  name: string;
  // ...
}

interface UserDoc {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  // any other fields you might need
}

export interface UserOrganizationPivot {
  _id: string;
  userId: string | UserDoc;
  organizationId: OrganizationRef;
  roleInOrg?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddUserToOrgPayload {
  userId: string;
  organizationId: string;
  roleInOrg?: string;
}
export interface RemoveUserFromOrgPayload {
  userId: string;
  organizationId: string;
}
export interface RemoveUserFromOrgResponse {
  success: boolean;
}

export const userOrganizationApi = createApi({
  reducerPath: 'userOrganizationApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addUserToOrg: builder.mutation<UserOrganizationPivot, AddUserToOrgPayload>({
      query: (body) => ({
        url: '/user-organizations/add',
        method: 'POST',
        body,
      }),
    }),
    removeUserFromOrg: builder.mutation<RemoveUserFromOrgResponse, RemoveUserFromOrgPayload>({
      query: (body) => ({
        url: '/user-organizations/remove',
        method: 'POST',
        body,
      }),
    }),
    listOrgsForUser: builder.query<UserOrganizationPivot[], string>({
      query: (userId) => `/user-organizations/user/${userId}`,
    }),
    listUsersInOrg: builder.query<UserOrganizationPivot[], string>({
      query: (organizationId) => `/user-organizations/org/${organizationId}`,
    }),
  }),
});

export const {
  useAddUserToOrgMutation,
  useRemoveUserFromOrgMutation,
  useListOrgsForUserQuery,
  useListUsersInOrgQuery,
} = userOrganizationApi;
