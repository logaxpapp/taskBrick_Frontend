/*****************************************************************
 * File: src/components/Timesheet/TimesheetManager.tsx
 * Description: A slick Tailwind + Framer Motion UI for
 *              managing timesheets, featuring:
 *                - Filter dropdown in header
 *                - "Log Time" create modal
 *                - Edit modal
 *                - Aggregator card
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  useListTimesheetsByProjectQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
  useGetTotalHoursByUserQuery,
  ITimesheet,
} from '../../api/timesheet/timesheetApi';
import {
  FaClock,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';

// Example user list for filtering. Adjust or fetch from an API
const mockUsers = [
  { _id: 'all', name: 'All Users' },
  { _id: 'user1', name: 'Alice Johnson' },
  { _id: 'user2', name: 'Bob Smith' },
];

interface TimesheetManagerProps {
  selectedProjectId: string; // or null if none
  currentUserId?: string;    // if you only allow logging for the current user
}

type ModalMode = 'create' | 'edit';

const TimesheetManager: React.FC<TimesheetManagerProps> = ({
  selectedProjectId,
  currentUserId,
}) => {
  // Grab user from Redux
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const { firstName, lastName } = loggedInUser || {};

  // ----------------------------------------------
  // Filter dropdown states
  // ----------------------------------------------
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // We track user selection in a dropdown: 'all' means "All Users"
  const [filterUserId, setFilterUserId] = useState(currentUserId || 'all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Because "all" is not a real userId, we do a transform:
  const userIdForQuery = filterUserId === 'all' ? undefined : filterUserId;

  // ----------------------------------------------
  // Timesheet Query
  // ----------------------------------------------
  const {
    data: timesheets,
    refetch: refetchTimesheets,
    isLoading: loadingTimesheets,
  } = useListTimesheetsByProjectQuery(
    {
      projectId: selectedProjectId,
      userId: userIdForQuery,
      startDate: filterStartDate || undefined,
      endDate: filterEndDate || undefined,
    },
    { skip: !selectedProjectId }
  );

  // ----------------------------------------------
  // Mutations
  // ----------------------------------------------
  const [createTimesheet, { isLoading: creating }] = useCreateTimesheetMutation();
  const [updateTimesheet, { isLoading: updating }] = useUpdateTimesheetMutation();
  const [deleteTimesheet, { isLoading: deleting }] = useDeleteTimesheetMutation();

  // ----------------------------------------------
  // Aggregator
  // ----------------------------------------------
  const [aggUserId, setAggUserId] = useState(currentUserId || '');
  const [aggStartDate, setAggStartDate] = useState('');
  const [aggEndDate, setAggEndDate] = useState('');
  const {
    data: totalHoursData,
    refetch: refetchTotalHours,
  } = useGetTotalHoursByUserQuery(
    {
      projectId: selectedProjectId,
      userId: aggUserId,
      startDate: aggStartDate || undefined,
      endDate: aggEndDate || undefined,
    },
    { skip: !selectedProjectId || !aggUserId }
  );

  // ----------------------------------------------
  // Create Modal States
  // ----------------------------------------------
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserId, setCreateUserId] = useState(currentUserId || '');
  const [createDate, setCreateDate] = useState('');
  const [createHours, setCreateHours] = useState<number>(0);
  const [createDescription, setCreateDescription] = useState('');

  // ----------------------------------------------
  // Edit Modal States
  // ----------------------------------------------
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTimesheet, setEditTimesheet] = useState<ITimesheet | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editHours, setEditHours] = useState<number>(0);
  const [editDescription, setEditDescription] = useState('');

  // ----------------------------------------------
  // Project changes => refetch
  // ----------------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchTimesheets();
    }
  }, [selectedProjectId, refetchTimesheets]);

  // ----------------------------------------------
  // Filter or aggregator triggers
  // ----------------------------------------------
  function applyFilters() {
    refetchTimesheets();
  }
  function getTotalHours() {
    refetchTotalHours();
  }

  // ----------------------------------------------
  // Create Modal
  // ----------------------------------------------
  function openCreateModal() {
    setCreateUserId(currentUserId || ''); // or keep 'all' if needed
    setCreateDate('');
    setCreateHours(0);
    setCreateDescription('');
    setShowCreateModal(true);
  }
  function closeCreateModal() {
    setShowCreateModal(false);
  }
  async function handleCreateSubmit() {
    if (!selectedProjectId || !createUserId || !createDate || createHours <= 0) return;
    try {
      await createTimesheet({
        projectId: selectedProjectId,
        userId: createUserId,
        date: createDate,
        hoursSpent: createHours,
        description: createDescription,
      }).unwrap();

      closeCreateModal();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to create timesheet:', err);
    }
  }

  // ----------------------------------------------
  // Edit Modal
  // ----------------------------------------------
  function openEditModal(ts: ITimesheet) {
    setEditTimesheet(ts);
    setEditDate(ts.date.slice(0, 10));
    setEditHours(ts.hoursSpent);
    setEditDescription(ts.description || '');
    setShowEditModal(true);
  }
  function closeEditModal() {
    setShowEditModal(false);
    setEditTimesheet(null);
    setEditDate('');
    setEditHours(0);
    setEditDescription('');
  }
  async function handleEditSubmit() {
    if (!editTimesheet || !editDate || editHours <= 0) return;
    try {
      await updateTimesheet({
        id: editTimesheet._id,
        updates: {
          date: editDate,
          hoursSpent: editHours,
          description: editDescription,
        },
      }).unwrap();

      closeEditModal();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to update timesheet:', err);
    }
  }

  // ----------------------------------------------
  // Delete
  // ----------------------------------------------
  async function handleDeleteTimesheet(id: string) {
    if (!window.confirm('Are you sure you want to delete this timesheet entry?')) return;
    try {
      await deleteTimesheet(id).unwrap();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to delete timesheet:', err);
    }
  }

  // ----------------------------------------------
  // Framer Motion variants
  // ----------------------------------------------
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const dropdownVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
    exit: { height: 0, opacity: 0, transition: { type: 'tween' } },
  };

  // ----------------------------------------------
  // Render
  // ----------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header row: Title + Filter button + user info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaClock size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Timesheet Manager</h2>
        </div>
        <div className="text-right space-y-1">
          {(firstName || lastName) && (
            <p className="text-sm text-gray-500">
              Logged in as: <strong>{firstName} {lastName}</strong>
            </p>
          )}
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
          >
            <FaFilter className="mr-1" />
            Filter
          </button>
        </div>
      </div>

      {/* No project selected? */}
      {!selectedProjectId && (
        <p className="text-gray-600">Please select a project to manage timesheets.</p>
      )}

      {/* If a project is selected, show everything else */}
      {selectedProjectId && (
        <>
          {/* Filter dropdown content */}
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white border border-gray-200 rounded shadow p-4 space-y-4"
              >
                <h4 className="text-md font-semibold mb-2">Filter Timesheets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* User Filter: user dropdown */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">User</label>
                    <select
                      value={filterUserId}
                      onChange={(e) => setFilterUserId(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {mockUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Start Date */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* End Date */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Apply Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={applyFilters}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Log Time" button - to open create modal */}
          <div className="flex justify-end">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
            >
              <FaPlus className="mr-1" />
              Log Time
            </button>
          </div>

          {/* Timesheet Table */}
          <div className="bg-white border border-gray-200 rounded shadow p-4 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Timesheet Entries</h3>
            {loadingTimesheets && <p className="text-gray-600">Loading timesheets...</p>}
            {!loadingTimesheets && timesheets?.length === 0 && (
              <p className="text-gray-600">No timesheet entries found.</p>
            )}

            {!!timesheets?.length && (
              <div className="overflow-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 font-semibold">User</th>
                      <th className="px-4 py-2 font-semibold">Date</th>
                      <th className="px-4 py-2 font-semibold">Hours</th>
                      <th className="px-4 py-2 font-semibold">Description</th>
                      <th className="px-4 py-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {timesheets.map((t) => (
                        <motion.tr
                          key={t._id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="border-b last:border-none"
                        >
                          <td className="px-4 py-2">
                            <FaUserCircle className="inline-block mr-1 text-gray-500" />
                            {t.userId}
                          </td>
                          <td className="px-4 py-2">{t.date.slice(0, 10)}</td>
                          <td className="px-4 py-2">{t.hoursSpent}</td>
                          <td className="px-4 py-2">{t.description || 'N/A'}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              onClick={() => openEditModal(t)}
                              className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimesheet(t._id)}
                              disabled={deleting}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              <FaTrashAlt size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white p-6 rounded shadow max-w-md w-full space-y-4 relative"
              >
                <button
                  onClick={closeCreateModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
                <h3 className="text-lg font-semibold">Log New Timesheet</h3>
                {/* If only the current user can log, disable user ID input */}
                <div>
                  <label className="block mb-1 font-medium">User ID</label>
                  <input
                    type="text"
                    value={createUserId}
                    onChange={(e) => setCreateUserId(e.target.value)}
                    disabled={!!currentUserId}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Hours Spent</label>
                  <input
                    type="number"
                    value={createHours}
                    onChange={(e) => setCreateHours(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={closeCreateModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSubmit}
                    disabled={!createUserId || !createDate || createHours <= 0 || creating}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Submit'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editTimesheet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white p-6 rounded shadow max-w-md w-full space-y-4 relative"
              >
                <button
                  onClick={closeEditModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
                <h3 className="text-lg font-semibold">Edit Timesheet</h3>
                <div>
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Hours Spent</label>
                  <input
                    type="number"
                    value={editHours}
                    onChange={(e) => setEditHours(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Submit'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Aggregator: total hours card */}
          <div className="bg-white border border-gray-200 rounded shadow p-4 space-y-4">
            <h4 className="text-lg font-semibold">User Hours Aggregator</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">User ID</label>
                <input
                  type="text"
                  value={aggUserId}
                  onChange={(e) => setAggUserId(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., user1"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  value={aggStartDate}
                  onChange={(e) => setAggStartDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  value={aggEndDate}
                  onChange={(e) => setAggEndDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <button
              onClick={getTotalHours}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Get Total Hours
            </button>
            {totalHoursData && (
              <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mt-2">
                <strong>Total Hours:</strong> {totalHoursData.totalHours}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TimesheetManager;
