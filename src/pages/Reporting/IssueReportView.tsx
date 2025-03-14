/********************************************
 * File: src/pages/Board/IssueReportView.tsx
 ********************************************/
import React from 'react';
import { IssueReportingResponse } from '../../api/reporting/reportingApi';

interface IssueReportViewProps {
  data: IssueReportingResponse;
}

const IssueReportView: React.FC<IssueReportViewProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold mb-2">Issue: {data.title}</h2>
      <p className="text-sm">Status: {data.status}</p>
      <p className="text-sm">Priority: {data.priority}</p>
      <p className="text-sm">Watchers: {data.watchersCount}</p>
      <p className="text-sm">Comments: {data.commentsCount}</p>
      <p className="text-sm">Attachments: {data.attachmentsCount}</p>
    </div>
  );
};

export default IssueReportView;
