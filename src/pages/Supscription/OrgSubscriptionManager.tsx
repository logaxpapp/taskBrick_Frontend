import React, { useState, useMemo } from 'react';
import {
  useGetActiveSubscriptionQuery,
  useListSubscriptionsForOrgQuery,
  useListPlansQuery,
  useCreateOrUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
  SubscriptionPlan,
  Feature,
} from '../../api/subscription/subscriptionApi';
import { useAppSelector } from '../../app/hooks/redux';
import { motion, AnimatePresence } from 'framer-motion';

const OrgSubscriptionManager: React.FC = () => {
  console.log('[OrgSubscriptionManager] Render start');

  // 1) Get orgId from Redux
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const orgId = selectedOrgId || '';
  const skipAll = !orgId;

  // 2) Queries
  const {
    data: activeSub,
    isLoading: activeLoading,
    isError: activeError,
    refetch: refetchActive,
  } = useGetActiveSubscriptionQuery(orgId, { skip: skipAll });

  const {
    data: subHistory,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useListSubscriptionsForOrgQuery(orgId, { skip: skipAll });

  // We do NOT skip listing plans, but that’s okay:
  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
  } = useListPlansQuery();

  // 3) Mutations
  const [createOrUpdateSubscription] = useCreateOrUpdateSubscriptionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // 4) Local UI state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // 5) Handlers
  const handleCancel = async () => {
    console.log('[handleCancel] Called for orgId=', orgId);
    try {
      await cancelSubscription({ orgId }).unwrap();
      setShowCancelConfirm(false);
      refetchActive();
      refetchHistory();
    } catch (err: any) {
      alert(`Cancel error: ${err.message || err}`);
    }
  };

  const handleSubscribeOrSwitch = async (planId: string) => {
    console.log('[handleSubscribeOrSwitch] planId=', planId, 'orgId=', orgId);
    try {
      await createOrUpdateSubscription({ organizationId: orgId, planId }).unwrap();
      refetchActive();
      refetchHistory();
    } catch (err: any) {
      alert(`Subscribe/Upgrade error: ${err.message || err}`);
    }
  };

  // 6) Always define variables outside conditionals:
  const active = activeSub || null;
  const subList = subHistory || [];
  const planList = plans || [];

  // This useMemo must always be called unconditionally
  const currentPlanId = useMemo(() => {
    console.log('[OrgSubscriptionManager -> useMemo for currentPlanId]');
    if (!active?.planId) return null;
    if (typeof active.planId === 'string') return active.planId;
    return (active.planId as SubscriptionPlan)._id;
  }, [active]);

  // 7) Decide what to render using if/else
  let content: React.ReactNode = null;

  if (skipAll) {
    // No org
    content = (
      <div className="p-4 text-gray-700">
        <p>No organization selected. Please select an org first.</p>
      </div>
    );
  } else if (activeLoading || historyLoading || plansLoading) {
    // Loading
    content = (
      <div className="p-4 text-gray-700 animate-pulse">
        Loading subscription data...
      </div>
    );
  } else if (activeError || historyError || plansError) {
    // Error
    content = (
      <div className="p-4 text-red-500">
        Error loading subscription info. Please try again.
      </div>
    );
  } else {
    // Normal scenario
    content = (
      <div className="space-y-6 max-w-[1200px] mx-auto">

        {/* Current Subscription */}
        <motion.div
          className="bg-white p-6 shadow-lg rounded-md"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Subscription
          </h2>
          {active ? (
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Status:</span> {active.status}
              </p>
              <p>
                <span className="font-medium">Plan:</span>{' '}
                {typeof active.planId === 'object'
                  ? (active.planId as SubscriptionPlan).name
                  : active.planId}
              </p>
              <p>
                <span className="font-medium">Start Date:</span>{' '}
                {new Date(active.startDate).toLocaleDateString()}
              </p>
              {active.endDate && (
                <p>
                  <span className="font-medium">End Date:</span>{' '}
                  {new Date(active.endDate).toLocaleDateString()}
                </p>
              )}
              {(active.status === 'active' || active.status === 'trial') && (
                <button
                  className="mt-4 bg-purple-500 text-white px-4 py-1.5 rounded  hover:bg-purple-600 shadow-sm"
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>No current subscription.</p>
            </div>
          )}
        </motion.div>

        {/* Subscription History */}
        <motion.div
          className="bg-white p-6 shadow-lg rounded-md"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Subscription History
          </h2>
          {subList.length === 0 ? (
            <p className="text-gray-600">No past subscriptions found.</p>
          ) : (
            <ul className="space-y-3">
              {subList.map((sub) => (
                <li
                  key={sub._id}
                  className="p-3 border border-gray-200 rounded bg-gray-50"
                >
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Plan:</span>{' '}
                    {typeof sub.planId === 'object'
                      ? (sub.planId as SubscriptionPlan).name
                      : sub.planId}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Status:</span> {sub.status}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Start:</span>{' '}
                    {new Date(sub.startDate).toLocaleDateString()}
                  </p>
                  {sub.endDate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">End:</span>{' '}
                      {new Date(sub.endDate).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Plans */}
        <motion.div
          className="bg-white p-6 shadow-lg rounded-md"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Available Plans
          </h2>
          {planList.length === 0 ? (
            <p className="text-gray-600">No plans available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {planList.map((plan) => {
                const isCurrent = currentPlanId === plan._id;
                return (
                  <motion.div
                    key={plan._id}
                    className={`p-5 border rounded-lg shadow-md bg-white flex flex-col justify-between transition-all 
                      ${
                        isCurrent
                          ? 'border-indig0-400 ring-1 ring-indigo-400'
                          : 'border-gray-200'
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <h4 className="text-lg font-semibold mb-1 text-gray-800">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">
                          ${plan.monthlyPrice}
                        </span>
                        /mo
                      </p>
                      {Array.isArray(plan.features) && plan.features.length > 0 && (
                        <ul>
                        {(plan.features as Feature[]).map((f) => (
                          <li key={f._id}>{f.name}</li>
                        ))}
                      </ul>
                      )}
                    </div>
                    <div>
                      {isCurrent ? (
                        <span className="inline-block text-sm text-green-600 font-medium mt-2">
                          Currently Subscribed
                        </span>
                      ) : (
                        <button
                          className="mt-3 bg-purple-500 text-white px-4 py-1.5 text-sm rounded shadow hover:bg-purple-700 transition-colors"
                          onClick={() => handleSubscribeOrSwitch(plan._id)}
                        >
                          Subscribe / Switch
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Cancel Confirmation Overlay */}
        <AnimatePresence>
          {showCancelConfirm && (
            <motion.div
              key="cancelConfirmOverlay"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded shadow-2xl max-w-md w-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Cancel Subscription
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to cancel your subscription?
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
                    onClick={handleCancel}
                  >
                    Cancel Subscription
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 8) Single final return
  return <>{content}</>;
};

export default OrgSubscriptionManager;
