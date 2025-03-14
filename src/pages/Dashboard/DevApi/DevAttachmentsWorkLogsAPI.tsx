// File: src/pages/developerApi/DevAttachmentsWorkLogsAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PaperClipIcon, ClockIcon } from '@heroicons/react/24/outline';

const DevAttachmentsWorkLogsAPI: React.FC = () => {
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
        <PaperClipIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Attachments & Work Logs API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Upload files to issues and track time spent on tasks via work logs.
      </motion.p>

      {/* Attachments */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <PaperClipIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Attachment Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /attachments</strong> — uploadAttachment (supports multi-file).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /attachments?issueId=xxx</strong> — listAttachments for a given issue.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /attachments/:id</strong> — deleteAttachment.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/attachments \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "files=@/path/to/image.png" \\
  -F "issueId=issue123"`}
        </motion.pre>
      </motion.section>

      {/* Work Logs */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ClockIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Work Log Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /worklogs</strong> — createWorkLog. Body: <code>issueId, hours, comment?</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /worklogs/issue/:issueId</strong> — listWorkLogsForIssue.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /worklogs/user/:userId</strong> — listWorkLogsForUser.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /worklogs</strong> — listAllWorkLogs (admin usage, perhaps).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /worklogs/:id</strong> — updateWorkLog. Body: <code>hours, comment, loggedAt, etc.</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /worklogs/:id</strong> — deleteWorkLog.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/worklogs \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issueId": "issue123",
    "hours": 2.5,
    "comment": "Debugging and testing"
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevAttachmentsWorkLogsAPI;