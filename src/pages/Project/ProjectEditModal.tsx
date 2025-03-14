// File: src/pages/components/ProjectEditModal.tsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Project,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from '../../api/project/projectApi';
import { UserOrganizationPivot } from '../../api/userOrganization/userOrganizationApi';

interface ProjectEditModalProps {
  projectId: string;
  orgUsers: UserOrganizationPivot[]; // userId could be string or object
  isLoadingUsers: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  projectId,
  orgUsers,
  isLoadingUsers,
  onClose,
  onUpdated,
}) => {
  const { data: project, isLoading: isProjectLoading } = useGetProjectQuery(projectId);
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Include 'key' in the local state
  const [form, setForm] = useState({
    name: '',
    key: '',
    description: '',
    leadUserId: '',
  });

  console.log(project);

  // Populate form once the project data arrives
  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || '',
        key: project.key || '',
        description: project.description || '',
        leadUserId: project.leadUserId || '',
      });
    }
  }, [project]);

  const handleSave = async () => {
    if (!project) return;
    try {
      await updateProject({
        id: project._id,
        updates: {
          name: form.name,
          key: form.key || null,
          description: form.description || null,
          leadUserId: form.leadUserId || null,
        },
      }).unwrap();
      onUpdated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to update project');
    }
  };

  if (!projectId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="projectEdit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md p-6 bg-white rounded shadow-lg relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Project</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {isProjectLoading ? (
            <p className="text-sm text-gray-500">Loading project data...</p>
          ) : (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  className="w-full border p-2 rounded"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Key</label>
                <input
                  className="w-full border p-2 rounded"
                  value={form.key}
                  onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
                />
                <p className="text-xs text-gray-400">Short unique code (e.g. “PROJ”).</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              {/* Lead User */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Lead User</label>
                <select
                  className="w-full border p-2 rounded"
                  value={form.leadUserId}
                  onChange={(e) => setForm((prev) => ({ ...prev, leadUserId: e.target.value }))}
                  disabled={isLoadingUsers}
                >
                  <option value="">-- No Specific Lead --</option>
                  {orgUsers.map((pivot) => {
                    let userValue = '';
                    let userLabel = '';

                    if (typeof pivot.userId === 'string') {
                      userValue = pivot.userId;
                      userLabel = pivot.userId; // fallback: the raw string
                    } else {
                      // It's an object with ._id, .firstName, .lastName, etc.
                      userValue = pivot.userId._id;
                      const fname = pivot.userId.firstName || '';
                      const lname = pivot.userId.lastName || '';
                      userLabel = (fname + ' ' + lname).trim() || pivot.userId._id;
                    }

                    return (
                      <option key={pivot._id} value={userValue}>
                        {userLabel}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectEditModal;
