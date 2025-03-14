// File: src/pages/stepByStep/StepTenPortfoliosAndBudgets.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepTenPortfoliosAndBudgets: React.FC = () => {
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
        Step 10: Portfolios & Project Budgets
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Portfolios group projects, and budgets manage allocated funds.
      </motion.p>

      {/* 1) Portfolios */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <FolderIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating & Managing Portfolios
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Portfolios”:</strong> Find in sidebar.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create Portfolio:</strong> Add name and description.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Add Projects:</strong> Group existing projects.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Remove/Delete:</strong> Manage projects or delete.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Project Budgets */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <CurrencyDollarIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Managing Project Budgets
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Track allocated funds vs. actual spending:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Budget” Tab:</strong> See allocated funds.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Update/Request Changes:</strong> Adjust budget.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Monitoring:</strong> Track spending.
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
          Organize projects and track budgets for insight.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Explore advanced features like project risks and resource allocation.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepTenPortfoliosAndBudgets;