/********************************************
 * File: src/pages/Board/ProjectReportView.tsx
 ********************************************/
import React from 'react';
import { ProjectReportingResponse } from '../../api/reporting/reportingApi';

interface ProjectReportViewProps {
  data: ProjectReportingResponse; // from your RTK “useGetProjectReportingQuery” result
}

const ProjectReportView: React.FC<ProjectReportViewProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold mb-2">Project: {data.projectName}</h2>
      <p className="text-sm">
        Organization ID: <span className="text-gray-700">{data.organizationId}</span>
      </p>
      <p className="text-sm">Board Count: {data.boardCount}</p>
      <p className="text-sm">Issue Count: {data.issueCount}</p>

      {/* Example breakdown of issues by status */}
      <div className="mt-2">
        <h3 className="text-sm font-medium mb-1">Issues by Status:</h3>
        <ul className="list-disc list-inside">
          {data.issuesByStatus.map((item) => (
            <li key={item._id} className="text-sm">
              {item._id}: {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectReportView;
