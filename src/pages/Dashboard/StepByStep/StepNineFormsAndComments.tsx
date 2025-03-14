// File: src/pages/stepByStep/StepNineFormsAndComments.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  DocumentPlusIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepNineFormsAndComments: React.FC = () => {
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
        Step 9: Forms & Comments
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        TaskBrick's "Forms" collect data, and "Comments" discuss details.
      </motion.p>

      {/* 1) Forms */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <DocumentPlusIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating and Managing Forms
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Create or fill out TaskBrick forms:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Forms”:</strong> Find in sidebar or settings.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create Form (Admins):</strong> Add title and fields.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Submit Form:</strong> Fill fields and click "Submit".
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>View Submissions:</strong> Review submissions.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Comments */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ChatBubbleLeftIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Adding Comments to an Issue
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Discuss or clarify details on an issue:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open Issue:</strong> Access the details page.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Locate “Comments”:</strong> Find the comment box.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Type Comment:</strong> Click "Add Comment".
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Deleting or Editing Comments */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <PencilSquareIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Editing/Removing Comments
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Edit or delete comments with permission.
        </motion.p>
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
          Forms and comments help gather input and track discussions.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Explore advanced tips like custom workflows and automations.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepNineFormsAndComments;