// File: src/pages/Board/IssueLabelManager.tsx

import React, { useState } from 'react';
import {
  useListLabelsForIssueQuery,
  useAddLabelMutation,
  useRemoveLabelMutation,
} from '../../api/issueLabel/issueLabelApi';
import { useListLabelsQuery, Label } from '../../api/label/labelApi';
import { FaTag, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';

interface IssueLabelManagerProps {
  issueId: string;
  organizationId?: string | null; // allow null or undefined
}

const IssueLabelManager: React.FC<IssueLabelManagerProps> = ({ issueId, organizationId }) => {
  // 1) Which labels are currently on this issue
  const { data: issueLabels, refetch: refetchIssueLabels } = useListLabelsForIssueQuery(issueId, {
    skip: !issueId,
  });

  // 2) All labels for this org
  // If organizationId is null or undefined, skip the query
  const { data: allLabels, isLoading: isLoadingLabels } = useListLabelsQuery(organizationId ?? '', {
    skip: !organizationId,
  });

  // 3) Add / remove label mutations
  const [addLabel] = useAddLabelMutation();
  const [removeLabel] = useRemoveLabelMutation();

  // local state for the selected label ID
  const [labelId, setLabelId] = useState('');

  const handleAdd = async () => {
    if (!labelId) return;
    await addLabel({ issueId, labelId }).unwrap();
    setLabelId('');
    refetchIssueLabels();
  };

  const handleRemove = async (lblId: string) => {
    await removeLabel({ issueId, labelId: lblId }).unwrap();
    refetchIssueLabels();
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex items-center mb-4">
        <FaTag className="text-gray-500 mr-2" />
        <h4 className="text-lg font-semibold">Labels</h4>
      </div>

      <div className="space-y-3 mb-4">
        {issueLabels?.map((l) => (
          <div
            key={l._id}
            className="border border-gray-200 p-3 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm flex-grow">
              {l.labelId?.name ?? 'Unknown Label'}
            </span>
            <button
              className="text-red-600 hover:text-red-800 transition-colors"
              onClick={() => handleRemove(l.labelId._id)}
            >
              <FaTimesCircle />
            </button>
          </div>
        ))}
      </div>

      {/* Add Label */}
      <div className="flex items-center">
        {/* If the org doesn't exist or we have no labels, disable */}
        <select
          className="border border-gray-300 p-2 rounded text-sm flex-1 focus:ring focus:ring-blue-200"
          value={labelId}
          onChange={(e) => setLabelId(e.target.value)}
          disabled={!organizationId || !allLabels?.length}
        >
          <option value="">Select a label</option>
          {allLabels?.map((label: Label) => (
            <option key={label._id} value={label._id}>
              {label.name}
            </option>
          ))}
        </select>
        <button
          className="ml-3 bg-purple-600 text-white px-4 py-2 text-sm rounded hover:bg-purple-800 transition-colors flex items-center disabled:opacity-60"
          onClick={handleAdd}
          disabled={!labelId}
        >
          <FaPlusCircle className="mr-2" /> Add Label
        </button>
      </div>

      {isLoadingLabels && (
        <p className="text-sm text-gray-400 mt-2">Loading labels...</p>
      )}
    </div>
  );
};

export default IssueLabelManager;
