// File: src/pages/Board/EditIssueModal.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useGetIssueQuery } from '../../api/issue/issueApi';

interface EditIssueModalProps {
  isOpen: boolean;
  issueId: string | null;
  onClose: () => void;

  // Callback to actually save updates
  onUpdate: (id: string, updates: Partial<{ title: string; description: string; priority: string }>) => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
};

const modal = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const EditIssueModal: React.FC<EditIssueModalProps> = ({ isOpen, issueId, onClose, onUpdate }) => {
  // We can fetch the issue details if we have an ID
  const { data: issue, isFetching, isError } = useGetIssueQuery(issueId ?? '', {
    skip: !issueId || !isOpen,
  });

  // local form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDesc(issue.description ?? '');
      setPriority(issue.priority ?? 'MEDIUM');
    }
  }, [issue]);

  const handleSave = () => {
    if (!issueId) return;
    onUpdate(issueId, {
      title: title.trim(),
      description: desc.trim(),
      priority,
    });
    onClose();
  };

  if (!isOpen || !issueId) return null;

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
              className="bg-white rounded shadow-lg w-full max-w-md p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {isFetching ? 'Loading...' : `Edit Issue: ${issue?.title}`}
                </h2>
                <button onClick={onClose}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {isError && <p className="text-sm text-red-500">Error loading issue data.</p>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700">Title</label>
                  <input
                    className="border w-full p-1 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Description</label>
                  <textarea
                    className="border w-full p-1 rounded text-sm"
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Priority</label>
                  <select
                    className="border w-full p-1 rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  onClick={handleSave}
                  disabled={isFetching}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditIssueModal;
