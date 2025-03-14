// File: src/pages/stepByStep/StepOneCreateUser.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const StepOneCreateUser: React.FC = () => {
  const cardVariants = {
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
        Step 1: Creating a User
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        Ready to grow your TaskBrick workspace? Follow these steps to add a new
        user.
      </motion.p>

      {/* Step 1: Open the “Users” or “Team” Section */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <UsersIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Open the “Users” or “Team” Section
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          From your dashboard, locate the sidebar and click <strong>Users</strong> or <strong>Team</strong>.
        </motion.p>
      </motion.div>

      {/* Step 2: Click “Add New User” */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <UserPlusIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Click “Add New User”
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Click the <em>“Add New User”</em> or similar button to open the user form.
        </motion.p>
      </motion.div>

      {/* Step 3: Fill Out the User Details */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <ClipboardDocumentListIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Fill Out the User Details
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Email:</strong> The new user’s login email.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Name (Optional):</strong> Keep your user list clear.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Role:</strong> Choose a role (e.g., Member, Admin).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Password Setup:</strong> Set a password or send an invite.
          </motion.li>
        </motion.ul>
        <motion.p className="mt-4 text-gray-700">
          Confirm by pressing <em>“Save”</em> or <em>“Create”</em>.
        </motion.p>
      </motion.div>

      {/* Step 4: Confirm & Notify the User */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Confirm & Notify the User
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          After saving, the user will appear in your user list. If you sent an
          invite, they will receive instructions.
        </motion.p>
        <motion.p className="text-gray-700">
          <strong>Congratulations!</strong> The user can now log in and start
          collaborating.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default StepOneCreateUser;