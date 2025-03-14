/*****************************************************************
 * File: src/components/Issue/IssueForm.tsx
 * Description: An enhanced form for creating/editing an Issue,
 *              now including "startDate" and "dueDate".
 *****************************************************************/
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { RootState } from '../../app/store';

// 1) Data Types & RTK Query Hooks
import { Issue } from '../../api/issue/issueApi';
import { useListIssuesQuery } from '../../api/issue/issueApi';
import { useListIssueTypesQuery } from '../../api/issueType/issueTypeApi';
import { useListBoardColumnsQuery } from '../../api/boardColumn/boardColumnApi';
import { useListOrgMembersQuery } from '../../api/user/userApi';
import { useAppSelector} from '../../app/hooks/redux';
/** 
 * Props for the IssueForm
 */
interface IssueFormProps {
  /** The existing issue (if we're editing) */
  issue: Issue;

  /** Callback to save changes. Expects partial Issue updates. */
  onSave: (updates: Partial<Issue>) => void;

  /** If we're performing an async operation, we can disable the form. */
  isSaving: boolean;

  /**
   * The organization ID for loading relevant data (e.g., org members, issue types).
   */
  organizationId?: string | null;

  /**
   * The board ID for loading board columns (if this issue belongs to a board).
   */
  boardId?: string;

  /**
   * The project ID for loading possible parent issues, if needed.
   */
  projectId?: string;
}

/**
 * A form to edit or create an Issue, allowing you to update:
 *  - Title, Description, Status, Priority
 *  - Assignee/Reporter (org members)
 *  - Story Points
 *  - Board Column (if in a board)
 *  - Issue Type (from issue types in the org)
 *  - Parent Issue (from all issues in the project)
 *  - NEW: Start Date, Due Date
 */
const IssueForm: React.FC<IssueFormProps> = ({
  issue,
  onSave,
  isSaving,
 
  boardId,
  projectId,
}) => {
  // -----------------------------------
  //  Local state for form fields
  // -----------------------------------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TO_DO');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [reporterId, setReporterId] = useState<string | null>(null);
  const [storyPoints, setStoryPoints] = useState<number | null>(null);
  const [boardColumnId, setBoardColumnId] = useState<string | null>(null);
  const [issueTypeId, setIssueTypeId] = useState<string | null>(null);
  const [parentIssueId, setParentIssueId] = useState<string | null>(null);

  console.log('IssueForm: issue', issue);
  // ---------- NEW date fields ----------
  // We'll store them as strings. 
  // The server might accept them as ISO strings or parse them.
  const [startDate, setStartDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  

  const organizationId = useSelector((state: RootState) => state.organization.selectedOrgId);
  // -----------------------------------
  //  Redux: logged-in user
  // -----------------------------------
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || 'me';

  // -----------------------------------
  //  RTK Query: load dependencies
  // -----------------------------------

  // 1) Board columns (skip if no boardId)
  const { data: columns } = useListBoardColumnsQuery(
    { boardId },
    { skip: !boardId }
  );

  console.log('IssueForm: columns', columns);

  // 2) Org members (for assigning / reporting). 
  //    We'll skip if no org is set:
  const { data: orgUsers } = useListOrgMembersQuery(
    { userId, orgId: organizationId || '' },
    { skip: !organizationId }
  );

  // 3) Issue Types (skip if no org)
  const { data: issueTypes } = useListIssueTypesQuery(organizationId || '', {
    skip: !organizationId,
  });

  // 4) All issues in the same project (skip if no projectId)
  const { data: allIssues } = useListIssuesQuery(
    { projectId },
    { skip: !projectId }
  );

  // -----------------------------------
  //  useEffect: initialize form fields
  // -----------------------------------
  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description ?? '');
      setStatus(issue.status ?? 'TO_DO');
      setPriority(issue.priority ?? 'MEDIUM');
      setAssigneeId(issue.assigneeId ?? null);
      setReporterId(issue.reporterId ?? null);
      setStoryPoints(issue.storyPoints ?? null);
      setBoardColumnId(issue.boardColumnId ?? null);
      setIssueTypeId(issue.issueTypeId ?? null);
      setParentIssueId(issue.parentIssueId ?? null);

      // Convert the existing date fields to ISO strings or "YYYY-MM-DD"
      // If the server returns them as ISO, we might do substring to get "YYYY-MM-DD"
      if (issue.startDate) {
        const d = new Date(issue.startDate);
        // toISOString => "2025-03-05T00:00:00.000Z"
        // substring(0,10) => "2025-03-05"
        setStartDate(d.toISOString().substring(0, 10));
      } else {
        setStartDate('');
      }
      if (issue.dueDate) {
        const d = new Date(issue.dueDate);
        setDueDate(d.toISOString().substring(0, 10));
      } else {
        setDueDate('');
      }
    }
  }, [issue]);

  // -----------------------------------
  //  Save handler
  // -----------------------------------
  const handleSave = () => {
    const updates: Partial<Issue> = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      reporterId,
      storyPoints,
      boardColumnId,
      issueTypeId,
      parentIssueId,
    };

    // Convert local date strings back to something server expects
    // If the server expects ISO strings or Date objects, we do:
    updates.startDate = startDate ? new Date(startDate).toISOString() : null;
    updates.dueDate = dueDate ? new Date(dueDate).toISOString() : null;

    onSave(updates);
  };

  // -----------------------------------
  //  Render form
  // -----------------------------------
  return (
    <div className="bg-white rounded shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FaEdit className="text-gray-500" />
        <h3 className="text-xl font-semibold text-gray-800">
          {issue ? 'Edit Issue Fields' : 'Create New Issue'}
        </h3>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="TO_DO">TO_DO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="DONE">DONE</option>
            <option value="DEPLOYED">DEPLOYED</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        {/* Board Column */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Board Column
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={boardColumnId ?? ''}
            onChange={(e) => setBoardColumnId(e.target.value || null)}
          >
            <option value="">-- None --</option>
            {columns?.map((col) => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Type
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={issueTypeId ?? ''}
            onChange={(e) => setIssueTypeId(e.target.value || null)}
          >
            <option value="">-- None --</option>
            {issueTypes?.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={assigneeId ?? ''}
            onChange={(e) => setAssigneeId(e.target.value || null)}
          >
            <option value="">-- Unassigned --</option>
            {orgUsers?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Reporter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reporter
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={reporterId ?? ''}
            onChange={(e) => setReporterId(e.target.value || null)}
          >
            <option value="">-- None --</option>
            {orgUsers?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Story Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Points
          </label>
          <input
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={storyPoints ?? ''}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setStoryPoints(isNaN(val) ? null : val);
            }}
          />
        </div>

        {/* Parent Issue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Issue
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={parentIssueId ?? ''}
            onChange={(e) => setParentIssueId(e.target.value || null)}
          >
            <option value="">(No Parent)</option>
            {allIssues
              ?.filter((iss) => iss._id !== issue._id) // exclude self if desired
              .map((iss) => (
                <option key={iss._id} value={iss._id}>
                  {iss.title}
                </option>
              ))}
          </select>
        </div>

        {/* --------------- NEW FIELDS: Start Date & Due Date --------------- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {/* --------------------------------------------------------------- */}

        {/* Description (spans 2 columns) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin mr-2 h-4 w-4 text-white"
                viewBox="0 0 24 24"
              ></svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default IssueForm;
