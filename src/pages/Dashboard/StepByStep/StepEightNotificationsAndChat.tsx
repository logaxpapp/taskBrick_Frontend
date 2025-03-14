// File: src/pages/stepByStep/StepEightNotificationsAndChat.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  PaperClipIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepEightNotificationsAndChat: React.FC = () => {
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
        Step 8: Notifications & Chat
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        TaskBrick notifies you about important events and features built-in chat.
      </motion.p>

      {/* 1) Notifications */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <BellIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Viewing Notifications
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Find the Icon:</strong> Look for a bell icon.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Read or Mark:</strong> Click to jump or clear the badge.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Filtering:</strong> Filter by "unread" or archive.
          </motion.li>
        </motion.ol>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Chat & Messaging
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          TaskBrick has real-time chat rooms or "conversations."
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the Panel:</strong> Look for a chat icon.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Select or Create:</strong> Start a new conversation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Send Messages:</strong> Type and attach files.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Receive Updates:</strong> See messages and notifications.
          </motion.li>
        </motion.ol>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Marking Messages as Read
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Manually mark messages as read or unread.
        </motion.p>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Next Steps
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          You now know how to use notifications and chat.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          In the next step, we’ll explore forms and custom data inputs.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepEightNotificationsAndChat;