// File: src/components/managers/PortfolioSummary.tsx
import React from 'react';
import { IPortfolio } from '../../api/portfolio/portfolioApi';

interface PortfolioSummaryProps {
  portfolio?: IPortfolio;
  summaryData?: {
    name: string;
    projectCount: number;
    // any other summary fields returned from your backend
  };
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio, summaryData }) => {
  if (!portfolio) return null;
  if (!summaryData) return null;

  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 shadow p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Selected Portfolio Summary</h3>
      <p className="text-gray-800">
        <strong>Name:</strong> {summaryData.name}
      </p>
      <p className="text-gray-800">
        <strong>Project Count:</strong> {summaryData.projectCount}
      </p>
      {/* add more fields as desired */}
    </div>
  );
};

export default PortfolioSummary;
