// File: src/pages/Board/AllWorkLogsManager.tsx
import React from 'react';
import { useListAllWorkLogsQuery, useDeleteWorkLogMutation, WorkLog } from '../../api/workLog/workLogApi';
import { FaTrash, FaClock } from 'react-icons/fa';

/**
 * This component shows all WorkLogs in the system (admin or global view).
 * Optionally allows deletion. 
 * For editing, you'd need a global approach or row-by-row editing logic (like in WorkLogManager).
 */
const AllWorkLogsManager: React.FC = () => {
  // 1) Fetch all logs
  const { data: allLogs, isLoading, isError, refetch } = useListAllWorkLogsQuery();
  // 2) If we allow delete, here's the mutation
  const [deleteWorkLog] = useDeleteWorkLogMutation();

  const handleDelete = async (log: WorkLog) => {
    if (!window.confirm(`Delete work log of ${log.hours} hours?`)) return;
    try {
      await deleteWorkLog({ id: log._id, issueId: log.issueId }).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (isLoading) return <div>Loading all work logs...</div>;
  if (isError) return <div>Error loading all work logs.</div>;

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h4 className="flex items-center text-lg font-semibold text-gray-700">
        <FaClock className="mr-2" />
        All Work Logs
      </h4>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border-b border-gray-200 text-left">Hours</th>
            <th className="px-3 py-2 border-b border-gray-200 text-left">Comment</th>
            <th className="px-3 py-2 border-b border-gray-200 text-left">LoggedAt</th>
            <th className="px-3 py-2 border-b border-gray-200 text-left">Issue ID</th>
            <th className="px-3 py-2 border-b border-gray-200 text-left">User ID</th>
            <th className="px-3 py-2 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allLogs?.map((wl) => {
            const logged = wl.loggedAt ? new Date(wl.loggedAt).toLocaleString() : '';
            return (
              <tr key={wl._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b border-gray-200">{wl.hours}</td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {wl.comment ?? ''}
                </td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {logged}
                </td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {wl.issueId}
                </td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {wl.userId}
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 inline-flex items-center"
                    onClick={() => handleDelete(wl)}
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllWorkLogsManager;
