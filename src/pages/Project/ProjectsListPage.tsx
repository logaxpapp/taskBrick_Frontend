/*****************************************************************
 * File: src/pages/ProjectsListPage.tsx
 * Description: A Tailwind + Framer Motion page for listing projects
 *              (in a chosen org), with a view mode toggle (list/cards).
 *****************************************************************/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  useListProjectsQuery,
  Project,
} from '../../api/project/projectApi';
import { useOrgContext } from '../../contexts/OrgContext';

// Icons
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
// If you prefer React Icons: import { FaListUl, FaThLarge } from 'react-icons/fa'

const ProjectsListPage: React.FC = () => {
  // Grab the orgId from context, convert null => undefined
  const { selectedOrgId } = useOrgContext();
  const orgIdParam = selectedOrgId ?? undefined;

  // Query projects for that org
  const { data: projects, isLoading, isError, refetch } = useListProjectsQuery(orgIdParam, {
    skip: !orgIdParam, // skip if no org
  });

  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');

  if (!orgIdParam) {
    return (
      <div className="p-8 text-red-500">
        No organization selected. Please pick an org first.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-gray-600">Loading projects...</div>;
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Error loading projects.{' '}
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  if (!projects?.length) {
    return <div className="p-8 text-gray-600">No projects found.</div>;
  }

  // AnimatePresence wrapper for framer transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
    exit: { opacity: 0, y: 10 },
  };

  // List view
  const listView = (
    <motion.div
      key="listView"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="overflow-x-auto bg-white rounded-lg shadow mt-6"
    >
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Key
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((proj) => (
            <tr key={proj._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-gray-800 whitespace-nowrap">
                {proj.name}
              </td>
              <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                {proj.key}
              </td>
              <td className="px-4 py-4 text-gray-500">
                {proj.description || 'No description'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                <Link
                  to={`/dashboard/project/${proj._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );

  // Card view
  const cardView = (
    <motion.div
      key="cardView"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
    >
      {projects.map((proj) => (
        <div
          key={proj._id}
          className="bg-white rounded-lg border border-gray-200 shadow hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {proj.name}
            </h2>
            <p className="text-gray-600 mb-3">
              Key:{' '}
              <span className="font-mono text-sm font-semibold text-blue-500">
                {proj.key}
              </span>
            </p>
            <p className="text-gray-500 text-sm">
              {proj.description || 'No description available.'}
            </p>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Link
              to={`/dashboard/project/${proj._id}`}
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-200"
            >
              View Project Details
            </Link>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Projects Dashboard
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('list')}
            className={`
              px-3 py-2 rounded-md text-sm font-medium focus:outline-none
              ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <ListBulletIcon className="h-5 w-5 inline-block align-middle mr-1" />
            List View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`
              px-3 py-2 rounded-md text-sm font-medium focus:outline-none
              ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Squares2X2Icon className="h-5 w-5 inline-block align-middle mr-1" />
            Card View
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? listView : cardView}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsListPage;
