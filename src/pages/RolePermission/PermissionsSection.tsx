// File: src/components/admin/PermissionsSection.tsx
import React, { useState } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import {
  useListPermissionsQuery,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
} from '../../api/rolePermission/rolePermissionApi';
import { Permission } from '../../types/rolePermissionTypes';
import Pagination from '../../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

function PermissionsSection() {
  const { data: perms, isLoading, error } = useListPermissionsQuery();
  const [createPermission] = useCreatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  // For editing
  const [editPermId, setEditPermId] = useState<string | null>(null);
  const [editPermName, setEditPermName] = useState('');
  const [editPermDesc, setEditPermDesc] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading)
    return <p className="text-center p-4">Loading Permissions...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 p-4">
        Error fetching permissions
      </p>
    );
  if (!perms) return null;

  // Filter permissions by search term
  const filteredPerms = perms.filter((p: Permission) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const total = filteredPerms.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const paginatedPerms = filteredPerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleCreatePermission(name: string, description?: string) {
    try {
      await createPermission({ name, description }).unwrap();
      setShowCreate(false);
    } catch (err) {
      console.error('Failed to create permission:', err);
    }
  }

  async function handleDeletePermission(permId: string) {
    if (!window.confirm('Are you sure you want to delete this permission?'))
      return;
    try {
      await deletePermission(permId).unwrap();
    } catch (err) {
      console.error('Failed to delete permission:', err);
    }
  }

  function startEditPerm(p: Permission) {
    setEditPermId(p._id);
    setEditPermName(p.name);
    setEditPermDesc(p.description || '');
  }

  async function handleUpdatePerm() {
    if (!editPermId) return;
    try {
      await updatePermission({
        id: editPermId,
        data: { name: editPermName, description: editPermDesc },
      }).unwrap();
      setEditPermId(null);
      setEditPermName('');
      setEditPermDesc('');
    } catch (err) {
      console.error('Failed to update permission:', err);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Permissions</h1>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search Permissions"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded p-2 w-64 shadow-sm"
          />
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            <FaPlus />
            <span>Create Permission</span>
          </button>
        </div>
      </div>

      {/* Create Permission Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <CreatePermissionForm
                onClose={() => setShowCreate(false)}
                onCreate={handleCreatePermission}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permissions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedPerms.map((p: Permission) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editPermId === p._id ? (
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 w-full"
                      value={editPermName}
                      onChange={(e) => setEditPermName(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-800">{p.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editPermId === p._id ? (
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 w-full"
                      value={editPermDesc}
                      onChange={(e) => setEditPermDesc(e.target.value)}
                    />
                  ) : (
                    <span className="text-gray-600">{p.description}</span>
                  )}
                </td>
                <td className="px-4 py-3 flex justify-center space-x-2">
                  {editPermId === p._id ? (
                    <button
                      onClick={handleUpdatePerm}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditPerm(p)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded shadow flex items-center"
                      title="Edit Permission"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePermission(p._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-500 px-3 py-1 rounded shadow flex items-center"
                    title="Delete Permission"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedPerms.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                  No permissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default PermissionsSection;

function CreatePermissionForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, description?: string) => void;
}) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), desc.trim() || undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Create New Permission
      </h3>
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Permission Name
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. user.create"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description (optional)
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-full"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Allows creation of users"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded shadow"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
