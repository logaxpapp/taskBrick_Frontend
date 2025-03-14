// File: src/components/Board/BoardList.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useListBoardsQuery,
  useCreateBoardMutation,
  useDeleteBoardMutation,
  Board,
} from '../../api/board/boardApi';
import Button from '../../components/UI/Button';
import { PencilIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import CreateBoardModal from './CreateBoardModal';

interface BoardListProps {
  projectId?: string;
}

type ViewMode = 'list' | 'cards';

const BoardList: React.FC<BoardListProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const { data: boards, isLoading, isError, refetch } = useListBoardsQuery(
    { projectId },
    { skip: !projectId }
  );
  const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState('');
  const [cardDropdownOpen, setCardDropdownOpen] = useState(false);

  const navigateToBoard = (boardId: string) => {
    navigate(`/dashboard/project/${projectId}/board/${boardId}`);
  };

  if (!projectId) {
    return <p className="text-red-600">No projectId provided.</p>;
  }
  if (isLoading)
    return <div className="text-center py-6 text-gray-700">Loading boards...</div>;
  if (isError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-600">Error loading boards.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      await deleteBoard(boardId).unwrap();
      refetch();
    } catch (err: any) {
      alert(err.data?.error || err.message || 'Error deleting board');
    }
  };

  const handleCreateBoard = async (
    name: string,
    type: string,
    description?: string
  ) => {
    setCreateError('');
    if (!projectId || !name.trim()) {
      setCreateError('Missing project or board name.');
      return;
    }
    try {
      const newBoard = await createBoard({
        projectId,
        name,
        type,
        config: description ? { description } : {},
      }).unwrap();
      setShowCreateModal(false);
      refetch();
      navigateToBoard(newBoard._id);
    } catch (err: any) {
      setCreateError(err.data?.error || err.message || 'Error creating board.');
    }
  };

  // Simple card animation
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 border-b pb-2">
        {/* List View */}
      {boards && boards.length > 0 && viewMode === 'list' && (
        <div className=" max-w-md ">
          <select
            className="w-full border border-gray-300 rounded p-3 shadow-sm focus:ring focus:ring-blue-300"
            onChange={(e) => {
              const selectedBoardId = e.target.value;
              if (selectedBoardId) {
                navigateToBoard(selectedBoardId);
              }
            }}
            defaultValue=""
          >
            <option value="">Select a board...</option>
            {boards.map((b: Board) => (
              <option key={b._id} value={b._id}>
                {b.name} - {b.type || 'KANBAN'}
              </option>
            ))}
          </select>
        </div>
      )}

        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="custom"
            className="flex items-center px-4 py-2 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
          >
            <PencilIcon className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-blue-600">Create Board</span>
          </Button>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setViewMode('list');
                setCardDropdownOpen(false);
              }}
              className={`px-4 py-2 rounded text-sm border ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              } transition-colors`}
            >
              List
            </button>
            <button
              onClick={() => {
                setViewMode('cards');
                setCardDropdownOpen(true);
              }}
              className={`px-4 py-2 rounded text-sm border ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              } transition-colors`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

     
      {/* Cards View */}
      {boards && boards.length > 0 && viewMode === 'cards' && (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {boards.map((b: Board) => (
              <motion.div
                key={b._id}
                variants={cardVariant}
                className="bg-white rounded-lg shadow border p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  navigateToBoard(b._id);
                }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {b.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Type: {b.type || 'KANBAN'}
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(b._id);
                    }}
                    className="px-3 py-1 border border-red-600 rounded hover:bg-red-50 text-red-600"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {(!boards || boards.length === 0) && (
        <p className="text-center text-gray-500">No boards yet.</p>
      )}

      {/* Create Board Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateBoardModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreateBoard={handleCreateBoard}
            isCreating={isCreating}
            error={createError}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardList;
