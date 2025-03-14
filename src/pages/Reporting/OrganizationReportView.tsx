// Example sub-component for org data
// src/pages/Board/OrganizationReportView.tsx
import React from 'react';
import { OrgReportingResponse } from '../../api/reporting/reportingApi';

const OrganizationReportView: React.FC<{ data: OrgReportingResponse }> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold mb-2">
        Organization: {data.organizationName}
      </h2>
      <p className="text-sm">Projects: {data.projectCount}</p>
      <p className="text-sm">Boards: {data.boardCount}</p>
      <p className="text-sm">Issues: {data.issueCount}</p>
      <p className="text-sm">Members: {data.memberCount}</p>

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

export default OrganizationReportView;
