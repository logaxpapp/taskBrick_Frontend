/*****************************************************************
 * File: src/components/Issue/IssueListView.tsx
 * Description: An upgraded Tailwind + Framer Motion UI for listing
 *              & creating issues, featuring:
 *               - A project selector
 *               - Filter panel (toggle)
 *               - 2-column layout (on large screens)
 *               - Framer Motion transitions
 *               - Client-side pagination
 *****************************************************************/
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PreDashboard from '../auth/PreDashboard';
import {
  useListIssuesQuery,
  useCreateIssueMutation,
 
} from '../../api/issue/issueApi';
import { useAppSelector } from '../../app/hooks/redux'; 
import {
  useListProjectsQuery,
  Project,
} from '../../api/project/projectApi';

// ▼ Switch from OrgContext to Redux if desired

import CreateIssueModal from '../Board/CreateIssueModal';

// Icons
import { FaClipboardList, FaFilter, FaPlusSquare } from 'react-icons/fa';

const IssueListView: React.FC = () => {
  const { projectId: paramProjectId } = useParams<{ projectId?: string }>();
   const { selectedOrgId } = useAppSelector((state) => state.organization);
  const orgIdParam = selectedOrgId ?? undefined;

  // Fetch all projects in this org
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    refetch: refetchProjects,
  } = useListProjectsQuery(orgIdParam, {
    skip: !selectedOrgId,
  });

  // Track whichever projectId we want to show
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    paramProjectId
  );

  // If there's a param, prefer that
  useEffect(() => {
    if (paramProjectId) {
      setSelectedProjectId(paramProjectId);
    }
  }, [paramProjectId]);

  // If no param & we do have projects, default to first
  useEffect(() => {
    if (
      !paramProjectId &&
      projects &&
      projects.length > 0 &&
      !selectedProjectId
    ) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [paramProjectId, projects, selectedProjectId]);

  // Fetch issues for the selected project
  const {
    data: issues,
    isLoading: isLoadingIssues,
    isError: isErrorIssues,
    refetch: refetchIssues,
  } = useListIssuesQuery(
    { projectId: selectedProjectId },
    {
      skip: !selectedProjectId,
    }
  );

  // Local states for filter / sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>(
    'createdAt'
  );

  // Create Issue states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createColId, setCreateColId] = useState<string | null>(null);
  const [createIssueError, setCreateIssueError] = useState('');
  const [createIssue] = useCreateIssueMutation();

  // Toggle for the filter panel
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // ▼ NEW: Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 5; // how many issues to show per page

  // Filter/sort the issues client-side
  const filteredIssues = useMemo(() => {
    if (!issues) return [];

    let filtered = [...issues];

    // status filter
    if (statusFilter) {
      filtered = filtered.filter((iss) => iss.status === statusFilter);
    }

    // search
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (iss) =>
          iss.title.toLowerCase().includes(lowerSearch) ||
          (iss.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    // sort
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'updatedAt') {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA; // descending
      } else {
        // 'createdAt'
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
    });

    return filtered;
  }, [issues, statusFilter, searchTerm, sortBy]);

  // ▼ NEW: Slice the issues for the current page
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage) || 1;
  // Ensure currentPage doesn't exceed totalPages (e.g. if filters reduce the list)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * issuesPerPage;
    const endIndex = startIndex + issuesPerPage;
    return filteredIssues.slice(startIndex, endIndex);
  }, [filteredIssues, currentPage, issuesPerPage]);

  // Handlers
  const handleOpenCreateIssue = () => {
    setCreateColId(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateIssue = async (title: string, issueTypeId: string) => {
    if (!selectedProjectId) return;
    try {
      await createIssue({
        projectId: selectedProjectId,
        title,
        issueTypeId,
      }).unwrap();

      setIsCreateModalOpen(false);
      setCreateIssueError('');
      refetchIssues();
    } catch (err: any) {
      setCreateIssueError(err.data?.error || err.message);
    }
  };

  // Filter panel motion variants
  const filterPanelVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring', stiffness: 220, damping: 20 },
    },
    exit: { x: '-100%', opacity: 0, transition: { type: 'tween' } },
  };

  // RENDER states
  if (!selectedOrgId) {
    return (
      <div className="p-4 text-red-500">
        <PreDashboard />
      </div>
    );
  }
  if (isLoadingProjects) {
    return <div className="p-4">Loading projects...</div>;
  }
  if (isErrorProjects) {
    return (
      <div className="p-4 text-red-500">
        Error loading projects.{' '}
        <button onClick={() => refetchProjects()}>Retry</button>
      </div>
    );
  }

  // MAIN RENDER
  return (
    <div className="mx-auto p-6 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex items-center space-x-2">
        <FaClipboardList size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold">Issue Management</h1>
      </div>

      {/* 2-column layout for large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT COLUMN: PROJECT SELECTOR + FILTER TOGGLE */}
        <div className="space-y-4 lg:col-span-1">
          {/* Project Selector */}
          {projects && projects.length > 0 && (
            <div className="bg-white border border-gray-200 rounded shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Project:
              </label>
              <select
                className="border border-gray-300 p-2 rounded w-full text-sm"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a Project --
                </option>
                {projects.map((p: Project) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.key})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow transition-colors"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* RIGHT COLUMN: ISSUES */}
        <div className="lg:col-span-3 space-y-4">
          {!selectedProjectId && (
            <div className="text-sm text-gray-500">No project selected.</div>
          )}

          {selectedProjectId && (
            <>
              {/* Issues Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Issues for Project:{' '}
                  <span className="text-blue-700">{selectedProjectId}</span>
                </h2>
                <button
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded shadow hover:bg-blue-700"
                  onClick={handleOpenCreateIssue}
                >
                  <FaPlusSquare className="mr-2" />
                  Create Issue
                </button>
              </div>

              {/* If loading or error for issues */}
              {isLoadingIssues ? (
                <p className="text-gray-600">Loading issues...</p>
              ) : isErrorIssues ? (
                <p className="text-red-500">
                  Error loading issues.{' '}
                  <button onClick={() => refetchIssues()}>Retry</button>
                </p>
              ) : (
                // Issues Table
                <>
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
                        {paginatedIssues.map((issue) => {
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
                              <td className="p-2 border-b">{issue.priority}</td>
                              <td className="p-2 border-b">{created}</td>
                              <td className="p-2 border-b">{updated}</td>
                            </tr>
                          );
                        })}
                        {paginatedIssues.length === 0 && (
                          <tr>
                            <td
                              className="p-2 border-b text-center text-gray-500"
                              colSpan={5}
                            >
                              No issues found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ▼ Pagination Controls */}
                  {filteredIssues.length > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Showing page {currentPage} of {totalPages}
                      </p>
                      <div className="space-x-2">
                        <button
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Create Issue Modal */}
              <CreateIssueModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                issueTypes={[]} // or pass your real types
                columnId={createColId}
                onCreate={handleCreateIssue}
              />
              {createIssueError && (
                <p className="text-red-500 text-sm mt-2">{createIssueError}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter Panel (Slide from left with Framer Motion) */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            key="filterPanel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0, transition: { type: 'tween' } }}
            className="fixed inset-y-0 right-0 w-52 top-12 bg-gray-700 text-white shadow-xl border-l border-gray-200 z-50 p-4 overflow-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters &amp; Sort</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-green-500 hover:text-green-400"
              >
                <FaPlusSquare className="rotate-45" /> {/* X icon trick */}
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status Filter
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
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
                <label className="block text-sm font-medium mb-1">Search:</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
                  placeholder="Find text in title/desc"
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

export default IssueListView;
