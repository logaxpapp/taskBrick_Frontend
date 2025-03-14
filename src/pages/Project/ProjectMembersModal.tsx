// File: src/pages/components/ProjectMembersModal.tsx
import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

import {
  useListProjectMembersQuery,
  useAddMemberToProjectMutation,
  useRemoveMemberFromProjectMutation,
  ProjectMember,
} from '../../api/project/projectMemberApi';

// We'll import the pivot type so we can map orgUsers
import { UserOrganizationPivot } from '../../api/userOrganization/userOrganizationApi';

interface ProjectMembersModalProps {
  projectId: string;
  // Pass the entire list of orgUsers from your parent (the manager)
  orgUsers: UserOrganizationPivot[];
  onClose: () => void;
}

const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({
  projectId,
  orgUsers,
  onClose,
}) => {
  const { data: projectMembers, refetch, isLoading } = useListProjectMembersQuery(projectId, {
    skip: !projectId,
  });
  const [addMember] = useAddMemberToProjectMutation();
  const [removeMember] = useRemoveMemberFromProjectMutation();

  // Local form states
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState('');

  // Build a Set of user IDs already in the project
  const existingUserIds = useMemo(() => {
    if (!projectMembers) return new Set<string>();
    return new Set(
      projectMembers.map((m) => m.userId.toString()) // userId can be string or object, but presumably stored as string
    );
  }, [projectMembers]);

  // Filter out users already in the project
  const availableUsers = useMemo(() => {
    return orgUsers.filter((pivot) => {
      let actualId: string;
      if (typeof pivot.userId === 'string') {
        actualId = pivot.userId;
      } else {
        actualId = pivot.userId._id;
      }
      return !existingUserIds.has(actualId);
    });
  }, [orgUsers, existingUserIds]);

  const handleAdd = async () => {
    if (!newUserId.trim()) {
      alert('Please select a user.');
      return;
    }
    try {
      await addMember({
        projectId,
        userId: newUserId.trim(),
        roleInProject: newRole || null,
      }).unwrap();
      setNewUserId('');
      setNewRole('');
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to add member');
    }
  };

  const handleRemove = async (member: ProjectMember) => {
    if (!window.confirm(`Remove user ${member.userId} from this project?`)) return;
    try {
      await removeMember({ projectId, userId: member.userId.toString() }).unwrap();
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to remove member');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="membersModal"
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
            <h2 className="text-xl font-semibold">Project Members</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {isLoading && <p className="text-gray-500 text-sm">Loading members...</p>}
          {!isLoading && projectMembers && projectMembers.length === 0 && (
            <p className="text-sm text-gray-500">No members yet.</p>
          )}
          {!isLoading && projectMembers && projectMembers.length > 0 && (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
              {projectMembers.map((m) => (
                <li key={m._id} className="flex items-center justify-between p-2">
                  <div>
                    <p className="text-sm text-gray-700">
                      User: <span className="font-semibold">{m.userId}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Role: {m.roleInProject || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(m)}
                    className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Add Member</h3>

            {/* Instead of text input, we show a dropdown of available org users */}
            <select
              className="w-full border p-2 rounded"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
            >
              <option value="">-- Select User --</option>
              {availableUsers.map((pivot) => {
                let userVal: string;
                let userLabel: string;

                if (typeof pivot.userId === 'string') {
                  userVal = pivot.userId;
                  userLabel = pivot.userId; // fallback label
                } else {
                  userVal = pivot.userId._id;
                  const fname = pivot.userId.firstName ?? '';
                  const lname = pivot.userId.lastName ?? '';
                  userLabel = (fname + ' ' + lname).trim() || pivot.userId._id;
                }

                return (
                  <option key={pivot._id} value={userVal}>
                    {userLabel}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Role (optional)"
              className="w-full border p-2 rounded"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />

            <button
              onClick={handleAdd}
              className="mt-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Add Member
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectMembersModal;
