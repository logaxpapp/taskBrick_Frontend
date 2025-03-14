// File: src/components/FeatureManager/FeatureCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Feature } from '../../api/subscription/subscriptionApi';

interface FeatureCardProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (featureId: string) => void;
  onActivate: (featureId: string) => void;
  onDeactivate: (featureId: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="
          relative
          bg-white shadow-md rounded-md p-4
          border-l-4
          border-l-blue-500
        "
      >
        {/* Top row: name + icons */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {feature.name}{' '}
            <span className="ml-2 text-xs text-gray-500">[{feature.code}]</span>
          </h3>
          <div className="flex gap-2 items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(feature)}
            >
              <PencilIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDeleteConfirmation(true)}
            >
              <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
            </motion.button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-2 mb-4">
          {feature.description || 'No description'}
        </p>

        {/* Footer: Active/Beta status */}
        <div className="flex gap-2">
          {feature.isActive ? (
            <button
              onClick={() => onDeactivate(feature._id)}
              className="
                bg-[#192bc2] text-white px-3 py-1
                rounded-md hover:bg-orange-600
              "
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => onActivate(feature._id)}
              className="
                bg-green-500 text-white px-3 py-1
                rounded-md hover:bg-green-600
              "
            >
              Activate
            </button>
          )}
          {feature.isBeta && (
            <span className="text-xs text-pink-500 bg-pink-50 border border-pink-200 px-2 py-1 rounded-md">
              Beta
            </span>
          )}
        </div>

        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {deleteConfirmation && (
            <motion.div
              layout
              className="
                absolute inset-0 bg-black bg-opacity-50
                flex items-center justify-center
                rounded-md
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-4 rounded shadow-lg w-72"
              >
                <h4 className="text-sm font-semibold mb-3">
                  Confirm Delete?
                </h4>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onDelete(feature._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation(false)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureCard;
