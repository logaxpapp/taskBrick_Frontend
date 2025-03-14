// File: src/components/managers/PortfolioItem.tsx

import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IPortfolio } from '../../api/portfolio/portfolioApi';
import { Project } from '../../api/project/projectApi';

interface PortfolioItemProps {
  portfolio: IPortfolio;   // e.g. { _id, name, description, projectIds }
  projects: Project[];     // all projects in the org
  isDeleting: boolean;     // if currently deleting
  isUpdating: boolean;     // if currently updating

  // The child expects onUpdate with (id, name, desc)
  onUpdate: (id: string, name: string, desc: string) => void;

  onDelete: (id: string) => void;
  onToggleProject: (portfolioId: string, projectId: string, isChecked: boolean) => void;
}

/**
 * Renders one portfolio row:
 * - "View mode" (displays name, desc, # projects)
 * - "Edit mode" (rename, desc, toggle projects)
 */
const PortfolioItem: React.FC<PortfolioItemProps> = ({
  portfolio,
  projects,
  isDeleting,
  isUpdating,
  onUpdate,
  onDelete,
  onToggleProject,
}) => {
  // local edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState(portfolio.name);
  const [editDescription, setEditDescription] = useState(portfolio.description || '');

  // track local selected projects
  const [localProjectIds, setLocalProjectIds] = useState(portfolio.projectIds.map(String));

  function handleCancelEdit() {
    setIsEditMode(false);
    setEditName(portfolio.name);
    setEditDescription(portfolio.description || '');
    setLocalProjectIds(portfolio.projectIds.map(String));
  }

  // Save changes: calls parent with (id, name, desc)
  async function handleSaveEdit() {
    onUpdate(portfolio._id, editName, editDescription);
    setIsEditMode(false);
  }

  function handleProjectCheck(projectId: string, checked: boolean) {
    if (checked) {
      setLocalProjectIds((prev) => [...prev, projectId]);
      onToggleProject(portfolio._id, projectId, true);
    } else {
      setLocalProjectIds((prev) => prev.filter((id) => id !== projectId));
      onToggleProject(portfolio._id, projectId, false);
    }
  }

  if (!isEditMode) {
    // ------------------------------------------------ VIEW MODE
    return (
      <div className="border p-4 rounded bg-white shadow space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-600">
            {portfolio.name}
          </h3>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditMode(true)}
              className="px-2 py-1 bg-yellow-50 text-amber-500 rounded shadow hover:text-yellow-600"
            >
              <FaEdit className="inline-block " />
              
            </button>
            <button
              onClick={() => onDelete(portfolio._id)}
              disabled={isDeleting}
              className="px-1 py-1 bg-red-50 text-red-500 rounded shadow hover:text-red-700 disabled:bg-gray-400"
            >
              <FaTrashAlt className="inline-block" />
              {isDeleting ? 'Deleting...' : ''}
            </button>
          </div>
        </div>
        <p className="text-gray-700">{portfolio.description}</p>
        <p className="text-sm text-gray-600">
          <strong>Projects:</strong> {portfolio.projectIds.length}
        </p>
      </div>
    );
  }

  // ------------------------------------------------ EDIT MODE
  return (
    <div className="border p-4 rounded bg-white shadow space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">
          Name:
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 focus:ring"
          />
        </label>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">
          Description:
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1 focus:ring"
          />
        </label>
      </div>

      <div>
        <h4 className="font-semibold mb-1">Projects in this Portfolio</h4>
        <div className="max-h-40 overflow-auto border rounded p-2 space-y-1">
          {projects.map((proj) => {
            const checked = localProjectIds.includes(proj._id);
            return (
              <label key={proj._id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={checked}
                  onChange={(e) => handleProjectCheck(proj._id, e.target.checked)}
                />
                <span>{proj.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleSaveEdit}
          disabled={isUpdating}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isUpdating ? 'Updating...' : 'Save'}
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PortfolioItem;
