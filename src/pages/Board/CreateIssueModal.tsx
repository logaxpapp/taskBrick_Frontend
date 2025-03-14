// File: src/pages/CreateIssueModal.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IssueType } from '../../api/issueType/issueTypeApi';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, issueTypeId: string) => void;
  issueTypes: IssueType[]; // real issue types
  columnId?: string | null;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  issueTypes,
  columnId,
}) => {
  const [title, setTitle] = useState('');
  const [issueTypeId, setIssueTypeId] = useState('');

  console.log('issueTypes', issueTypes);
  console.log('columnId', columnId);

  const handleSave = () => {
    if (!title.trim() || !issueTypeId) return;
    onCreate(title.trim(), issueTypeId);
    setTitle('');
    setIssueTypeId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div
              className="bg-white rounded shadow-lg w-full max-w-sm p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create Issue</h2>
                <button onClick={onClose}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-3">
                {columnId && (
                  <p className="text-xs text-gray-400">
                    Creating in Column: <strong>{columnId}</strong>
                  </p>
                )}
                <div>
                  <label className="block text-sm text-gray-600">Title</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Issue Type</label>
                  <select
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    value={issueTypeId}
                    onChange={(e) => setIssueTypeId(e.target.value)}
                  >
                    <option value="">-- Select Type --</option>
                    {issueTypes.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleSave}
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateIssueModal;
