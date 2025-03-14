// File: src/pages/Board/IssueHistoryManager.tsx
import React from 'react';
import {
  useListIssueHistoryQuery,
  useDeleteHistoryRecordMutation,
} from '../../api/issueHistory/issueHistoryApi';

interface IssueHistoryManagerProps {
  issueId: string;
}

const IssueHistoryManager: React.FC<IssueHistoryManagerProps> = ({ issueId }) => {
  const { data: history, refetch } = useListIssueHistoryQuery(issueId, { skip: !issueId });
  const [deleteRecord] = useDeleteHistoryRecordMutation();

  const handleDelete = async (recId: string) => {
    if (!window.confirm('Delete this history record?')) return;
    await deleteRecord(recId);
    refetch();
  };

  return (
    <div className="p-3 bg-white rounded shadow-sm">
      <h4 className="text-md font-semibold mb-2">History</h4>
      <ul className="space-y-2">
        {history?.map((rec) => (
          <li
            key={rec._id}
            className="border border-gray-200 p-2 rounded flex justify-between items-center text-sm"
          >
            <div>
              <div>
                <span className="font-medium">{rec.field}</span>: {rec.oldValue} → {rec.newValue}
              </div>
              <div className="text-xs text-gray-400">
                Changed by {rec.changedByUserId} at {rec.createdAt}
              </div>
            </div>
            <button
              className="text-xs text-red-600 hover:underline ml-2"
              onClick={() => handleDelete(rec._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueHistoryManager;
