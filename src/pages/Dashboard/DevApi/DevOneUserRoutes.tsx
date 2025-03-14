// File: src/pages/developerApi/DevOneUserRoutes.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, ShieldCheckIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline';

const DevOneUserRoutes: React.FC = () => {
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
        <UsersIcon className="w-8 h-8 mr-2 text-indigo-500" />
        User Routes Overview
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        The <code>userRoutes.ts</code> file exposes several endpoints under <code>/users</code>. Below is a summary of each:
      </motion.p>

      <motion.ul className="list-disc list-inside text-gray-700 space-y-2">
        <motion.li variants={listItemVariants}>
          <code>POST /users</code> – Create a new user (requires authentication).
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>GET /users/check</code> – Check if a user exists, returning minimal info.
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>GET /users</code> – List all users (with optional query params).
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>GET /users/:id</code> – Get details for a single user by ID.
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>PATCH /users/:id</code> – Update certain fields for a user.
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>DELETE /users/:id/deactivate</code> – Soft-deactivate a user.
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>PATCH /users/:id/suspend</code> – Toggle suspension of a user.
        </motion.li>
        <motion.li variants={listItemVariants}>
          <code>DELETE /users/:id</code> – Permanently delete a user.
        </motion.li>
      </motion.ul>

      <motion.p className="text-gray-700 mt-6 flex items-center">
        <ShieldCheckIcon className="w-5 h-5 mr-2 text-yellow-500" />
        Each route is protected by <strong>authMiddleware</strong> and some use <strong>verifyOrgMember</strong>.
      </motion.p>

      <motion.p className="text-gray-700 mt-4 flex items-center">
        <DocumentChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
        For the underlying logic, see <strong>userController.ts</strong> and <strong>userService.ts</strong>, with Mongoose models.
      </motion.p>
    </motion.div>
  );
};

export default DevOneUserRoutes;
