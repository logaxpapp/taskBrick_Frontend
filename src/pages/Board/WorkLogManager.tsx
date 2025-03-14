// File: src/pages/Board/WorkLogManager.tsx
import React, { useState } from 'react';
import {
  useListWorkLogsQuery,
  useCreateWorkLogMutation,
  useUpdateWorkLogMutation,
  useDeleteWorkLogMutation,
  WorkLog,
} from '../../api/workLog/workLogApi';
import { FaClock, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface WorkLogManagerProps {
  issueId: string;
  currentUserId: string; 
}

const WorkLogManager: React.FC<WorkLogManagerProps> = ({ issueId, currentUserId }) => {
  // 1) Query for all work logs on this issue
  const { data: workLogs, refetch } = useListWorkLogsQuery(
    { issueId },
    { skip: !issueId }
  );

  // 2) RTK mutations
  const [createWorkLog] = useCreateWorkLogMutation();
  const [updateWorkLog] = useUpdateWorkLogMutation();
  const [deleteWorkLog] = useDeleteWorkLogMutation();

  // 3) Local state for a new entry
  const [hours, setHours] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loggedAt, setLoggedAt] = useState<string>('');

  // For editing an existing log
  const [editId, setEditId] = useState<string | null>(null);
  const [editHours, setEditHours] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');
  const [editLoggedAt, setEditLoggedAt] = useState<string>('');

  const handleAdd = async () => {
    if (hours <= 0) {
      alert('Please enter hours > 0');
      return;
    }
    try {
      await createWorkLog({
        issueId,
        userId: currentUserId, // or read from your store
        hours,
        comment,
        loggedAt, // optional
      }).unwrap();

      setHours(0);
      setComment('');
      setLoggedAt('');
      refetch();
    } catch (err: any) {
      alert('Failed to add work log: ' + err.message);
    }
  };

  const handleDelete = async (logId: string) => {
    if (!window.confirm('Delete this work log entry?')) return;
    try {
      await deleteWorkLog({ id: logId, issueId }).unwrap();
      refetch();
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleStartEdit = (log: WorkLog) => {
    setEditId(log._id);
    setEditHours(log.hours);
    setEditComment(log.comment || '');
    setEditLoggedAt(log.loggedAt || '');
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    try {
      await updateWorkLog({
        id: editId,
        issueId,
        updates: {
          hours: editHours,
          comment: editComment,
          loggedAt: editLoggedAt,
        },
      }).unwrap();

      setEditId(null);
      refetch();
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h4 className="flex items-center text-lg font-semibold text-gray-700">
        <FaClock className="mr-2" />
        Work Logs
      </h4>

      {/* List of existing logs */}
      <div className="space-y-2">
        {workLogs?.map((wl) => (
          <div
            key={wl._id}
            className="border border-gray-200 p-3 rounded flex items-center justify-between bg-gray-50"
          >
            {/* If this is being edited */}
            {editId === wl._id ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-grow">
                <input
                  type="number"
                  className="border p-1 rounded w-20 text-sm"
                  value={editHours}
                  onChange={(e) => setEditHours(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                />
                <input
                  type="text"
                  placeholder="Comment"
                  className="border p-1 rounded text-sm flex-1"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                />
                <input
                  type="datetime-local"
                  className="border p-1 rounded text-sm"
                  value={editLoggedAt}
                  onChange={(e) => setEditLoggedAt(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal display
              <div className="flex-1">
                <div className="text-sm text-gray-800 font-medium">
                  {wl.hours.toFixed(2)} hrs 
                </div>
                {wl.comment && (
                  <div className="text-xs text-gray-600">
                    {wl.comment}
                  </div>
                )}
                {wl.loggedAt && (
                  <div className="text-xs text-gray-400">
                    Logged At: {new Date(wl.loggedAt).toLocaleString()}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  Created: {wl.createdAt ? new Date(wl.createdAt).toLocaleString() : ''}
                </div>
              </div>
            )}
            {/* Action buttons (if not editing) */}
            {editId !== wl._id && (
              <div className="flex space-x-2 ml-2">
                <button
                  className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleStartEdit(wl)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(wl._id)}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form to add new entry */}
      <div className="border border-gray-200 p-3 rounded bg-gray-50">
        <h5 className="text-sm text-gray-700 mb-2 font-medium">Add Work Log</h5>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="number"
            className="border p-1 rounded w-24 text-sm"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min={0.01}
            step={0.01}
          />
          <input
            type="text"
            className="border p-1 rounded text-sm flex-1"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border p-1 rounded text-sm"
            value={loggedAt}
            onChange={(e) => setLoggedAt(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkLogManager;
