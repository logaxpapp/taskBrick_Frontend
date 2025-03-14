// File: src/pages/stepByStep/StepFiveIssues.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  TicketIcon,
  TagIcon,
  EyeIcon,
  UserCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepFiveIssues: React.FC = () => {
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
        Step 5: Working With Issues & Issue Types
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Issues (or tickets) are individual work items in TaskBrick.
      </motion.p>

      {/* 1) Creating an Issue */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <TicketIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating a New Issue
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the Board:</strong> Navigate to the board.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “New Issue”:</strong> Provide a title and type.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Assign to a Column:</strong> Place in a relevant column.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> Your issue is created.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Adding Watchers, Labels, or Assignees */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Enhancing Issues
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Add context to your issues:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Labels:</strong> Color-coded tags.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Watchers:</strong> Team members who get notified.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Assignee:</strong> User responsible for the issue.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700 mt-2">
          Find “Add Label” or “Add Watcher” buttons.
        </motion.p>
      </motion.section>

      {/* 3) Editing or Removing Issues */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <PencilSquareIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Updating & Deleting Issues
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Edit:</strong> Rename, change description, or adjust type.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Move Columns:</strong> Drag the issue card.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Delete:</strong> Remove the issue.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 4) Managing Issue Types */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <EyeIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Issue Types
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Use custom “Issue Types” to classify work items.
        </motion.p>
        <motion.p className="text-gray-700">
          Admins can configure these in the “Issue Type Manager”.
        </motion.p>
      </motion.section>

      {/* 5) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-purple-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            5. Next Steps
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          With issues, watchers, and labels, you have a solid system.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Explore advanced features like sprint planning and time tracking.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepFiveIssues;