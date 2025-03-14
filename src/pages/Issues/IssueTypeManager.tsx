import React, { useEffect, useState } from 'react';
import {
  useListIssueTypesQuery,
  useCreateIssueTypeMutation,
  useUpdateIssueTypeMutation,
  useDeleteIssueTypeMutation,
  useGetIssueTypeQuery,
  IssueType,
} from '../../api/issueType/issueTypeApi';
import { useAppSelector } from '../../app/hooks/redux'; 
import { motion, AnimatePresence } from 'framer-motion';
import PreDashboard from '../auth/PreDashboard';

export interface IssueTypeManagerProps {
  projectId?: string;
}

/**
 * A simple page/component that demonstrates:
 *  - listing all Issue Types with animation
 *  - creating a new Issue Type with smooth transitions
 *  - fetching details for a single Issue Type (using a lazy query)
 *  - updating an Issue Type
 *  - deleting an Issue Type with a fade out effect
 */
const IssueTypeManager: React.FC<IssueTypeManagerProps> = ({ projectId }) => {
 
   const { selectedOrgId } = useAppSelector((state) => state.organization);

  const {
    data: issueTypes,
    refetch,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = useListIssueTypesQuery(selectedOrgId || '', {
    skip: !selectedOrgId,
  });

  const [createIssueType, { isLoading: isCreateLoading }] = useCreateIssueTypeMutation();
  const [updateIssueType, { isLoading: isUpdateLoading }] = useUpdateIssueTypeMutation();
  const [deleteIssueType, { isLoading: isDeleteLoading }] = useDeleteIssueTypeMutation();

  const [itemId, setItemId] = useState<string | null>(null);
  const { data: issueTypeDetails, isFetching: isDetailLoading } = useGetIssueTypeQuery(itemId!, {
    skip: !itemId,
  });

  // Local state for creating a new type
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIconUrl, setNewIconUrl] = useState('');

  // Local state for editing
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editIconUrl, setEditIconUrl] = useState('');

  const handleCreate = async () => {
    if (!selectedOrgId) return alert('No organization selected');
    if (!newName.trim()) return alert('Please enter a name');

    try {
      await createIssueType({
        organizationId: selectedOrgId,
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        iconUrl: newIconUrl.trim() || undefined,
      }).unwrap();

      setNewName('');
      setNewDesc('');
      setNewIconUrl('');
      refetch();
      alert('IssueType created!');
    } catch (error: any) {
      alert(`Error creating issue type: ${error.data?.error || error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this issue type?')) return;
    try {
      await deleteIssueType(id).unwrap();
      refetch();
    } catch (error: any) {
      alert(`Error deleting: ${error.data?.error || error.message}`);
    }
  };

  const handleViewDetails = (id: string) => {
    setItemId(id);
  };

  const startEditing = (it: IssueType) => {
    setEditId(it._id);
    setEditName(it.name);
    setEditDesc(it.description || '');
    setEditIconUrl(it.iconUrl || '');
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await updateIssueType({
        id: editId,
        updates: {
          name: editName.trim(),
          description: editDesc.trim() || undefined,
          iconUrl: editIconUrl.trim() || undefined,
        },
      }).unwrap();

      setEditId(null);
      setEditName('');
      setEditDesc('');
      setEditIconUrl('');
      refetch();
      alert('IssueType updated!');
    } catch (error: any) {
      alert(`Error updating: ${error.data?.error || error.message}`);
    }
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditName('');
    setEditDesc('');
    setEditIconUrl('');
  };

  if (!selectedOrgId) {
    return (
      <div className="p-4 text-red-500">
       <PreDashboard />
      </div>
    );
  }

  if (isListLoading) {
    return <div className="p-4">Loading Issue Types...</div>;
  }
  if (isListError) {
    return (
      <div className="p-4 text-red-500">
        Error loading issue types: {String(listError)}
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-bold mb-2">Issue Type Manager</h2>

      {/* CREATE FORM */}
      <motion.div
        className="border p-3 mb-4 rounded shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="font-semibold mb-2">Create New Issue Type</h3>
        <div className="flex flex-col space-y-2 max-w-sm">
          <input
            className="border p-1 rounded"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <input
            className="border p-1 rounded"
            placeholder="Icon URL"
            value={newIconUrl}
            onChange={(e) => setNewIconUrl(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2 self-start"
            onClick={handleCreate}
            disabled={isCreateLoading}
          >
            {isCreateLoading ? 'Creating...' : 'Create'}
          </motion.button>
        </div>
      </motion.div>

      {/* LIST OF ISSUE TYPES */}
      {!issueTypes || issueTypes.length === 0 ? (
        <p>No issue types found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          <AnimatePresence>
            {issueTypes.map((it) => (
              <motion.li
                key={it._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="p-2 flex items-center justify-between gap-2"
              >
                {editId === it._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      className="border p-1 rounded w-full"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="border p-1 rounded w-full"
                      placeholder="Description"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                    <input
                      className="border p-1 rounded w-full"
                      placeholder="Icon URL"
                      value={editIconUrl}
                      onChange={(e) => setEditIconUrl(e.target.value)}
                    />
                    <div className="mt-1 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={handleUpdate}
                        disabled={isUpdateLoading}
                      >
                        {isUpdateLoading ? 'Saving...' : 'Save'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border px-3 py-1 rounded"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 border p-2 rounded bg-gray-50">
                      <p className="font-medium ">{it.name}</p>
                      <p className="text-xs text-gray-600">
                        {it.description || '(No description)'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-blue-600 underline"
                        onClick={() => handleViewDetails(it._id)}
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-green-600 underline"
                        onClick={() => startEditing(it)}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-red-600 underline"
                        onClick={() => handleDelete(it._id)}
                        disabled={isDeleteLoading}
                      >
                        {isDeleteLoading ? 'Deleting...' : 'Delete'}
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* SHOW DETAILS */}
      <AnimatePresence>
        {issueTypeDetails && (
          <motion.div
            className="mt-4 p-3 border rounded bg-gray-50 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold">Issue Type Details:</h4>
            {isDetailLoading ? (
              <p>Loading details...</p>
            ) : (
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(issueTypeDetails, null, 2)}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IssueTypeManager;
