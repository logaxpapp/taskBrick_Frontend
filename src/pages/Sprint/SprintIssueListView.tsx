import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PreDashboard from '../auth/PreDashboard';
import { useAppSelector } from '../../app/hooks/redux'; 
import { useListProjectsQuery } from '../../api/project/projectApi';
import {
  useListSprintsQuery,
  useAddIssueToSprintMutation,
  useRemoveIssueFromSprintMutation,
} from '../../api/sprint/sprintApi';
import {
  useListIssuesQuery,
  useCreateIssueMutation,
} from '../../api/issue/issueApi';

// Board & Column queries
import { useListBoardsQuery } from '../../api/board/boardApi';
import { useListBoardColumnsQuery } from '../../api/boardColumn/boardColumnApi';

// Icons
import {
  FaPlus,
  FaArrowRight,
  FaTrash,
  FaSearch,
  FaProjectDiagram,
  FaFlagCheckered,
  FaTasks,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const SprintIssueListView: React.FC = () => {
  const { selectedOrgId } = useAppSelector((state) => state.organization);
  const orgId = selectedOrgId || '';

  // (1) Pick a project
  const [projectId, setProjectId] = useState('');
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useListProjectsQuery(orgId, { skip: !orgId });

  // (2) Pick a sprint
  const [sprintId, setSprintId] = useState('');
  const {
    data: sprints,
    isLoading: isLoadingSprints,
    isError: isErrorSprints,
  } = useListSprintsQuery({ projectId }, { skip: !projectId });

  // (3) List Boards for this project
  const { data: boards } = useListBoardsQuery({ projectId }, { skip: !projectId });
  const [boardId, setBoardId] = useState('');

  // Once we have boards, if there's exactly 1, auto-set it:
  useEffect(() => {
    if (boards && boards.length === 1) {
      setBoardId(boards[0]._id);
    }
  }, [boards]);

  // (4) List Board Columns for the chosen board
  const {
    data: boardColumns,
    isLoading: isLoadingColumns,
    isError: isErrorColumns,
  } = useListBoardColumnsQuery({ boardId }, { skip: !boardId });

  // (5) List Issues for this project
  const {
    data: projectIssues,
    isLoading: isLoadingIssues,
    isError: isErrorIssues,
    refetch: refetchIssues,
  } = useListIssuesQuery({ projectId }, { skip: !projectId });

  // Mutations
  const [addIssueToSprint] = useAddIssueToSprintMutation();
  const [removeIssueFromSprint] = useRemoveIssueFromSprintMutation();
  const [createIssue, { isLoading: isCreating }] = useCreateIssueMutation();

  // Local state for search, new-issue form, etc.
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState('TO_DO');
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  // Separate issues based on sprint
  const issuesInSprint = useMemo(() => {
    if (!projectIssues || !sprintId) return [];
    return projectIssues.filter((iss) => iss.sprintId === sprintId);
  }, [projectIssues, sprintId]);

  const issuesNotInSprint = useMemo(() => {
    if (!projectIssues || !sprintId) return [];
    return projectIssues.filter((iss) => iss.sprintId !== sprintId);
  }, [projectIssues, sprintId]);

  // Filter by search term
  const filteredInSprint = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return issuesInSprint;
    return issuesInSprint.filter((i) => i.title.toLowerCase().includes(term));
  }, [issuesInSprint, searchTerm]);

  const filteredNotInSprint = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return issuesNotInSprint;
    return issuesNotInSprint.filter((i) => i.title.toLowerCase().includes(term));
  }, [issuesNotInSprint, searchTerm]);

  // Pagination
  const [inSprintPage, setInSprintPage] = useState(1);
  const [notInSprintPage, setNotInSprintPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination for "in sprint"
  const inSprintTotalPages = Math.ceil(filteredInSprint.length / itemsPerPage);
  const inSprintStartIdx = (inSprintPage - 1) * itemsPerPage;
  const inSprintPaginated = filteredInSprint.slice(
    inSprintStartIdx,
    inSprintStartIdx + itemsPerPage
  );

  // Pagination for "not in sprint"
  const notInSprintTotalPages = Math.ceil(filteredNotInSprint.length / itemsPerPage);
  const notInSprintStartIdx = (notInSprintPage - 1) * itemsPerPage;
  const notInSprintPaginated = filteredNotInSprint.slice(
    notInSprintStartIdx,
    notInSprintStartIdx + itemsPerPage
  );

  // Handlers
  async function handleAddIssue(issueId: string) {
    if (!sprintId) return;
    try {
      await addIssueToSprint({ sprintId, issueId }).unwrap();
      refetchIssues();
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  async function handleRemoveIssue(issueId: string) {
    if (!sprintId) return;
    try {
      await removeIssueFromSprint({ sprintId, issueId }).unwrap();
      refetchIssues();
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  // Open modal to create new issue
  function openCreateIssueModal() {
    setIsModalOpen(true);
    // If boardColumns exist, default to first column
    if (boardColumns && boardColumns.length > 0) {
      setSelectedColumnId(boardColumns[0]._id);
    } else {
      setSelectedColumnId(null);
    }
  }

  function closeCreateIssueModal() {
    setIsModalOpen(false);
    setNewTitle('');
    setNewStatus('TO_DO');
  }

  async function handleCreateNewIssue() {
    if (!projectId || !sprintId) {
      alert('Select a project and sprint first!');
      return;
    }
    if (!newTitle.trim()) {
      alert('Issue title is required.');
      return;
    }

    const finalColumnId = selectedColumnId || null;

    try {
      await createIssue({
        projectId,
        sprintId,
        boardColumnId: finalColumnId,
        title: newTitle.trim(),
        status: newStatus,
      }).unwrap();

      refetchIssues();
      alert('Issue created & added to sprint!');
      closeCreateIssueModal();
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  }

  // Early returns
  if (!selectedOrgId) {
    return <div className="p-4 text-red-500">
      <PreDashboard />
    </div>;
  }
  if (isLoadingProjects) {
    return <div className="p-4">Loading Projects...</div>;
  }
  if (isErrorProjects) {
    return <div className="p-4 text-red-500">Error loading projects.</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FaTasks />
        Sprint Issue Management
      </h2>

      {/* Card: Project + Sprint + Board */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaProjectDiagram className="text-blue-600" />
          Select Project & Sprint
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Project */}
          <div className="flex-1">
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Project:
            </label>
            <select
              className="border rounded px-3 py-2 w-full text-sm"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setSprintId('');
                setBoardId('');
                setInSprintPage(1);
                setNotInSprintPage(1);
              }}
            >
              <option value="">-- Select Project --</option>
              {projects?.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sprint */}
          {projectId && !isLoadingSprints && !isErrorSprints && sprints && (
            <div className="flex-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Sprint:
              </label>
              <select
                className="border rounded px-3 py-2 w-full text-sm"
                value={sprintId}
                onChange={(e) => {
                  setSprintId(e.target.value);
                  setInSprintPage(1);
                  setNotInSprintPage(1);
                }}
              >
                <option value="">-- Select Sprint --</option>
                {sprints.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Board (only if boards found) */}
          {projectId && boards && boards.length > 0 && (
            <div className="flex-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Board:
              </label>
              {boards.length === 1 ? (
                // If there's exactly one board, show read-only or 
                // skip the dropdown entirely
                <div className="text-sm text-gray-500">
                  {boards[0].name} (auto-selected)
                </div>
              ) : (
                <select
                  className="border rounded px-3 py-2 w-full text-sm"
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                >
                  <option value="">-- Select Board --</option>
                  {boards.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* If sprint is chosen, show the 2-column area */}
      <AnimatePresence mode="wait">
        {sprintId && (
          <motion.div
            key="sprint-content"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <FaSearch className="text-blue-600" />
                Search Issues
              </h3>
              <input
                type="text"
                placeholder="Type to filter issues by title..."
                className="border rounded px-3 py-2 w-full text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setInSprintPage(1);
                  setNotInSprintPage(1);
                }}
              />
            </div>

            {/* 2-column: in sprint / not in sprint */}
            <div className="bg-white rounded-lg shadow p-4 space-y-6 relative">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-8">
                <FaFlagCheckered className="text-green-600" />
                Manage Issues in Sprint
              </h3>

              {/* Create Issue button */}
              <button
                onClick={openCreateIssueModal}
                className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center gap-1"
              >
                <FaPlus />
                Create Issue
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Issues in sprint */}
                <div className="border border-gray-200 rounded p-4 space-y-2">
                  <h4 className="text-md font-medium text-blue-700 mb-1">
                    Issues Currently in Sprint
                  </h4>
                  <div className="text-sm text-gray-700 divide-y">
                    {isLoadingIssues ? (
                      <p>Loading issues...</p>
                    ) : isErrorIssues ? (
                      <p className="text-red-500">Error loading issues</p>
                    ) : inSprintPaginated.length === 0 ? (
                      <p className="text-gray-500 italic">
                        No issues in this sprint
                      </p>
                    ) : (
                      inSprintPaginated.map((issue) => (
                        <div
                          key={issue._id}
                          className="py-2 flex items-center justify-between"
                        >
                          <Link
                            to={`/dashboard/issues/${issue._id}`}
                            className="text-blue-600 underline"
                          >
                            {issue.title}
                          </Link>
                          <button
                            onClick={() => handleRemoveIssue(issue._id)}
                            className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 flex items-center gap-1"
                          >
                            <FaTrash />
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* PAGINATION for "in sprint" */}
                  {filteredInSprint.length > 0 && (
                    <div className="flex items-center justify-between mt-3">
                      <button
                        disabled={inSprintPage <= 1}
                        onClick={() => setInSprintPage((p) => p - 1)}
                        className="text-xs bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <FaChevronLeft />
                        Prev
                      </button>
                      <span className="text-sm">
                        Page {inSprintPage} of {inSprintTotalPages}
                      </span>
                      <button
                        disabled={inSprintPage >= inSprintTotalPages}
                        onClick={() => setInSprintPage((p) => p + 1)}
                        className="text-xs bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
                      >
                        Next
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </div>

                {/* Column 2: Issues not in sprint */}
                <div className="border border-gray-200 rounded p-4 space-y-2">
                  <h4 className="text-md font-medium text-blue-700 mb-1">
                    Available Issues (Not in Sprint)
                  </h4>
                  <div className="text-sm text-gray-700 divide-y">
                    {isLoadingIssues ? (
                      <p>Loading issues...</p>
                    ) : isErrorIssues ? (
                      <p className="text-red-500">Error loading issues</p>
                    ) : notInSprintPaginated.length === 0 ? (
                      <p className="text-gray-500 italic">
                        No issues outside this sprint
                      </p>
                    ) : (
                      notInSprintPaginated.map((issue) => (
                        <div
                          key={issue._id}
                          className="py-2 flex items-center justify-between"
                        >
                          <Link
                            to={`/dashboard/issues/${issue._id}`}
                            className="text-blue-600 underline"
                          >
                            {issue.title}
                          </Link>
                          <button
                            onClick={() => handleAddIssue(issue._id)}
                            className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-200 flex items-center gap-1"
                          >
                            <FaArrowRight />
                            Add
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* PAGINATION for "Not In Sprint" */}
                  {filteredNotInSprint.length > 0 && (
                    <div className="flex items-center justify-between mt-3">
                      <button
                        disabled={notInSprintPage <= 1}
                        onClick={() => setNotInSprintPage((p) => p - 1)}
                        className="text-xs bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <FaChevronLeft />
                        Prev
                      </button>
                      <span className="text-sm">
                        Page {notInSprintPage} of {notInSprintTotalPages}
                      </span>
                      <button
                        disabled={notInSprintPage >= notInSprintTotalPages}
                        onClick={() => setNotInSprintPage((p) => p + 1)}
                        className="text-xs bg-gray-100 px-2 py-1 rounded disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
                      >
                        Next
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Create New Issue */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="create-issue-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FaPlus className="text-purple-600" />
                Create New Issue
              </h2>

              {/* Board Column (only if we have a board) */}
              {boardId && boardColumns && boardColumns.length > 0 && (
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    Board Column:
                  </label>
                  <select
                    className="border rounded px-3 py-2 w-full text-sm"
                    value={selectedColumnId || ''}
                    onChange={(e) => setSelectedColumnId(e.target.value || null)}
                  >
                    {boardColumns.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name || 'Unnamed Column'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full text-sm"
                    placeholder="Issue title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    className="border rounded px-3 py-2 w-full text-sm"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="TO_DO">TO_DO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="BLOCKED">BLOCKED</option>
                    <option value="DONE">DONE</option>
                    <option value="DEPLOYED">DEPLOYED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeCreateIssueModal}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewIssue}
                  disabled={isCreating}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l2-2-2-2v4a8 8 0 010 16H4a4 4 0 010-8z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SprintIssueListView;
