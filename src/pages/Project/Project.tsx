/*****************************************************************
 * File: src/pages/ProjectPage.tsx
 * Description: A Tailwind + Framer Motion page that:
 *   - Loads all projects in the org
 *   - Defaults to first project if none selected
 *   - Shows a top dropdown to pick a project
 *   - Provides tab-based content (Summary, Board, Calendar, etc.)
 *   - Uses framer-motion for smooth transitions
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useListProjectsQuery } from '../../api/project/projectApi';
import { useAppSelector} from '../../app/hooks/redux';

import BoardPage from '../Board/BoardPage';
import Summary from './Summary';
import BoardList from '../Board/BoardList';
import Calendar from '../Calendar/Calendar';
import List from '../Board/List';
import TaskManagerCharts from './TaskManagerCharts';
import IssueTypeManager from '../Issues/IssueTypeManager';
import IssueProgressGantt from '../Board/IssueProgressGantt';
import IssueProgress from '../Board/IssueProgress';
import FormsPage from '../Forms/FormsPage';
import PreDashboard from '../auth/PreDashboard';

import {
  FaTachometerAlt,
  FaChalkboard,
  FaCalendarAlt,
  FaListUl,
  FaWpforms,
  FaBullseye,
  FaHistory,
  FaLink,
  FaTasks,
} from 'react-icons/fa';

type ProjectTab =
  | 'summary'
  | 'board'
  | 'calendar'
  | 'list'
  | 'forms'
  | 'charts'
  | 'old-issues'
  | 'shortcuts'
  | 'progress'
  | 'issue-types'
  | 'Gantt';

/**
 * A responsive, animated ProjectPage that:
 *  1) Lists all projects in the org,
 *  2) Defaults to the first project if none selected,
 *  3) Has a dropdown for project selection,
 *  4) Shows tab-based sub-pages, with framer-motion transitions.
 */
const ProjectPage: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const orgIdParam = selectedOrgId ?? undefined;

  // If no org -> bail out early
  if (!orgIdParam) {
    return (
      <div className="p-6 text-red-500">
       <PreDashboard />
      </div>
    );
  }

  // Query all projects for this org
  const {
    data: projects,
    isLoading,
    isError,
    refetch,
  } = useListProjectsQuery(orgIdParam, {
    skip: !orgIdParam,
  });

  // Local state: which project is selected? which tab?
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<ProjectTab>('summary');

  // On mount or whenever projects load, if none selected, pick first
  useEffect(() => {
    if (!selectedProjectId && projects && projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // If loading or error
  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading projects...</div>;
  }
  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading projects.{' '}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }
  if (!projects || projects.length === 0) {
    return <div className="p-6 text-gray-600">No projects found in this org.</div>;
  }

  // Which project object is currently selected?
  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  // We'll define the tab list here for easy mapping
  const tabs = [
    { tab: 'summary', label: 'Summary', icon: FaTachometerAlt },
    { tab: 'board', label: 'Board', icon: FaChalkboard },
    { tab: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
    { tab: 'list', label: 'List', icon: FaListUl },
    { tab: 'forms', label: 'Forms', icon: FaWpforms },
    { tab: 'charts', label: 'Charts', icon: FaBullseye },
    { tab: 'old-issues', label: 'Old Issues', icon: FaHistory },
    { tab: 'shortcuts', label: 'Shortcuts', icon: FaLink },
    { tab: 'progress', label: 'Progress', icon: FaTasks },
    { tab: 'issue-types', label: 'Issue Types', icon: FaTasks },
    { tab: 'Gantt', label: 'Gantt', icon: FaTasks },

  ];

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* TOP BAR: Project Dropdown + Refresh Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Project Selector */}
        <div className="flex items-center space-x-3">
          <label className="block text-sm font-medium text-gray-700">
            Choose Project:
          </label>
          <select
            className="border border-gray-300 p-2 rounded text-sm"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name} ({proj.key})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => refetch()}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* If there's a selected project, show the main content */}
      {selectedProject ? (
        <div className="space-y-4">
          {/* TABS: summary, board, calendar, etc. */}
          <nav
            className="flex items-center gap-4 mb-2 
                       overflow-x-auto whitespace-nowrap 
                       scrollbar-thin scrollbar-thumb-gray-300 
                       py-2"
          >
            {tabs.map(({ tab, label, icon: Icon }) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as ProjectTab)}
                  className={`flex items-center gap-1 px-3 py-1 rounded 
                  ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* MAIN CONTENT for each tab, with framer-motion transitions */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <Summary />
                </motion.div>
              )}
              {activeTab === 'board' && (
                <motion.div
                  key="board"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <BoardList projectId={selectedProject._id} />
                  {/* Nested route for board details */}
                  <Routes>
                    <Route
                      path="board/:boardId"
                      element={<BoardPage projectId={selectedProject._id} />}
                    />
                  </Routes>
                </motion.div>
              )}
              {activeTab === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <Calendar />
                </motion.div>
              )}
              {activeTab === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <List projectId={selectedProject._id} />
                </motion.div>
              )}
              {activeTab === 'forms' && (
                <motion.div
                  key="forms"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <FormsPage />
                </motion.div>
              )}
              {activeTab === 'charts' && (
                <motion.div
                  key="charts"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <TaskManagerCharts />
                </motion.div>
              )}
              {activeTab === 'old-issues' && (
                <motion.div
                  key="old-issues"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <p className="text-sm text-gray-600">Old Issues feature coming soon...</p>
                </motion.div>
              )}
              {activeTab === 'shortcuts' && (
                <motion.div
                  key="shortcuts"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <p className="text-sm text-gray-600">Shortcuts coming soon...</p>
                </motion.div>
              )}
              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <IssueProgress projectId={selectedProject._id} />
                </motion.div>
              )}
              {activeTab === 'issue-types' && (
                <motion.div
                  key="issue-types"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <IssueTypeManager projectId={selectedProject._id} />
                </motion.div>
              )}
              {activeTab === 'Gantt' && (
                <motion.div
                  key="Gantt"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full"
                >
                  <IssueProgressGantt projectId={selectedProject._id} />
                </motion.div>
              )}
             
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          No project selected. Please choose from dropdown above.
        </p>
      )}
    </div>
  );
};

export default ProjectPage;
