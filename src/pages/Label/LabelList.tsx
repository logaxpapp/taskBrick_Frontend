// File: src/pages/components/LabelList.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeleteLabelMutation, Label } from '../../api/label/labelApi';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

interface LabelListProps {
  labels: Label[];
  isLoading: boolean;
  // Instead of passing labelId, pass the entire label
  onEdit: (label: Label) => void;
  onRefresh: () => void;
}

const LabelList: React.FC<LabelListProps> = ({
  labels,
  isLoading,
  onEdit,
  onRefresh,
}) => {
  const [deleteLabel] = useDeleteLabelMutation();
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this label?')) return;
    try {
      await deleteLabel(id).unwrap();
      onRefresh();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to delete label');
    }
  };

  if (isLoading) {
    return <p>Loading labels...</p>;
  }
  if (!labels || labels.length === 0) {
    return <p className="text-gray-500">No labels found in this organization.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`
            flex items-center gap-1 px-3 py-1 
            rounded text-sm font-medium
            hover:bg-gray-200 transition-colors
            ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
          `}
        >
          <ListBulletIcon className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => setViewMode('cards')}
          className={`
            flex items-center gap-1 px-3 py-1 
            rounded text-sm font-medium
            hover:bg-gray-200 transition-colors
            ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}
          `}
        >
          <Squares2X2Icon className="w-4 h-4" />
          Cards
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 text-left">
              <tr>
                <th className="px-4 py-2">Label Name</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((lbl) => (
                <tr key={lbl._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-blue-700">
                    {lbl.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {lbl.color ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: lbl.color }}
                        />
                        <span className="text-xs">{lbl.color}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No color</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => onEdit(lbl)} // pass the entire label
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lbl._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labels.map((lbl) => (
            <motion.div
              key={lbl._id}
              className="border border-gray-200 p-4 rounded bg-white shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-blue-700">{lbl.name}</h3>
                {lbl.color && (
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: lbl.color }}
                  />
                )}
              </div>
              {!lbl.color && (
                <p className="text-xs text-gray-400 mt-1">No color</p>
              )}

              <div className="mt-3 flex gap-2 text-sm">
                <button
                  onClick={() => onEdit(lbl)} // pass entire label
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lbl._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabelList;
