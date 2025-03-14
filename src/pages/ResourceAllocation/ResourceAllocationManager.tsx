// File: src/components/ResourceAllocationManager.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useListAllocationsByProjectQuery,
  useCreateAllocationMutation,
  useUpdateAllocationMutation,
  useDeleteAllocationMutation,
  useGetTotalAllocationQuery,
  IResourceAllocation,
} from '../../api/resourceAllocation/resourceAllocationApi';

/** Modal State */
type ModalMode = 'create' | 'edit';

interface ResourceAllocationManagerProps {
  selectedProjectId: string; // or null if none selected
}

const ResourceAllocationManager: React.FC<ResourceAllocationManagerProps> = ({
  selectedProjectId,
}) => {
  const {
    data: allocations,
    refetch: refetchAllocations,
    isLoading: loadingAllocations,
  } = useListAllocationsByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createAllocation, { isLoading: creating }] = useCreateAllocationMutation();
  const [updateAllocation, { isLoading: updating }] = useUpdateAllocationMutation();
  const [deleteAllocation, { isLoading: deleting }] = useDeleteAllocationMutation();

  // Aggregator
  const { data: totalAllocationData, refetch: refetchTotalAllocation } =
    useGetTotalAllocationQuery(selectedProjectId, {
      skip: !selectedProjectId,
    });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [resourceName, setResourceName] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState(0);
  const [role, setRole] = useState('Developer');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedProjectId) {
      refetchAllocations();
      refetchTotalAllocation();
    }
  }, [selectedProjectId, refetchAllocations, refetchTotalAllocation]);

  function openModalCreate() {
    setModalMode('create');
    resetFormFields();
    setShowModal(true);
  }

  function openModalEdit(allocation: IResourceAllocation) {
    setModalMode('edit');
    setEditingId(allocation._id);
    setResourceName(allocation.resourceName);
    setAllocationPercentage(allocation.allocationPercentage);
    setRole(allocation.role || 'Developer');
    setStartDate(allocation.startDate.slice(0, 10));
    setEndDate(allocation.endDate ? allocation.endDate.slice(0, 10) : '');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetFormFields();
    setEditingId(null);
  }

  function resetFormFields() {
    setResourceName('');
    setAllocationPercentage(0);
    setRole('Developer');
    setStartDate('');
    setEndDate('');
  }

  async function handleCreateAllocation() {
    if (!selectedProjectId || !resourceName.trim() || !startDate) return;
    try {
      await createAllocation({
        projectId: selectedProjectId,
        resourceName,
        allocationPercentage,
        role,
        startDate,
        endDate: endDate || null,
      }).unwrap();

      closeModal();
      refetchAllocations();
      refetchTotalAllocation();
    } catch (err) {
      console.error('Failed to create allocation:', err);
    }
  }

  async function handleUpdateAllocation() {
    if (!editingId || !resourceName.trim() || !startDate) return;
    try {
      await updateAllocation({
        id: editingId,
        updates: {
          resourceName,
          allocationPercentage,
          role,
          startDate,
          endDate: endDate || null,
        },
      }).unwrap();

      closeModal();
      refetchAllocations();
      refetchTotalAllocation();
    } catch (err) {
      console.error('Failed to update allocation:', err);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this allocation?')) return;
    try {
      await deleteAllocation(id).unwrap();
      refetchAllocations();
      refetchTotalAllocation();
    } catch (err) {
      console.error('Failed to delete allocation:', err);
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resource Allocation Manager</h2>
        {!selectedProjectId && (
          <p className="text-gray-600 text-sm">
            Please select a project to manage resource allocations.
          </p>
        )}
      </div>

      {selectedProjectId && (
        <>
          <button
            onClick={openModalCreate}
            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
          >
            + Add Resource
          </button>

          {totalAllocationData && (
            <div className="bg-blue-50 border border-blue-300 rounded p-4 space-y-2">
              <h4 className="text-md font-semibold">Total Resource Allocation</h4>
              <p>
                <span className="font-mono bg-gray-100 px-1 rounded">
                  {totalAllocationData.projectId}
                </span>{' '}
                - {totalAllocationData.totalAllocationPercentage}% allocated
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Allocations for Project</h3>
            {loadingAllocations && <p>Loading resource allocations...</p>}
            {!loadingAllocations && allocations?.length === 0 && (
              <p className="text-gray-600">No allocations found for this project.</p>
            )}

            <AnimatePresence>
              {!!allocations?.length && (
                <motion.table
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                  className="min-w-full bg-white rounded shadow border border-gray-200"
                >
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2 font-semibold">Resource Name</th>
                      <th className="px-4 py-2 font-semibold">Role</th>
                      <th className="px-4 py-2 font-semibold">Allocation (%)</th>
                      <th className="px-4 py-2 font-semibold">Start / End</th>
                      <th className="px-4 py-2 font-semibold w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations?.map((alloc) => (
                      <tr key={alloc._id} className="border-b last:border-none">
                        <td className="px-4 py-2">{alloc.resourceName}</td>
                        <td className="px-4 py-2">{alloc.role}</td>
                        <td className="px-4 py-2">{alloc.allocationPercentage}%</td>
                        <td className="px-4 py-2">
                          {alloc.startDate.slice(0, 10)}{' '}
                          {alloc.endDate ? ` ~ ${alloc.endDate.slice(0, 10)}` : ''}
                        </td>
                        <td className="px-4 py-2 space-x-1">
                          <button
                            onClick={() => openModalEdit(alloc)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(alloc._id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none disabled:opacity-50"
                            disabled={deleting}
                          >
                            {deleting ? '...' : 'Del'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              )}
            </AnimatePresence>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
                layout
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>

                {modalMode === 'create' ? (
                  <h3 className="text-lg font-semibold mb-4">Create New Allocation</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Edit Allocation</h3>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Resource Name</label>
                    <input
                      type="text"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Allocation (%)</label>
                    <input
                      type="number"
                      value={allocationPercentage}
                      onChange={(e) => setAllocationPercentage(Number(e.target.value))}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">End Date (optional)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  {modalMode === 'create' ? (
                    <button
                      onClick={handleCreateAllocation}
                      disabled={!resourceName.trim() || !startDate || creating}
                      className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateAllocation}
                      disabled={!resourceName.trim() || !startDate || updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
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

export default ResourceAllocationManager;
