import React, { useState } from 'react';
import {
  useGetMetricsJsonQuery,
  useSetWatchersGaugeMutation,
  useSetDbConnectionsMutation,
  useResetCountersMutation,
} from '../../api/metrics/metricsApi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

/**
 * The top-level component showing a tabbed interface:
 *   - System Metrics
 *   - Memory Metrics
 *   - Custom Metrics
 *   - Advanced Tools (set watchers, etc.)
 *   - Charts
 */
function MetricsDashboard() {
  // 1) Fetch JSON metrics from your /admin/metrics-json endpoint
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useGetMetricsJsonQuery();

  // 2) Group them by "system", "memory", and "custom" categories
  const { systemMetrics, memoryMetrics, customMetrics } = groupMetricsByCategory(
    metricsData || []
  );

  // We also define some chartData (static example).
  // In a real scenario, you'd fetch historical data from a separate endpoint.
  const [chartData] = useState<{ time: number; value: number }[]>([
    { time: 1, value: 5 },
    { time: 2, value: 12 },
    { time: 3, value: 9 },
    { time: 4, value: 16 },
  ]);

  // Our tabs:
  const TABS = [
    { label: 'System' },
    { label: 'Memory' },
    { label: 'Custom' },
    { label: 'Advanced' },
    { label: 'Charts' },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Metrics Dashboard</h2>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 space-x-2">
        {TABS.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 ${
              activeTab === idx
                ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render the active tab */}
      <div className="mt-4">
        {/* 1) System Metrics Tab */}
        {activeTab === 0 && (
          <MetricsSection
            title="System Metrics"
            metrics={systemMetrics}
            loading={metricsLoading}
            error={metricsError}
          />
        )}

        {/* 2) Memory Metrics Tab */}
        {activeTab === 1 && (
          <MetricsSection
            title="Memory Metrics"
            metrics={memoryMetrics}
            loading={metricsLoading}
            error={metricsError}
          />
        )}

        {/* 3) Custom Metrics Tab */}
        {activeTab === 2 && (
          <MetricsSection
            title="Custom Metrics"
            metrics={customMetrics}
            loading={metricsLoading}
            error={metricsError}
          />
        )}

        {/* 4) Advanced Tab (Set watchers, DB connections, reset counters) */}
        {activeTab === 3 && <AdvancedMetricsTab />}

        {/* 5) Charts Tab */}
        {activeTab === 4 && <ChartsSection data={chartData} />}
      </div>
    </div>
  );
}

/**
 * A helper function to group metrics into "system", "memory", or "custom".
 * Modify as you wish to match your metric names.
 */
function groupMetricsByCategory(metrics: any[]) {
  const systemMetrics: any[] = [];
  const memoryMetrics: any[] = [];
  const customMetrics: any[] = [];

  for (const m of metrics) {
    const name = m.name || '';

    // Example logic for "system" metrics
    const isSystem =
      name.startsWith('process_') ||
      name.startsWith('nodejs_eventloop_') ||
      name.startsWith('nodejs_active_') ||
      name.startsWith('nodejs_version_info') ||
      name.startsWith('nodejs_gc_duration_seconds');

    // Example logic for "memory" metrics
    const isMemory =
      name.includes('memory') ||
      name.includes('heap') ||
      name.includes('resident_memory') ||
      name.includes('external_memory');

    if (isSystem) {
      systemMetrics.push(m);
    } else if (isMemory) {
      memoryMetrics.push(m);
    } else {
      // everything else is "custom"
      customMetrics.push(m);
    }
  }

  return { systemMetrics, memoryMetrics, customMetrics };
}

/**
 * A generic component that displays a list of metrics in collapsible cards.
 */
function MetricsSection({
  title,
  metrics,
  loading,
  error,
}: {
  title: string;
  metrics: any[];
  loading: boolean;
  error: any;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {loading && <p className="text-gray-600">Loading metrics...</p>}
      {error && <p className="text-red-500">Error fetching metrics</p>}

      {metrics && metrics.length > 0 ? (
        <div className="space-y-4">
          {metrics.map((m) => (
            <MetricCard key={m.name} metric={m} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No {title} found.</p>
      )}
    </section>
  );
}

/**
 * A single collapsible card for one metric, 
 * showing its help text and a table of (value, labels) sets.
 */
function MetricCard({ metric }: { metric: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded shadow-sm">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-50 px-4 py-2 cursor-pointer flex justify-between items-center"
      >
        <span className="font-bold">{metric.name}</span>
        <span className="text-sm text-gray-500">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </div>
      {isOpen && (
        <div className="px-4 py-2">
          <div className="text-gray-700 mb-2">
            {metric.help || 'No description'}
          </div>
          {metric.values && metric.values.length > 0 ? (
            <div className="overflow-auto max-h-40">
              <table className="min-w-full text-sm border border-gray-100">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 text-left">Value</th>
                    <th className="px-2 py-1 text-left">Labels</th>
                  </tr>
                </thead>
                <tbody>
                  {metric.values.map((val: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="px-2 py-1 whitespace-nowrap">
                        {val.value}
                      </td>
                      <td className="px-2 py-1">
                        {Object.keys(val.labels).length > 0
                          ? JSON.stringify(val.labels)
                          : '{}'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No values found.</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A section that shows an example Recharts area chart.
 * In real usage, you'd feed it actual time-series data from a DB or a separate API.
 */
function ChartsSection({ data }: { data: { time: number; value: number }[] }) {
  return (
    <section>
      <h3 className="text-xl font-semibold">Custom Charts</h3>
      <p className="text-sm text-gray-600">
        In production, you'd store historical data for each metric and display
        them here in various charts.
      </p>
      <div className="w-full h-64 mt-4 bg-white border rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/**
 * A tab for advanced metric manipulation:
 * - Set watchers gauge
 * - Set DB connections gauge
 * - Reset certain counters
 */
function AdvancedMetricsTab() {
  // Hooks for watchers + DB connections + reset counters
  const [setWatchersGauge] = useSetWatchersGaugeMutation();
  const [setDbConnections] = useSetDbConnectionsMutation();
  const [resetCounters] = useResetCountersMutation();

  // Local state for watchers + connections input fields
  const [watchers, setWatchers] = useState(0);
  const [connections, setConnections] = useState(0);

  async function handleSetWatchers() {
    try {
      await setWatchersGauge(watchers).unwrap();
      alert(`watchersGauge set to ${watchers}`);
    } catch (err) {
      console.error(err);
      alert('Failed to set watchersGauge');
    }
  }

  async function handleSetConnections() {
    try {
      await setDbConnections(connections).unwrap();
      alert(`dbConnectionGauge set to ${connections}`);
    } catch (err) {
      console.error(err);
      alert('Failed to set dbConnectionGauge');
    }
  }

  async function handleResetCounters() {
    try {
      await resetCounters().unwrap();
      alert('Counters reset successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to reset counters');
    }
  }

  return (
    <section className="space-y-6">
      <h3 className="text-xl font-semibold">Advanced Metrics Tools</h3>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Set Watchers Gauge</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={watchers}
              onChange={(e) => setWatchers(Number(e.target.value))}
              className="border p-1 rounded w-24"
            />
            <button
              onClick={handleSetWatchers}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Set
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Set DB Connections Gauge</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={connections}
              onChange={(e) => setConnections(Number(e.target.value))}
              className="border p-1 rounded w-24"
            />
            <button
              onClick={handleSetConnections}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Set
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleResetCounters}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Reset user & issue counters
          </button>
        </div>
      </div>
    </section>
  );
}

export default MetricsDashboard;
