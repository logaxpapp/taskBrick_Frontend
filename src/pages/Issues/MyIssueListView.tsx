/*****************************************************************
 * File: src/components/Issue/MyIssueListView.tsx
 * Description: A Tailwind + Framer Motion UI for listing
 *              issues assigned to the current user, with
 *              optional project filter + search, status, etc.
 *****************************************************************/
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

import { useOrgContext } from '../../contexts/OrgContext';

// If you still want a project filter:
import { useListProjectsQuery, Project } from '../../api/project/projectApi';
import { useFilterIssuesQuery, Issue } from '../../api/issue/issueApi';

// Icons
import { FaUserShield, FaFilter, FaPlusSquare } from 'react-icons/fa';

const MyIssueListView: React.FC = () => {
  // Grab the logged-in user
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || '';

  // If you want to fetch an orgId from context or Redux
  const { selectedOrgId } = useOrgContext();
    const orgIdParam = selectedOrgId ?? undefined;

  // 1) Fetch all projects if you want a project dropdown
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
    refetch: refetchProjects,
  } = useListProjectsQuery(orgIdParam, {
    skip: !orgIdParam,
  });

  // 2) Track which project is selected (or "all")
  const [selectedProjectId, setSelectedProjectId] = useState<string | ''>('');

  // 3) Local states for search, status, sort, filter panel
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('createdAt');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // 4) On mount or if we get new projects, default to none or the first
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(''); // or projects[0]._id if you want to auto-select the first
    }
  }, [projects, selectedProjectId]);

  // 5) Now fetch issues that are assigned to me
  const {
    data: issues,
    isLoading: loadingIssues,
    isError: errorIssues,
    refetch: refetchIssues,
  } = useFilterIssuesQuery(
    {
      assignedTo: userId,       // <--- the key difference
      projectId: selectedProjectId || undefined,
      // ... any other filter
    },
    {
      skip: !userId,
    }
  );

  // Filter & sort client-side
  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    let result = [...issues];

    // status
    if (statusFilter) {
      result = result.filter((iss) => iss.status === statusFilter);
    }

    // search
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (iss) =>
          iss.title.toLowerCase().includes(lower) ||
          (iss.description?.toLowerCase().includes(lower) ?? false)
      );
    }

    // sort
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'updatedAt') {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return db - da; // desc
      } else {
        // createdAt
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      }
    });
    return result;
  }, [issues, statusFilter, searchTerm, sortBy]);

  // Motion variants
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring', stiffness: 220, damping: 20 },
    },
    exit: { x: '100%', opacity: 0, transition: { type: 'tween' } },
  };

  // Render states if no user
  if (!userId) {
    return <div className="p-4 text-red-500">You must be logged in to see your issues.</div>;
  }

  // If projects are loading
  if (loadingProjects) {
    return <p className="p-4">Loading Projects...</p>;
  }
  if (errorProjects) {
    return (
      <p className="p-4 text-red-500">
        Error loading projects. <button onClick={() => refetchProjects()}>Retry</button>
      </p>
    );
  }

  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center space-x-2">
        <FaUserShield size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold">My Issues</h1>
      </div>

      {/* 2-col layout on large */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: Project dropdown + Filter button */}
        <div className="space-y-4 lg:col-span-1">
          {/* Project dropdown */}
          {projects && projects.length > 0 && (
            <div className="bg-white border border-gray-200 rounded shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Project:
              </label>
              <select
                className="border border-gray-300 p-2 rounded w-full text-sm"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="">All Projects</option>
                {projects.map((p: Project) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Panel Toggle */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* RIGHT COLUMN: My Issues Table */}
        <div className="lg:col-span-3 space-y-4">
          {loadingIssues ? (
            <p className="text-gray-500">Loading your issues...</p>
          ) : errorIssues ? (
            <p className="text-red-500">
              Error loading issues. <button onClick={() => refetchIssues()}>Retry</button>
            </p>
          ) : (
            <div className="bg-white border border-gray-200 rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b text-left">Title</th>
                    <th className="p-2 border-b text-left">Status</th>
                    <th className="p-2 border-b text-left">Priority</th>
                    <th className="p-2 border-b text-left">Created</th>
                    <th className="p-2 border-b text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => {
                    const created = issue.createdAt
                      ? new Date(issue.createdAt).toLocaleString()
                      : 'N/A';
                    const updated = issue.updatedAt
                      ? new Date(issue.updatedAt).toLocaleString()
                      : 'N/A';

                    return (
                      <tr key={issue._id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">
                          <Link
                            to={`/dashboard/issues/${issue._id}`}
                            className="text-blue-600 underline"
                          >
                            {issue.title}
                          </Link>
                        </td>
                        <td className="p-2 border-b">{issue.status}</td>
                        <td className="p-2 border-b">
                          {issue.priority ? issue.priority : 'N/A'}
                        </td>
                        <td className="p-2 border-b">{created}</td>
                        <td className="p-2 border-b">{updated}</td>
                      </tr>
                    );
                  })}
                  {filteredIssues.length === 0 && (
                    <tr>
                      <td className="p-2 border-b text-center text-gray-500" colSpan={5}>
                        No issues assigned to you under this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel (Slide from right) */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            key="filterPanel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0, transition: { type: 'tween' } }}
            className="fixed inset-y-0 right-0 w-52 top-12 bg-gray-700 text-gray-50 shadow-xl border-l border-gray-200 z-50 p-4 overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters &amp; Sort</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-green-500 hover:text-green-400"
              >
                <FaPlusSquare className="rotate-45" /> {/* 'X' icon trick */}
              </button>
            </div>

            {/* Filter + Sort */}
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border border-gray-50 rounded px-2 py-1 text-sm text-gray-900"
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

              {/* Search */} 
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-800"
                  placeholder="Find in title or desc"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-800"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="createdAt">Created (Desc)</option>
                  <option value="updatedAt">Updated (Desc)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyIssueListView;
