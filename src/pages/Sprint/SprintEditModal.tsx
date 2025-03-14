// File: src/pages/components/SprintEditModal.tsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import {
  useGetSprintQuery,
  useUpdateSprintMutation,
  Sprint,
} from '../../api/sprint/sprintApi';

/**
 * Props for editing a sprint.
 */
interface SprintEditModalProps {
  /** The sprint's ID */
  sprintId: string;

  /** Callback when the modal closes */
  onClose: () => void;

  /** Callback after a successful update – typically re-fetch or refresh */
  onUpdated: () => void;
}

/**
 * A modal for editing an existing sprint.
 * Includes fields for name, goal, velocity, capacity, start/end dates, and status.
 */
const SprintEditModal: React.FC<SprintEditModalProps> = ({
  sprintId,
  onClose,
  onUpdated,
}) => {
  // 1) Fetch the sprint from RTK Query
  const { data: sprint, isLoading: isSprintLoading } = useGetSprintQuery(sprintId);

  // 2) Prepare mutation for update
  const [updateSprint, { isLoading: isUpdating }] = useUpdateSprintMutation();

  // 3) Local form state
  const [form, setForm] = useState({
    name: '',
    goal: '',
    velocity: '',
    capacity: '',
    startDate: '',
    endDate: '',
    status: 'PLANNED',
  });

  // 4) Sync local form from fetched sprint
  useEffect(() => {
    if (sprint) {
      setForm({
        name: sprint.name,
        goal: sprint.goal ?? '',
        velocity: sprint.velocity?.toString() ?? '',
        capacity: sprint.capacity?.toString() ?? '',
        startDate: sprint.startDate ? sprint.startDate.slice(0, 10) : '',
        endDate: sprint.endDate ? sprint.endDate.slice(0, 10) : '',
        status: sprint.status,
      });
    }
  }, [sprint]);

  // 5) Handle Save -> call the update mutation
  const handleSave = async () => {
    if (!sprint) return;

    try {
      await updateSprint({
        id: sprint._id,
        updates: {
          name: form.name.trim(),
          goal: form.goal.trim() || undefined,
          velocity: form.velocity ? Number(form.velocity) : null,
          capacity: form.capacity ? Number(form.capacity) : null,
          startDate: form.startDate || null, // or parse as new Date() if needed
          endDate: form.endDate || null,
          status: form.status as 'PLANNED' | 'ACTIVE' | 'CLOSED',
        },
      }).unwrap();

      // 6) On success, trigger callback
      onUpdated();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to update sprint');
    }
  };

  // If no sprintId, we bail out
  if (!sprintId) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="sprintEditModal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md p-6 bg-white rounded shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PencilSquareIcon className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-800">Edit Sprint</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Loading/Content */}
          {isSprintLoading ? (
            <p className="text-sm text-gray-500">Loading sprint data...</p>
          ) : (
            <div className="space-y-4 text-sm">
              {/* Sprint Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* Sprint Goal */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Goal
                </label>
                <input
                  className="w-full border p-2 rounded"
                  value={form.goal}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, goal: e.target.value }))
                  }
                  placeholder="Finish user auth module"
                />
              </div>

              {/* Velocity / Capacity */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Velocity
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={form.velocity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, velocity: e.target.value }))
                    }
                    placeholder="e.g. 30"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, capacity: e.target.value }))
                    }
                    placeholder="e.g. 40"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="PLANNED">PLANNED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Footer Actions */}
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
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SprintEditModal;
