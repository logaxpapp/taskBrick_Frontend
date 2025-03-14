// File: src/pages/developerApi/DevLabelsAndWatchersAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { TagIcon, EyeIcon } from '@heroicons/react/24/outline';

const DevLabelsAndWatchersAPI: React.FC = () => {
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
        <TagIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Labels & Watchers API
      </motion.h2>

      {/* 1) Label Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Label Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /labels</strong> – createLabel.<br />Expects <code>organizationId</code>, <code>name</code>, and optional <code>color</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /labels?organizationId=xxx</strong> – listLabels.<br />Returns all labels for that organization.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /labels/:id</strong> – updateLabel.<br />Modify name or color of a label (with <code>checkLabelOrgMiddleware</code>).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /labels/:id</strong> – deleteLabel.<br />Removes the label. Also uses <code>checkLabelOrgMiddleware</code>.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/labels \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organizationId": "org123",
    "name": "Urgent",
    "color": "#FF0000"
  }'`}
        </motion.pre>
      </motion.section>

      {/* 2) Issue-Label Linking */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Issue-Label Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /issue-label/add</strong> – addLabelToIssue.<br />Body: <code>issueId, labelId</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /issue-label/remove</strong> – removeLabelFromIssue.<br />Body: <code>issueId, labelId</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issue-label/issue/:issueId/labels</strong> – listLabelsForIssue.<br />Path param: <code>issueId</code>.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/issue-label/add \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issueId": "issue789",
    "labelId": "labelABC"
  }'`}
        </motion.pre>
      </motion.section>

      {/* 3) Watcher Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <EyeIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. IssueWatcher Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /issue-watcher/add</strong> – addWatcher.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /issue-watcher/remove</strong> – removeWatcher.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issue-watcher/:issueId/watchers</strong> – listWatchersForIssue.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issue-watcher/user/:userId/watched-issues</strong> – listWatchedIssuesByUser.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/issue-watcher/add \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issueId": "issue789",
    "userId": "user456"
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevLabelsAndWatchersAPI;