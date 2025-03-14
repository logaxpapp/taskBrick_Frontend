// File: src/pages/stepByStep/StepFourteenAttachmentsAndWorkLogs.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  PaperClipIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepFourteenAttachmentsAndWorkLogs: React.FC = () => {
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
        Step 14: Attachments & Work Logs
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Attach files to issues and log work hours in TaskBrick.
      </motion.p>

      {/* 1) Attachments */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <PaperClipIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Uploading Attachments
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the Issue:</strong> Go to issue details.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Find “Attachments”:</strong> Locate upload area.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Select File(s):</strong> Choose or drag files.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>View & Remove:</strong> Manage uploaded files.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Work Logs */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Logging Work (Work Logs)
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Record hours spent on a task:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Go to “Work Logs”:</strong> Find log work section.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Enter Hours:</strong> Add time and comment.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> Add log entry.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Edit/Delete:</strong> Manage log entries.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Next Steps
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Keep essential information in one place with attachments and work logs.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          TaskBrick handles advanced tasks from Sprints to Subscriptions.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepFourteenAttachmentsAndWorkLogs;