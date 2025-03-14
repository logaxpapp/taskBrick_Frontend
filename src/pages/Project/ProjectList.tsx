// File: src/pages/components/ProjectList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Project, useDeleteProjectMutation } from '../../api/project/projectApi';


// icon for editing
// import {  } from '@heroicons/react/24/outline';
import { TrashIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  viewMode: 'list' | 'cards';
  onEdit: (projectId: string) => void;
  onManageMembers: (projectId: string) => void;
  onRefresh: () => void; // We'll call this after deleting
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  viewMode,
  onEdit,
  onManageMembers,
  onRefresh,
}) => {
  const [deleteProject] = useDeleteProjectMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    try {
      await deleteProject(id).unwrap();
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete project: ${err.data?.error || err.message}`);
    }
  };

  if (isLoading) {
    return <p>Loading projects...</p>;
  }
  if (!projects || projects.length === 0) {
    return <p className="text-gray-500">No projects found.</p>;
  }

  // ----------------------
  // LIST VIEW
  // ----------------------
  if (viewMode === 'list') {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2  text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap font-medium text-blue-700">
                  {proj.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-700">{proj.key}</td>
                <td className="px-4 py-2 text-gray-600">
                  {proj.description || <span className="text-gray-400">No desc</span>}
                </td>
                <td className="px-4 py-2 text-right flex items-center gap-2">
                  <button
                    onClick={() => onEdit(proj._id)}
                    className="px-3 py-1 text-blue-500 rounded hover:text-blue-700"
                    title="Edit Project"
                    style={{ marginLeft: 'auto' }} // Align to the right
                  >
                    <PencilIcon className="w-4 h-4 inline-block" />
                  </button>
                  <button
                    onClick={() => onManageMembers(proj._id)}
                    className="px-3 py-1 text-green-500  rounded " title='Manage Members'
                  >
                    <UserIcon className="w-4 h-4 inline-block" />
                  </button>
                  {/* Delete Icon Button */}
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    title="Delete Project"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ----------------------
  // CARD VIEW
  // ----------------------
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((proj) => (
        <motion.div
          key={proj._id}
          className="relative rounded-md border border-gray-200 p-4 shadow-sm bg-white"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <h3 className="text-lg font-semibold text-blue-700">{proj.name}</h3>
          <p className="text-xs text-gray-500">Key: {proj.key}</p>
          {proj.description && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-3">
              {proj.description}
            </p>
          )}

          <div className="mt-3 flex gap-2 text-sm">
            <button
              onClick={() => onEdit(proj._id)}
              className="px-3 py-1 text-blue-500 rounded hover:text-blue-600"
                title="Edit Project"
            >
              <PencilIcon className="w-4 h-4 inline-block" />
            </button>
            <button
              onClick={() => onManageMembers(proj._id)}
              className="px-3 py-1 text-green-500 rounded hover:text-green-600"
              title='Manage Members'
            >
                <UserIcon className="w-4 h-4 inline-block" />
            </button>

            {/* Delete Icon Button */}
            <button
              onClick={() => handleDelete(proj._id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
              title="Delete Project"
              style={{ marginLeft: 'auto' }}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;
