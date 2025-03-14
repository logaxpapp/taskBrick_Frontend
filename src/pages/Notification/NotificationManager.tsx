/*****************************************************************
 * File: src/components/Notification/NotificationManager.tsx
 * Description: A Tailwind + Framer Motion UI for managing notifications
 *              with a more polished layout and pagination controls.
 *****************************************************************/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  INotification,
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
} from '../../api/notification/notificationApi';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { FaBell, FaFilter, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type FilterMode = 'all' | 'read' | 'unread';

const NotificationManager: React.FC = () => {
  // Grab the logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || '';

  // Filter + Pagination states
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [page, setPage] = useState(1);     // current page
  const [limit, setLimit] = useState(5);  // items per page (could be 10, etc.)

  // Convert the filterMode into an isRead param
  let isReadParam: boolean | undefined;
  if (filterMode === 'read') isReadParam = true;
  if (filterMode === 'unread') isReadParam = false;

  // Use RTK Query
  const {
    data: paginated,
    refetch: refetchNotifications,
    isLoading: loadingNotifications,
  } = useListNotificationsQuery(
    {
      userId,
      isRead: isReadParam,
      page,
      limit,
    },
    {
      skip: !userId,
    }
  );

  const [markNotificationRead] = useMarkNotificationReadMutation();

  // If user changes or filter changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [userId, filterMode]);

  // Re-fetch on mount or changes
  useEffect(() => {
    if (userId) {
      refetchNotifications();
    }
  }, [userId, filterMode, page, limit, refetchNotifications]);

  // Mark as read
  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead({ id }).unwrap();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  }

  // For convenience
  const notifications = paginated?.notifications || [];
  const totalPages = paginated?.pages || 1;
  const currentPage = paginated?.page || 1;

  // Framer Motion variants
  const itemVariants = {
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

  // Pagination
  function handlePrevious() {
    if (page > 1) setPage(page - 1);
  }
  function handleNext() {
    if (page < totalPages) setPage(page + 1);
  }

  // Render
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex items-center space-x-2 mb-4">
        <FaBell size={28} className="text-yellow-500" />
        <h2 className="text-3xl font-bold">Notification Center</h2>
      </div>

      {/* The main container: 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT Column: Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header row with Filter button */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Notifications</h3>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
            >
              <FaFilter className="mr-1" />
              Filter
            </button>
          </div>

          {/* Filter dropdown (Framer Motion) */}
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white border border-gray-200 rounded shadow p-4"
              >
                <h4 className="text-md font-semibold mb-2">Show Notifications</h4>
                <div className="flex space-x-3">
                  <button
                    className={`px-3 py-1 rounded ${
                      filterMode === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setFilterMode('all')}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      filterMode === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setFilterMode('read')}
                  >
                    Read
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${
                      filterMode === 'unread'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setFilterMode('unread')}
                  >
                    Unread
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification List */}
          <div className="bg-white border border-gray-200 rounded shadow p-4 space-y-4">
            {loadingNotifications && (
              <p className="text-gray-500">Loading notifications...</p>
            )}
            {!loadingNotifications && notifications.length === 0 && (
              <p className="text-gray-600">No notifications found.</p>
            )}

            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div
                  key={n._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`border border-gray-100 p-3 rounded hover:shadow transition-all ${
                    n.isRead ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <p className="text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="mt-2 inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      <FaCheck className="mr-1" />
                      Mark Read
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* PAGINATION CONTROLS */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-end mt-4 space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={handlePrevious}
                  className="inline-flex items-center px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  <FaChevronLeft className="mr-1" />
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={handleNext}
                  className="inline-flex items-center px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT Column: Possibly an aggregator or instructions */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded shadow">
            <h4 className="text-md font-semibold mb-2">About Notifications</h4>
            <p className="text-sm text-gray-700">
              Filter and manage notifications. Mark them as read when you’re done reviewing.
            </p>
          </div>
          {/* You could place another card or aggregator here, if needed */}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
