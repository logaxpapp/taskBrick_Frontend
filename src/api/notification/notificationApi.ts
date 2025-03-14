/*****************************************************************
 * File: src/api/notification/notificationApi.ts
 *****************************************************************/
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

/** Notification interface */
export interface INotification {
  _id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Query params (with pagination) */
export interface ListNotificationsParams {
  userId?: string;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

/** Server’s paginated response */
export interface PaginatedNotifications {
  notifications: INotification[];
  page: number;
  pages: number;
  total: number;
}

/** Mark a notification read */
export interface MarkNotificationReadPayload {
  id: string;
}

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notification'],

  endpoints: (builder) => ({
    /** GET /notifications?userId=...&isRead=...&page=...&limit=... */
    listNotifications: builder.query<PaginatedNotifications, ListNotificationsParams>({
      query: ({ userId, isRead, page = 1, limit = 5 }) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (typeof isRead === 'boolean') params.append('isRead', String(isRead));
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        let url = '/notifications';
        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map((n) => ({
                type: 'Notification' as const,
                id: n._id,
              })),
              'Notification',
            ]
          : ['Notification'],
    }),

    /** PATCH /notifications/:id/read */
    markNotificationRead: builder.mutation<INotification, MarkNotificationReadPayload>({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Notification', id: arg.id },
        'Notification',
      ],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
} = notificationApi;
