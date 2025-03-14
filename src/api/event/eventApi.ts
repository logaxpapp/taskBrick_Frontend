// File: src/api/event/eventApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';
import { EventType } from '../../types/eventTypes';

export interface EventModel {
  _id: string;
  orgId: string;
  createdBy: string;

  title: string;
  description?: string;
  eventType: EventType;
  startTime: string;
  endTime: string;
  allDay?: boolean;

  participants: string[];
  location?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface ListEventsParams {
  orgId: string;
  start?: string; // e.g. '2023-08-01'
  end?: string;   // e.g. '2023-08-31'
}

interface CreateEventPayload {
  orgId: string;
  title: string;
  description?: string;
  eventType?: EventType;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  allDay?: boolean;
  participants?: string[];
  location?: string;
}

interface UpdateEventPayload {
  id: string; // eventId
  updates: {
    title?: string;
    description?: string;
    eventType?: EventType;
    startTime?: string;   // ISO
    endTime?: string;     // ISO
    allDay?: boolean;
    participantsToAdd?: string[];
    participantsToRemove?: string[];
    location?: string;
  };
}

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Event'],

  endpoints: (builder) => ({
    // 1) list events
    listEvents: builder.query<EventModel[], ListEventsParams>({
      query: ({ orgId, start, end }) => {
        const search = new URLSearchParams({ orgId });
        if (start) search.set('start', start);
        if (end) search.set('end', end);
        return { url: `/events?${search.toString()}`, method: 'GET' };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((evt) => ({ type: 'Event' as const, id: evt._id })),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
    }),

    // 2) get single
    getEvent: builder.query<EventModel, string>({
      query: (eventId) => `/events/${eventId}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),

    // 3) create
    createEvent: builder.mutation<EventModel, CreateEventPayload>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    // 4) update
    updateEvent: builder.mutation<EventModel, UpdateEventPayload>({
      query: ({ id, updates }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Event', id: arg.id },
        { type: 'Event', id: 'LIST' },
      ],
    }),

    // 5) delete
    deleteEvent: builder.mutation<{ message: string }, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Event', id },
        { type: 'Event', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
