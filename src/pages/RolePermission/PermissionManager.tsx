// File: src/components/PermissionManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import {
  useListPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from '../../api/rolePermission/rolePermissionApi';
import { Permission, CreatePermissionPayload } from '../../types/rolePermissionTypes';
import Pagination from '../../components/Pagination';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PermissionManager: React.FC = () => {
  // API hooks
  const { data: permissions, isLoading, error, refetch } = useListPermissionsQuery();
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const [deletePermission] = useDeletePermissionMutation();

  // Modal and form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState<CreatePermissionPayload>({ name: '', description: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = permissions ? Math.ceil(permissions.length / itemsPerPage) : 1;
  const paginatedPermissions = permissions
    ? permissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Create Permission Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPermission(formData).unwrap();
      refetch();
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Error creating permission:', err);
    }
  };

  // Edit Permission Handler
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPermission) {
      try {
        await updatePermission({ id: selectedPermission._id, data: formData }).unwrap();
        refetch();
        setShowEditModal(false);
        setSelectedPermission(null);
        setFormData({ name: '', description: '' });
      } catch (err) {
        console.error('Error updating permission:', err);
      }
    }
  };

  // Delete Permission Handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Error deleting permission:', err);
      }
    }
  };

  // Open Edit Modal and populate form with selected permission's data
  const openEditModal = (perm: Permission) => {
    setSelectedPermission(perm);
    setFormData({ name: perm.name, description: perm.description || '' });
    setShowEditModal(true);
  };

  return (
    <motion.div
      className="p-8 bg-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Permission Manager</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Create Permission
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="text-center text-gray-600">Loading permissions...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error loading permissions.</div>
        ) : (
          <>
            {/* Permissions Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPermissions.map((perm) => (
                    <motion.tr
                      key={perm._id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {perm.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {perm.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(perm)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit Permission"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(perm._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Permission"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Permission Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Create Permission</h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label htmlFor="create-name" className="block text-gray-700 text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="create-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="create-description" className="block text-gray-700 text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Permission Modal */}
      <AnimatePresence>
        {showEditModal && selectedPermission && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Permission</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPermission(null);
                  }}
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="mb-4">
                  <label htmlFor="edit-name" className="block text-gray-700 text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="edit-description" className="block text-gray-700 text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PermissionManager;
