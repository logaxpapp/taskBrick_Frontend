// File: src/pages/components/SprintList.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprint,
  useDeleteSprintMutation,
} from '../../api/sprint/sprintApi';
import {
  ListBulletIcon,
  Squares2X2Icon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface SprintListProps {
  sprints: Sprint[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

/**
 * A small helper to color-code each status
 */
function statusColorClass(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'PLANNED':
      return 'bg-yellow-100 text-yellow-800';
    case 'CLOSED':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

const SprintList: React.FC<SprintListProps> = ({
  sprints,
  isLoading,
  onEdit,
  onRefresh,
}) => {
  const [deleteSprint] = useDeleteSprintMutation();
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sprint?')) return;
    try {
      await deleteSprint(id).unwrap();
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete sprint: ${err.data?.error || err.message}`);
    }
  };

  if (isLoading) {
    return <p>Loading sprints...</p>;
  }
  if (!sprints || sprints.length === 0) {
    return <p className="text-gray-500">No sprints found for this project.</p>;
  }

  return (
    <div className="space-y-4">
      {/* View toggles */}
      <div className="flex items-center justify-end mb-2 gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`
            flex items-center gap-1 px-3 py-1.5 
            rounded text-sm font-medium 
            focus:outline-none
            transition-colors
            ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <ListBulletIcon className="w-4 h-4" />
          <span>List</span>
        </button>
        <button
          onClick={() => setViewMode('cards')}
          className={`
            flex items-center gap-1 px-3 py-1.5 
            rounded text-sm font-medium 
            focus:outline-none
            transition-colors
            ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Squares2X2Icon className="w-4 h-4" />
          <span>Cards</span>
        </button>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <motion.div
          key="listView"
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="overflow-x-auto border border-gray-200 rounded shadow-sm"
        >
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Sprint Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sprints.map((sprint) => (
                <tr key={sprint._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-blue-700">
                    {sprint.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded text-xs font-semibold
                        ${statusColorClass(sprint.status)}
                      `}
                    >
                      {sprint.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {sprint.startDate && (
                      <p className="leading-tight">
                        <span className="text-xs text-gray-400 mr-1">
                          Start:
                        </span>
                        <span className="font-medium">
                          {new Date(sprint.startDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                    {sprint.endDate && (
                      <p className="leading-tight">
                        <span className="text-xs text-gray-400 mr-1">
                          End:
                        </span>
                        <span className="font-medium">
                          {new Date(sprint.endDate).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {sprint.goal ? (
                      <span className="text-gray-800 line-clamp-1">
                        {sprint.goal}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        (No goal)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(sprint._id)}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sprint._id)}
                      className="inline-flex items-center px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* CARD VIEW */}
      <AnimatePresence mode="popLayout">
        {viewMode === 'cards' && (
          <motion.div
            key="cardView"
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {sprints.map((sprint) => (
              <motion.div
                key={sprint._id}
                className="border border-gray-200 p-4 rounded bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                whileHover={{ scale: 1.01 }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-1">
                    {sprint.name}
                  </h3>
                  <div className="mb-2">
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded text-xs font-semibold
                        ${statusColorClass(sprint.status)}
                      `}
                    >
                      {sprint.status}
                    </span>
                  </div>

                  {/* Sprint Dates */}
                  {sprint.startDate && (
                    <p className="text-xs text-gray-500">
                      <span className="mr-1">Start:</span>
                      <span className="font-medium">
                        {new Date(sprint.startDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {sprint.endDate && (
                    <p className="text-xs text-gray-500">
                      <span className="mr-1">End:</span>
                      <span className="font-medium">
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}

                  {/* Goal */}
                  {sprint.goal && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium text-xs text-gray-400 mr-1">
                        Goal:
                      </span>
                      {sprint.goal}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2 text-sm">
                  <button
                    onClick={() => onEdit(sprint._id)}
                    className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sprint._id)}
                    className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SprintList;
