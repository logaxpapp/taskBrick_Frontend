import React, { useState, useEffect } from 'react';
import { useGetSprintQuery, useListSprintsQuery, Sprint } from '../../api/sprint/sprintApi';
import { useListIssuesQuery } from '../../api/issue/issueApi';
import Velocity from './Velocity';
import BurndownChart from './BurndownChart';
import BurnupChart from './BurnupChart';
import StatusReportList from './StatusReportList';
import { useListProjectsQuery, Project } from '../../api/project/projectApi';
import { useAppSelector } from '../../app/hooks/redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart2, LineChart, PieChart, ClipboardList, CalendarDays } from 'lucide-react';

const SprintReport: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const skipProjectsQuery = !selectedOrgId;
  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } = useListProjectsQuery(selectedOrgId || undefined, { skip: skipProjectsQuery });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'velocity' | 'burndown' | 'burnup' | 'status'>('velocity');

  const { data: sprints, isLoading: isSprintsLoading, isError: isSprintsError } = useListSprintsQuery({ projectId: selectedProjectId || '' }, { skip: !selectedProjectId });
  const { data: sprint, isLoading: isSprintLoading, isError: isSprintError } = useGetSprintQuery(selectedSprintId || '', { skip: !selectedSprintId });
  const { data: issues, isLoading: isIssuesLoading, isError: isIssuesError } = useListIssuesQuery({ projectId: selectedProjectId || '' }, { skip: !selectedProjectId });

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (sprints && sprints.length > 0 && !selectedSprintId) {
      setSelectedSprintId(sprints[0]._id);
    }
  }, [sprints, selectedSprintId]);

  if (!selectedOrgId) {
    return <div className="p-4 text-red-500">Please select an organization.</div>;
  }

  if (isProjectsLoading || isSprintsLoading || isSprintLoading || isIssuesLoading) {
    return <div className="p-4 flex items-center justify-center">Loading...</div>;
  }

  if (isProjectsError || isSprintsError || isSprintError || isIssuesError) {
    return <div className="p-4 text-red-500 flex items-center justify-center">Error loading data.</div>;
  }

  if (!projects || projects.length === 0) {
    return <div className="p-4 text-red-500 flex items-center justify-center">No projects found.</div>;
  }

  if (!sprints || sprints.length === 0) {
    return <div className="p-4 text-red-500 flex items-center justify-center">No sprints found.</div>;
  }

  if (!sprint) {
    return <div className="p-4 text-red-500 flex items-center justify-center">Sprint not found.</div>;
  }

  return (
    <motion.div
      className="mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header Section */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-full shadow-md">
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold ">Sprint Report: {sprint.name}</h1>
            <p className="text-sm text-purple-500 opacity-90">
              Track your sprint progress with detailed analytics and visualizations.
            </p>
          </div>
        </div>
      </div>

      {/* Project and Sprint Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-white border border-gray-200 rounded-lg shadow p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>Select Project:</span>
          </label>
          <div className="relative">
            <select
              className="border border-gray-300 p-2 rounded w-full text-sm appearance-none pr-10"
              value={selectedProjectId || ''}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedSprintId(null);
              }}
            >
              {projects.map((p: Project) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white border border-gray-200 rounded-lg shadow p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>Select Sprint:</span>
          </label>
          <div className="relative">
            <select
              className="border border-gray-300 p-2 rounded w-full text-sm appearance-none pr-10"
              value={selectedSprintId || ''}
              onChange={(e) => setSelectedSprintId(e.target.value)}
            >
              {sprints.map((s: Sprint) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <motion.button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            activeTab === 'velocity' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('velocity')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BarChart2 className="w-5 h-5" />
          <span>Velocity</span>
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            activeTab === 'burndown' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('burndown')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LineChart className="w-5 h-5" />
          <span>Burndown</span>
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            activeTab === 'burnup' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('burnup')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PieChart className="w-5 h-5" />
          <span>Burnup</span>
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
            activeTab === 'status' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('status')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ClipboardList className="w-5 h-5" />
          <span>Status Report</span>
        </motion.button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {activeTab === 'velocity' && <Velocity />}
          {activeTab === 'burndown' && <BurndownChart />}
          {activeTab === 'burnup' && <BurnupChart />}
          {activeTab === 'status' && <StatusReportList projectId={selectedProjectId || ''} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SprintReport;