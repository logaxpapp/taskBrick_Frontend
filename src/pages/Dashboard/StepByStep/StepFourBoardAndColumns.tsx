// File: src/pages/stepByStep/StepFourBoardAndColumns.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightCircleIcon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline';

const StepFourBoardAndColumns: React.FC = () => {
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
        Step 4: Creating & Managing Boards and Columns
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Boards in TaskBrick help you visualize tasks within a project.
      </motion.p>

      {/* 1) Creating a Board */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <ViewColumnsIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating a Board
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Go to Your Project:</strong> Select the project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Find the “Boards” Tab:</strong> Click to view or create.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Create Board”:</strong> Enter a name.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save Your Board:</strong> Ready for setup.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Adding Columns */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <PlusCircleIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Adding Columns
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Columns represent stages in your workflow.
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Locate “Add Column” Button:</strong> Find the plus sign.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Specify Column Name:</strong> Give it a name and order.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> Ready to hold tasks.
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700">
          Repeat for all columns. Drag and drop to reorder.
        </motion.p>
      </motion.section>

      {/* 3) Updating or Deleting Boards/Columns */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <PencilSquareIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Managing Boards & Columns
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Rename, reorder, or remove columns and boards.
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Rename a Board/Column:</strong> Via “Settings” or “Edit”.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Delete a Board/Column:</strong> Using the trash icon.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Reorder Columns:</strong> Via drag-and-drop.
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
          With boards and columns set up, you can start organizing tasks.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          In the next step, we’ll dive into creating and managing issues/tickets.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepFourBoardAndColumns;