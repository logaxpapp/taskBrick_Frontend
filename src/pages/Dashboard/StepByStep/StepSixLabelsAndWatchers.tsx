// File: src/pages/stepByStep/StepSixLabelsAndWatchers.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  TagIcon,
  EyeIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

const StepSixLabelsAndWatchers: React.FC = () => {
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
        Step 6: Labels & Watchers
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Labels categorize issues, and watchers receive notifications.
      </motion.p>

      {/* 1) Creating and Applying Labels */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Creating a Label
          </motion.h3>
        </div>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open Settings:</strong> Go to “Labels” tab.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Create Label”:</strong> Provide a name and color.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> Label is now available.
          </motion.li>
        </motion.ol>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <TagIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Applying Labels to an Issue
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Apply labels to issues:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open Issue Details:</strong> Select the issue.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Click “Add Label”:</strong> Pick from existing labels.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Confirm:</strong> Issue shows the chosen label.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 3) Watchers */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <EyeIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Adding Watchers
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          Watchers track changes to an issue:
        </motion.p>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Open the Issue:</strong> Go to the detail view.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Look for “Add Watcher”:</strong> Enter teammate's name.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Save:</strong> They'll receive notifications.
          </motion.li>
        </motion.ol>
      </motion.section>

      {/* 4) Removing Watchers */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <div className="flex items-center mb-4">
          <MinusCircleIcon className="w-6 h-6 text-yellow-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            4. Removing a Watcher
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Remove watchers who no longer need notifications:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2 mt-2">
          <motion.li variants={listItemVariants}>
            Go to the issue details.
          </motion.li>
          <motion.li variants={listItemVariants}>
            Click “Remove” or “Unwatch” button.
          </motion.li>
          <motion.li variants={listItemVariants}>
            They'll stop receiving updates.
          </motion.li>
        </motion.ul>
      </motion.section>

      {/* 5) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
      >
        <div className="flex items-center mb-4">
          <ArrowRightCircleIcon className="w-6 h-6 text-purple-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            5. Next Steps
          </motion.h3>
        </div>
        <motion.p className="text-gray-700">
          Labels and watchers help you stay organized and informed.
        </motion.p>
        <motion.p className="text-gray-700 mt-2">
          Next, we’ll look at TaskBrick’s issue history.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default StepSixLabelsAndWatchers;