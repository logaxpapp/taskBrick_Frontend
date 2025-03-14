/*****************************************************************
 * File: src/components/ProjectBudget/ProjectBudgetManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing project budgets
 *              with request/approval logic, now using icons.
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../app/store'; // Adjust path to your root state
import {
  useGetBudgetByProjectQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
  // Hooks for request/approval
  useRequestBudgetChangeMutation,
  useApproveBudgetChangeMutation,
  useRejectBudgetChangeMutation,
  IProjectBudget,
} from '../../api/projectBudget/projectBudgetApi';

// Example icon imports
import {
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaPlus,
  FaMoneyBillWave,
} from 'react-icons/fa';

interface ProjectBudgetManagerProps {
  selectedProjectId: string; // or null if none selected
}

const OWNER_ROLE = 'owner';

const ProjectBudgetManager: React.FC<ProjectBudgetManagerProps> = ({
  selectedProjectId,
}) => {
  // ----------------------------------------------
  // Grab the logged-in user from Redux
  // ----------------------------------------------
  const user = useSelector((state: RootState) => state.auth.user);

  // ----------------------------------------------
  // RTK Query Hooks
  // ----------------------------------------------
  const {
    data: existingBudget,
    refetch: refetchBudget,
    isLoading: loadingBudget,
  } = useGetBudgetByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });
  const [createBudget, { isLoading: creating }] = useCreateBudgetMutation();
  const [updateBudget, { isLoading: updating }] = useUpdateBudgetMutation();
  const [deleteBudget, { isLoading: deleting }] = useDeleteBudgetMutation();

  // NEW: request/approval
  const [requestBudgetChange, { isLoading: requesting }] = useRequestBudgetChangeMutation();
  const [approveBudgetChange, { isLoading: approving }] = useApproveBudgetChangeMutation();
  const [rejectBudgetChange, { isLoading: rejecting }] = useRejectBudgetChangeMutation();

  // ----------------------------------------------
  // Local form states (create/edit)
  // ----------------------------------------------
  const [allocatedBudget, setAllocatedBudget] = useState<number>(0);
  const [spentBudget, setSpentBudget] = useState<number>(0);
  const [forecastBudget, setForecastBudget] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');

  const [isEditing, setIsEditing] = useState(false);

  // For requesting budget changes
  const [changeAmount, setChangeAmount] = useState<number>(0);

  // ----------------------------------------------
  // Data fetching & sync
  // ----------------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchBudget();
    }
  }, [selectedProjectId, refetchBudget]);

  useEffect(() => {
    if (existingBudget) {
      setAllocatedBudget(existingBudget.allocatedBudget);
      setSpentBudget(existingBudget.spentBudget);
      setForecastBudget(existingBudget.forecastBudget);
      setCurrency(existingBudget.currency);
      setIsEditing(false);
    } else {
      setAllocatedBudget(0);
      setSpentBudget(0);
      setForecastBudget(0);
      setCurrency('USD');
      setIsEditing(false);
    }
  }, [existingBudget]);

  // ----------------------------------------------
  // CRUD Handlers
  // ----------------------------------------------
  async function handleCreateBudget() {
    if (!selectedProjectId) return;
    try {
      await createBudget({
        projectId: selectedProjectId,
        allocatedBudget,
        spentBudget,
        forecastBudget,
        currency,
      }).unwrap();
      refetchBudget();
    } catch (err) {
      console.error('Error creating budget:', err);
    }
  }

  async function handleUpdateBudget() {
    if (!existingBudget) return;
    try {
      await updateBudget({
        id: existingBudget._id,
        updates: {
          allocatedBudget,
          spentBudget,
          forecastBudget,
          currency,
        },
      }).unwrap();
      setIsEditing(false);
      refetchBudget();
    } catch (err) {
      console.error('Error updating budget:', err);
    }
  }

  async function handleDeleteBudget() {
    if (!existingBudget) return;
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      await deleteBudget(existingBudget._id).unwrap();
      setAllocatedBudget(0);
      setSpentBudget(0);
      setForecastBudget(0);
      setCurrency('USD');
      refetchBudget();
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  }

  // ----------------------------------------------
  // Request & Approval
  // ----------------------------------------------
  async function handleRequestChange() {
    if (!existingBudget || changeAmount === 0) return;
    try {
      await requestBudgetChange({
        id: existingBudget._id,
        changeAmount,
      }).unwrap();
      setChangeAmount(0);
      refetchBudget();
    } catch (err) {
      console.error('Error requesting budget change:', err);
    }
  }

  async function handleApproveChange() {
    if (!existingBudget) return;
    try {
      await approveBudgetChange({ id: existingBudget._id }).unwrap();
      refetchBudget();
    } catch (err) {
      console.error('Error approving budget change:', err);
    }
  }

  async function handleRejectChange() {
    if (!existingBudget) return;
    try {
      await rejectBudgetChange({ id: existingBudget._id }).unwrap();
      refetchBudget();
    } catch (err) {
      console.error('Error rejecting budget change:', err);
    }
  }

  // ----------------------------------------------
  // UI Helpers
  // ----------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  function formatNumber(num: number) {
    return num.toLocaleString();
  }

  // ----------------------------------------------
  // Render
  // ----------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center space-x-2">
        <FaMoneyBillWave size={24} />
        <h2 className="text-2xl font-bold">Project Budget Manager</h2>
      </div>

      {!selectedProjectId && (
        <p className="text-gray-600">Please select a project to manage its budget.</p>
      )}

      {selectedProjectId && (
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded shadow p-6 space-y-4"
        >
          {loadingBudget ? (
            <p className="text-gray-600">Loading budget...</p>
          ) : existingBudget ? (
            <>
              {/* ========================
                  EXISTING BUDGET VIEW
              ======================== */}
              <div className="flex items-center space-x-2 mb-2">
                <FaMoneyBillWave size={20} className="text-green-600" />
                <h4 className="text-lg font-semibold">Current Budget</h4>
              </div>

              {/* Display or Edit */}
              {!isEditing ? (
                /* ------------------------------------------------
                   DISPLAY MODE
                 ------------------------------------------------ */
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Allocated</p>
                      <p>
                        {formatNumber(existingBudget.allocatedBudget)}{' '}
                        {existingBudget.currency}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Spent</p>
                      <p>
                        {formatNumber(existingBudget.spentBudget)}{' '}
                        {existingBudget.currency}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">Forecast</p>
                      <p>
                        {formatNumber(existingBudget.forecastBudget)}{' '}
                        {existingBudget.currency}
                      </p>
                    </div>
                  </div>

                  {/* Approval/Request Panel */}
                  {typeof existingBudget.requestedChange === 'number' &&
                    existingBudget.approvalStatus && (
                      <div className="mt-4 p-3 border border-gray-200 rounded bg-gray-50 space-y-2">
                        <p className="text-sm">
                          <strong>Status:</strong> {existingBudget.approvalStatus}
                        </p>
                        <p className="text-sm">
                          <strong>Requested Change:</strong>{' '}
                          {existingBudget.requestedChange}
                        </p>
                        {existingBudget.approvalComment && (
                          <p className="text-sm">
                            <strong>Comment:</strong> {existingBudget.approvalComment}
                          </p>
                        )}

                        {/* If pending and user is 'owner', show Approve/Reject */}
                        {existingBudget.approvalStatus === 'Pending' &&
                          user?.role?.toLowerCase() === OWNER_ROLE && (
                            <div className="flex items-center space-x-2 pt-2">
                              <button
                                onClick={handleApproveChange}
                                disabled={approving}
                                className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                <FaCheck className="mr-1" />
                                {approving ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                onClick={handleRejectChange}
                                disabled={rejecting}
                                className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                <FaTimes className="mr-1" />
                                {rejecting ? 'Rejecting...' : 'Reject'}
                              </button>
                            </div>
                          )}
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <FaEdit size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteBudget}
                      disabled={deleting}
                      className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      <FaTrashAlt size={14} className="mr-1" />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  {/* If not pending, let user request more (any user or certain roles only) */}
                  {existingBudget.approvalStatus !== 'Pending' && (
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <FaPlus size={16} className="text-blue-600" />
                        <h5 className="font-semibold text-sm">Request More Budget</h5>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="border p-1 rounded w-24 text-sm focus:outline-none"
                          value={changeAmount}
                          onChange={(e) => setChangeAmount(Number(e.target.value))}
                          placeholder="e.g. 5000"
                        />
                        <button
                          onClick={handleRequestChange}
                          disabled={requesting || changeAmount === 0}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          <FaPlus className="mr-1" />
                          {requesting ? 'Requesting...' : 'Request'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ------------------------------------------------
                   EDIT MODE
                 ------------------------------------------------ */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Allocated Budget
                    </label>
                    <input
                      type="number"
                      value={allocatedBudget}
                      onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Spent Budget
                    </label>
                    <input
                      type="number"
                      value={spentBudget}
                      onChange={(e) => setSpentBudget(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Forecast Budget
                    </label>
                    <input
                      type="number"
                      value={forecastBudget}
                      onChange={(e) => setForecastBudget(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={handleUpdateBudget}
                      disabled={updating}
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400"
                    >
                      <FaTimes className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ========================
                  NO BUDGET => CREATE FORM
              ======================== */}
              <div className="flex items-center space-x-2 mb-2">
                <FaPlus size={18} className="text-blue-600" />
                <h4 className="text-lg font-semibold">Create Budget</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Allocated Budget
                  </label>
                  <input
                    type="number"
                    value={allocatedBudget}
                    onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Spent Budget
                  </label>
                  <input
                    type="number"
                    value={spentBudget}
                    onChange={(e) => setSpentBudget(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Forecast Budget
                  </label>
                  <input
                    type="number"
                    value={forecastBudget}
                    onChange={(e) => setForecastBudget(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <button
                  onClick={handleCreateBudget}
                  disabled={creating}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaCheck className="mr-1" />
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectBudgetManager;
