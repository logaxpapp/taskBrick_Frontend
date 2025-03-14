// File: src/api/organization/organizationApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';

// -------------------------------------------------
// Existing Types
// -------------------------------------------------
export interface Organization {
  id: number;
  name: string;
  description?: string | null;
  ownerUserId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrgCreationPayload {
  name: string;
  description?: string | null;
  ownerUserId?: string | null;
}

export interface OrgAndOwnerPayload {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
interface OrgAndOwnerResponse {
  message: string;
  organization: Organization;
  owner: any; // or define a proper User interface
}

// For "all org users" endpoint
export interface ListAllOrgUsersResponse {
  users: Array<any>;
  invites: Array<any>;
}
interface RemoveUserFromOrgResponse {
  message: string;
}

// -------------------------------------------------
// (NEW) For "Invite user to org" endpoint
// -------------------------------------------------
export interface InviteUserToOrgPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  roleInOrg?: string;
}

export interface InviteUserToOrgResponse {
  message: string;
  user: any; // or define a more specific "User" type
}

// -------------------------------------------------
// organizationApi
// -------------------------------------------------
export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    // 1) createOrganization (existing)
    createOrganization: builder.mutation<Organization, OrgCreationPayload>({
      query: (body) => ({
        url: '/organizations',
        method: 'POST',
        body,
      }),
    }),

    // 2) createOrgAndOwner (existing)
    createOrgAndOwner: builder.mutation<OrgAndOwnerResponse, OrgAndOwnerPayload>({
      query: (body) => ({
        url: '/organizations/create-with-owner',
        method: 'POST',
        body,
      }),
    }),

    // 3) listOrganizations (existing)
    listOrganizations: builder.query<Organization[], void>({
      query: () => ({
        url: '/organizations',
        method: 'GET',
      }),
    }),

    // 4) getOrganization (existing)
    getOrganization: builder.query<Organization, number>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: 'GET',
      }),
    }),

    // 5) updateOrganization (existing)
    updateOrganization: builder.mutation<
      Organization,
      { id: number; data: Partial<OrgCreationPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/organizations/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // 6) deleteOrganization (existing)
    deleteOrganization: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: 'DELETE',
      }),
    }),

    // 7) (NEW) List all org users (including invites)
    listAllOrgUsers: builder.query<ListAllOrgUsersResponse, string>({
      query: (orgId) => ({
        url: `/organizations/${orgId}/all-users`,
        method: 'GET',
      }),
    }),

    // 8) (NEW) Remove user from org
    removeUserFromOrg: builder.mutation<RemoveUserFromOrgResponse, { orgId: string; userId: string }>(
      {
        query: ({ orgId, userId }) => ({
          url: `/organizations/${orgId}/users/${userId}`,
          method: 'DELETE',
        }),
      }
    ),

    /**
     * 9) (NEW) Invite a user to org => POST /organizations/:orgId/invite-user
     * Body: { email, firstName?, lastName?, roleInOrg? }
     * Returns { message, user }
     */
    inviteUserToOrg: builder.mutation<InviteUserToOrgResponse, { orgId: string; payload: InviteUserToOrgPayload }>(
      {
        query: ({ orgId, payload }) => ({
          url: `/organizations/${orgId}/invite-user`,
          method: 'POST',
          body: payload,
        }),
      }
    ),
  }),
});

// -------------------------------------------------
// Export hooks
// -------------------------------------------------
export const {
  // existing
  useCreateOrganizationMutation,
  useCreateOrgAndOwnerMutation,
  useListOrganizationsQuery,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,

  // new
  useListAllOrgUsersQuery,
  useRemoveUserFromOrgMutation,
  useInviteUserToOrgMutation,
} = organizationApi;
