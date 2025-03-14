// File: src/pages/stepByStep/StepElevenRisksTimesheetsResourcesStatus.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepElevenRisksTimesheetsResourcesStatus: React.FC = () => {
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
        Step 11: Risks, Timesheets, Resources, & Status
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Advanced features for project health: risks, timesheets, resources, and status.
      </motion.p>

      {/* 1) Project Risks */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Managing Project Risks
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Anticipate and mitigate potential issues:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Risks”:</strong> Find in project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Set Likelihood & Impact:</strong> Define each risk.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Mitigation Plan:</strong> Document steps.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Timesheets */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Logging Time with Timesheets
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Track team member hours on tasks:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Access “Timesheets”:</strong> Find in project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Add Entry:</strong> Specify date and hours.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Review & Edit:</strong> Correct hours.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Resource Allocation */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <UserGroupIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Allocating Resources
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Track resource allocations:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Resources”:</strong> Find in project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Define Resource:</strong> Add name and role.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Allocate Percentage:</strong> Indicate time.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Start/End Dates:</strong> Specify timeframe.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 4) Status Reports */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Project Status Reports
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Summarize progress and key risks:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Create Report:</strong> Add date and highlights.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Review & Distribute:</strong> Share with team.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 5) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-purple-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            5. Bringing It All Together
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Track project health with risks, timesheets, resources, and status.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Explore automation and analytics for more value.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepElevenRisksTimesheetsResourcesStatus;