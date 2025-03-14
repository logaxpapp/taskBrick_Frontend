import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

import {
  useGetMetricHistoryQuery,
  MetricHistoryParams,
  MetricSample,
} from '../../api/metrics/metricsApi';

/**
 * A dashboard that fetches historical data for a selected metric
 * between a chosen start + end date, then displays them in multiple charts,
 * with an "Apply Filters" button and optional auto-refresh.
 */
function MetricsHistoryDashboard() {
  /* ------------------------- 1) Local Input States ------------------------- */
  const [inputMetricName, setInputMetricName] = useState('user_signup_count');
  const [inputStart, setInputStart] = useState(
    dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm') // last 24h
  );
  const [inputEnd, setInputEnd] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  /* ---------------------- 2) Applied (Query) States ------------------------ */
  const [appliedMetricName, setAppliedMetricName] = useState('user_signup_count');
  const [appliedStart, setAppliedStart] = useState(
    dayjs().subtract(1, 'day').toISOString()
  );
  const [appliedEnd, setAppliedEnd] = useState(dayjs().toISOString());

  /* ---------------------- 3) Auto-Refresh States --------------------------- */
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshSeconds, setRefreshSeconds] = useState(30);

  /* --------------------- 4) Build RTK Query Params ------------------------- */
  const queryParams: MetricHistoryParams = {
    metricName: appliedMetricName,
    start: appliedStart,
    end: appliedEnd,
  };

  /* ------------------------ 5) Fetch Data via RTKQ ------------------------- */
  const { data: samples, isLoading, error, refetch } = useGetMetricHistoryQuery(queryParams);

  /* --------------------- 6) Convert Data for Recharts ---------------------- */
  let chartData: { time: string; value: number }[] = [];
  if (samples) {
    chartData = samples.map((sample: MetricSample) => ({
      time: dayjs(sample.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      value: sample.value,
    }));
  }

  /* --------------------- 7) Apply Filters Handler -------------------------- */
  function handleApplyFilters() {
    setAppliedMetricName(inputMetricName);
    setAppliedStart(dayjs(inputStart).toISOString());
    setAppliedEnd(dayjs(inputEnd).toISOString());
  }

  /* ---------------------- 8) Auto-Refresh Effect --------------------------- */
  useEffect(() => {
    if (!autoRefresh) return;
    const intervalId = setInterval(() => {
      refetch();
    }, refreshSeconds * 1000);
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshSeconds, refetch]);

  /* -------------------------- Render the UI -------------------------------- */
  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Metrics History Dashboard</h2>

      {/* ========== Filters & Auto-Refresh Card ========== */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
        </div>

        {/* Filters Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Metric Name */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1 text-gray-700">Metric Name</label>
            <select
              value={inputMetricName}
              onChange={(e) => setInputMetricName(e.target.value)}
              className="border rounded p-2"
            >
              <option value="user_signup_count">user_signup_count</option>
              <option value="issue_created_count">issue_created_count</option>
              <option value="issue_watchers_count">issue_watchers_count</option>
              <option value="organizations_created_count">organizations_created_count</option>
            </select>
          </div>

          {/* Start DateTime */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1 text-gray-700">Start Date/Time</label>
            <input
              type="datetime-local"
              value={inputStart}
              onChange={(e) => setInputStart(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {/* End DateTime */}
          <div className="flex flex-col">
            <label className="block font-medium mb-1 text-gray-700">End Date/Time</label>
            <input
              type="datetime-local"
              value={inputEnd}
              onChange={(e) => setInputEnd(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 w-full"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Auto-Refresh Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              id="autoRefresh"
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 accent-blue-600"
            />
            <label htmlFor="autoRefresh" className="font-medium text-gray-700">
              Auto-refresh?
            </label>
          </div>
          {autoRefresh && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Refresh every</span>
              <input
                type="number"
                className="border p-1 w-20 rounded"
                value={refreshSeconds}
                onChange={(e) => setRefreshSeconds(Number(e.target.value) || 30)}
              />
              <span className="text-gray-600">seconds</span>
            </div>
          )}
        </div>
      </div>

      {/* ========== Data Section ========== */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {/* Loading & Error States */}
        {isLoading && <p className="text-gray-600">Loading history data...</p>}
        {error && <p className="text-red-500">Error fetching metric history</p>}

        {/* If data is present */}
        {samples && samples.length > 0 ? (
          <div className="space-y-8">
            {/* 1) Line Chart */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">
                {appliedMetricName} (Line Chart)
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" minTickGap={20} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2) Area Chart */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-700">
                {appliedMetricName} (Area Chart)
              </h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="time" minTickGap={20} />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3) Table of Raw Data */}
            <div className="border border-gray-200 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Raw Data for {appliedMetricName}
              </h3>
              <div className="overflow-auto max-h-64 border border-gray-200 rounded">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Timestamp
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 font-medium">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {samples.map((s, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {dayjs(s.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                        </td>
                        <td className="px-4 py-2">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // If samples is an empty array and there's no error or loading
          !isLoading &&
          !error && (
            <p className="text-gray-500">
              No data found for selected metric / time range.
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default MetricsHistoryDashboard;
