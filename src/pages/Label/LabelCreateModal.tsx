// File: src/pages/components/LabelCreateModal.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  useCreateLabelMutation,
  CreateLabelPayload,
} from '../../api/label/labelApi';

interface LabelCreateModalProps {
  organizationId: string;
  onClose: () => void;
  onCreated: () => void;
}

const LabelCreateModal: React.FC<LabelCreateModalProps> = ({
  organizationId,
  onClose,
  onCreated,
}) => {
  const [createLabel, { isLoading }] = useCreateLabelMutation();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#ffffff'); // default color

  const handleCreate = async () => {
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }
    const payload: CreateLabelPayload = {
      organizationId,
      name: name.trim(),
      color: color.trim() || null,
    };

    try {
      await createLabel(payload).unwrap();
      onCreated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to create label');
    }
  };

  // Sync typed color and color input
  const handleColorChange = (val: string) => {
    setColor(val);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="labelCreateModal"
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
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create Label</h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
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
                {/* Native color picker */}
                <input
                  type="color"
                  className="w-10 h-10 border rounded cursor-pointer"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                {/* Text input for color hex */}
                <input
                  className="w-full border p-2 rounded"
                  placeholder="#RRGGBB or 'red'"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LabelCreateModal;
