// File: src/pages/components/RetrospectiveManager.tsx
import React, { useState } from 'react';
import {
  useListRetroItemsQuery,
  useCreateRetroItemMutation,
  useUpdateRetroItemMutation,
  useDeleteRetroItemMutation,
  RetrospectiveItem,
} from '../../api/retrospective/retrospectiveApi';
import { Sprint } from '../../api/sprint/sprintApi';

interface RetrospectiveManagerProps {
  sprint: Sprint;
}

const RetrospectiveManager: React.FC<RetrospectiveManagerProps> = ({ sprint }) => {
  // 1) Query for all items for this sprint
  const {
    data: retroItems,
    refetch,
    isLoading,
  } = useListRetroItemsQuery(sprint._id);

  // 2) Create mutation
  const [createRetroItem] = useCreateRetroItemMutation();
  // 3) Update mutation
  const [updateRetroItem] = useUpdateRetroItemMutation();
  // 4) Delete mutation
  const [deleteRetroItem] = useDeleteRetroItemMutation();

  // local new item form
  const [newDescription, setNewDescription] = useState('');

  const handleAddItem = async () => {
    if (!newDescription.trim()) {
      alert('Description is required');
      return;
    }
    try {
      await createRetroItem({
        sprintId: sprint._id,
        description: newDescription.trim(),
      }).unwrap();
      setNewDescription('');
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Failed to create retro item');
    }
  };

  const handleToggleStatus = async (item: RetrospectiveItem) => {
    const newStatus = item.status === 'OPEN' ? 'DONE' : 'OPEN';
    try {
      await updateRetroItem({
        retroItemId: item._id,
        updates: { status: newStatus },
      }).unwrap();
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  };

  const handleDelete = async (retroItemId: string) => {
    if (!window.confirm('Delete this retrospective item?')) return;
    try {
      await deleteRetroItem(retroItemId).unwrap();
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message);
    }
  };

  return (
    <div className="mt-2">
      <h3 className="font-medium text-gray-700 mb-2">Retrospective Items</h3>

      {/* New item form */}
      <div className="flex items-center gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded text-sm flex-1"
          placeholder="Add new retro item..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading retro items...</p>}
      {!isLoading && retroItems && retroItems.length === 0 && (
        <p className="text-sm text-gray-500">No retrospective items yet.</p>
      )}
      <div className="space-y-2">
        {retroItems?.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 p-2 rounded flex items-center justify-between"
          >
            <div className="flex flex-col">
              <p className="text-sm text-gray-800">{item.description}</p>
              <p className="text-xs text-gray-400">
                Status: <strong>{item.status}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleStatus(item)}
                className="text-xs bg-yellow-100 px-2 py-1 rounded hover:bg-yellow-200"
              >
                {item.status === 'OPEN' ? 'Mark Done' : 'Re-open'}
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetrospectiveManager;
