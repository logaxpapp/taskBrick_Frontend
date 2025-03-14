// File: src/pages/ManageIssueTypesModal.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  useListIssueTypesQuery,
  useCreateIssueTypeMutation,
  useDeleteIssueTypeMutation,
  IssueType,
} from '../../api/issueType/issueTypeApi';
import { useOrgContext } from '../../contexts/OrgContext';

interface ManageIssueTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageIssueTypesModal: React.FC<ManageIssueTypesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedOrgId } = useOrgContext();

  const { data: issueTypes, refetch } = useListIssueTypesQuery(selectedOrgId || '', {
    skip: !selectedOrgId,
  });
  const [createIssueType] = useCreateIssueTypeMutation();
  const [deleteIssueType] = useDeleteIssueTypeMutation();

  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    if (isOpen && selectedOrgId) {
      refetch();
    }
  }, [isOpen, selectedOrgId, refetch]);

  const handleCreate = async () => {
    if (!selectedOrgId || !name.trim()) return;
    try {
      await createIssueType({
        organizationId: selectedOrgId,
        name: name.trim(),
        iconUrl: iconUrl.trim() || undefined,
      }).unwrap();
      setName('');
      setIconUrl('');
      refetch();
    } catch (err: any) {
      alert(`Error creating issue type: ${err.data?.error || err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this issue type?')) return;
    try {
      await deleteIssueType(id).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error deleting issue type: ${err.data?.error || err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div
              className="bg-white rounded w-full max-w-md p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Manage Issue Types</h2>
                <button onClick={onClose}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {!issueTypes || issueTypes.length === 0 ? (
                <p className="text-sm text-gray-500 mb-2">No issue types found.</p>
              ) : (
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded mb-3">
                  {issueTypes.map((t) => (
                    <li
                      key={t._id}
                      className="px-3 py-2 flex items-center justify-between"
                    >
                      <div className="text-sm text-gray-700">
                        {t.name}
                        {t.iconUrl && (
                          <img
                            src={t.iconUrl}
                            alt="icon"
                            className="inline-block w-4 h-4 ml-1 align-middle"
                          />
                        )}
                      </div>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-2 mb-4">
                <div>
                  <label className="block text-sm text-gray-600">Name</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Icon URL</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    placeholder="Optional icon URL"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                  />
                </div>
                <button
                  className="mt-1 px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleCreate}
                >
                  Add Type
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ManageIssueTypesModal;
