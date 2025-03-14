// File: src/pages/Board/IssueDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetIssueQuery,
  useUpdateIssueMutation,
  Issue,
} from '../../api/issue/issueApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import CommentManager from '../Board/CommentManager';
import AttachmentManager from '../Board/AttachmentManager';
import IssueLabelManager from '../Board/IssueLabelManager';
import IssueHistoryManager from '../Board/IssueHistoryManager';
import IssueWatcherManager from '../Board/IssueWatcherManager';
import WorkLogManager from '../Board/WorkLogManager';
import { useOrgContext } from '../../contexts/OrgContext';
import IssueForm from './IssueForm';

interface IssueDetailPageProps {
  boardId?: string;
}

const IssueDetailPage: React.FC<IssueDetailPageProps> = ({ boardId }) => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <div className="p-4">Please log in to view this page.</div>;
  }
  const currentUser = user._id;
  const { data: issue, isLoading, isError, refetch } = useGetIssueQuery(
    issueId!,
    { skip: !issueId }
  );
  const { selectedOrgId: orgId } = useOrgContext();
  const [updateIssue, { isLoading: isSaving }] = useUpdateIssueMutation();
  if (isLoading) {
    return <div className="p-4">Loading issue...</div>;
  }
  if (isError || !issue) {
    return <div className="p-4">Error: Issue not found.</div>;
  }
  const handleSaveIssue = async (updates: Partial<Issue>) => {
    if (!issueId) return;
    try {
      await updateIssue({ id: issueId, updates }).unwrap();
      refetch();
      alert('Issue updated!');
    } catch (err: any) {
      alert(`Failed to update issue: ${err.data?.error || err.message}`);
    }
  };
  const createdAt = issue.createdAt
    ? new Date(issue.createdAt).toLocaleString()
    : 'Unknown';
  const updatedAt = issue.updatedAt
    ? new Date(issue.updatedAt).toLocaleString()
    : 'Unknown';

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Main Content (Issue Form, Managers) */}
      <div className="md:col-span-2 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Issue Detail</h2>
            <p className="text-sm text-gray-500">
              Editing Issue: {issue.title} (ID: {issue._id})
            </p>
            <p className="text-xs text-gray-500">
              Created at: {createdAt} | Updated at: {updatedAt}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-100 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Back
          </button>
        </div>

        {/* Issue Form Card */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <IssueForm
            issue={issue}
            onSave={handleSaveIssue}
            isSaving={isSaving}
            organizationId={orgId}
            boardId={boardId}
          />
        </div>

        {/* Managers Cards */}
        {issueId && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold mb-3">Comments</h3>
              <CommentManager issueId={issueId} />
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold mb-3">Attachments</h3>
              <AttachmentManager issueId={issueId} />
            </div>
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h3 className="font-semibold mb-3">Work Log</h3>
              <WorkLogManager issueId={issueId} currentUserId={currentUser} />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (Watchers, History, Labels) */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-semibold mb-3">Watchers</h3>
          <IssueWatcherManager issueId={issueId!} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-semibold mb-3">History</h3>
          <IssueHistoryManager issueId={issueId!} />
        </div>
        {issueId && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="font-semibold mb-3">Labels</h3>
            <IssueLabelManager issueId={issueId} organizationId={orgId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDetailPage;