// File: src/pages/Invitation/CreateInvitationModal.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Team } from '../../api/team/teamApi';
import { TeamRole } from '../../types/teamRole';

interface CreateInvitationModalProps {
  open: boolean;
  onClose: () => void;
  teams: Team[];
  inviteForm: {
    email: string;
    teamId: string;
    roleInTeam?: string | null;
  };
  setInviteForm: React.Dispatch<
    React.SetStateAction<{
      email: string;
      teamId: string;
      roleInTeam?: string | null;
    }>
  >;
  handleCreate: () => void;
}

const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
  open,
  onClose,
  teams,
  inviteForm,
  setInviteForm,
  handleCreate,
}) => {
  // If not open, do not render the modal at all
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="createInvitationModal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* The actual modal container */}
          <motion.div
            className="w-full max-w-md rounded bg-white p-6 shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Invitation</h2>
              <button onClick={onClose} aria-label="Close Modal">
                <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Modal Fields */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full rounded border px-3 py-1"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              {/* Team Dropdown */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Team
                </label>
                <select
                  className="w-full rounded border px-3 py-1"
                  value={inviteForm.teamId}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, teamId: e.target.value }))
                  }
                >
                  <option value="">-- Select Team --</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role in Team Field use teamRole enum */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role in Team
                </label>
                <select
                  className="w-full rounded border px-3 py-1"
                  // Replace `null | undefined` with an empty string:
                  value={inviteForm.roleInTeam ?? ''} 
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      roleInTeam: e.target.value || null,
                    }))
                  }
                >
                  <option value="">-- Select Role --</option>
                  {Object.values(TeamRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  Optional. If left blank, a default role may be assigned.
                </p>
              </div>
            </div>

            {/* Modal Footer (Buttons) */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded bg-gray-300 px-4 py-1.5 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="rounded bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateInvitationModal;
