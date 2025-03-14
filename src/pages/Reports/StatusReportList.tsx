// File: src/components/StatusReport/StatusReportList.tsx

import React, { useState, useEffect } from 'react';
import { useListStatusReportsByProjectQuery, IStatusReport } from '../../api/statusReport/statusReportApi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye } from 'lucide-react'; // Import icons

interface StatusReportListProps {
  projectId: string;
}

const StatusReportList: React.FC<StatusReportListProps> = ({ projectId }) => {
  const { data: statusReports, isLoading, isError, refetch } = useListStatusReportsByProjectQuery(projectId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isError) {
      setErrorMessage('Failed to load status reports. Please try again.');
    } else {
      setErrorMessage(null);
    }
  }, [isError]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 flex justify-center items-center"
      >
        Loading status reports...
      </motion.div>
    );
  }

  if (errorMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 text-red-500"
      >
        {errorMessage}
        <button
          onClick={() => refetch()}
          className="ml-2 text-blue-600 hover:text-blue-800 transition duration-200"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!statusReports || statusReports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 text-gray-600"
      >
        No status reports found for this project.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-4"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <FileText className="mr-2 text-blue-500" />
        Status Reports
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Report Date</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b max-w-[200px] hidden sm:table-cell">Progress Summary</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b max-w-[150px] hidden sm:table-cell">Risks</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b max-w-[150px] hidden sm:table-cell">Issues</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b max-w-[200px] hidden sm:table-cell">Next Steps</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statusReports.map((report: IStatusReport) => (
              <motion.tr
                key={report._id}
                className="hover:bg-gray-50 transition duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <td className="p-3 border-b text-sm">
                    {new Date(report.reportDate).toLocaleDateString()}
                </td>
                <td className="p-3 border-b text-sm truncate max-w-[200px] hidden sm:table-cell">{report.progressSummary}</td>
                <td className="p-3 border-b text-sm truncate max-w-[150px] hidden sm:table-cell">{report.risks}</td>
                <td className="p-3 border-b text-sm truncate max-w-[150px] hidden sm:table-cell">{report.issues}</td>
                <td className="p-3 border-b text-sm truncate max-w-[200px] hidden sm:table-cell">{report.nextSteps}</td>
                <td className="p-3 border-b text-sm">
                  <Link
                    to={`/dashboard/status-reports/${report._id}`}
                    className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center"
                  >
                    <Eye className="mr-1" size={16}/>
                    View
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StatusReportList;