// File: src/pages/stepByStep/StepIntro.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  PuzzlePieceIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepIntro: React.FC = () => {
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
      <motion.h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to TaskBrick Step-by-Step Guides
      </motion.h1>

      <motion.p className="text-lg text-gray-700 mb-8">
        This series of tutorials will walk you through setting up TaskBrick,
        inviting your team, and organizing tasks. Let’s dive in and see how
        TaskBrick can streamline your projects!
      </motion.p>

      {/* 1) Basic Overview */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <PuzzlePieceIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            1. What Is TaskBrick?
          </motion.h2>
        </div>
        <motion.p className="text-gray-700 mb-2">
          TaskBrick is a collaborative task and project management platform
          designed to help teams stay organized and productive.
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-4">
          <motion.li variants={listItemVariants}>
            <strong>Projects:</strong> Group tasks, discussions, and resources.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Teams:</strong> Keep members aligned with shared boards.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Notifications:</strong> Stay updated on changes and due dates.
          </motion.li>
        </motion.ul>
      </motion.section>

      {/* 2) Getting Started with Your Organization */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <BuildingOfficeIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            2. Setting Up Your Organization
          </motion.h2>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Organizations in TaskBrick group your teams and projects under one
          umbrella.
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 mb-4 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Access the Organization Menu:</strong> Look for the selector.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create a New Organization:</strong> Enter the name and description.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Invite Team Members (Optional Now):</strong> Add colleagues.
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700">
          Once set up, you’ll be taken to your org’s dashboard.
        </motion.p>
      </motion.section>

      {/* 3) Inviting Users */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <UserGroupIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            3. Inviting Your Team
          </motion.h2>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Collaboration is key! TaskBrick makes it easy to invite people.
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the “Users” or “Team” Section:</strong> Find the tab.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Invite User”:</strong> Enter email and choose role.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>They Accept and Join:</strong> They get an email to join.
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700">
          Manage everyone in the “Team” section.
        </motion.p>
      </motion.section>

      {/* 4) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            4. Next Steps
          </motion.h2>
        </div>
        <motion.p className="text-gray-700">
          That’s it! You’ve created an organization and invited members.
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mt-2 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>Creating Projects</strong> and boards.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Managing Sprints</strong> for agile teams.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Using Labels</strong> and filters.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Notifications</strong> and integrations.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700 mt-4">
          Ready to continue? Use the sidebar to jump to the next step.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepIntro;