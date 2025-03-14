// File: src/api/adminUserApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import type { User } from '../../types/userTypes';
import { Organization } from '../../types/organizationTypes';

interface DashboardCounts {
    users: number;
    projects: number;
    issues: number;
    teams: number;
    roles: number;
    boards: number;
    labels: number;
    organizations: number;
    invitations: {
      accepted: number;
      pending: number;
    };
  }
  
  interface LatestSignupsResponse {
    users: User[];
    organizations: Organization[];
  }

export const adminUserApi = createApi({
  reducerPath: 'adminUserApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AdminUser'],
  endpoints: (build) => ({
    // 1) Admin get all users
    adminGetAllUsers: build.query<User[], void>({
      query: () => '/admin',
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'AdminUser' as const, id: user._id })),
              { type: 'AdminUser', id: 'ADMIN-LIST' },
            ]
          : [{ type: 'AdminUser', id: 'ADMIN-LIST' }],
    }),
    // 2) Admin update user
    adminUpdateUser: build.mutation<User, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/admin/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'AdminUser', id: userId }],
    }),
    // 3) Admin delete user
    adminDeleteUser: build.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/admin/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'AdminUser', id: userId }],
    }),
    // 4) Admin toggle suspend user
    adminToggleSuspendUser: build.mutation<
      { message: string; user: User },
      { userId: string; isActive: boolean }
    >({
      query: ({ userId, isActive }) => ({
        url: `/admin/${userId}/suspend`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'AdminUser', id: userId }],
    }),
    // 5) Admin deactivate user
    adminDeactivateUser: build.mutation<User, string>({
      query: (userId) => ({
        url: `/admin/${userId}/deactivate`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'AdminUser', id: userId }],
    }),
    // 6) Admin dashboard counts
    getDashboardCounts: build.query<DashboardCounts, void>({
        query: () => '/admin/counts',
        providesTags: [{ type: 'AdminUser', id: 'DASHBOARD_COUNTS' }],
    }),
    getLatestSignups: build.query<LatestSignupsResponse, number | void>({
        query: (days = 60) => `/admin/latestSignups?days=${days}`,
        // Typically we do not need to invalidate these results often, so no tags needed
      }),
  }),
});

export const {
  useAdminGetAllUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useAdminToggleSuspendUserMutation,
  useAdminDeactivateUserMutation,
  useGetDashboardCountsQuery,
  useGetLatestSignupsQuery,
} = adminUserApi;
