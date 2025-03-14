// File: src/components/Header/ProjectModal.tsx

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector} from '../app/hooks/redux';

import { useCreateProjectMutation } from '../api/project/projectApi';      // RTK for creating
import { useListUsersInOrgQuery } from '../api/userOrganization/userOrganizationApi';


interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {

  const { selectedOrgId } = useAppSelector((state) => state.organization);


  // 2) RTK: load users in this org (to choose a lead if desired)
  const {
    data: orgUsers = [],
    isLoading: isUsersLoading,
  } = useListUsersInOrgQuery(selectedOrgId || '', {
    skip: !selectedOrgId,
  });

  // 3) RTK: create project mutation
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  // 4) Form state
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [leadUserId, setLeadUserId] = useState('');

  if (!isOpen) return null;

  // 5) Handler for create
  const handleCreateProject = async () => {
    if (!selectedOrgId) {
      alert('No organization selected.');
      return;
    }
    if (!projectName.trim() || !projectKey.trim()) {
      alert('Please provide both a project name and a key.');
      return;
    }
    try {
      await createProject({
        organizationId: selectedOrgId,
        name: projectName.trim(),
        key: projectKey.trim(),
        description: projectDesc || null,
        leadUserId: leadUserId || null,
      }).unwrap();

      // Example success
      alert(`Project "${projectName}" created!`);
      // Reset fields
      setProjectName('');
      setProjectKey('');
      setProjectDesc('');
      setLeadUserId('');
      // Close modal
      onClose();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to create project');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="projectModal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              w-full max-w-md 
              rounded-lg 
              shadow-2xl 
              bg-white 
              relative 
              overflow-hidden
            "
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Create a New Project
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-purple-500 transition"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="
                    w-full mt-1 px-4 py-2 
                    border border-gray-300 
                    rounded-md
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-indigo-500
                  "
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'PROJ'"
                  className="
                    w-full mt-1 px-4 py-2
                    border border-gray-300 
                    rounded-md
                    focus:outline-none 
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  A short unique code (e.g. “PROJ”).
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  className="
                    w-full mt-1 px-4 py-2
                    border border-gray-300 
                    rounded-md
                    focus:outline-none 
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
              </div>

              {/* Lead User dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Lead User
                </label>
                <select
                  className="
                    w-full mt-1 px-4 py-2
                    border border-gray-300 
                    rounded-md
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-indigo-500
                  "
                  value={leadUserId}
                  onChange={(e) => setLeadUserId(e.target.value)}
                  disabled={isUsersLoading}
                >
                  <option value="">-- No Specific Lead --</option>
                  {orgUsers.map((pivot) => {
                    let userVal = '';
                    let userLabel = '';
                    if (typeof pivot.userId === 'string') {
                      userVal = pivot.userId;
                      userLabel = pivot.userId; // fallback
                    } else {
                      userVal = pivot.userId._id;
                      const fname = pivot.userId.firstName || '';
                      const lname = pivot.userId.lastName || '';
                      userLabel = (fname + ' ' + lname).trim() || pivot.userId._id;
                    }
                    return (
                      <option key={pivot._id} value={userVal}>
                        {userLabel}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                className="
                  px-4 py-2 
                  text-sm font-medium 
                  text-gray-700 
                  bg-gray-200
                  rounded-md 
                  hover:bg-gray-300 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-offset-1 
                  focus:ring-indigo-500 
                  mr-2
                "
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="
                  px-4 py-2
                  text-sm font-medium 
                  text-white 
                  bg-indigo-600
                  rounded-md 
                  shadow-sm
                  hover:bg-indigo-700
                  focus:outline-none 
                  focus:ring-2
                  focus:ring-offset-1
                  focus:ring-indigo-500
                "
                onClick={handleCreateProject}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
