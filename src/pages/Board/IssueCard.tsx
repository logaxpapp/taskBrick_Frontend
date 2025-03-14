// File: src/pages/Board/IssueCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface IssueCardData {
  id: string;
  title: string;
  type: string; // e.g. "Bug"
}

interface IssueCardProps {
  issue: IssueCardData;
  isDragging: boolean;

  // If we want to open an edit modal on double-click
  onDoubleClick?: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, isDragging, onDoubleClick }) => {
  return (
    <motion.div
      onDoubleClick={onDoubleClick}
      className={`
        bg-white rounded shadow px-3 py-2 mb-2 text-sm border border-gray-200
        ${isDragging ? 'opacity-75' : ''}
      `}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{issue.title}</span>
        <span className="text-xs text-gray-500">{issue.type}</span>
      </div>
    </motion.div>
  );
};

export default IssueCard;
