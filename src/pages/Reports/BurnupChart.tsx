// File: src/components/Issue/BurnupChart.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useListIssuesQuery, Issue } from '../../api/issue/issueApi';
import { useAppSelector } from '../../app/hooks/redux';
import { useListProjectsQuery } from '../../api/project/projectApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BurnupChart: React.FC = () => {
  const { projectId: paramProjectId } = useParams<{ projectId?: string }>();
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const orgIdParam = selectedOrgId ?? undefined;

  const { data: projects, isLoading: isLoadingProjects, isError: isErrorProjects } = useListProjectsQuery(orgIdParam, { skip: !selectedOrgId });

  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(paramProjectId);
  const [sprintIdFilter, setSprintIdFilter] = useState<string | null>(null);

  useEffect(() => {
    if (paramProjectId) {
      setSelectedProjectId(paramProjectId);
    }
  }, [paramProjectId]);

  useEffect(() => {
    if (!paramProjectId && projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [paramProjectId, projects, selectedProjectId]);

  const { data: issues, isLoading: isLoadingIssues, isError: isErrorIssues } = useListIssuesQuery({ projectId: selectedProjectId }, { skip: !selectedProjectId });

  const sprints = useMemo(() => {
    if (!issues) return [];
    const uniqueSprintIds = new Set<string>();
    issues.forEach((issue) => {
      if (issue.sprintId) {
        uniqueSprintIds.add(issue.sprintId);
      }
    });
    return Array.from(uniqueSprintIds);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    if (!sprintIdFilter) return issues;
    return issues.filter((issue) => issue.sprintId === sprintIdFilter);
  }, [issues, sprintIdFilter]);

  const burnupData = useMemo(() => {
    if (!filteredIssues || filteredIssues.length === 0) return null;

    const issuesWithStoryPoints = filteredIssues.filter(issue => issue.storyPoints !== undefined && issue.storyPoints !== null);

    if(issuesWithStoryPoints.length === 0) return null;

    const startDate = new Date(Math.min(...issuesWithStoryPoints.map(issue => new Date(issue.createdAt || Date.now()).getTime())));
    const endDate = new Date(); // Current date as end date. You can also use sprint end date if available.
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let totalStoryPoints = issuesWithStoryPoints.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

    const labels: string[] = [];
    const completedData: number[] = [];
    const scopeData: number[] = [];

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24));
      labels.push(currentDate.toLocaleDateString());

      let completedStoryPoints = issuesWithStoryPoints.reduce((sum, issue) => {
        if (issue.createdAt && new Date(issue.createdAt).getTime() <= currentDate.getTime()) {
          return sum + (issue.storyPoints || 0);
        }
        return sum;
      }, 0);

      completedData.push(completedStoryPoints);
      scopeData.push(totalStoryPoints);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Completed Story Points',
          data: completedData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: false,
        },
        {
          label: 'Total Scope',
          data: scopeData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          fill: false,
        },
      ],
    };
  }, [filteredIssues]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sprint Burnup Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!selectedOrgId) {
    return <div className="p-4 text-red-500">Please select an organization.</div>;
  }

  if (isLoadingProjects || isLoadingIssues) {
    return <div className="p-4">Loading...</div>;
  }

  if (isErrorProjects || isErrorIssues) {
    return <div className="p-4 text-red-500">Error loading data.</div>;
  }

  return (
    <div className="mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
  {/* Enhanced Header Section */}
  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
    <div className="flex items-center space-x-4">
      {/* Icon */}
      <div className="p-3 bg-white rounded-full shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>

      {/* Title and Description */}
      <div>
        <h1 className="text-3xl font-bold text-white">Burnup Chart</h1>
        <p className="text-sm text-white opacity-90">
          Track your sprint progress with a visual representation of completed vs. total story points.
        </p>
      </div>
    </div>
  </div>

  {/* Project and Sprint Selectors */}
  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 justify-between">
    {projects && projects.length > 0 && (
      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 w-full md:w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Project:</label>
        <select
          className="border border-gray-300 p-2 rounded w-full text-sm"
          value={selectedProjectId || ''}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="" disabled>-- Select a Project --</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name} ({p.key})</option>
          ))}
        </select>
      </div>
    )}

    {selectedProjectId && (
      <div className="bg-white border border-gray-200 rounded-lg shadow p-4 w-full md:w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Sprint:</label>
        <select
          className="border border-gray-300 p-2 rounded w-full text-sm"
          value={sprintIdFilter || ''}
          onChange={(e) => setSprintIdFilter(e.target.value || null)}
        >
          <option value="">All Sprints</option>
          {sprints.map((sprintId) => (
            <option key={sprintId} value={sprintId}>{sprintId}</option>
          ))}
        </select>
      </div>
    )}
  </div>

  {/* Chart Section */}
  {selectedProjectId && burnupData && (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
      <Line options={chartOptions} data={burnupData} />
    </div>
  )}
  {selectedProjectId && !burnupData && (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
      <p>No issues with story points or no issues found in the selected sprint.</p>
    </div>
  )}
</div>

     
  );
};

export default BurnupChart;