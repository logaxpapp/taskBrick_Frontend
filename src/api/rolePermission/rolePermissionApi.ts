import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { Permission, Role, CreatePermissionPayload, CreateRolePayload } from '../../types/rolePermissionTypes';

// Typically you might have tagTypes = ['Role', 'Permission'] if you want caching
export const rolePermissionApi = createApi({
  reducerPath: 'rolePermissionApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role', 'Permission'],
  endpoints: (builder) => ({

    // ========== PERMISSIONS ==========

    // 1) Create Permission
    createPermission: builder.mutation<Permission, CreatePermissionPayload>({
      query: (body) => ({
        url: '/permissions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Permission'],
    }),

    // 2) List Permissions
    listPermissions: builder.query<Permission[], void>({
      query: () => '/permissions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((perm) => ({ type: 'Permission' as const, id: perm._id })),
              { type: 'Permission', id: 'LIST' },
            ]
          : [{ type: 'Permission', id: 'LIST' }],
    }),

    // 3) Get Permission by ID
    getPermission: builder.query<Permission, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permission', id }],
    }),

    // 4) Update Permission
    updatePermission: builder.mutation<Permission, { id: string; data: Partial<CreatePermissionPayload> }>({
      query: ({ id, data }) => ({
        url: `/permissions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Permission', id },
        { type: 'Permission', id: 'LIST' },
      ],
    }),

    // 5) Delete Permission
    deletePermission: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Permission', id },
        { type: 'Permission', id: 'LIST' },
      ],
    }),

    // ========== ROLES ==========

    // 6) Create Role
    createRole: builder.mutation<Role, CreateRolePayload>({
      query: (body) => ({
        url: '/roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),

    // 7) List Roles
    listRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map((role) => ({ type: 'Role' as const, id: role._id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),

    // 8) Get Role by ID
    getRole: builder.query<Role, string>({
      query: (roleId) => `/roles/${roleId}`,
      providesTags: (result, error, roleId) => [{ type: 'Role', id: roleId }],
    }),

    // 9) Update Role (e.g. rename)
    updateRole: builder.mutation<Role, { roleId: string; data: Partial<CreateRolePayload> }>({
      query: ({ roleId, data }) => ({
        url: `/roles/${roleId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    // 10) Delete Role
    deleteRole: builder.mutation<{ message: string }, string>({
      query: (roleId) => ({
        url: `/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, roleId) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    // 11) Add Permissions to Role
    addPermissionsToRole: builder.mutation<Role, { roleId: string; permissionIds: string[] }>({
      query: ({ roleId, permissionIds }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'POST',
        body: { permissionIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    // 12) Remove Permissions from Role
    removePermissionsFromRole: builder.mutation<Role, { roleId: string; permissionIds: string[] }>({
      query: ({ roleId, permissionIds }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'DELETE',
        body: { permissionIds },
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  // Permissions
  useCreatePermissionMutation,
  useListPermissionsQuery,
  useGetPermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,

  // Roles
  useCreateRoleMutation,
  useListRolesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAddPermissionsToRoleMutation,
  useRemovePermissionsFromRoleMutation,
} = rolePermissionApi;
