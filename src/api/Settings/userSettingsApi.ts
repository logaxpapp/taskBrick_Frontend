// File: src/api/userSettingsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/**
 * User settings model.
 */
export interface UserSetting {
  userId: string;
  invitationExpirationHours: number; // Expiration duration in hours
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Update payload structure.
 */
export interface UpdateUserSettingPayload {
  invitationExpirationHours?: number;
}

export const userSettingsApi = createApi({
  reducerPath: 'userSettingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserSetting'],

  endpoints: (builder) => ({
    /**
     * GET /settings/:userId - Fetch user settings
     */
    getUserSetting: builder.query<UserSetting, string>({
      query: (userId) => `/user-settings/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'UserSetting', id: userId }],
    }),

    /**
     * PUT /settings/:userId - Update user settings
     */
    updateUserSetting: builder.mutation<
      UserSetting,
      { userId: string; updates: UpdateUserSettingPayload }
    >({
      query: ({ userId, updates }) => ({
        url: `/user-settings/${userId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'UserSetting', id: arg.userId }],
    }),

    /**
     * POST /settings/:userId/reset - Reset user settings to defaults
     */
    resetUserSetting: builder.mutation<UserSetting, string>({
      query: (userId) => ({
        url: `/user-settings/${userId}/reset`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'UserSetting', id: userId }],
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetUserSettingQuery,
  useUpdateUserSettingMutation,
  useResetUserSettingMutation,
} = userSettingsApi;
