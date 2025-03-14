import React from 'react';

interface ProgressBarProps {
  progress: number; // from 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-full bg-purple-500 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
