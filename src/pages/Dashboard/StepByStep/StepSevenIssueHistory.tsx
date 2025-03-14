// File: src/pages/stepByStep/StepSevenIssueHistory.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepSevenIssueHistory: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800">
        Step 7: Issue History (Activity Log)
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        TaskBrick records issue changes, showing who changed what and when.
      </motion.p>

      {/* 1) Where to Find Issue History */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Viewing Issue History
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the Issue:</strong> Go to the detail view.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Look for “History” Tab:</strong> Click the tab.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Browse the Log:</strong> See chronological changes.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Searching or Filtering History */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Searching or Filtering
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Filter history by user, date, or change type.
        </motion.p>
      </motion.section>

      {/* 3) Why Issue History Matters */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Importance of Activity Logs
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Audit Trail:</strong> Understand who made changes.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Accountability:</strong> See reasoning behind changes.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Conflict Resolution:</strong> Clarify events.
          </motion.li>
        </motion.ul>
      </motion.section>

      {/* 4) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Next Steps
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Issue History completes your tracking system.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Explore advanced features like custom workflows.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepSevenIssueHistory;