import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseQueryWithReauth';

interface LogEntry {
  level: string;
  message: string;
  timestamp?: string;
  [key: string]: any;
}

// Define a type for the response data

interface LogsResponse {
  logs: LogEntry[];
}

export const logsApi = createApi({
  reducerPath: 'logsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getLogs: builder.query<LogsResponse, void>({
      query: () => '/admin/logs',
    }),
  }),
});

export const { useGetLogsQuery } = logsApi;
