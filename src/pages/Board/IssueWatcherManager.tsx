// File: src/pages/Board/IssueWatcherManager.tsx
import React, { useState, useEffect } from 'react';
import {
  useListWatchersForIssueQuery,
  useAddWatcherMutation,
  useRemoveWatcherMutation,
} from '../../api/issueWatcher/issueWatcherApi';
import { useListOrgMembersQuery } from '../../api/user/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { User } from '../../types/userTypes';
import { useSelectedOrgId } from '../../contexts/OrgContext';
import { FaEye, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';

interface IssueWatcherManagerProps {
  issueId: string;
}

const IssueWatcherManager: React.FC<IssueWatcherManagerProps> = ({ issueId }) => {
  const { data: watchers, refetch: refetchWatchers } = useListWatchersForIssueQuery(issueId, { skip: !issueId });
  const [addWatcher] = useAddWatcherMutation();
  const [removeWatcher] = useRemoveWatcherMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userId, setUserId] = useState('');
  const orgId = useSelectedOrgId();
  const { data: orgMembers, isLoading: isLoadingOrgMembers, refetch: refetchOrgMembers } = useListOrgMembersQuery(
    { userId: user?._id || '', orgId: orgId || '' },
    { skip: !orgId || !user?._id }
  );

  useEffect(() => {
    if (orgId && user?._id) {
      refetchOrgMembers();
    }
  }, [orgId, user?._id, refetchOrgMembers]);

  const handleAdd = async () => {
    if (!userId) return;
    await addWatcher({ issueId, userId }).unwrap();
    setUserId('');
    refetchWatchers();
  };

  const handleRemove = async (uid: string) => {
    await removeWatcher({ issueId, userId: uid }).unwrap();
    refetchWatchers();
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="flex items-center mb-4">
        <FaEye className="text-gray-500 mr-2" />
        <h4 className="text-lg font-semibold">Watchers</h4>
      </div>

      <ul className="space-y-3 mb-4">
        {watchers?.map((w) => (
          <li
            key={w._id}
            className="border border-gray-200 p-3 rounded flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm flex-grow">
              {typeof w.userId === 'object' ? w.userId.firstName + ' ' + w.userId.lastName : w.userId}
            </span>
            <button
              className="text-red-600 hover:text-red-800 transition-colors"
              onClick={() => handleRemove(typeof w.userId === 'object' ? w.userId._id : w.userId)}
            >
              <FaTimesCircle />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center">
        <select
          className="border border-gray-300 p-2 rounded text-sm flex-1 focus:ring focus:ring-blue-200"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select a user</option>
          {orgMembers?.map((member: User) => (
            <option key={member._id} value={member._id}>
              {member.firstName} {member.lastName}
            </option>
          ))}
        </select>
        <button
          className="ml-3 bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
          onClick={handleAdd}
        >
          <FaPlusCircle className="mr-2" /> Add Watcher
        </button>
      </div>
    </div>
  );
};

export default IssueWatcherManager;