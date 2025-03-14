import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import {
  useListMappingsQuery,
  useCreateMappingMutation,
  useUpdateMappingMutation,
  useDeleteMappingMutation,
} from '../../api/rolePermission/permissionMappingApi';

import { useListPermissionsQuery } from '../../api/rolePermission/rolePermissionApi';

import { PermissionMapping } from '../../types/permissionMappingTypes';
import { Permission } from '../../types/rolePermissionTypes';
import Pagination from '../../components/Pagination';

// Framer-motion variants for modals / fade transitions
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: '-100vh', opacity: 0 },
  visible: { y: '0', opacity: 1, transition: { duration: 0.2 } },
};

const PermissionMappingManager: React.FC = () => {
  // Mappings (list, create, update, delete)
  const { data: mappings, isLoading, error, refetch } = useListMappingsQuery();
  const [createMapping] = useCreateMappingMutation();
  const [updateMapping] = useUpdateMappingMutation();
  const [deleteMapping] = useDeleteMappingMutation();

  // Permissions for the dropdown
  const {
    data: allPerms,
    isLoading: permsLoading,
    error: permsError,
  } = useListPermissionsQuery();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    route: '',
    method: 'GET',
    permissionName: '',
  });

  // Edit form state
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    route: '',
    method: 'GET',
    permissionName: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /** Filter the mappings by searchTerm (matching route, method, or permissionName). */
  const filteredMappings: PermissionMapping[] = (mappings || []).filter((m) => {
    const s = searchTerm.toLowerCase();
    return (
      m.route.toLowerCase().includes(s) ||
      m.method.toLowerCase().includes(s) ||
      m.permissionName.toLowerCase().includes(s)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredMappings.length / itemsPerPage);
  const paginatedMappings = filteredMappings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ----------------- Create -------------------
  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.route.trim() || !createForm.permissionName.trim()) {
      alert('Route and Permission Name are required.');
      return;
    }
    try {
      await createMapping({
        route: createForm.route.trim(),
        method: createForm.method.trim(),
        permissionName: createForm.permissionName.trim(),
      }).unwrap();
      setShowCreateModal(false);
      setCreateForm({ route: '', method: 'GET', permissionName: '' });
    } catch (err) {
      console.error('Create Mapping failed:', err);
      alert('Failed to create mapping');
    }
  }

  // ----------------- Edit -------------------
  function openEditModal(m: PermissionMapping) {
    setEditId(m._id);
    setEditForm({
      route: m.route,
      method: m.method,
      permissionName: m.permissionName,
    });
    setShowEditModal(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    if (!editForm.route.trim() || !editForm.permissionName.trim()) {
      alert('Route and Permission Name are required.');
      return;
    }
    try {
      await updateMapping({
        id: editId,
        data: {
          route: editForm.route.trim(),
          method: editForm.method.trim(),
          permissionName: editForm.permissionName.trim(),
        },
      }).unwrap();
      setShowEditModal(false);
      setEditId(null);
      setEditForm({ route: '', method: 'GET', permissionName: '' });
    } catch (err) {
      console.error('Update mapping failed:', err);
      alert('Failed to update');
    }
  }

  // ----------------- Delete -------------------
  async function handleDelete(id: string) {
    if (!window.confirm('Really delete this mapping?')) return;
    try {
      await deleteMapping(id).unwrap();
    } catch (err) {
      console.error('Delete mapping failed:', err);
      alert('Failed to delete');
    }
  }

  // Handle loading and error states
  if (isLoading || permsLoading) {
    return <p className="text-gray-500 text-center mt-10">Loading data...</p>;
  }
  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading mappings.{' '}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }
  if (permsError) {
    return <p className="text-red-500 text-center mt-10">Error loading Permissions list.</p>;
  }
  if (!mappings || !allPerms) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header & Search/Create Row */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Permission Mapping Manager</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search route/method/permission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full md:w-1/3 shadow-sm"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            <FaPlus />
            <span>Create Mapping</span>
          </button>
        </div>
      </div>

      {/* Table of Mappings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Route</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Method</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Permission</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedMappings.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{m.route}</td>
                <td className="px-6 py-4">{m.method}</td>
                <td className="px-6 py-4">{m.permissionName}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => openEditModal(m)}
                    className="flex items-center justify-center p-2 text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-full shadow"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="flex items-center justify-center p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-full shadow"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedMappings.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                  No mappings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" variants={modalVariants}>
              <h2 className="text-xl font-bold mb-4 text-center">Create a Mapping</h2>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700">Route</label>
                  <input
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={createForm.route}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, route: e.target.value }))}
                    placeholder="/ or /:id or /projects"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Method</label>
                  <select
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={createForm.method}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, method: e.target.value }))}
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PATCH</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Permission Name</label>
                  <select
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={createForm.permissionName}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        permissionName: e.target.value,
                      }))
                    }
                  >
                    <option value="">--Select a Permission--</option>
                    {allPerms.map((perm: Permission) => (
                      <option key={perm._id} value={perm.name}>
                        {perm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg" variants={modalVariants}>
              <h2 className="text-xl font-bold mb-4 text-center">Edit Mapping</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700">Route</label>
                  <input
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={editForm.route}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, route: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Method</label>
                  <select
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={editForm.method}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, method: e.target.value }))}
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PATCH</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700">Permission Name</label>
                  <select
                    className="border border-gray-300 p-2 rounded w-full shadow-sm"
                    value={editForm.permissionName}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        permissionName: e.target.value,
                      }))
                    }
                  >
                    <option value="">--Select a Permission--</option>
                    {allPerms.map((perm: Permission) => (
                      <option key={perm._id} value={perm.name}>
                        {perm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PermissionMappingManager;
