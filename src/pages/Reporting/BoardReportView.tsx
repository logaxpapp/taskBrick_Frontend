/********************************************
 * File: src/pages/Board/BoardReportView.tsx
 ********************************************/
import React from 'react';
import { BoardReportingResponse } from '../../api/reporting/reportingApi';

interface BoardReportViewProps {
  data: BoardReportingResponse;
}

const BoardReportView: React.FC<BoardReportViewProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold mb-2">Board: {data.boardName}</h2>
      <p className="text-sm">Type: {data.boardType}</p>
      <p className="text-sm">Column Count: {data.columnCount}</p>

      {/* Example listing of issues per column */}
      <div className="mt-2">
        <h3 className="text-sm font-medium mb-1">Issues per Column:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(data.columnsWithIssueCount).map(([colName, count]) => (
            <li key={colName} className="text-sm">
              {colName}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoardReportView;
