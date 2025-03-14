/*****************************************************************
 * File: src/components/Issue/IssueProgressGantt.tsx
 * Description: A Gantt chart using react-google-charts for your Issues,
 *              featuring pagination and a mature color palette.
 *****************************************************************/
import React, { useMemo, useState } from 'react';
import { useListIssuesQuery, Issue } from '../../api/issue/issueApi';
import { Chart } from 'react-google-charts';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

// Example statuses
export enum IssueStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
  REVIEW = 'REVIEW',
  DEPLOYED = 'DEPLOYED',
}

interface IssueProgressGanttProps {
  projectId: string;
}

/**
 * A "mature" color palette for Gantt's resources
 * (One item per distinct resource).
 */
const MATURE_PALETTE = [
  { color: '#3f51b5', dark: '#303f9f', light: '#eaf4f4' },   // Indigo
  { color: '#009688', dark: '#00695c', light: '#b2dfdb' },   // Teal
  { color: '#ff5722', dark: '#e64a19', light: '#ffccbc' },   // Deep Orange
  { color: '#607d8b', dark: '#455a64', light: '#cfd8dc' },   // Blue Gray
  { color: '#8e24aa', dark: '#6a1b9a', light: '#e1bee7' },   // Purple
  { color: '#795548', dark: '#5d4037', light: '#d7ccc8' },   // Brown
  // add more if needed
];

const IssueProgressGantt: React.FC<IssueProgressGanttProps> = ({ projectId }) => {
  // Fetch issues
  const { data: allIssues, isLoading, isError } = useListIssuesQuery(
    { projectId },
    { skip: !projectId }
  );

  // ---------- Pagination states ----------
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8; // how many tasks per page?

  // If we have issues, figure out how many pages
  const totalPages = allIssues ? Math.ceil(allIssues.length / pageSize) : 1;

  // slice the issues for the current page
  const pagedIssues = useMemo(() => {
    if (!allIssues) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allIssues.slice(startIndex, endIndex);
  }, [allIssues, currentPage]);

  // ---------- Build the Gantt chart data from our "paged" issues ----------
  const chartData = useMemo(() => {
    if (!pagedIssues.length) return null;

    // each row: [ taskId, taskName, resource, start, end, duration, percentComplete, dependencies ]
    const rows = pagedIssues.map((iss) => {
      // fallback start/end for demonstration
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 5);

      // progress logic based on status
      let percentComplete = 0;
      switch (iss.status) {
        case IssueStatus.DONE:
        case IssueStatus.DEPLOYED:
          percentComplete = 100;
          break;
        case IssueStatus.IN_PROGRESS:
        case IssueStatus.REVIEW:
          percentComplete = 70;
          break;
        case IssueStatus.BLOCKED:
          percentComplete = 30;
          break;
        default:
          // TO_DO => 0
          percentComplete = 0;
      }

      // resource = status => color-coded
      const resource = iss.status;

      return [
        iss._id,         // Task ID
        iss.title,       // Task Name
        resource,        // Resource (use status as resource grouping)
        start, 
        end,
        null,            // duration
        percentComplete,
        null,            // dependencies
      ];
    });

    const dataTable = [
      [
        { type: 'string', id: 'Task ID' },
        { type: 'string', id: 'Task Name' },
        { type: 'string', id: 'Resource' },
        { type: 'date',   id: 'Start Date' },
        { type: 'date',   id: 'End Date' },
        { type: 'number', id: 'Duration' },
        { type: 'number', id: 'Percent Complete' },
        { type: 'string', id: 'Dependencies' },
      ],
      ...rows,
    ];

    return dataTable;
  }, [pagedIssues]);

  if (isLoading) return <div>Loading Gantt data...</div>;
  if (isError) return <div>Error or no issues found.</div>;
  if (!allIssues || allIssues.length === 0) {
    return <div className="text-gray-600">No issues found in this project.</div>;
  }
  if (!chartData) {
    // means we have no paged issues
    return <div className="text-gray-600">No issues on this page.</div>;
  }

  // Gantt chart options
  const options = {
    height: 500,
    gantt: {
      trackHeight: 32,
      percentEnabled: true,
      palette: MATURE_PALETTE,
      sortTasks: false,
    },
  };

  // ---------- Pagination Handlers ----------
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        <ListBulletIcon className="h-10 w-10 inline-block mr-2" />
        Issue Gantt Chart
      </h2>

      {/* Gantt Chart */}
      <Chart
        chartType="Gantt"
        width="95%"
        height="500px"
        data={chartData}
        options={options}
        // loader={<div>Loading Chart...</div>} // optional
      />

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          Next
        </button>
      </div>

      {/* Legend / Info */}
      <div className="text-sm text-gray-500 mt-4">
        <p>Status is color-coded by resource, with a “mature” palette:</p>
        <ul className="list-disc list-inside">
          <li><strong>TO_DO</strong> 0% progress, Indigo row</li>
          <li><strong>IN_PROGRESS</strong> / <strong>REVIEW</strong> 70% progress</li>
          <li><strong>BLOCKED</strong> 30% progress</li>
          <li><strong>DONE</strong> / <strong>DEPLOYED</strong> 100% progress</li>
        </ul>
        <p className="mt-1">
          Each page shows up to {pageSize} tasks.
        </p>
      </div>
    </div>
  );
};

export default IssueProgressGantt;
