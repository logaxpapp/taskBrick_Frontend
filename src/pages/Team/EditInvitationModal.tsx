// File: src/pages/Invitation/EditInvitationModal.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation } from '../../api/invitation/invitationApi';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditInvitationModalProps {
  open: boolean;
  onClose: () => void;
  editData: Invitation | null;
  setEditData: React.Dispatch<React.SetStateAction<Invitation | null>>;
  handleSaveEdit: () => Promise<void>;
}

const EditInvitationModal: React.FC<EditInvitationModalProps> = ({
  open,
  onClose,
  editData,
  setEditData,
  handleSaveEdit,
}) => {
  if (!open || !editData) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="editInvitationModal"
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded shadow-lg p-6 w-full max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Invitation</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border px-3 py-1 rounded"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role in Team
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-1 rounded"
                  placeholder="e.g. Developer, Tester..."
                  value={editData.roleInTeam || ''}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, roleInTeam: e.target.value } : null
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border px-3 py-1 rounded"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, status: e.target.value as Invitation['status'] } : null
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditInvitationModal;
