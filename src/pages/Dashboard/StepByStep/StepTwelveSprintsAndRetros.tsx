// File: src/pages/stepByStep/StepTwelveSprintsAndRetros.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepTwelveSprintsAndRetros: React.FC = () => {
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
        Step 12: Sprints & Retrospectives
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        TaskBrick's Sprints plan tasks, and Retrospectives review progress.
      </motion.p>

      {/* 1) Creating & Managing Sprints */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating & Managing Sprints
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Sprints”:</strong> Find in project navigation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create Sprint:</strong> Add name, dates, and issues.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Start Sprint:</strong> Move issues to active view.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Track Progress:</strong> See task completion.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Complete Sprint:</strong> End and roll over issues.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Sprint Retrospective */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ArrowPathIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Sprint Retros & Review
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Retro”:</strong> Find review button.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Provide Feedback:</strong> Summarize what went well.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create Action Items:</strong> Add retro items.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Review & Save:</strong> Finalize the retro.
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
          Structured sprints and retrospectives improve team focus.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Plan next sprint and track retro action items.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepTwelveSprintsAndRetros;