// File: src/pages/developerApi/DevIssueAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BugAntIcon, ClipboardDocumentListIcon, TagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const DevIssueAPI: React.FC = () => {
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
        <ClipboardDocumentListIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Issue & IssueType API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        REST endpoints for creating, updating, and deleting Issues and Issue Types. Ensure requests include a valid Bearer token.
      </motion.p>

      {/* IssueType Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <BugAntIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. IssueType Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /issue-types</strong> — <em>createIssueType</em>. Provide <code>organizationId</code>, <code>name</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issue-types</strong> — <em>listIssueTypes</em>. Query param <code>organizationId</code> is required.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issue-types/:id</strong> — <em>getIssueType</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /issue-types/:id</strong> — <em>updateIssueType</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /issue-types/:id</strong> — <em>deleteIssueType</em>.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
{`curl -X POST https://api.yourapp.com/issue-types \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organizationId": "org123",
    "name": "Bug",
    "description": "Defects or errors",
    "iconUrl": "https://some-icon.png"
  }'`}
        </motion.pre>
      </motion.section>

      {/* Issue Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Issue Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /issues</strong> — <em>createIssue</em>. Provide <code>title</code>, <code>projectId</code>, <code>issueType</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issues</strong> — <em>listIssues</em>. Query <code>projectId</code> for filtering.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issues/filter</strong> — <em>listFilteredIssues</em>. Filter by <code>organizationId</code>, <code>assignedTo</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /issues/:id</strong> — <em>getIssue</em>. Return a single issue.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /issues/:id</strong> — <em>updateIssue</em>. Update fields (title, status, etc.).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /issues/:id</strong> — <em>deleteIssue</em>. Remove an issue.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
{`curl -X POST https://api.yourapp.com/issues \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "projectABC",
    "title": "Fix login bug",
    "issueType": "Bug"
  }'`}
        </motion.pre>
      </motion.section>

      {/* Labels & Watchers */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Labels & Watchers
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /issues/label/add</strong> — <em>addLabelToIssue</em>. Body: <code>issueId</code>, <code>labelId</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /issues/label/remove</strong> — <em>removeLabelFromIssue</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /issues/watcher/add</strong> — <em>addWatcher</em>. Body: <code>issueId</code>, <code>userId</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /issues/watcher/remove</strong> — <em>removeWatcher</em>.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700 mt-2">
          These routes use the request body to identify the issue and label/user.
        </motion.p>
      </motion.section>

      {/* Security & Middleware */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Security & Middleware
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          In addition to <strong>authMiddleware</strong>, we often use{' '}
          <strong>checkIssueOrgMiddleware</strong> and{' '}
          <strong>checkIssueTypeOrgMiddleware</strong> to ensure the user has membership in the relevant organization or project. If you receive <em>403 Forbidden</em>, confirm that your token’s user belongs to that org or project.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevIssueAPI;
