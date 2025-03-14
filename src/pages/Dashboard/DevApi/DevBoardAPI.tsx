// File: src/pages/developerApi/DevBoardAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CodeBracketIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const DevBoardAPI: React.FC = () => {
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
        <TableCellsIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Board & Column API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Manage boards and columns programmatically via the TaskBrick REST API. Endpoints require a valid Bearer token.
      </motion.p>

      {/* Boards */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <TableCellsIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Board Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /boards</strong> — <em>createBoard</em>. Provide <code>projectId</code>, <code>name</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /boards</strong> — <em>listBoardsByProject</em>. Query param <code>projectId</code> is required.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /boards/:id</strong> — <em>getBoard</em>. Returns a single board by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /boards/:id</strong> — <em>updateBoard</em>. Update fields like <code>name</code>, <code>config</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /boards/:id</strong> — <em>deleteBoard</em>. Permanently remove a board.
          </motion.li>
        </motion.ul>

        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/boards \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "project123",
    "name": "Kanban Board"
  }'`}
        </motion.pre>
      </motion.section>

      {/* Columns */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <CodeBracketIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. BoardColumn Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /board-columns</strong> — <em>createBoardColumn</em>. Provide <code>boardId</code>, <code>name</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /board-columns</strong> — <em>listBoardColumns</em>. Query param <code>boardId</code> is optional.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /board-columns/:id</strong> — <em>getBoardColumn</em>. Fetch a single column by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /board-columns/:id</strong> — <em>updateBoardColumn</em>. Update <code>name</code>, <code>order</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /board-columns/:id</strong> — <em>deleteBoardColumn</em>. Remove a column.
          </motion.li>
        </motion.ul>

        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/board-columns \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "boardId": "boardABC",
    "name": "To Do",
    "order": 1
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevBoardAPI;