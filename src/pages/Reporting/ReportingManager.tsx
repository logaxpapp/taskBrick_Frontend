import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

import { useListOrgsForUserQuery } from '../../api/userOrganization/userOrganizationApi';
import { useListProjectsQuery } from '../../api/project/projectApi';

// Our reporting queries
import {
  useGetOrgReportingQuery,
  useGetProjectReportingQuery,
  // If you want Board/Issue:
  useGetBoardReportingQuery,
  useGetIssueReportingQuery,
} from '../../api/reporting/reportingApi';

// Example sub-components to display the data
// Or you can inline them like earlier examples
import OrganizationReportView from './OrganizationReportView';
import ProjectReportView from './ProjectReportView';
import BoardReportView from './BoardReportView';
import IssueReportView from './IssueReportView';

// The possible levels of reporting
type ReportLevel = 'organization' | 'project' | 'board' | 'issue';

const ReportingManager: React.FC = () => {
  // 1) Get the current user from Redux, so we know userId
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id;

  // 2) Local state for which “level” we’re viewing
  const [reportLevel, setReportLevel] = useState<ReportLevel>('organization');

  // 3) Local state for chosen Org ID, Project ID, Board ID, Issue ID
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');

  // 4) Fetch user’s orgs
  const { data: orgPivots, isLoading: isOrgLoading } = useListOrgsForUserQuery(userId || '', {
    skip: !userId,
  });
  const orgs = orgPivots?.map((pivot) => pivot.organizationId) || [];

  // 5) Once an Org is chosen, fetch projects
  const {
    data: projects,
    isLoading: isProjectsLoading,
  } = useListProjectsQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  // If you want boards, do something like:
  // const { data: boards, isLoading: isBoardsLoading } = useListBoardsQuery({ projectId: selectedProjectId }, { skip: !selectedProjectId });

  // 6) We call the relevant reporting query. We'll skip if the user hasn't selected the needed ID, or if the reportLevel doesn't match
  const orgReportQuery = useGetOrgReportingQuery(selectedOrgId, {
    skip: reportLevel !== 'organization' || !selectedOrgId,
  });
  const projectReportQuery = useGetProjectReportingQuery(selectedProjectId, {
    skip: reportLevel !== 'project' || !selectedProjectId,
  });
  const boardReportQuery = useGetBoardReportingQuery(selectedBoardId, {
    skip: reportLevel !== 'board' || !selectedBoardId,
  });
  const issueReportQuery = useGetIssueReportingQuery(selectedIssueId, {
    skip: reportLevel !== 'issue' || !selectedIssueId,
  });

  // For display
  const isLoadingReport =
    orgReportQuery.isLoading ||
    projectReportQuery.isLoading ||
    boardReportQuery.isLoading ||
    issueReportQuery.isLoading;

  const isErrorReport =
    orgReportQuery.isError ||
    projectReportQuery.isError ||
    boardReportQuery.isError ||
    issueReportQuery.isError;

  // On "reportLevel" change, we might want to reset some selected IDs
  useEffect(() => {
    // e.g. if user changes from "project" to "organization," we can clear project
    if (reportLevel === 'organization') {
      setSelectedProjectId('');
      setSelectedBoardId('');
      setSelectedIssueId('');
    } else if (reportLevel === 'project') {
      setSelectedBoardId('');
      setSelectedIssueId('');
    } else if (reportLevel === 'board') {
      setSelectedIssueId('');
    }
    // If "issue," we eventually pick an issue from something
  }, [reportLevel]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Reporting Manager</h1>

      {isOrgLoading && <p className="text-sm text-gray-500">Loading your organizations...</p>}
      {!isOrgLoading && orgs.length === 0 && (
        <p className="text-sm text-red-500">No organizations found.</p>
      )}

      {/* ----- Step 1: Choose Report Level ----- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Report Level
        </label>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={reportLevel}
          onChange={(e) => setReportLevel(e.target.value as ReportLevel)}
        >
          <option value="organization">Organization</option>
          <option value="project">Project</option>
          <option value="board">Board</option>
          <option value="issue">Issue</option>
        </select>
      </div>

      {/* ----- Step 2: If user must pick an Org (for all levels except maybe "issue" if your design differs) ----- */}
      {(reportLevel === 'organization' ||
        reportLevel === 'project' ||
        reportLevel === 'board' ||
        reportLevel === 'issue') && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Organization
          </label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            <option value="">-- Choose an Org --</option>
            {orgs.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ----- Step 3: If user must pick a Project (for project/board/issue levels) ----- */}
      {(reportLevel === 'project' ||
        reportLevel === 'board' ||
        reportLevel === 'issue') && selectedOrgId && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Project
          </label>
          {isProjectsLoading && <p className="text-xs text-gray-500">Loading projects...</p>}
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">-- Choose a Project --</option>
            {projects?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.key})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ----- Step 4: (Optional) If user must pick a Board (for board/issue levels) ----- */}
      {reportLevel === 'board' && selectedProjectId && (
        <>
          {/* If you have a "listBoardsQuery" in your boardApi:
              const { data: boards } = useListBoardsQuery({ projectId: selectedProjectId });
          */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Board
            </label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
              value={selectedBoardId}
              onChange={(e) => setSelectedBoardId(e.target.value)}
            >
              <option value="">-- Choose a Board --</option>
              {/* boards?.map(...) */}
            </select>
          </div>
        </>
      )}

      {/* ----- Step 5: (Optional) If user must pick an Issue (for issue level) ----- */}
      {reportLevel === 'issue' && selectedProjectId && (
        <>
          {/* You might do something like 
              const { data: issues } = useListIssuesQuery({ projectId: selectedProjectId });
             then fill a dropdown:
          */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Issue
            </label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
            >
              <option value="">-- Choose an Issue --</option>
              {/* issues?.map(...) */}
            </select>
          </div>
        </>
      )}

      {/* Now show the result: check if loading/error, otherwise show the subview */}
      {isLoadingReport && <p className="text-gray-500">Loading report data...</p>}
      {isErrorReport && (
        <p className="text-red-500">Error fetching report data. Check console or try again.</p>
      )}

      {!isLoadingReport && !isErrorReport && (
        <div className="mt-6">
          {reportLevel === 'organization' && orgReportQuery.data && (
            <OrganizationReportView data={orgReportQuery.data} />
          )}
          {reportLevel === 'project' && projectReportQuery.data && (
            <ProjectReportView data={projectReportQuery.data} />
          )}
          {reportLevel === 'board' && boardReportQuery.data && (
            <BoardReportView data={boardReportQuery.data} />
          )}
          {reportLevel === 'issue' && issueReportQuery.data && (
            <IssueReportView data={issueReportQuery.data} />
          )}
        </div>
      )}
    </div>
  );
};

export default ReportingManager;
