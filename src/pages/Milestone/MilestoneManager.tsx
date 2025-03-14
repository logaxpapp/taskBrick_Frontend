/*****************************************************************
 * File: src/components/Milestone/MilestoneManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing Milestones
 *              using a modal for create/edit, a table for listing,
 *              and a card for progress aggregation.
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useListMilestonesForProjectQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetMilestoneProgressQuery,
  IMilestone,
} from '../../api/milestone/milestoneApi';

// Example icons from react-icons
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaCalendarCheck,
} from 'react-icons/fa';

interface MilestoneManagerProps {
  selectedProjectId: string; // or null if none selected
}

/** Modal mode for create or edit */
type ModalMode = 'create' | 'edit';

const MilestoneManager: React.FC<MilestoneManagerProps> = ({ selectedProjectId }) => {
  // --------------------------------------
  // RTK Query Hooks
  // --------------------------------------
  const {
    data: milestones,
    refetch: refetchMilestones,
    isLoading: loadingMilestones,
  } = useListMilestonesForProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createMilestone, { isLoading: creating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: updating }] = useUpdateMilestoneMutation();
  const [deleteMilestone, { isLoading: deleting }] = useDeleteMilestoneMutation();

  // Milestone progress aggregator
  const {
    data: progressData,
    refetch: refetchProgress,
  } = useGetMilestoneProgressQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  // --------------------------------------
  // Modal states
  // --------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // --------------------------------------
  // Form fields for create/edit
  // --------------------------------------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<
    'Not Started' | 'In Progress' | 'Completed' | 'Delayed'
  >('Not Started');

  // --------------------------------------
  // Effects
  // --------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchMilestones();
      refetchProgress();
    }
  }, [selectedProjectId, refetchMilestones, refetchProgress]);

  // --------------------------------------
  // Modal logic
  // --------------------------------------
  function openModalCreate() {
    setModalMode('create');
    resetFormFields();
    setShowModal(true);
  }

  function openModalEdit(milestone: IMilestone) {
    setModalMode('edit');
    setEditingId(milestone._id);
    setTitle(milestone.title);
    setDescription(milestone.description || '');
    setDueDate(milestone.dueDate.slice(0, 10));
    setStatus(milestone.status);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetFormFields();
    setEditingId(null);
  }

  function resetFormFields() {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('Not Started');
  }

  // --------------------------------------
  // CREATE
  // --------------------------------------
  async function handleCreateMilestone() {
    if (!selectedProjectId || !title.trim() || !dueDate) return;
    try {
      await createMilestone({
        projectId: selectedProjectId,
        title,
        description,
        dueDate,
        status,
      }).unwrap();

      closeModal();
      refetchMilestones();
      refetchProgress();
    } catch (err) {
      console.error('Error creating milestone:', err);
    }
  }

  // --------------------------------------
  // UPDATE
  // --------------------------------------
  async function handleUpdateMilestone() {
    if (!editingId || !title.trim() || !dueDate) return;
    try {
      await updateMilestone({
        id: editingId,
        updates: {
          title,
          description,
          dueDate,
          status,
        },
      }).unwrap();
      closeModal();
      refetchMilestones();
      refetchProgress();
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  }

  // --------------------------------------
  // DELETE
  // --------------------------------------
  async function handleDeleteMilestone(id: string) {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await deleteMilestone(id).unwrap();
      refetchMilestones();
      refetchProgress();
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  }

  // --------------------------------------
  // Motion Variants
  // --------------------------------------
  const tableVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // --------------------------------------
  // Render
  // --------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center space-x-2">
        <FaCalendarCheck size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold">Milestone Manager</h2>
      </div>

      {!selectedProjectId && (
        <p className="text-gray-600">Please select a project to manage milestones.</p>
      )}

      {selectedProjectId && (
        <>
          {/* Button: Add Milestone => open create modal */}
          <div className="flex justify-end">
            <button
              onClick={openModalCreate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
            >
              <FaPlus className="mr-1" />
              Add Milestone
            </button>
          </div>

          {/* Progress Card */}
          {progressData && (
            <div className="bg-blue-50 border border-blue-200 rounded shadow p-4">
              <h4 className="text-md font-semibold mb-2">Project Milestone Progress</h4>
              <p>
                <span className="font-medium">Total Milestones:</span>{' '}
                {progressData.totalMilestones}
              </p>
              <p>
                <span className="font-medium">Completed:</span>{' '}
                {progressData.completedMilestones}
              </p>
              <p>
                <span className="font-medium">Completion %:</span>{' '}
                {progressData.completionPercentage.toFixed(2)}%
              </p>
            </div>
          )}

          {/* Milestones List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Existing Milestones</h3>
            {loadingMilestones && <p>Loading milestones...</p>}
            {!loadingMilestones && milestones?.length === 0 && (
              <p className="text-gray-600">No milestones found for this project.</p>
            )}
          </div>

          <AnimatePresence>
            {!!milestones?.length && (
              <motion.table
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tableVariants}
                className="min-w-full bg-white border border-gray-200 rounded shadow"
              >
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Title</th>
                    <th className="px-4 py-2 font-semibold">Due Date</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones?.map((m) => (
                    <tr key={m._id} className="border-b last:border-none">
                      <td className="px-4 py-2 text-sm">
                        {m.title}
                        {m.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {m.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{m.dueDate.slice(0, 10)}</td>
                      <td className="px-4 py-2 text-sm">{m.status}</td>
                      <td className="px-4 py-2 text-sm w-32 space-x-1">
                        <button
                          onClick={() => openModalEdit(m)}
                          className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(m._id)}
                          disabled={deleting}
                          className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 focus:outline-none"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            )}
          </AnimatePresence>

          {/* Modal for create/edit */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                layout
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
              >
                {/* Close button */}
                <button
                  onClick={() => closeModal()}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>

                {modalMode === 'create' ? (
                  <h3 className="text-lg font-semibold mb-4">Create Milestone</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Edit Milestone</h3>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => closeModal()}
                    className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  {modalMode === 'create' ? (
                    <button
                      onClick={handleCreateMilestone}
                      disabled={!title.trim() || !dueDate || creating}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateMilestone}
                      disabled={!title.trim() || !dueDate || updating}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {updating ? 'Updating...' : 'Save'}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MilestoneManager;
