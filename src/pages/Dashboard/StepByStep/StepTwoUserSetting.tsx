// File: src/pages/stepByStep/StepTwoUserSetting.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const StepTwoUserSetting: React.FC = () => {
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
        Step 2: Managing Your User Settings
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        Every user in TaskBrick has personal settings that control how they
        receive invitations, notifications, and other preferences.
      </motion.p>

      {/* Accessing Settings */}
      <motion.section
        variants={sectionVariants}
        className="mb-6 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <Cog6ToothIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Accessing the Settings Page
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Look for <strong>“Profile”</strong> or <strong>“Settings”</strong> in the
          top navigation or sidebar.
        </motion.p>
      </motion.section>

      {/* Editing Preferences */}
      <motion.section
        variants={sectionVariants}
        className="mb-6 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <PencilSquareIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Editing Your Preferences
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Once in “Settings,” you’ll see various options:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2 mb-4">
          <motion.li variants={listItemVariants}>
            <strong>Invitation Expiration:</strong> Set the validity of invitations.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Notification Preferences:</strong> Control email and in-app alerts.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Profile Info:</strong> Change your display name and picture.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          Make changes and click <em>“Save”</em> or <em>“Update.”</em>
        </motion.p>
      </motion.section>

      {/* Resetting Defaults */}
      <motion.section
        variants={sectionVariants}
        className="mb-6 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <ArrowUturnLeftIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Resetting to Default
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Use the <strong>“Reset to Default”</strong> button to revert to TaskBrick’s
          original settings.
        </motion.p>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. That’s It!
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Manage your settings to ensure TaskBrick works how you want. In the next
          tutorial, we’ll cover more advanced features.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepTwoUserSetting;