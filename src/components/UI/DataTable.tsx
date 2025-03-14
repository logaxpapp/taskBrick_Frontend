import React from 'react';

interface DataTableProps {
  columns: string[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <div className="overflow-auto max-w-full border rounded-lg ">
      <table className="min-w-full border border-gray-200">
        <thead className="sticky top-0 bg-gray-100 ">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx}
                className="p-3 text-sm font-semibold text-gray-700 border-b border-gray-200 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rIndex) => (
              <tr key={rIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, cIndex) => (
                  <td
                    key={cIndex}
                    className="p-3 text-sm text-gray-600 border-b border-gray-100"
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-3 text-sm text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
