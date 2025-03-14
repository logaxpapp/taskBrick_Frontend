// File: src/components/SubscriptionPlanManager.tsx

import React, { useState, useMemo } from 'react';
import {
  SubscriptionPlan,
  CreatePlanPayload,
  UpdatePlanPayload,
  useListPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useActivatePlanMutation,
  useDeactivatePlanMutation,
  useDeletePlanMutation,
  Feature,
} from '../../api/subscription/subscriptionApi';

import { useListFeaturesQuery } from '../../api/subscription/subscriptionApi'; 
// We assume you have an endpoint for listing features, e.g. "useListFeaturesQuery"

import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

/** A helper to safely parse JSON usage limits. */
function parseJsonOrEmpty(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

/** For building local form data in the create/edit modals. */
interface PlanFormData {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  seatLimit?: number;
  usageLimits?: Record<string, any>;
  featureIds: string[]; // we store the selected features
}

const SubscriptionPlanManager: React.FC = () => {
  // 1) Queries / Mutations
  const { data: plans, isLoading, isError, refetch } = useListPlansQuery();
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [activatePlan] = useActivatePlanMutation();
  const [deactivatePlan] = useDeactivatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  // We'll also need to list features for the multi-select
  const { data: allFeatures } = useListFeaturesQuery();

  // 2) UI State
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'createdAt'>('name');

  // CREATE Plan Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState<PlanFormData>({
    name: '',
    monthlyPrice: 0,
    annualPrice: 0,
    seatLimit: 0,
    usageLimits: {},
    featureIds: [],
  });

  // EDIT Plan Modal
  const [editPlanId, setEditPlanId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<PlanFormData>({
    name: '',
    monthlyPrice: 0,
    annualPrice: 0,
    seatLimit: 0,
    usageLimits: {},
    featureIds: [],
  });

  // DELETE
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(
    null
  );

  // 3) Filter & Sort
  const filteredAndSortedPlans: SubscriptionPlan[] = useMemo(() => {
    if (!plans) return [];
    let result = [...plans];

    // 1) Filter by searchTerm
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          String(p.monthlyPrice).includes(lower) ||
          String(p.annualPrice).includes(lower)
      );
    }
    // 2) Sort
    if (sortKey === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // sort by createdAt desc
      result.sort((a, b) => {
        const ta = new Date(a.createdAt ?? '').getTime();
        const tb = new Date(b.createdAt ?? '').getTime();
        return tb - ta;
      });
    }

    return result;
  }, [plans, searchTerm, sortKey]);

  // 4) Handlers

  /** ========== CREATE ========== */
  const handleOpenCreateModal = () => {
    setCreateFormData({
      name: '',
      monthlyPrice: 0,
      annualPrice: 0,
      seatLimit: 0,
      usageLimits: {},
      featureIds: [],
    });
    setShowCreateModal(true);
  };
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCreatePlan = async () => {
    if (!createFormData.name) {
      alert('Plan name is required');
      return;
    }
    try {
      await createPlan({
        name: createFormData.name,
        monthlyPrice: createFormData.monthlyPrice,
        annualPrice: createFormData.annualPrice,
        featureIds: createFormData.featureIds,
        seatLimit: createFormData.seatLimit,
        usageLimits: createFormData.usageLimits,
      }).unwrap();

      setShowCreateModal(false);
      refetch();
    } catch (err: any) {
      alert(`Error creating plan: ${err.message || err}`);
    }
  };

  /** ========== EDIT ========== */
  const handleOpenEditModal = (plan: SubscriptionPlan) => {
    setEditPlanId(plan._id);

    // if plan.features is an array of strings or objects
    let featIds: string[] = [];
    if (Array.isArray(plan.features)) {
      featIds = plan.features.map((f) => (typeof f === 'string' ? f : f._id));
    }

    setEditFormData({
      name: plan.name,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
      seatLimit: plan.seatLimit,
      usageLimits: plan.usageLimits,
      featureIds: featIds,
    });
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditPlanId(null);
  };

  const handleSaveEdit = async () => {
    if (!editPlanId) return;
    const updates: UpdatePlanPayload = {
      name: editFormData.name,
      monthlyPrice: editFormData.monthlyPrice,
      annualPrice: editFormData.annualPrice,
      featureIds: editFormData.featureIds,
      seatLimit: editFormData.seatLimit,
      usageLimits: editFormData.usageLimits,
      // isActive we'll keep as is, or we can pass if we want
    };

    try {
      await updatePlan({ id: editPlanId, updates }).unwrap();
      setShowEditModal(false);
      setEditPlanId(null);
      refetch();
    } catch (err: any) {
      alert(`Error updating plan: ${err.message || err}`);
    }
  };

  /** ========== ACTIVATE / DEACTIVATE ========== */
  const handleActivate = async (planId: string) => {
    try {
      await activatePlan(planId).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error activating plan: ${err.message || err}`);
    }
  };
  const handleDeactivate = async (planId: string) => {
    try {
      await deactivatePlan(planId).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error deactivating plan: ${err.message || err}`);
    }
  };

  /** ========== DELETE ========== */
  const handleConfirmDelete = (id: string) => {
    setDeleteConfirmationId(id);
  };
  const handleCancelDelete = () => {
    setDeleteConfirmationId(null);
  };
  const handleDeletePlanConfirm = async (id: string) => {
    try {
      await deletePlan(id).unwrap();
      setDeleteConfirmationId(null);
      refetch();
    } catch (err: any) {
      alert(`Error deleting plan: ${err.message || err}`);
    }
  };

  // 5) Render
  if (isLoading) {
    return (
      <div className="p-8 text-xl text-gray-600 animate-pulse">
        Loading Subscription Plans...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500 text-xl">
        Error loading plans. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-10 space-y-6">
      {/* PAGE HEADER / CONTROLS */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Subscription Plans
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex items-center border px-2 rounded bg-white">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              className="outline-none px-2 py-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort dropdown */}
          <select
            className="text-sm border rounded px-2 py-1 bg-white"
            value={sortKey}
            onChange={(e) =>
              setSortKey(e.target.value === 'createdAt' ? 'createdAt' : 'name')
            }
          >
            <option value="name">Name</option>
            <option value="createdAt">Newest</option>
          </select>

          {/* View toggle (like the feature manager) */}
          <div className="flex items-center gap-1">
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                viewMode === 'cards' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setViewMode('cards')}
            >
              <Squares2X2Icon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className={`p-1 rounded hover:bg-gray-100 ${
                viewMode === 'list' ? 'bg-gray-200' : ''
              }`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="
              bg-blue-600 text-white
              px-4 py-2 rounded-md 
              hover:bg-blue-700 transition
            "
          >
            + New Plan
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {filteredAndSortedPlans.length === 0 ? (
        <p className="text-gray-500">No plans match your search/filters.</p>
      ) : viewMode === 'cards' ? (
        /* CARD VIEW */
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedPlans.map((plan) => (
            <AnimatePresence key={plan._id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="
                  relative
                  bg-white shadow-md rounded-md p-4
                  border-l-4
                  border-l-indigo-500
                "
              >
                {/* If editing inline, you can do that, or we do the modal approach. Let's do modal. */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {plan.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenEditModal(plan)}
                    >
                      <PencilIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleConfirmDelete(plan._id)}
                    >
                      <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
                    </motion.button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2 mb-4 space-y-1">
                  <p>Monthly: ${plan.monthlyPrice}</p>
                  <p>Annual: ${plan.annualPrice}</p>
                  <p>Seat Limit: {plan.seatLimit ?? 'N/A'}</p>
                  {plan.usageLimits && Object.keys(plan.usageLimits).length > 0 && (
                    <div>
                      <strong>Usage Limits:</strong>{' '}
                      <pre className="text-xs bg-gray-50 p-1 rounded mt-1">
                        {JSON.stringify(plan.usageLimits, null, 2)}
                      </pre>
                    </div>
                  )}
                  {/* Show plan features (populated or IDs) */}
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div>
                      <strong>Features:</strong>
                      <ul className="list-disc list-inside text-xs">
                        {plan.features.map((f) => {
                          if (typeof f === 'string') return <li key={f}>{f}</li>;
                          const feat = f as Feature;
                          return (
                            <li key={feat._id}>
                              {feat.name} ({feat.code})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {plan.isActive ? (
                    <button
                      onClick={() => handleDeactivate(plan._id)}
                      className="
                        bg-orange-500 text-white px-3 py-1
                        rounded-md hover:bg-orange-600
                      "
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(plan._id)}
                      className="
                        bg-green-500 text-white px-3 py-1
                        rounded-md hover:bg-green-600
                      "
                    >
                      Activate
                    </button>
                  )}
                </div>

                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                  {deleteConfirmationId === plan._id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="
                        absolute inset-0 bg-black bg-opacity-50
                        flex items-center justify-center
                        rounded-md
                      "
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white p-4 rounded shadow-lg w-72"
                      >
                        <h4 className="text-sm font-semibold mb-3">
                          Confirm Delete?
                        </h4>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDeletePlanConfirm(plan._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Plan Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Monthly
                </th>
                <th scope="col" className="px-6 py-3">
                  Annual
                </th>
                <th scope="col" className="px-6 py-3">
                  Seat Limit
                </th>
                <th scope="col" className="px-6 py-3">
                  Active?
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPlans.map((p) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-6 py-4">${p.monthlyPrice}</td>
                  <td className="px-6 py-4">${p.annualPrice}</td>
                  <td className="px-6 py-4">{p.seatLimit ?? 'N/A'}</td>
                  <td className="px-6 py-4">
                    {p.isActive ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleOpenEditModal(p)}
                      >
                        <PencilIcon className="w-4 h-4 inline-block" />
                      </button>
                      {p.isActive ? (
                        <button
                          className="text-orange-500 hover:text-orange-600"
                          onClick={() => handleDeactivate(p._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleActivate(p._id)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleConfirmDelete(p._id)}
                      >
                        <TrashIcon className="w-4 h-4 inline-block" />
                      </button>
                    </div>
                    {/* Potentially a delete overlay here too, 
                        but we can do a single approach like the card view. */}
                    <AnimatePresence>
                      {deleteConfirmationId === p._id && (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-0 right-0 bg-black bg-opacity-40 flex items-center justify-center"
                          style={{ top: 0, bottom: 0 }}
                        >
                          <motion.td
                            colSpan={6}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white p-4 rounded shadow-lg w-72"
                          >
                            <h4 className="text-sm font-semibold mb-3">
                              Confirm Delete?
                            </h4>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleDeletePlanConfirm(p._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            key="createPlanModal"
            className="
              fixed inset-0 bg-black bg-opacity-50 
              flex items-center justify-center z-50
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                bg-white w-full max-w-md
                rounded-lg p-6 shadow-2xl
              "
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Plan</h2>
                <button onClick={handleCloseCreateModal}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4 h-96 overflow-y-auto">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-1 rounded"
                    value={createFormData.name}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Price fields */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Price
                    </label>
                    <input
                      type="number"
                      className="w-full border px-3 py-1 rounded"
                      value={createFormData.monthlyPrice}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          monthlyPrice: +e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Price
                    </label>
                    <input
                      type="number"
                      className="w-full border px-3 py-1 rounded"
                      value={createFormData.annualPrice}
                      onChange={(e) =>
                        setCreateFormData((prev) => ({
                          ...prev,
                          annualPrice: +e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Seat Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    className="w-full border px-3 py-1 rounded"
                    value={createFormData.seatLimit ?? 0}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        seatLimit: +e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Usage Limits (JSON) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limits (JSON)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border px-3 py-1 rounded text-sm"
                    value={JSON.stringify(createFormData.usageLimits || {})}
                    onChange={(e) => {
                      const parsed = parseJsonOrEmpty(e.target.value);
                      setCreateFormData((prev) => ({
                        ...prev,
                        usageLimits: parsed,
                      }));
                    }}
                  />
                </div>

                {/* Feature Checkbox List */}
                {allFeatures && allFeatures.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Features
                    </label>
                    <div className="space-y-1">
                      {allFeatures.map((f) => (
                        <label key={f._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={createFormData.featureIds.includes(f._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // add to array
                                setCreateFormData((prev) => ({
                                  ...prev,
                                  featureIds: [...prev.featureIds, f._id],
                                }));
                              } else {
                                // remove from array
                                setCreateFormData((prev) => ({
                                  ...prev,
                                  featureIds: prev.featureIds.filter(
                                    (id) => id !== f._id
                                  ),
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">
                            {f.name} ({f.code})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleCloseCreateModal}
                  className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            key="editPlanModal"
            className="
              fixed inset-0 bg-black bg-opacity-50 
              flex items-center justify-center z-50
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="
                bg-white w-full max-w-md
                rounded-lg p-6 shadow-2xl
              "
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Plan</h2>
                <button onClick={handleCloseEditModal}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4 h-96 overflow-y-auto">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-1 rounded"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Prices */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Price
                    </label>
                    <input
                      type="number"
                      className="w-full border px-3 py-1 rounded"
                      value={editFormData.monthlyPrice ?? 0}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          monthlyPrice: +e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Price
                    </label>
                    <input
                      type="number"
                      className="w-full border px-3 py-1 rounded"
                      value={editFormData.annualPrice ?? 0}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          annualPrice: +e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Seat Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    className="w-full border px-3 py-1 rounded"
                    value={editFormData.seatLimit ?? 0}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        seatLimit: +e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Usage Limits (JSON) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limits (JSON)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border px-3 py-1 rounded text-sm"
                    value={JSON.stringify(editFormData.usageLimits || {})}
                    onChange={(e) => {
                      const parsed = parseJsonOrEmpty(e.target.value);
                      setEditFormData((prev) => ({
                        ...prev,
                        usageLimits: parsed,
                      }));
                    }}
                  />
                </div>

                {/* Feature Checkboxes */}
                {allFeatures && allFeatures.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Features
                    </label>
                    <div className="space-y-1">
                      {allFeatures.map((f) => (
                        <label key={f._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editFormData.featureIds?.includes(f._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // add
                                setEditFormData((prev) => ({
                                  ...prev,
                                  featureIds: [
                                    ...(prev.featureIds ?? []),
                                    f._id,
                                  ],
                                }));
                              } else {
                                // remove
                                setEditFormData((prev) => ({
                                  ...prev,
                                  featureIds: (prev.featureIds ?? []).filter(
                                    (id) => id !== f._id
                                  ),
                                }));
                              }
                            }}
                          />
                          <span className="text-sm">
                            {f.name} ({f.code})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={handleCloseEditModal}
                  className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlanManager;
