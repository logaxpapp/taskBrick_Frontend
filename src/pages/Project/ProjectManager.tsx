// File: src/pages/ProjectManager.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListProjectsQuery } from '../../api/project/projectApi';
import { useListUsersInOrgQuery } from '../../api/userOrganization/userOrganizationApi';
import { useAppSelector } from '../../app/hooks/redux'; 
import PreDashboard from '../auth/PreDashboard';

// Sub-components
import ProjectList from './ProjectList';
import ProjectCreateModal from './ProjectCreateModal';
import ProjectEditModal from './ProjectEditModal';

// NEW import: separate ManageProjectMembers component
import ManageProjectMembers from './ManageProjectMembers';

import {
  MagnifyingGlassIcon,
  ListBulletIcon,
  Squares2X2Icon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

const ProjectManager: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  // If no org selected, show some placeholder / pre-dashboard
  if (!selectedOrgId) {
    return (
      <div className="p-8 text-gray-600">
        <PreDashboard />
      </div>
    );
  }

  // Query: fetch projects for this org
  const { data: projects, isLoading: isProjectsLoading, refetch } =
    useListProjectsQuery(selectedOrgId);

  // Query: all users in org (for leader dropdown, etc.)
  const { data: orgUsers, isLoading: isUsersLoading } = useListUsersInOrgQuery(selectedOrgId);

  // Local UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  // Instead of a modal, we'll show a separate "manage members" component
  const [memberProjectId, setMemberProjectId] = useState<string | null>(null);

  // Filter projects in memory
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchTerm.trim()) return projects;
    const term = searchTerm.trim().toLowerCase();
    return projects.filter((p) =>
      p.name.toLowerCase().includes(term) ||
      p.key.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  // If we are currently managing members, show that component instead of the main list
  const isManagingMembers = !!memberProjectId;

  return (
    <motion.div
      className="p-6 md:p-8 lg:p-10 text-gray-800 relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 
        We'll conditionally render EITHER the main "Project List" view OR the "Manage Members" view.
        Use AnimatePresence to smoothly transition between them.
      */}
      <AnimatePresence>
        {!isManagingMembers && (
          <motion.div
            key="main-project-list"
            className="absolute inset-0"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }} // slide out left
            transition={{ duration: 0.3 }}
          >
            {/* Top header & actions */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Project Manager
              </h1>
              {/* Actions Row */}
              <div className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-50 rounded-lg shadow-inner">
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="border border-gray-300 pl-10 pr-3 py-2 rounded-md
                              focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Buttons */}
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300
                                transition-colors duration-200 ${
                                  viewMode === 'list'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                  >
                    <ListBulletIcon className="w-4 h-4 inline-block mr-1 align-middle" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300
                                transition-colors duration-200 ${
                                  viewMode === 'cards'
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                  >
                    <Squares2X2Icon className="w-4 h-4 inline-block mr-1 align-middle" />
                  </button>
                </div>

                {/* Create Project Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold
                             px-4 py-2 rounded-md shadow-md transition-shadow duration-200
                             flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* Project List / Cards */}
            <ProjectList
              projects={filteredProjects}
              isLoading={isProjectsLoading}
              viewMode={viewMode}
              onEdit={(projectId) => setEditProjectId(projectId)}
              onManageMembers={(projectId) => setMemberProjectId(projectId)}
              onRefresh={refetch}
            />

            {/* Create Modal */}
            {showCreateModal && (
              <ProjectCreateModal
                orgUsers={orgUsers || []}
                isLoadingUsers={isUsersLoading}
                onClose={() => setShowCreateModal(false)}
                onCreated={() => {
                  refetch();
                  setShowCreateModal(false);
                }}
              />
            )}

            {/* Edit Modal */}
            {editProjectId && (
              <ProjectEditModal
                projectId={editProjectId}
                orgUsers={orgUsers || []}
                isLoadingUsers={isUsersLoading}
                onClose={() => setEditProjectId(null)}
                onUpdated={() => {
                  refetch();
                  setEditProjectId(null);
                }}
              />
            )}
          </motion.div>
        )}

        {isManagingMembers && memberProjectId && (
          <motion.div
            key="manage-members"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <ManageProjectMembers
              projectId={memberProjectId}
              orgUsers={orgUsers || []}
              onClose={() => setMemberProjectId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectManager;
