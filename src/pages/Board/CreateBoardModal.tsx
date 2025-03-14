// File: src/pages/BoardList/CreateBoardModal.tsx
import React, { useState } from 'react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (name: string, type: string, description?: string) => void;
  isCreating: boolean;
  error: string;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
  isCreating,
  error,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'KANBAN' | 'SCRUM'>('KANBAN');
  const [description, setDescription] = useState('');

  // Clears inputs whenever the modal opens (optional):
  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setType('KANBAN');
      setDescription('');
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a board name');
      return;
    }
    onCreateBoard(name.trim(), type, description.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Create a New Board</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Board Name
        </label>
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Kanban"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Board Type
        </label>
        <select
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3"
          value={type}
          onChange={(e) => setType(e.target.value as 'KANBAN' | 'SCRUM')}
        >
          <option value="KANBAN">KANBAN</option>
          <option value="SCRUM">SCRUM</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief details..."
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Board'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
