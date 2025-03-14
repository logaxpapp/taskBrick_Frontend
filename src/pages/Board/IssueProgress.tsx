/*****************************************************************
 * File: src/components/Issue/IssueProgress.tsx
 * Description: A Tailwind + Chart.js example for a burn-down chart
 *              using actual startDate / dueDate from each Issue.
 *****************************************************************/
import React, { useMemo } from 'react';
import { useListIssuesQuery, Issue } from '../../api/issue/issueApi';

// Import Chart.js & React wrapper
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeUnit, // <--- import for correct type
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface IssueProgressProps {
  projectId: string;
}

const IssueProgress: React.FC<IssueProgressProps> = ({ projectId }) => {
  const { data: issues, isLoading, isError } = useListIssuesQuery({ projectId }, { skip: !projectId });

  // Build time-based burn-down data
  const chartData = useMemo(() => {
    if (!issues || issues.length === 0) return null;

    // parse date or fallback
    const safeDate = (dateStr?: string | null): Date | null => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    };

    let earliestStart: Date | null = null;
    let latestDue: Date | null = null;

    issues.forEach((iss) => {
      const sd = safeDate(iss.startDate);
      const dd = safeDate(iss.dueDate);

      if (sd && (!earliestStart || sd < earliestStart)) earliestStart = sd;
      if (dd && (!latestDue || dd > latestDue)) latestDue = dd;
    });

    if (!earliestStart) earliestStart = new Date();
    if (!latestDue) {
      const fallbackEnd = new Date(earliestStart);
      fallbackEnd.setDate(fallbackEnd.getDate() + 7);
      latestDue = fallbackEnd;
    }

    // generate an array of days from earliestStart..latestDue
    const getDateRange = (start: Date, end: Date): Date[] => {
      const dates: Date[] = [];
      const current = new Date(start);
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };
    const dateRange = getDateRange(earliestStart, latestDue);

    // for each day, compute how many storyPoints remain
    const dailyData = dateRange.map((day) => {
      let remain = 0;
      issues.forEach((iss) => {
        const dd = safeDate(iss.dueDate);
        if (!dd) {
          // no dueDate => never finished => always remain
          remain += iss.storyPoints || 0;
        } else {
          // if day < dd => still open
          if (day < dd) {
            remain += iss.storyPoints || 0;
          }
        }
      });
      return { x: day, y: remain };
    });

    return {
      datasets: [
        {
          label: 'Remaining Story Points',
          data: dailyData,
          fill: false,
          borderColor: 'rgb(75,192,192)',
          tension: 0.1,
        },
      ],
    };
  }, [issues]);

  if (isLoading) return <p className="text-gray-500 text-sm">Loading issue progress data...</p>;
  if (isError) return <p className="text-red-500 text-sm">Error loading issues for progress chart.</p>;
  if (!issues || issues.length === 0) return <p className="text-gray-600 text-sm">No issues found.</p>;
  if (!chartData) return null;

  // Chart.js options with time scale
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const, 
        // or: type: 'time' as 'time',
        time: {
          unit: 'day' as TimeUnit, // <--- fix the type error
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Story Points Remaining',
        },
      },
    },
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: `Burn-down Chart (Project: ${projectId})`,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Issue Progress (Burn-down)</h2>
      <Line data={chartData} options={options} />
      <p className="text-sm text-gray-500 mt-2">
        Based on <strong>startDate</strong> / <strong>dueDate</strong>. Issues without a due date are never completed.
      </p>
    </div>
  );
};

export default IssueProgress;
