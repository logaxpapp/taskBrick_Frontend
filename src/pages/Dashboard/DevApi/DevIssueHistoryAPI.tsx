// File: src/pages/developerApi/DevIssueHistoryAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const DevIssueHistoryAPI: React.FC = () => {
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
        <ClockIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Issue History API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Store and retrieve historical changes for issues. Changes are typically recorded automatically, but can also be created manually.
      </motion.p>

      {/* 1) Adding a History Record */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. POST /history
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Endpoint: <strong>POST /history</strong> – <em>addHistoryRecord</em>
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            Body fields: <code>issueId, changedByUserId, field, oldValue, newValue</code>
          </motion.li>
          <motion.li variants={listItemVariants}>
            Typically used internally by controllers for issues, watchers, labels, etc.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/history \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issueId": "issue123",
    "changedByUserId": "user789",
    "field": "status",
    "oldValue": "Open",
    "newValue": "In Progress"
  }'`}
        </motion.pre>
      </motion.section>

      {/* 2) Listing Issue History */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. GET /history/:issueId
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Endpoint: <strong>GET /history/:issueId</strong> – <em>listIssueHistory</em>
        </motion.p>
        <motion.p className="text-gray-700">
          Retrieves a chronological array of all changes for that issue.
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X GET https://api.yourapp.com/history/issue123 \\
  -H "Authorization: Bearer <TOKEN>"`}
        </motion.pre>
      </motion.section>

      {/* 3) Deleting a History Record */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
      >
        <div className="flex items-center mb-4">
          <TrashIcon className="w-6 h-6 text-red-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. DELETE /history/record/:id
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Endpoint: <strong>DELETE /history/record/:id</strong> – <em>deleteHistoryRecord</em>
        </motion.p>
        <motion.p className="text-gray-700">
          Removes a single record from the log. Typically done by admins or for incorrectly created records.
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X DELETE https://api.yourapp.com/history/record/abcd1234 \\
  -H "Authorization: Bearer <TOKEN>"`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevIssueHistoryAPI;