// File: src/components/AdminOrgSubscriptionManager.tsx

import React, { useState } from 'react';
import {
  useGetActiveSubscriptionQuery,
  useListSubscriptionsForOrgQuery,
  useListPlansQuery,
  useCreateOrUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  SubscriptionPlan,
} from '../../api/subscription/subscriptionApi';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AdminOrgSubscriptionManager: React.FC = () => {
  // ---------------------------------
  // 1) Admin can input an orgId
  // ---------------------------------
  const [searchOrgId, setSearchOrgId] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  // Subscriptions data
  const {
    data: activeSub,
    isLoading: activeLoading,
    refetch: refetchActive,
  } = useGetActiveSubscriptionQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  const {
    data: subHistory,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useListSubscriptionsForOrgQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  const { data: plans, isLoading: plansLoading } = useListPlansQuery();

  // Mutations
  const [createOrUpdateSubscription] = useCreateOrUpdateSubscriptionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // UI states
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ---------------------------------
  // 2) Handlers
  // ---------------------------------
  const handleSearchOrg = () => {
    setSelectedOrgId(searchOrgId.trim());
  };

  const handleChangeSubscription = () => {
    setSelectedPlanId('');
    setShowChangeModal(true);
  };
  const handleCloseChangeModal = () => setShowChangeModal(false);

  const handleConfirmChange = async () => {
    if (!selectedPlanId || !selectedOrgId) {
      alert('Missing plan or orgId');
      return;
    }
    try {
      await createOrUpdateSubscription({
        organizationId: selectedOrgId,
        planId: selectedPlanId,
      }).unwrap();
      setShowChangeModal(false);
      refetchActive();
      refetchHistory();
    } catch (err: any) {
      alert(`Error updating subscription: ${err.message || err}`);
    }
  };

  const handleAdminCancel = async () => {
    if (!selectedOrgId) return;
    try {
      await cancelSubscription({ orgId: selectedOrgId }).unwrap();
      setShowCancelConfirm(false);
      refetchActive();
      refetchHistory();
    } catch (err: any) {
      alert(`Error canceling subscription: ${err.message || err}`);
    }
  };

  // ---------------------------------
  // 3) Render
  // ---------------------------------
  return (
    <div className="p-4 space-y-6">
      {/* Search for Org */}
      <div className="bg-white p-4 shadow rounded flex items-center gap-3">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Enter Org ID..."
          value={searchOrgId}
          onChange={(e) => setSearchOrgId(e.target.value)}
        />
        <button
          onClick={handleSearchOrg}
          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* If an org is selected, show subscription details */}
      {selectedOrgId && (
        <motion.div
          className="bg-white p-4 shadow rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Admin Subscription View - Org: {selectedOrgId}
          </h2>

          {/* Active Subscription */}
          {activeLoading ? (
            <p className="text-gray-500">Loading active subscription...</p>
          ) : activeSub ? (
            <div className="space-y-2 mb-4">
              <p>
                <strong>Status:</strong> {activeSub.status}
              </p>
              <p>
                <strong>Plan:</strong>{' '}
                {typeof activeSub.planId === 'object'
                  ? (activeSub.planId as SubscriptionPlan).name
                  : activeSub.planId}
              </p>
              <p>
                <strong>Start Date:</strong>{' '}
                {new Date(activeSub.startDate).toLocaleDateString()}
              </p>
              {activeSub.endDate && (
                <p>
                  <strong>End Date:</strong>{' '}
                  {new Date(activeSub.endDate).toLocaleDateString()}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  onClick={handleChangeSubscription}
                >
                  Change/Upgrade
                </button>
                {(activeSub.status === 'active' ||
                  activeSub.status === 'trial') && (
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>No active subscription found. The admin may create one below.</p>
          )}

          {/* History */}
          {historyLoading ? (
            <p>Loading subscription history...</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold mt-6">
                Subscription History
              </h3>
              {(!subHistory || subHistory.length === 0) && (
                <p>No history for this organization.</p>
              )}
              <ul className="space-y-2 mt-2">
                {subHistory?.map((sub) => (
                  <li
                    key={sub._id}
                    className="p-2 bg-gray-50 border border-gray-200 rounded"
                  >
                    <p className="text-sm">
                      <strong>Plan:</strong>{' '}
                      {typeof sub.planId === 'object'
                        ? (sub.planId as SubscriptionPlan).name
                        : sub.planId}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {sub.status}
                    </p>
                    <p className="text-sm">
                      <strong>Start:</strong>{' '}
                      {new Date(sub.startDate).toLocaleDateString()}
                    </p>
                    {sub.endDate && (
                      <p className="text-sm">
                        <strong>End:</strong>{' '}
                        {new Date(sub.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      )}

      {/* CANCEL CONFIRM OVERLAY */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            key="adminCancelOverlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-2xl w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                Admin Cancel Subscription
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to forcibly cancel this org's subscription?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Close
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
                  onClick={handleAdminCancel}
                >
                  Cancel Subscription
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHANGE/UPGRADE OVERLAY */}
      <AnimatePresence>
        {showChangeModal && (
          <motion.div
            key="adminChangeModal"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded shadow-2xl w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">
                  Admin - Change/Upgrade Subscription
                </h4>
                <button onClick={handleCloseChangeModal}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {plansLoading ? (
                <p>Loading plans...</p>
              ) : !plans || plans.length === 0 ? (
                <p>No plans to select from.</p>
              ) : (
                <div className="space-y-3">
                  <select
                    className="border w-full p-2 rounded"
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                  >
                    <option value="">Select a plan...</option>
                    {plans.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — ${p.monthlyPrice}/mo
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                      onClick={handleCloseChangeModal}
                    >
                      Close
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                      onClick={handleConfirmChange}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrgSubscriptionManager;
