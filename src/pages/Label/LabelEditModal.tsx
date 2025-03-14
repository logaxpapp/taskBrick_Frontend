// File: src/pages/components/LabelEditModal.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUpdateLabelMutation, Label } from '../../api/label/labelApi';

interface LabelEditModalProps {
  label: Label; // entire label object
  onClose: () => void;
  onUpdated: () => void;
}

const LabelEditModal: React.FC<LabelEditModalProps> = ({
  label,
  onClose,
  onUpdated,
}) => {
  const [updateLabel, { isLoading: isUpdating }] = useUpdateLabelMutation();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff');

  useEffect(() => {
    setName(label.name);
    setColor(label.color || '#ffffff');
  }, [label]);

  const handleSave = async () => {
    try {
      await updateLabel({
        id: label._id,
        updates: {
          name: name.trim(),
          color: color.trim() || null,
        },
      }).unwrap();
      onUpdated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to update label');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="labelEditModal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md p-6 bg-white rounded shadow-lg relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Label</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-10 border rounded cursor-pointer"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="#RRGGBB or 'blue'"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LabelEditModal;
