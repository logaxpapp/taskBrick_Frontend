// File: src/pages/components/ProjectCreateModal.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useCreateProjectMutation } from '../../api/project/projectApi';
import { UserOrganizationPivot } from '../../api/userOrganization/userOrganizationApi';
import { useAppSelector} from '../../app/hooks/redux';

interface ProjectCreateModalProps {
  orgUsers: UserOrganizationPivot[];
  isLoadingUsers: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({
  orgUsers,
  isLoadingUsers,
  onClose,
  onCreated,
}) => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const [form, setForm] = useState({
    name: '',
    key: '',
    description: '',
    leadUserId: '',
  });

  const handleCreate = async () => {
    if (!selectedOrgId) return;
    if (!form.name.trim() || !form.key.trim()) {
      alert('Name and Key are required.');
      return;
    }
    try {
      await createProject({
        organizationId: selectedOrgId,
        name: form.name.trim(),
        key: form.key.trim(),
        description: form.description || null,
        leadUserId: form.leadUserId || null,
      }).unwrap();
      onCreated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to create project');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="projectCreate"
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
            <h2 className="text-xl font-semibold">Create Project</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Key</label>
              <input
                className="w-full border p-2 rounded"
                value={form.key}
                onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
              />
              <p className="text-xs text-gray-400">Short unique code (e.g. “PROJ”).</p>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700">Lead User</label>
              <select
                className="w-full border p-2 rounded"
                value={form.leadUserId}
                onChange={(e) => setForm((prev) => ({ ...prev, leadUserId: e.target.value }))}
                disabled={isLoadingUsers}
              >
                <option value="">-- No Specific Lead --</option>
                {orgUsers.map((pivot) => (
                <option
                key={pivot._id}
                value={
                    typeof pivot.userId === 'string'
                    ? pivot.userId
                    : pivot.userId._id // if it's a populated object
                }
                >
                {typeof pivot.userId === 'string'
                    ? pivot.userId
                    : pivot.userId.firstName + ' ' + pivot.userId.lastName}
                </option>

                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectCreateModal;
