/*****************************************************************
 * File: src/components/managers/StatusReportManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing
 *              Status Reports (uses a modal for create/edit).
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useListStatusReportsByProjectQuery,
  useCreateStatusReportMutation,
  useUpdateStatusReportMutation,
  useDeleteStatusReportMutation,
  IStatusReport,
} from '../../api/statusReport/statusReportApi';

// Icon imports
import { FaPlus, FaEdit, FaTrashAlt, FaCheck, FaTimes, FaRegCalendarAlt } from 'react-icons/fa';

interface StatusReportManagerProps {
  selectedProjectId: string; // or null if none selected
}

/** Modal mode: 'create' or 'edit' */
type ModalMode = 'create' | 'edit';

const StatusReportManager: React.FC<StatusReportManagerProps> = ({
  selectedProjectId,
}) => {
  // --------------------------------------------
  // RTK Query: fetch status reports
  // --------------------------------------------
  const {
    data: reports,
    refetch: refetchReports,
    isLoading: loadingReports,
  } = useListStatusReportsByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createReport, { isLoading: creating }] = useCreateStatusReportMutation();
  const [updateReport, { isLoading: updating }] = useUpdateStatusReportMutation();
  const [deleteReport, { isLoading: deleting }] = useDeleteStatusReportMutation();

  // --------------------------------------------
  // Modal state
  // --------------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // --------------------------------------------
  // Form fields for create/edit
  // --------------------------------------------
  const [reportDate, setReportDate] = useState('');
  const [progressSummary, setProgressSummary] = useState('');
  const [risks, setRisks] = useState('');
  const [issues, setIssues] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  // --------------------------------------------
  // Effects
  // --------------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchReports();
    }
  }, [selectedProjectId, refetchReports]);

  // --------------------------------------------
  // Modal logic
  // --------------------------------------------
  function openModalCreate() {
    setModalMode('create');
    resetFormFields();
    setShowModal(true);
  }

  function openModalEdit(report: IStatusReport) {
    setModalMode('edit');
    setEditingId(report._id);

    // Pre-fill form fields
    setReportDate(report.reportDate.slice(0, 10));
    setProgressSummary(report.progressSummary);
    setRisks(report.risks);
    setIssues(report.issues);
    setNextSteps(report.nextSteps);

    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetFormFields();
    setEditingId(null);
  }

  function resetFormFields() {
    setReportDate('');
    setProgressSummary('');
    setRisks('');
    setIssues('');
    setNextSteps('');
  }

  // --------------------------------------------
  // CREATE
  // --------------------------------------------
  async function handleCreateReport() {
    if (!selectedProjectId || !reportDate) return;
    try {
      await createReport({
        projectId: selectedProjectId,
        reportDate,
        progressSummary,
        risks,
        issues,
        nextSteps,
      }).unwrap();

      closeModal();
      refetchReports();
    } catch (err) {
      console.error('Failed to create status report:', err);
    }
  }

  // --------------------------------------------
  // UPDATE
  // --------------------------------------------
  async function handleUpdateReport() {
    if (!editingId || !reportDate) return;
    try {
      await updateReport({
        id: editingId,
        updates: {
          reportDate,
          progressSummary,
          risks,
          issues,
          nextSteps,
        },
      }).unwrap();

      closeModal();
      refetchReports();
    } catch (err) {
      console.error('Failed to update status report:', err);
    }
  }

  // --------------------------------------------
  // DELETE
  // --------------------------------------------
  async function handleDeleteReport(id: string) {
    if (!window.confirm('Are you sure you want to delete this status report?')) return;
    try {
      await deleteReport(id).unwrap();
      refetchReports();
    } catch (err) {
      console.error('Failed to delete status report:', err);
    }
  }

  // --------------------------------------------
  // Framer Motion
  // --------------------------------------------
  const tableVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // --------------------------------------------
  // Render
  // --------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center space-x-2">
        <FaRegCalendarAlt size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold">Status Report Manager</h2>
      </div>

      {!selectedProjectId && (
        <p className="text-gray-600">
          Please select a project to view or create status reports.
        </p>
      )}

      {selectedProjectId && (
        <>
          {/* Button to open create modal */}
          <div className="flex justify-end">
            <button
              onClick={openModalCreate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
            >
              <FaPlus className="mr-1" />
              Add Status Report
            </button>
          </div>

          {/* Existing Reports */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Existing Reports</h3>
            {loadingReports && <p className="text-gray-600">Loading reports...</p>}
            {!loadingReports && reports?.length === 0 && (
              <p className="text-gray-600">No status reports found for this project.</p>
            )}
          </div>

          <AnimatePresence>
            {!!reports?.length && (
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
                    <th className="px-4 py-2 font-semibold">Date</th>
                    <th className="px-4 py-2 font-semibold">Progress Summary</th>
                    <th className="px-4 py-2 font-semibold">Risks</th>
                    <th className="px-4 py-2 font-semibold">Issues</th>
                    <th className="px-4 py-2 font-semibold">Next Steps</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r._id} className="border-b last:border-none">
                      <td className="px-4 py-2 text-sm">{r.reportDate.slice(0, 10)}</td>
                      <td className="px-4 py-2 text-sm">{r.progressSummary}</td>
                      <td className="px-4 py-2 text-sm">{r.risks}</td>
                      <td className="px-4 py-2 text-sm">{r.issues}</td>
                      <td className="px-4 py-2 text-sm">{r.nextSteps}</td>
                      <td className="px-4 py-2 text-sm w-32 space-x-1">
                        <button
                          onClick={() => openModalEdit(r)}
                          className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteReport(r._id)}
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
                {/* Close button (top-right) */}
                <button
                  onClick={() => closeModal()}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>

                {modalMode === 'create' ? (
                  <h3 className="text-lg font-semibold mb-4">Create Status Report</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Edit Status Report</h3>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Report Date</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Progress Summary</label>
                    <textarea
                      value={progressSummary}
                      onChange={(e) => setProgressSummary(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Risks</label>
                    <textarea
                      value={risks}
                      onChange={(e) => setRisks(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Issues</label>
                    <textarea
                      value={issues}
                      onChange={(e) => setIssues(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Next Steps</label>
                    <textarea
                      value={nextSteps}
                      onChange={(e) => setNextSteps(e.target.value)}
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
                      onClick={handleCreateReport}
                      disabled={!reportDate || creating}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateReport}
                      disabled={!reportDate || updating}
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

export default StatusReportManager;
