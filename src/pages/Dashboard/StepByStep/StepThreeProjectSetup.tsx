// File: src/pages/stepByStep/StepThreeProjectSetup.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderPlusIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepThreeProjectSetup: React.FC = () => {
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
        Step 3: Creating & Managing Projects
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Projects are at the heart of TaskBrick. They help you group tasks,
        sprints, and discussions under one umbrella.
      </motion.p>

      {/* 1) Creating a Project */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <FolderPlusIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating a New Project
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Go to Projects:</strong> Click the <em>“Projects”</em> tab.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Create Project”:</strong> Enter the project name.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Choose Organization:</strong> Select the organization.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> Hit <em>“Create”</em> or <em>“Save”</em>.
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700 mt-2">
          Your project is now live.
        </motion.p>
      </motion.section>

      {/* 2) Adding Members to a Project */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <UserPlusIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Adding Members
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Add new teammates to your project:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open Project Settings:</strong> Find the <em>“Members”</em> tab.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Add Member”:</strong> Enter the user's email.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Confirm:</strong> The user will have access.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Removing Members */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <UserMinusIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Removing Members
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          If someone leaves the project:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Members” Section:</strong> Locate the user.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Select “Remove”:</strong> Confirm the action.
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700">
          This removes them from the project, not the organization.
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
          You’ve created a project and set up collaborators.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          In the upcoming steps, we’ll explore setting up boards, creating tasks,
          planning sprints, and more.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepThreeProjectSetup;