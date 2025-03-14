// File: src/components/admin/AdminUserManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
} from 'react-icons/fa';
import {
  useAdminGetAllUsersQuery,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useAdminToggleSuspendUserMutation,
  useAdminDeactivateUserMutation,
} from '../../api/admin/adminUserApi';
import Pagination from '../../components/Pagination';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import { User } from '../../types/userTypes';

const AdminUserManager: React.FC = () => {
  // Fetch admin users using the admin API slice
  const {
    data: adminUsers,
    isLoading,
    error,
    refetch,
  } = useAdminGetAllUsersQuery();

  // API hooks for user actions
  const [updateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useAdminDeleteUserMutation();
  const [toggleSuspendUser, { isLoading: isToggling }] = useAdminToggleSuspendUserMutation();
  const [deactivateUser, { isLoading: isDeactivating }] = useAdminDeactivateUserMutation();

  // State for the Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = adminUsers ? Math.ceil(adminUsers.length / itemsPerPage) : 1;
  const paginatedUsers = adminUsers
    ? adminUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Open edit modal and prefill data
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName || '');
    setEditLastName(user.lastName || '');
    setEditEmail(user.email);
    setShowEditModal(true);
  };

  // Handle saving the edits
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await updateUser({
        userId: selectedUser._id,
        data: {
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
        },
      }).unwrap();
      refetch();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating admin user:', err);
    }
  };

  // Handle deletion of a user
  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (err) {
        console.error('Error deleting admin user:', err);
      }
    }
  };

  // Toggle the suspend status of a user
  const handleToggleSuspend = async (user: User) => {
    if (
      window.confirm('Are you sure you want to toggle suspend status for this admin user?')
    ) {
      try {
        await toggleSuspendUser({ userId: user._id, isActive: !user.isActive }).unwrap();
        refetch();
      } catch (err) {
        console.error('Error toggling suspend status:', err);
      }
    }
  };

  // Deactivate a user
  const handleDeactivate = async (userId: string) => {
    if (window.confirm('Are you sure you want to deactivate this admin user?')) {
      try {
        await deactivateUser(userId).unwrap();
        refetch();
      } catch (err) {
        console.error('Error deactivating user:', err);
      }
    }
  };

  return (
    <motion.div
      className="p-8 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin User Manager</h1>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading admin users...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading admin users.</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.firstName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(user)}
                          className="text-yellow-600 hover:text-yellow-800 mr-4"
                          title="Toggle Suspend"
                        >
                          {user.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          className="text-gray-600 hover:text-gray-800 mr-4"
                          title="Deactivate User"
                        >
                          <FaTimes />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            title="Edit Admin User"
            footer={
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" onClick={handleEditSubmit} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            }
          >
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUserManager;
