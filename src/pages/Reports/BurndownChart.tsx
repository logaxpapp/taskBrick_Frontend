// File: src/components/Issue/BurndownChart.tsx

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
import { motion } from 'framer-motion'; // Import framer-motion
import { FaChartLine } from 'react-icons/fa'; // Import a relevant icon

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BurndownChart: React.FC = () => {
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

  const burndownData = useMemo(() => {
    if (!filteredIssues || filteredIssues.length === 0) return null;

    const issuesWithStoryPoints = filteredIssues.filter(issue => issue.storyPoints !== undefined && issue.storyPoints !== null);

    if (issuesWithStoryPoints.length === 0) return null;

    const startDate = new Date(Math.min(...issuesWithStoryPoints.map(issue => new Date(issue.createdAt || Date.now()).getTime())));
    const endDate = new Date(); // Current date as end date. You can also use sprint end date if available.
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let remainingStoryPoints = issuesWithStoryPoints.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    const dailyReduction = remainingStoryPoints / totalDays;

    const labels: string[] = [];
    const actualData: number[] = [];
    const idealData: number[] = [];

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24));
      labels.push(currentDate.toLocaleDateString());

      let currentDayStoryPoints = issuesWithStoryPoints.reduce((sum, issue) => {
        if (issue.createdAt && new Date(issue.createdAt).getTime() <= currentDate.getTime()) {
          return sum + (issue.storyPoints || 0);
        }
        return sum;

      }, 0);

      actualData.push(currentDayStoryPoints);
      idealData.push(remainingStoryPoints - i * dailyReduction);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Actual Burndown',
          data: actualData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          fill: false,
        },
        {
          label: 'Ideal Burndown',
          data: idealData,
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
        text: 'Sprint Burndown Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!selectedOrgId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 text-red-500"
      >
        Please select an organization.
      </motion.div>
    );
  }

  if (isLoadingProjects || isLoadingIssues) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-center items-center"
      >
        Loading...
      </motion.div>
    );
  }

  if (isErrorProjects || isErrorIssues) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 text-red-500"
      >
        Error loading data.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto p-6 space-y-6 bg-gray-100 rounded-lg shadow-md" // Added background and shadow
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          <FaChartLine className="inline-block mr-2" />
          Burndown Chart
        </h1>
      </div>

      {projects && projects.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-300 rounded-md shadow-sm p-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Project:</label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="" disabled>-- Select a Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.key})</option>
            ))}
          </select>
        </motion.div>
      )}

      {selectedProjectId && (
        <motion.div
         whileHover={{ scale: 1.02 }}
         className="bg-white border border-gray-300 rounded-md shadow-sm p-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Sprint:</label>
          <select
            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" // Added focus styles
            value={sprintIdFilter || ''}
            onChange={(e) => setSprintIdFilter(e.target.value || null)}
          >
            <option value="">All Sprints</option>
            {sprints.map((sprintId) => (
              <option key={sprintId} value={sprintId}>{sprintId}</option>
            ))}
          </select>
        </motion.div>
      )}

      {selectedProjectId && burndownData && (
        <motion.div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
          <Line options={chartOptions} data={burndownData} />
        </motion.div>
      )}

      {selectedProjectId && !burndownData && (
        <motion.div
          className="bg-white border border-gray-300 rounded-md shadow-sm p-4 text-center"
        >
          <p className="text-gray-600">No issues with story points or no issues found in the selected sprint.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BurndownChart;