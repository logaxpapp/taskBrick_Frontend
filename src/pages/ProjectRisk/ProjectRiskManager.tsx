/*****************************************************************
 * File: src/components/ProjectRisk/ProjectRiskManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing risks,
 *              featuring an aggregated "Risk Summary" and
 *              a create/edit risk modal.
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useListRisksByProjectQuery,
  useCreateRiskMutation,
  useUpdateRiskMutation,
  useDeleteRiskMutation,
  useGetProjectRiskSummaryQuery,
  IProjectRisk,
} from '../../api/projectRisk/projectRiskApi';

// Example icons from react-icons
import { FaPlus, FaEdit, FaTrashAlt, FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';

interface ProjectRiskManagerProps {
  selectedProjectId: string; // or null if none selected
}

/** Modal mode for create vs. edit */
type ModalMode = 'create' | 'edit';

const ProjectRiskManager: React.FC<ProjectRiskManagerProps> = ({ selectedProjectId }) => {
  // --------------------------------------
  // RTK Query hooks
  // --------------------------------------
  const {
    data: risks,
    refetch: refetchRisks,
    isLoading: loadingRisks,
  } = useListRisksByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createRisk, { isLoading: creating }] = useCreateRiskMutation();
  const [updateRisk, { isLoading: updating }] = useUpdateRiskMutation();
  const [deleteRisk, { isLoading: deleting }] = useDeleteRiskMutation();

  // Aggregator: risk summary
  const {
    data: riskSummary,
    refetch: refetchRiskSummary,
  } = useGetProjectRiskSummaryQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  // --------------------------------------
  // Modal state for create/edit
  // --------------------------------------
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create'); 
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields (used by create/edit modal)
  const [description, setDescription] = useState('');
  const [likelihood, setLikelihood] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [impact, setImpact] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [status, setStatus] = useState<'Open' | 'Mitigated' | 'Closed'>('Open');

  // --------------------------------------
  // Lifecycle
  // --------------------------------------
  useEffect(() => {
    if (selectedProjectId) {
      refetchRisks();
      refetchRiskSummary();
    }
  }, [selectedProjectId, refetchRisks, refetchRiskSummary]);

  // --------------------------------------
  // Modal logic
  // --------------------------------------
  function openModalCreate() {
    setModalMode('create');
    resetFormFields();
    setShowModal(true);
  }

  function openModalEdit(risk: IProjectRisk) {
    setModalMode('edit');
    setEditingId(risk._id);
    setDescription(risk.description);
    setLikelihood(risk.likelihood);
    setImpact(risk.impact);
    setMitigationPlan(risk.mitigationPlan || '');
    setStatus(risk.status);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    resetFormFields();
    setEditingId(null);
  }

  function resetFormFields() {
    setDescription('');
    setLikelihood('Low');
    setImpact('Low');
    setMitigationPlan('');
    setStatus('Open');
  }

  // --------------------------------------
  // Create
  // --------------------------------------
  async function handleCreateRisk() {
    if (!selectedProjectId || !description.trim()) return;
    try {
      await createRisk({
        projectId: selectedProjectId,
        description,
        likelihood,
        impact,
        mitigationPlan,
        status,
      }).unwrap();
      closeModal();
      refetchRisks();
      refetchRiskSummary();
    } catch (err) {
      console.error('Failed to create risk:', err);
    }
  }

  // --------------------------------------
  // Update
  // --------------------------------------
  async function handleUpdateRisk() {
    if (!editingId || !description.trim()) return;
    try {
      await updateRisk({
        id: editingId,
        updates: {
          description,
          likelihood,
          impact,
          mitigationPlan,
          status,
        },
      }).unwrap();
      closeModal();
      refetchRisks();
      refetchRiskSummary();
    } catch (err) {
      console.error('Failed to update risk:', err);
    }
  }

  // --------------------------------------
  // Delete
  // --------------------------------------
  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this risk?')) return;
    try {
      await deleteRisk(id).unwrap();
      refetchRisks();
      refetchRiskSummary();
    } catch (err) {
      console.error('Failed to delete risk:', err);
    }
  }

  // --------------------------------------
  // Framer Motion variants
  // --------------------------------------
  const listVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // Format aggregator result
  function formatSummary(riskSummary: { _id: string; count: number }[]) {
    // e.g. _id can be "Open", "Mitigated", "Closed"
    return riskSummary.map((item) => `${item._id}: ${item.count} `).join(' | ');
  }

  // --------------------------------------
  // Render
  // --------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center space-x-2">
        <FaExclamationTriangle size={24} className="text-red-600" />
        <h2 className="text-2xl font-bold">Project Risk Manager</h2>
      </div>

      {!selectedProjectId && (
        <p className="text-gray-600">Please select a project to manage risks.</p>
      )}

      {selectedProjectId && (
        <>
          {/* Button to open "Create Risk" modal */}
          <div className="flex justify-end">
            <button
              onClick={openModalCreate}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition-colors"
            >
              <FaPlus className="mr-1" />
              Add Risk
            </button>
          </div>

          {/* Risk Summary */}
          {riskSummary && riskSummary.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded shadow p-4">
              <h4 className="text-md font-semibold mb-2">Risk Summary</h4>
              <p className="text-sm text-gray-700">{formatSummary(riskSummary)}</p>
            </div>
          )}

          {/* Risk List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Existing Risks</h3>
            {loadingRisks && <p>Loading risks...</p>}
            {!loadingRisks && risks?.length === 0 && (
              <p className="text-gray-600">No risks found.</p>
            )}
          </div>

          <AnimatePresence>
            {!!risks?.length && (
              <motion.table
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={listVariants}
                className="min-w-full bg-white border border-gray-200 rounded shadow"
              >
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Description</th>
                    <th className="px-4 py-2 font-semibold">Likelihood</th>
                    <th className="px-4 py-2 font-semibold">Impact</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r) => (
                    <tr key={r._id} className="border-b last:border-none">
                      <td className="px-4 py-2 text-sm">
                        {r.description || 'N/A'}
                        {r.mitigationPlan && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Plan:</strong> {r.mitigationPlan}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{r.likelihood}</td>
                      <td className="px-4 py-2 text-sm">{r.impact}</td>
                      <td className="px-4 py-2 text-sm">{r.status}</td>
                      <td className="px-4 py-2 text-sm w-32 space-x-1">
                        <button
                          onClick={() => openModalEdit(r)}
                          className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
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

          {/* Modal for Create/Edit */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <motion.div
                className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
                layout
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
              >
                {/* Close button (top-right) */}
                <button
                  onClick={() => closeModal()}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>

                {modalMode === 'create' ? (
                  <h3 className="text-lg font-semibold mb-4">Create New Risk</h3>
                ) : (
                  <h3 className="text-lg font-semibold mb-4">Edit Risk</h3>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Likelihood</label>
                    <select
                      value={likelihood}
                      onChange={(e) => setLikelihood(e.target.value as any)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Impact</label>
                    <select
                      value={impact}
                      onChange={(e) => setImpact(e.target.value as any)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Mitigation Plan</label>
                    <textarea
                      value={mitigationPlan}
                      onChange={(e) => setMitigationPlan(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Mitigated">Mitigated</option>
                      <option value="Closed">Closed</option>
                    </select>
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
                      onClick={handleCreateRisk}
                      disabled={!description.trim() || creating}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaCheck className="mr-1" />
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdateRisk}
                      disabled={!description.trim() || updating}
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

export default ProjectRiskManager;
