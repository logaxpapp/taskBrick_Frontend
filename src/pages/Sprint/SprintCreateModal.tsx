// File: src/pages/SprintCreateModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreateSprintMutation } from '../../api/sprint/sprintApi';

import {
  XMarkIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

interface AdvancedSprintCreateModalProps {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

const AdvancedSprintCreateModal: React.FC<AdvancedSprintCreateModalProps> = ({
  projectId,
  onClose,
  onCreated,
}) => {
  const [createSprint, { isLoading: isCreating }] = useCreateSprintMutation();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [velocity, setVelocity] = useState('');
  const [capacity, setCapacity] = useState('');

  async function handleSubmit() {
    if (!name.trim()) {
      alert('Sprint name is required');
      return;
    }
    try {
      await createSprint({
        projectId,
        name: name.trim(),
        goal: goal.trim() || undefined,
        velocity: velocity ? Number(velocity) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
      }).unwrap();
      // after create, run onCreated
      onCreated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to create sprint');
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* The modal container */}
      <motion.div
        className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <PlusCircleIcon className="w-6 h-6 text-green-600" />
          Create Sprint
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sprint Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
              placeholder="e.g. 'Sprint 1'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal (optional)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
              placeholder="Finish user auth module"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Velocity (optional)
              </label>
              <input
                type="number"
                value={velocity}
                onChange={(e) => setVelocity(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                placeholder="e.g. 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (optional)
              </label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                placeholder="e.g. 40"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Sprint'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSprintCreateModal;
