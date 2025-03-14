// File: src/components/Issue/Velocity.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useListIssuesQuery, Issue } from '../../api/issue/issueApi';
import { useAppSelector } from '../../app/hooks/redux';
import { useListProjectsQuery } from '../../api/project/projectApi';
import { motion } from 'framer-motion';
import { ChevronDown, BarChart2, CalendarDays, Rocket } from 'lucide-react';

const Velocity: React.FC = () => {
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

  const calculateVelocity = useMemo(() => {
    if (!filteredIssues) return 0;
    return filteredIssues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
  }, [filteredIssues]);

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
      className="mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-50 rounded-lg  p-6 flex items-center justify-between text-gray-800">
        <div className="flex items-center space-x-4">
          <BarChart2 className="w-8 h-8" /> {/* Increased icon size */}
          <h1 className="text-2xl md:text-3xl font-bold">Velocity</h1>
        </div>
        <p className="text-lg md:text-xl font-semibold">
          {calculateVelocity} points
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 justify-start">
        {/* Project Selector */}
        {projects && projects.length > 0 && (
          <motion.div
            className="bg-white border border-gray-200 rounded-md shadow-sm p-4 w-full md:w-64"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Select Project:</span>
            </label>
            <div className="relative">
              <select
                className="border border-gray-300 p-2 rounded-md w-full text-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a Project --
                </option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Sprint Selector */}
        {selectedProjectId && (
          <motion.div
            className="bg-white border border-gray-200 rounded-md shadow-sm p-4 w-full md:w-64"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <span>Select Sprint:</span>
            </label>
            <div className="relative">
              <select
                className="border border-gray-300 p-2 rounded-md w-full text-sm appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sprintIdFilter || ''}
                onChange={(e) => setSprintIdFilter(e.target.value || null)}
              >
                <option value="">All Sprints</option>
                {sprints.map((sprintId) => (
                  <option key={sprintId} value={sprintId}>
                    {sprintId}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Velocity Details */}
      {selectedProjectId && (
        <motion.div
          className="bg-white border border-gray-200 rounded-md shadow-sm p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Rocket className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">Velocity Details</h2>
          </div>
          

          {filteredIssues && filteredIssues.length > 0 ? (
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm mt-4 table-auto"> {/* Added table-auto */}
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b text-left">Title</th>
                  <th className="p-2 border-b text-left">Story Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{issue.title}</td>
                    <td className="p-2 border-b">{issue.storyPoints || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p className="text-gray-600">No issues found for the selected sprint.</p>
          )}
           <p className='mt-4 font-bold'>Total Story Points: {calculateVelocity}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Velocity;