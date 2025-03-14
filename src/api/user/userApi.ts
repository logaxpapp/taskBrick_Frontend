// File: src/api/user/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';
import type { User } from '../../types/userTypes';

interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface ListUsersParams {
  email?: string;
  isActive?: boolean;
}

// For our new org-members endpoint
interface ListOrgMembersParams {
  userId: User | string;
  orgId: string;   // The ?orgId= param
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (build) => ({

    // 1) Register New User
    registerUser: build.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // 2) Create User
    createUser: build.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // 3) List Users
    listUsers: build.query<User[], ListUsersParams | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params?.email) queryParams.email = params.email;
        if (typeof params?.isActive !== 'undefined') {
          queryParams.isActive = params.isActive.toString();
        }
        const search = new URLSearchParams(queryParams).toString();
        return {
          url: `/users${search ? `?${search}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User' as const, id: user._id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // 4) Get single User
    getUser: build.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // 5) Update user
    updateUser: build.mutation<User, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),

    // 6) Delete user
    deleteUser: build.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // 7) Admin get all users
    adminGetAllUsers: build.query<User[], void>({
      query: () => '/users/admin',
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: 'User' as const, id: user._id })),
              { type: 'User', id: 'ADMIN-LIST' },
            ]
          : [{ type: 'User', id: 'ADMIN-LIST' }],
    }),

    // 8) toggle suspend or unsuspend user
    toggleSuspendUser: build.mutation<
      { message: string; user: User },
      { userId: string; isActive: boolean }
    >({
      query: ({ userId, isActive }) => ({
        url: `/users/${userId}/suspend`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),

    // 9) Deactivate user (some overlap with 'deleteUser' above)
    deactivateUser: build.mutation<User, string>({
      query: (userId) => ({
        url: `/users/${userId}/deactivate`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // 10) (New) List Org Members for a particular user context
    //     GET /users/:userId/org-members?orgId=xxx
    listOrgMembers: build.query<User[], ListOrgMembersParams>({
      query: ({ userId, orgId }) => {
        const searchParams = new URLSearchParams();
        if (orgId) searchParams.set('orgId', orgId);

        return {
          url: `/users/${userId}/org-members?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      // Provide general 'User' tag or you could do something more specific
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: 'User' as const, id: u._id })),
              { type: 'User', id: 'ORG-MEMBERS' },
            ]
          : [{ type: 'User', id: 'ORG-MEMBERS' }],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useCreateUserMutation,
  useListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAdminGetAllUsersQuery,
  useDeactivateUserMutation,
  useToggleSuspendUserMutation,

  // The new hook:
  useListOrgMembersQuery,
} = userApi;
