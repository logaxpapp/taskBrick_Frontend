import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useListIssuesQuery, Issue } from '../../api/issue/issueApi';
// If you want to open a "create issue" modal:
import CreateIssueModal from '../Board/CreateIssueModal';
import { useCreateIssueMutation } from '../../api/issue/issueApi';

interface IssueListViewProps {
    projectId?: string; 
  }

const IssueListView: React.FC<IssueListViewProps> = ({projectId}) => {
  

  // ----- Queries -----
  // We'll pull a list of issues for this project
  const {
    data: issues,
    isLoading,
    isError,
    refetch: refetchIssues,
  } = useListIssuesQuery(
    { projectId },
    {
      skip: !projectId,
    }
  );

  // ----- Local UI States -----
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('createdAt');

  // For the "Create Issue" modal:
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createColId, setCreateColId] = useState<string | null>(null);
  const [createIssueError, setCreateIssueError] = useState('');
  const [createIssue] = useCreateIssueMutation();

  // We can do a client-side "combined" list of issues:
  const filteredIssues = useMemo(() => {
    if (!issues) return [];

    let filtered = [...issues];
    // 1) Filter by status
    if (statusFilter) {
      filtered = filtered.filter((iss) => iss.status === statusFilter);
    }
    // 2) Filter by searchTerm in title or description
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((iss) =>
        iss.title.toLowerCase().includes(lowerSearch) ||
        (iss.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }
    // 3) Sort by chosen field
    filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'updatedAt') {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA; // descending
      } else {
        // sortBy = 'createdAt' (default)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // descending
      }
    });

    return filtered;
  }, [issues, statusFilter, searchTerm, sortBy]);

  // ----- Handlers -----
  const handleOpenCreateIssue = () => {
    setCreateColId(null); // We might not be using columns in this view
    setIsCreateModalOpen(true);
  };

  // Actually create the issue
  const handleCreateIssue = async (title: string, issueTypeId: string) => {
    if (!projectId) return;
    try {
      // we can pass boardColumnId=null or omit it if not using columns
      await createIssue({
        projectId,
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

  // ----- Early Return or Render -----
  if (!projectId) {
    return <div className="p-4 text-red-500">No projectId in URL.</div>;
  }
  if (isLoading) {
    return <div className="p-4">Loading Issues...</div>;
  }
  if (isError) {
    return <div className="p-4 text-red-500">Error loading issues.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header / Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-bold">Issues for Project: {projectId}</h2>
        <div className="mt-3 md:mt-0">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            onClick={handleOpenCreateIssue}
          >
            + Create Issue
          </button>
        </div>
      </div>

      {/* Filter + Search + Sort controls */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-2">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Search title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By:</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="createdAt">Created (Desc)</option>
            <option value="updatedAt">Updated (Desc)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Issues Table/List */}
      <div className="border rounded overflow-hidden">
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
                  <td className="p-2 border-b">{issue.priority}</td>
                  <td className="p-2 border-b">{created}</td>
                  <td className="p-2 border-b">{updated}</td>
                </tr>
              );
            })}
            {filteredIssues.length === 0 && (
              <tr>
                <td className="p-2 border-b text-center text-gray-500" colSpan={5}>
                  No issues found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Issue Modal (Reusing your existing code) */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        issueTypes={[]} // Or pass real list if you have them
        columnId={createColId} // We pass null if we're not using columns
        onCreate={handleCreateIssue}
      />
      {createIssueError && <p className="text-red-500 text-sm">{createIssueError}</p>}
    </div>
  );
};

export default IssueListView;
