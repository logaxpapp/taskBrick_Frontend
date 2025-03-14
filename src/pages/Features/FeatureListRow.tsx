// File: src/components/FeatureManager/FeatureListRow.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Feature } from '../../api/subscription/subscriptionApi';

interface FeatureListRowProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (featureId: string) => void;
  onActivate: (featureId: string) => void;
  onDeactivate: (featureId: string) => void;
}

const FeatureListRow: React.FC<FeatureListRowProps> = ({
  feature,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white border-b"
      whileHover={{ backgroundColor: 'rgba(245,245,245,1)' }}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-800">{feature.name}</div>
        <div className="text-xs text-gray-400">
          {feature.description?.slice(0, 50) || 'No description...'}
        </div>
      </td>
      <td className="px-6 py-4">{feature.code}</td>
      <td className="px-6 py-4">
        {feature.isActive ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-gray-500">Inactive</span>
        )}
      </td>
      <td className="px-6 py-4">
        {feature.isBeta ? <span className="text-pink-500">Yes</span> : 'No'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => onEdit(feature)}
          >
            <PencilIcon className="w-4 h-4 inline-block" />
          </button>
          {feature.isActive ? (
            <button
              onClick={() => onDeactivate(feature._id)}
              className="text-orange-500 hover:text-orange-600"
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => onActivate(feature._id)}
              className="text-green-500 hover:text-green-600"
            >
              Activate
            </button>
          )}
          <button
            className="text-red-500 hover:text-red-600"
            onClick={() => setDeleteConfirmation(true)}
          >
            <TrashIcon className="w-4 h-4 inline-block" />
          </button>
        </div>

        {/* Overlapping row for delete confirmation */}
        <AnimatePresence>
          {deleteConfirmation && (
            <motion.tr
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 right-0 bg-black bg-opacity-40 flex items-center justify-center"
              style={{ top: 0, bottom: 0 }}
            >
              <motion.td
                colSpan={5}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-4 rounded shadow-lg w-72"
              >
                <h4 className="text-sm font-semibold mb-3">Confirm Delete?</h4>
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
              </motion.td>
            </motion.tr>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
};

export default FeatureListRow;
