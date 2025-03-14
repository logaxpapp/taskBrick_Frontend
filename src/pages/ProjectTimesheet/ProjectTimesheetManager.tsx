/*****************************************************************
 * File: src/components/ProjectTimesheet/ProjectTimesheetManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing
 *              project-level timesheets with an enhanced
 *              filter dropdown in the header.
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IProjectTimesheet,
  useListTimesheetsByProjectQuery,
  useCreateProjectTimesheetMutation,
  useUpdateProjectTimesheetMutation,
  useDeleteProjectTimesheetMutation,
  useGetTotalHoursForProjectQuery,
} from '../../api/timesheet/projectTimesheetApi';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaFilter,
} from 'react-icons/fa';

interface ProjectTimesheetManagerProps {
  selectedProjectId: string; // or null if none selected
}

/** Modal mode for create vs. edit */
type ModalMode = 'create' | 'edit';

/** Predefined date ranges for convenience. */
const PRESET_RANGES = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Custom Range', value: 'custom' },
];

const ProjectTimesheetManager: React.FC<ProjectTimesheetManagerProps> = ({
  selectedProjectId,
}) => {
  // -------------------------------------------------
  // Filter states
  // -------------------------------------------------
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [presetRange, setPresetRange] = useState<'all' | '7d' | '30d' | 'thisMonth' | 'custom'>('all');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  // -------------------------------------------------
  // Timesheet queries/mutations
  // -------------------------------------------------
  const {
    data: timesheets,
    refetch: refetchTimesheets,
    isLoading: loadingTimesheets,
  } = useListTimesheetsByProjectQuery(
    {
      projectId: selectedProjectId,
      startDate: filterStart || undefined,
      endDate: filterEnd || undefined,
    },
    { skip: !selectedProjectId }
  );

  const [createTimesheet, { isLoading: creating }] = useCreateProjectTimesheetMutation();
  const [updateTimesheet, { isLoading: updating }] = useUpdateProjectTimesheetMutation();
  const [deleteTimesheet, { isLoading: deleting }] = useDeleteProjectTimesheetMutation();

  // -------------------------------------------------
  // Aggregator: total hours
  // -------------------------------------------------
  const [aggStart, setAggStart] = useState('');
  const [aggEnd, setAggEnd] = useState('');
  const {
    data: totalHoursData,
    refetch: refetchTotalHours,
  } = useGetTotalHoursForProjectQuery(
    {
      projectId: selectedProjectId,
      startDate: aggStart || undefined,
      endDate: aggEnd || undefined,
    },
    { skip: !selectedProjectId }
  );

  // -------------------------------------------------
  // Modal states (create/edit)
  // -------------------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields for create/edit
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [description, setDescription] = useState('');

  // -------------------------------------------------
  // On project changes, refetch timesheets
  // -------------------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchTimesheets();
    }
  }, [selectedProjectId, refetchTimesheets]);

  // -------------------------------------------------
  // Helper: set date range based on preset
  // -------------------------------------------------
  useEffect(() => {
    const now = new Date();
    let start = '';
    let end = '';

    switch (presetRange) {
      case '7d':
        end = now.toISOString().slice(0, 10);
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        break;
      case '30d':
        end = now.toISOString().slice(0, 10);
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        break;
      case 'thisMonth': {
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        start = firstOfMonth.toISOString().slice(0, 10);
        end = now.toISOString().slice(0, 10);
        break;
      }
      case 'all':
        // Clear the filters
        start = '';
        end = '';
        break;
      case 'custom':
        // Let user set custom
        break;
      default:
        break;
    }
    if (presetRange !== 'custom') {
      setFilterStart(start);
      setFilterEnd(end);
      if (selectedProjectId) refetchTimesheets();
    }
  }, [presetRange, selectedProjectId, refetchTimesheets]);

  // -------------------------------------------------
  // Modal logic
  // -------------------------------------------------
  function openModalCreate() {
    setModalMode('create');
    resetFormFields();
    setShowModal(true);
  }

  function openModalEdit(t: IProjectTimesheet) {
    setModalMode('edit');
    setEditingId(t._id);

    // Pre-fill form
    setStartDate(t.startDate.slice(0, 10));
    setEndDate(t.endDate ? t.endDate.slice(0, 10) : '');
    setTotalHours(t.totalHours);
    setDescription(t.description || '');

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetFormFields();
    setEditingId(null);
  }

  function resetFormFields() {
    setStartDate('');
    setEndDate('');
    setTotalHours(0);
    setDescription('');
  }

  // -------------------------------------------------
  // CREATE
  // -------------------------------------------------
  async function handleCreateTimesheet() {
    if (!selectedProjectId || !startDate || totalHours <= 0) return;
    try {
      await createTimesheet({
        projectId: selectedProjectId,
        startDate,
        endDate: endDate || undefined,
        totalHours,
        description,
      }).unwrap();

      closeModal();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to create timesheet:', err);
    }
  }

  // -------------------------------------------------
  // UPDATE
  // -------------------------------------------------
  async function handleUpdateTimesheet() {
    if (!editingId || !startDate || totalHours <= 0) return;
    try {
      await updateTimesheet({
        id: editingId,
        updates: {
          startDate,
          endDate: endDate || undefined,
          totalHours,
          description,
        },
      }).unwrap();

      closeModal();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to update timesheet:', err);
    }
  }

  // -------------------------------------------------
  // DELETE
  // -------------------------------------------------
  async function handleDeleteTimesheet(id: string) {
    if (!window.confirm('Are you sure you want to delete this timesheet?')) return;
    try {
      await deleteTimesheet(id).unwrap();
      refetchTimesheets();
    } catch (err) {
      console.error('Failed to delete timesheet:', err);
    }
  }

  // -------------------------------------------------
  // Manual filter apply (only relevant if user picks "custom" range)
  // -------------------------------------------------
  function applyFilters() {
    if (presetRange === 'custom') {
      refetchTimesheets();
    }
  }

  // -------------------------------------------------
  // Aggregator
  // -------------------------------------------------
  function getTotalHours() {
    refetchTotalHours();
  }

  // -------------------------------------------------
  // Framer Motion variants
  // -------------------------------------------------
  const tableVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
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

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header with filter dropdown icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaClock size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Project Timesheet Manager</h2>
        </div>

        {/* Filter dropdown toggle */}
        <button
          onClick={() => setShowFilterDropdown((prev) => !prev)}
          className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
        >
          <FaFilter className="mr-1" />
          Filter
        </button>
      </div>

      {/* If no project selected */}
      {!selectedProjectId && (
        <p className="text-gray-600">Please select a project to manage timesheets.</p>
      )}

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
                <h4 className="text-md font-semibold">Timesheet Range Filter</h4>
                <div>
                  <label className="block mb-1 font-medium">Preset Range</label>
                  <select
                    value={presetRange}
                    onChange={(e) =>
                      setPresetRange(e.target.value as
                        | 'all'
                        | '7d'
                        | '30d'
                        | 'thisMonth'
                        | 'custom')
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRESET_RANGES.map((pr) => (
                      <option key={pr.value} value={pr.value}>
                        {pr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show date pickers only if "custom" is selected */}
                {presetRange === 'custom' && (
                  <>
                    <div>
                      <label className="block mb-1 font-medium">Start Date</label>
                      <input
                        type="date"
                        value={filterStart}
                        onChange={(e) => setFilterStart(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">End Date</label>
                      <input
                        type="date"
                        value={filterEnd}
                        onChange={(e) => setFilterEnd(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={applyFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Apply Custom Range
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button: create timesheet => open modal */}
          <div className="flex justify-end">
            <button
              onClick={openModalCreate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
            >
              <FaPlus className="mr-1" />
              Add Timesheet
            </button>
          </div>

          {/* Timesheet List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Timesheet Entries</h3>
            {loadingTimesheets && <p className="text-gray-600">Loading timesheets...</p>}
            {!loadingTimesheets && timesheets?.length === 0 && (
              <p className="text-gray-600">No timesheet entries found.</p>
            )}
          </div>

          <AnimatePresence>
            {!!timesheets?.length && (
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
                    <th className="px-4 py-2 font-semibold">Date Range</th>
                    <th className="px-4 py-2 font-semibold">Total Hours</th>
                    <th className="px-4 py-2 font-semibold">Description</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map((t) => (
                    <tr key={t._id} className="border-b last:border-none">
                      <td className="px-4 py-2 text-sm">
                        {t.startDate.slice(0, 10)}{' '}
                        {t.endDate ? ` ~ ${t.endDate.slice(0, 10)}` : ''}
                      </td>
                      <td className="px-4 py-2 text-sm">{t.totalHours}</td>
                      <td className="px-4 py-2 text-sm">
                        {t.description || <span className="text-gray-400">N/A</span>}
                      </td>
                      <td className="px-4 py-2 text-sm w-32 space-x-1">
                        <button
                          onClick={() => openModalEdit(t)}
                          className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTimesheet(t._id)}
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

          {/* Aggregator: total hours for date range */}
          <div className="bg-white border border-gray-200 rounded shadow p-4 space-y-4">
            <h4 className="text-md font-semibold">Total Hours (Aggregator)</h4>
            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                value={aggStart}
                onChange={(e) => setAggStart(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                value={aggEnd}
                onChange={(e) => setAggEnd(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={getTotalHours}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Total Hours
            </button>
            {totalHoursData && (
              <p className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mt-2 text-sm">
                <strong>Total Hours:</strong> {totalHoursData.totalHours}
              </p>
            )}
          </div>

          {/* Modal for create/edit timesheet */}
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
                  <h3 className="text-lg font-semibold mb-4">Create Timesheet</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Edit Timesheet</h3>
                )}

                <div className="space-y-4">
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
                  <div>
                    <label className="block mb-1 font-medium">Total Hours</label>
                    <input
                      type="number"
                      value={totalHours}
                      onChange={(e) => setTotalHours(Number(e.target.value))}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Description (optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => closeModal()}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded shadow hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  {modalMode === 'create' ? (
                    <button
                      onClick={handleCreateTimesheet}
                      disabled={!startDate || totalHours <= 0 || creating}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateTimesheet}
                      disabled={!startDate || totalHours <= 0 || updating}
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

export default ProjectTimesheetManager;
