import { createApi } from '@reduxjs/toolkit/query/react';
 import { baseQueryWithReauth } from '../baseQueryWithReauth';

export interface PromMetric {
  name: string;
  help: string;
  type: string;
  values: {
    labels: Record<string, string>;
    value: number;
  }[];
}

export type PromMetricsPlain = string;

export interface MetricsMessage {
  message: string;
}

export interface MetricSample {
  _id: string;
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: string;
}

/**
 * The query params for getMetricHistory
 */
export interface MetricHistoryParams {
  metricName: string;  // e.g. 'user_signup_count'
  start?: string;      // e.g. ISO date string
  end?: string;        // e.g. ISO date string
}

/**
 * metricsApi slice handles:
 * 1) Real-time metrics endpoints (plaintext, JSON, watchers, dbConnections, reset)
 * 2) Historical data from /api/admin/metrics/history
 */
export const metricsApi = createApi({
  reducerPath: 'metricsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Metrics'],
  endpoints: (builder) => ({
    // (1) GET /metrics-json => returns array of PromMetric
    getMetricsJson: builder.query<PromMetric[], void>({
      query: () => '/admin/metrics-json',
    }),

    // (2) GET /metrics => returns plaintext
    getMetricsPlain: builder.query<PromMetricsPlain, void>({
      query: () => ({
        url: '/admin/metrics',
        // handle as text, not JSON
        responseHandler: (response) => response.text(),
      }),
    }),

    // (3) POST /set-watchers => body: { watchers: number }
    setWatchersGauge: builder.mutation<MetricsMessage, number>({
      query: (watchers) => ({
        url: '/admin/set-watchers',
        method: 'POST',
        body: { watchers },
      }),
    }),

    // (4) POST /set-db-connections => body: { connections: number }
    setDbConnections: builder.mutation<MetricsMessage, number>({
      query: (connections) => ({
        url: '/admin/set-db-connections',
        method: 'POST',
        body: { connections },
      }),
    }),

    // (5) POST /reset-counters => no body
    resetCounters: builder.mutation<MetricsMessage, void>({
      query: () => ({
        url: '/admin/reset-counters',
        method: 'POST',
      }),
    }),

    // (6) GET /metrics/history => returns array of MetricSample
    // e.g. GET /metrics/history?metricName=...&start=...&end=...
    getMetricHistory: builder.query<MetricSample[], MetricHistoryParams>({
      query: ({ metricName, start, end }) => {
        const params = new URLSearchParams({ metricName });
        if (start) params.set('start', start);
        if (end) params.set('end', end);

        return {
          url: `/admin/history?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
  }),
});

// Auto-generated React hooks:
export const {
  useGetMetricsJsonQuery,
  useGetMetricsPlainQuery,
  useSetWatchersGaugeMutation,
  useSetDbConnectionsMutation,
  useResetCountersMutation,
  useGetMetricHistoryQuery,
} = metricsApi;
