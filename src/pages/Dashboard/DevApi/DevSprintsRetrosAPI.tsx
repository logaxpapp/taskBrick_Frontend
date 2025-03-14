// File: src/pages/developerApi/DevSprintsRetrosAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const DevSprintsRetrosAPI: React.FC = () => {
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
        Sprints & Retros API
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        This doc covers endpoints for agile sprints (start, complete, add issues) and retrospectives (retro items).
      </motion.p>

      {/* Sprints */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Sprint Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /sprints</strong> — createSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /sprints</strong> — listSprints (optionally filter by <code>projectId</code>).</motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /sprints/:id</strong> — getSprint.
            <br />
            <motion.span className="flex items-center text-sm text-gray-600">
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              Uses <code>checkSprintOrgMiddleware</code> to ensure membership.
            </motion.span>
          </motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /sprints/:id</strong> — updateSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /sprints/:id</strong> — deleteSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /sprints/:id/start</strong> — startSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /sprints/:id/complete</strong> — completeSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /sprints/:id/add-issue</strong> — addIssueToSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /sprints/:id/remove-issue</strong> — removeIssueFromSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /sprints/:id/review</strong> — saveSprintReviewOrRetro (store feedback notes, etc.).</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm mt-3 overflow-auto">
          {`curl -X POST https://api.yourapp.com/sprints \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sprint 10",
    "projectId": "projABC",
    "startDate": "2025-05-01",
    "endDate": "2025-05-14"
  }'`}
        </motion.pre>
      </motion.section>

      {/* Retros */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <LightBulbIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Retro Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /retro</strong> — createRetroItem. Body: <code>{`{ sprintId, description, assigneeId? }`}</code>.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /retro/:sprintId</strong> — getRetroItemsForSprint.</motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /retro/:retroItemId</strong> — updateRetroItem.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /retro/:retroItemId</strong> — deleteRetroItem.</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm mt-3 overflow-auto">
          {`curl -X POST https://api.yourapp.com/retro \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sprintId": "sprint123",
    "description": "Need to improve code review process",
    "assigneeId": "user456"
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevSprintsRetrosAPI;