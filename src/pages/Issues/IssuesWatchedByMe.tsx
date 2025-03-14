/*****************************************************************
 * File: src/components/Issue/IssuesWatchedByMe.tsx
 * Description: A Tailwind + Framer Motion UI that lists
 *              all issues the current user is watching.
 *****************************************************************/
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaFilter, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

import {
  useListWatchedIssuesByUserQuery,
  IIssueWatcherDoc,
} from '../../api/issueWatcher/issueWatcherApi';

import { Link } from 'react-router-dom';

const IssuesWatchedByMe: React.FC = () => {
  // Grab the logged-in user from Redux
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const userId = loggedInUser?._id || '';

  // If user is not logged in, you can handle that:
  // e.g. redirect or show message
  // We'll just show an error
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Query all watchers for the user => userId
  const {
    data: watchers,
    isLoading,
    isError,
    refetch,
  } = useListWatchedIssuesByUserQuery(userId, {
    skip: !userId,
  });

  // This will be an array of watchers, each with .issueId
  // We'll transform them into an array of "Issue" data for filtering
  const watchedIssues = watchers || [];

  // Client-side filters
  const filteredIssues = useMemo(() => {
    let arr = [...watchedIssues];

    // Filter by status if we have it
    if (statusFilter) {
      arr = arr.filter((doc) => doc.issueId.status === statusFilter);
    }

    // Filter by searchTerm (title or priority or something)
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      arr = arr.filter(
        (doc) =>
          doc.issueId.title.toLowerCase().includes(lower) ||
          (doc.issueId.priority?.toLowerCase().includes(lower) ?? false)
      );
    }

    return arr;
  }, [watchedIssues, statusFilter, searchTerm]);

  // If user changes, you might want to refetch watchers or skip if no user
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  // Framer Motion variants for filter panel
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
    exit: { x: '100%', opacity: 0, transition: { type: 'tween' } },
  };

  if (!userId) {
    return <div className="p-4 text-red-500">Must be logged in to see watched issues.</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading issues you watch...</div>;
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading watchers.
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FaEye size={28} className="text-green-600" />
        <h1 className="text-3xl font-bold">Issues Watched By Me</h1>
      </div>

      {/* Filter toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
        >
          <FaFilter className="mr-1" />
          Filter
        </button>
      </div>

      {/* The table of issues */}
      <div className="bg-white border border-gray-200 rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b text-left">Title</th>
              <th className="p-2 border-b text-left">Status</th>
              <th className="p-2 border-b text-left">Priority</th>
              <th className="p-2 border-b text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((doc) => {
              const issue = doc.issueId;
              const updated = issue.updatedAt
                ? new Date(issue.updatedAt).toLocaleString()
                : 'N/A';
              return (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">
                    <Link
                      to={`/dashboard/issues/${issue._id}`}
                      className="text-blue-600 underline"
                    >
                      {issue.title}
                    </Link>
                  </td>
                  <td className="p-2 border-b">{issue.status}</td>
                  <td className="p-2 border-b">{issue.priority || 'MEDIUM'}</td>
                  <td className="p-2 border-b">{updated}</td>
                </tr>
              );
            })}
            {filteredIssues.length === 0 && (
              <tr>
                <td
                  className="p-2 border-b text-center text-gray-500"
                  colSpan={4}
                >
                  No issues found under this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            key="filterPanel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-52 top-12 bg-gray-700 shadow-xl border-l border-gray-200 z-50 p-4 overflow-auto text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filter &amp; Search</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-gray-50 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-800"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">(All)</option>
                <option value="TO_DO">TO_DO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="REVIEW">REVIEW</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DONE">DONE</option>
                <option value="DEPLOYED">DEPLOYED</option>
              </select>
            </div>

            {/* Search Term */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Search
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="Search title/priority"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IssuesWatchedByMe;
