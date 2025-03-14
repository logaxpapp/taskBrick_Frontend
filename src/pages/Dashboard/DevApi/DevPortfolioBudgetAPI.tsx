// File: src/pages/developerApi/DevPortfolioBudgetAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FolderIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const DevPortfolioBudgetAPI: React.FC = () => {
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
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FolderIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Portfolio & Project Budget API
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        REST endpoints for managing <strong>portfolios</strong> (collections of projects) and <strong>project budgets</strong> (allocated/spent funds, approval flows).
      </motion.p>

      {/* 1) Portfolio Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <FolderIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Portfolio Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-3 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /portfolios</strong> – create a new portfolio.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /portfolios</strong> – get all portfolios.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /portfolios/:id</strong> – get single portfolio by ID.</motion.li>
          <motion.li variants={listItemVariants}><strong>PUT /portfolios/:id</strong> – update name, description, projectIds, etc.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /portfolios/:id</strong> – remove portfolio entirely.</motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /portfolios/:id/projects</strong> – add a project to portfolio.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /portfolios/:id/projects</strong> – remove a project from portfolio.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /portfolios/:id/summary</strong> – aggregator info (like # of projects, etc.).</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/portfolios \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Q2 Initiatives",
    "description": "Grouping major Q2 projects",
    "projectIds": ["proj123", "proj456"]
  }'`}
        </motion.pre>
      </motion.section>

      {/* 2) Project Budget Routes */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <CurrencyDollarIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Project Budget Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-3 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /projectBudgets</strong> – create budget for a project.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /projectBudgets/:id</strong> – get budget by ID.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /projectBudgets/project/:projectId</strong> – get budget for a specific project.</motion.li>
          <motion.li variants={listItemVariants}><strong>PUT /projectBudgets/:id</strong> – update budget info (allocated, spent, currency, etc.).</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /projectBudgets/:id</strong> – remove budget entry.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /projectBudgets/:id/request-change</strong> – request a budget adjustment.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /projectBudgets/:id/approve-change</strong> – approve a pending change.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /projectBudgets/:id/reject-change</strong> – reject a change request.</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/projectBudgets \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj123",
    "allocatedBudget": 10000,
    "spentBudget": 0,
    "currency": "USD"
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevPortfolioBudgetAPI;