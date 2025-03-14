import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  useGetMetricHistoryQuery,
  MetricHistoryParams,
  MetricSample
} from '../../api/metrics/metricsApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

/**
 * A dashboard that fetches historical data for a selected metric
 * between a chosen start + end date, then displays them in multiple charts,
 * with an "Apply Filters" button and optional auto-refresh.
 */
function MetricsHistoryDashboard() {
  /**
   * 1) Local input states: the user modifies these in the UI.
   */
  const [inputMetricName, setInputMetricName] = useState('user_signup_count');
  const [inputStart, setInputStart] = useState(
    dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm') // last 24h
  );
  const [inputEnd, setInputEnd] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  /**
   * 2) Applied states: these actually define the RTK Query parameters.
   *    They update only when the user clicks "Apply Filters"
   */
  const [appliedMetricName, setAppliedMetricName] = useState('user_signup_count');
  const [appliedStart, setAppliedStart] = useState(
    dayjs().subtract(1, 'day').toISOString()
  );
  const [appliedEnd, setAppliedEnd] = useState(dayjs().toISOString());

  /**
   * 3) Optional: an auto-refresh toggle + interval for re-fetching
   */
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshSeconds, setRefreshSeconds] = useState(30);

  /**
   * 4) Build the query params for RTK Query from "applied" states
   */
  const queryParams: MetricHistoryParams = {
    metricName: appliedMetricName,
    start: appliedStart,
    end: appliedEnd,
  };

  /**
   * 5) Use RTK Query to fetch historical data
   */
  const { data: samples, isLoading, error, refetch } = useGetMetricHistoryQuery(queryParams);

  /**
   * 6) Convert the data into Recharts format
   */
  let chartData: { time: string; value: number }[] = [];
  if (samples) {
    chartData = samples.map((sample: MetricSample) => ({
      time: dayjs(sample.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      value: sample.value,
    }));
  }

  /**
   * 7) "Apply Filters" - updates the "applied" states from the user input
   */
  function handleApplyFilters() {
    setAppliedMetricName(inputMetricName);
    setAppliedStart(dayjs(inputStart).toISOString());
    setAppliedEnd(dayjs(inputEnd).toISOString());
  }

  /**
   * 8) Auto-refresh effect: if autoRefresh is true, refetch every X seconds
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      refetch(); // triggers the query again
    }, refreshSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshSeconds, refetch]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Metrics History Dashboard</h2>

      {/* ============== Filter & Auto-Refresh Controls ============== */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mt-4">
        {/* Metric Name */}
        <div>
          <label className="block font-medium mb-1">Metric Name</label>
          <select
            value={inputMetricName}
            onChange={(e) => setInputMetricName(e.target.value)}
            className="border rounded p-1 w-full"
          >
            <option value="user_signup_count">user_signup_count</option>
            <option value="issue_created_count">issue_created_count</option>
            <option value="issue_watchers_count">issue_watchers_count</option>
            <option value="organizations_created_count">organizations_created_count</option>
          </select>
        </div>

        {/* Start DateTime */}
        <div>
          <label className="block font-medium mb-1">Start Date/Time</label>
          <input
            type="datetime-local"
            value={inputStart}
            onChange={(e) => setInputStart(e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>

        {/* End DateTime */}
        <div>
          <label className="block font-medium mb-1">End Date/Time</label>
          <input
            type="datetime-local"
            value={inputEnd}
            onChange={(e) => setInputEnd(e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={handleApplyFilters}
            className="px-3 py-2 bg-blue-600 text-white rounded w-full"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* ============== Auto-Refresh Toggle ============== */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            id="autoRefresh"
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="autoRefresh" className="font-medium">
            Auto-refresh?
          </label>
        </div>
        {autoRefresh && (
          <div className="flex items-center space-x-2">
            <span>Refresh every</span>
            <input
              type="number"
              className="border p-1 w-20"
              value={refreshSeconds}
              onChange={(e) => setRefreshSeconds(Number(e.target.value) || 30)}
            />
            <span>seconds</span>
          </div>
        )}
      </div>

      {/* ============== Loading/Errors ============== */}
      {isLoading && <p className="text-gray-600">Loading history data...</p>}
      {error && <p className="text-red-500">Error fetching metric history</p>}

      {/* ============== Chart & Table ============== */}
      {samples && samples.length > 0 ? (
        <div className="space-y-8 mt-4">
          {/* 1) Line Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              {appliedMetricName} (Line Chart)
            </h3>
            <div className="w-full h-64 bg-white border rounded shadow">
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
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              {appliedMetricName} (Area Chart)
            </h3>
            <div className="w-full h-64 bg-white border rounded shadow">
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
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Raw Data for {appliedMetricName}
            </h3>
            <div className="overflow-auto max-h-64 border border-gray-200 rounded shadow-sm">
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
                      <td className="px-4 py-2">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // If samples is an empty array
        !isLoading && !error && (
          <p className="text-gray-500 mt-4">
            No data found for selected metric / time range.
          </p>
        )
      )}
    </div>
  );
}

export default MetricsHistoryDashboard;
