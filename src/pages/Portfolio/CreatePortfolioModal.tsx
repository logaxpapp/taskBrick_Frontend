// File: src/components/managers/CreatePortfolioModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Project } from '../../api/project/projectApi';

interface CreatePortfolioModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (name: string, desc: string, projectIds: string[]) => void;
  projects?: Project[];
  isCreating?: boolean;
}

const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({
  show,
  onClose,
  onCreate,
  projects,
  isCreating,
}) => {
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createSelectedProjects, setCreateSelectedProjects] = useState<string[]>([]);

  if (!show) return null;

  async function handleCreate() {
    if (!createName.trim()) return;
    await onCreate(createName.trim(), createDescription.trim(), createSelectedProjects);
    setCreateName('');
    setCreateDescription('');
    setCreateSelectedProjects([]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4 relative"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold">Create New Portfolio</h2>

        <div>
          <label className="block text-gray-700 font-medium">
            Name:
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">
            Description:
            <textarea
              value={createDescription}
              onChange={(e) => setCreateDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </label>
        </div>

        {/* Projects checkbox list */}
        {projects && projects.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2">Select Projects</h4>
            <div className="max-h-40 overflow-auto space-y-1 border border-gray-200 p-2 rounded">
              {projects.map((proj) => (
                <label key={proj._id} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={createSelectedProjects.includes(proj._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCreateSelectedProjects((prev) => [...prev, proj._id]);
                      } else {
                        setCreateSelectedProjects((prev) =>
                          prev.filter((id) => id !== proj._id)
                        );
                      }
                    }}
                  />
                  <span>{proj.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!createName.trim() || isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Portfolio'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePortfolioModal;
