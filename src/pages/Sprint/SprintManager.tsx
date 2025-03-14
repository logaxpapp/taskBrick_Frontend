// File: src/pages/AdvancedSprintManager.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../app/hooks/redux'; 
import { useListProjectsQuery } from '../../api/project/projectApi';
import { Link } from 'react-router-dom';
import {
  Sprint,
  useListSprintsQuery,
} from '../../api/sprint/sprintApi';
import AdvancedSprintCreateModal from './SprintCreateModal';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import PreDashboard from '../auth/PreDashboard';

const AdvancedSprintManager: React.FC = () => {
 const { selectedOrgId } = useAppSelector((state) => state.organization);
  const [projectId, setProjectId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  
  // Show/hide our "create sprint" modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 1) Projects in this org
  const { data: userProjects } = useListProjectsQuery(selectedOrgId ?? '', {
    skip: !selectedOrgId,
  });

  // 2) Sprints for the selected project
  const {
    data: sprints,
    isLoading: sprintsLoading,
    refetch: refetchSprints,
  } = useListSprintsQuery(
    { projectId },
    {
      skip: !projectId, // only fetch if projectId is set
    }
  );

  // Filter in memory by search term
  const filteredSprints = useMemo(() => {
    if (!sprints) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sprints;
    return sprints.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        (s.status || '').toLowerCase().includes(term) ||
        (s.goal || '').toLowerCase().includes(term)
    );
  }, [sprints, searchTerm]);

  if (!selectedOrgId) {
    return (
      <div className="p-6">
        <PreDashboard />
      </div>
    );
  }

  // Handlers
  const handleRefresh = () => {
    if (projectId) {
      refetchSprints();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sprint Manager</h1>

      {/* Project Selection */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm font-semibold">Select Project:</label>
        <select
          className="border px-2 py-1 rounded"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">-- Choose a Project --</option>
          {userProjects?.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.name}
            </option>
          ))}
        </select>
        {projectId && (
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        )}

        {/* Button to open "Create Sprint" modal */}
        {projectId && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create Sprint</span>
          </button>
        )}
      </div>

      {/* Search bar */}
      {projectId && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Search Sprints:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Sprint List */}
      {projectId && (
        <>
          {sprintsLoading ? (
            <p>Loading sprints...</p>
          ) : filteredSprints.length === 0 ? (
            <p className="text-gray-500 mt-2">No sprints found.</p>
          ) : (
            <motion.div
              layout
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4"
            >
              {filteredSprints.map((sprint) => (
                <motion.div
                  key={sprint._id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className="border p-4 rounded bg-white shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-blue-700">
                    {sprint.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{' '}
                    <span className="font-medium uppercase">
                      {sprint.status}
                    </span>
                  </p>
                  {sprint.goal && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      Goal: {sprint.goal}
                    </p>
                  )}
                  <div className="flex justify-end mt-3">
                  <Link to={`/dashboard/sprint-detail/${sprint._id}`} className=" hover:underline bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                   View / Manage
                  </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}

     

      {/* Create Sprint Modal */}
      <AnimatePresence>
        {showCreateModal && projectId && (
          <AdvancedSprintCreateModal
            projectId={projectId}
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              handleRefresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSprintManager;
