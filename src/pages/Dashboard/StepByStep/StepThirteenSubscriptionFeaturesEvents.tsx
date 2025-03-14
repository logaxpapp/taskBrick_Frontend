// File: src/pages/stepByStep/StepThirteenSubscriptionFeaturesEvents.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepThirteenSubscriptionFeaturesEvents: React.FC = () => {
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
        Step 13: Subscription, Features & Events
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Manage subscriptions, features, and events in TaskBrick.
      </motion.p>

      {/* 1) Subscription Plans */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <CreditCardIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Managing Subscription Plans
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Manage subscription plans as an admin:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Subscription”:</strong> View current plan.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Upgrade/Downgrade:</strong> Choose a plan.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>View Features:</strong> Compare plans.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 2) Feature Toggles */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Activating/Deactivating Features
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Enable or disable features as an admin:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Features”:</strong> Find toggles.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Enable/Disable:</strong> Flip the switch.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save & Reload:</strong> Apply changes.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Events / Calendar */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Events & Calendars
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Schedule team meetings and deadlines:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open “Calendar”:</strong> Find in menu.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Create/Invite:</strong> Add event details.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>View & Edit:</strong> Modify events.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 4) Next Steps */}
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
          Tailor TaskBrick with subscriptions, features, and events.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Next, handle file attachments and log work details.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepThirteenSubscriptionFeaturesEvents;