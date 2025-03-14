// File: src/api/auth/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../api/baseQueryWithReauth';

export interface AcceptInvitePayload {
  token: string;
  orgId: string;
  newPassword: string;
}

// The response shape
export interface AcceptInviteResponse {
  message: string;
  // or anything else you return
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}
interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    _id: string;
    email: string;
    role: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImage?: string | null;
  };
}

interface LogoutResponse {
  message: string;
}

interface ForgotPasswordPayload {
  email: string;
}
interface VerifyOtpPayload {
  email: string;
  otp: string;
}
interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/** 
 * For updating user profile 
 */
interface UpdateProfilePayload {
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: string | null;
  // possibly other fields like "appleId" or "googleId" if user can set them
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation<any, RegisterPayload>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

      // 1) LOGIN
      loginUser: builder.mutation<LoginResponse, LoginRequest>({
        query: (body) => {
          console.log('[loginUser] Attempting POST /auth/login with body:', body);
          return {
            url: '/auth/login',
            method: 'POST',
            body,
          };
        },
        async onQueryStarted(arg, { queryFulfilled }) {
          try {
            const result = await queryFulfilled;
            console.log('[loginUser] Success:', result);
          } catch (error) {
            console.error('[loginUser] Error:', error);
          }
        },
      }),

     // 2) LOGOUT
     logoutUser: builder.mutation<LogoutResponse, void>({
      query: () => {
        console.log('[logoutUser] Attempting POST /auth/logout...');
        return {
          url: '/auth/logout',
          method: 'POST',
        };
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log('[logoutUser] Success:', result);
        } catch (error) {
          console.error('[logoutUser] Error:', error);
        }
      },
    }),

    refreshToken: builder.mutation<{ accessToken: string }, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordPayload>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<{ message: string }, VerifyOtpPayload>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordPayload>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body,
      }),
    }),

    updateProfile: builder.mutation<
      { message: string; user: { id: number; email: string; firstName?: string; lastName?: string; profileImage?: string; } },
      UpdateProfilePayload
    >({
      query: (body) => {
        console.log("Update Profile Request Body:", body); // ✅ Log payload
        return {
          url: '/auth/update-profile',
          method: 'PATCH',
          body,
        };
      },
    }),
    acceptInvite: builder.mutation<AcceptInviteResponse, AcceptInvitePayload>({
      query: (body) => ({
        url: '/auth/accept-invite',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,

  // 🔹 The new hook
  useUpdateProfileMutation,
  useAcceptInviteMutation,
} = authApi;
