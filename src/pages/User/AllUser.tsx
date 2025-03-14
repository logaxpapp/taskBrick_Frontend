// File: src/pages/users/AllUser.tsx

import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  HiUsers,
  HiUserAdd,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import type { Role } from '../../types/rolePermissionTypes';
import {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleSuspendUserMutation,
  useDeactivateUserMutation,
} from '../../api/user/userApi';
import Pagination from '../../components/Pagination';
import { useListRolesQuery } from '../../api/rolePermission/rolePermissionApi';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import ToastContainer from '../../components/UI/Toast/ToastContainer';
import type { ToastProps } from '../../components/UI/Toast/Toast';
import { User } from '../../types/userTypes';
import ConfirmDialog from './ConfirmDialog';
import UserGridItem from './UserGridItem';
import UserListRow from './UserListRow';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.15 },
  },
};

const AllUser: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add / Edit Modal states for adding a new user
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  // Edit Modal states
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [editUserFirstName, setEditUserFirstName] = useState('');
  const [editUserLastName, setEditUserLastName] = useState('');
  const [editUserRole, setEditUserRole] = useState('');

  // Toast notifications
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);
  const addToast = (message: string, variant?: ToastProps['variant']) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant }]);
  };
  const handleToastClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Confirm dialog for deactivation/deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // API queries and mutations
  const {
    data: userData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    refetch,
  } = useListUsersQuery();

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [toggleSuspendUser, { isLoading: isTogglingSuspend }] = useToggleSuspendUserMutation();
  const [deactivateUser, { isLoading: isDeactivatingUser }] = useDeactivateUserMutation();
  const { data: allRoles = [], isLoading: rolesLoading } = useListRolesQuery();

  // Dropdown state for actions
  const [dropdownOpenFor, setDropdownOpenFor] = useState<string | null>(null);
  const toggleDropdown = (userId: string) => {
    setDropdownOpenFor((prev) => (prev === userId ? null : userId));
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalUsers = userData ? userData.length : 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage) || 1;
  const paginatedUsers = userData
    ? userData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  /* --- Add User logic --- */
  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      addToast('Please fill out email and password!', 'warning');
      return;
    }
    try {
      await createUser({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName,
        role: newUserRole || undefined,
      }).unwrap();
      addToast(`User '${newUserEmail}' created successfully!`, 'success');
      setAddModalOpen(false);
      setNewUserFirstName('');
      setNewUserLastName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('');
      refetch();
    } catch (err: any) {
      console.error('Create user error:', err);
      addToast(err.data?.error || 'Failed to create user', 'error');
    }
  };

  /* --- Edit User logic --- */
  const openEditUserModal = (user: User) => {
    setEditUserId(user._id);
    setEditUserFirstName(user.firstName || '');
    setEditUserLastName(user.lastName || '');
    setEditUserRole(typeof user.role === 'string' ? user.role : user.role?.name || '');
    setEditModalOpen(true);
  };
  const handleEditUserSave = async () => {
    if (!editUserId) return;
    try {
      await updateUser({
        userId: editUserId,
        data: {
          firstName: editUserFirstName,
          lastName: editUserLastName,
          role: editUserRole,
        },
      }).unwrap();
      addToast('User updated successfully!', 'success');
      setEditModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('Update user error:', err);
      addToast(err.data?.error || 'Failed to update user', 'error');
    }
  };

  /* --- Deactivate / Delete / Suspend logic --- */
  const handleDeactivateUser = (userId: string) => {
    setConfirmMessage('Are you sure you want to deactivate this user?');
    setConfirmAction(() => async () => {
      try {
        await deactivateUser(userId).unwrap();
        addToast('User deactivated', 'success');
        refetch();
      } catch (err: any) {
        console.error('Deactivate user error:', err);
        addToast(err.data?.error || 'Failed to deactivate user', 'error');
      }
    });
    setConfirmOpen(true);
  };
  const handleDeleteUser = (userId: string) => {
    setConfirmMessage('Are you sure you want to permanently delete this user?');
    setConfirmAction(() => async () => {
      try {
        await deleteUser(userId).unwrap();
        addToast('User deleted', 'success');
        refetch();
      } catch (err: any) {
        console.error('Delete user error:', err);
        addToast(err.data?.error || 'Failed to delete user', 'error');
      }
    });
    setConfirmOpen(true);
  };
  const handleToggleSuspend = async (user: User) => {
    const newStatus = !user.isActive;
    const actionLabel = newStatus ? 'Unsuspend' : 'Suspend';
    if (!window.confirm(`Are you sure you want to ${actionLabel} this user?`)) return;
    try {
      await toggleSuspendUser({ userId: user._id, isActive: newStatus }).unwrap();
      addToast(`User ${actionLabel}ed successfully!`, 'success');
      refetch();
    } catch (err: any) {
      console.error('Suspend user error:', err);
      addToast(err.data?.error || 'Failed to change user status', 'error');
    }
  };

  return (
    <motion.div
      className="p-6 md:p-8 lg:p-10 space-y-6 text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Toasts */}
      <ToastContainer toasts={toasts} onClose={handleToastClose} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        message={confirmMessage}
        onConfirm={() => {
          confirmAction?.();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Top row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">All Users</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" leftIcon={HiUsers}>
            Manage roles
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={HiUserAdd}
            onClick={() => setAddModalOpen(true)}
          >
            Add user
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={viewMode === 'grid' ? HiEyeOff : HiEye}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">Search users</label>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <hr className="border-gray-200" />

      {/* Main content */}
      {isUsersLoading && <p>Loading users...</p>}
      {isUsersError && <p className="text-red-500">Error: {String(usersError)}</p>}

      {userData && !isUsersLoading && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedUsers.map((user) => (
                <UserGridItem
                  key={user._id}
                  user={user}
                  dropdownOpenFor={dropdownOpenFor}
                  onToggleDropdown={toggleDropdown}
                  onEditUser={openEditUserModal}
                  onToggleSuspend={handleToggleSuspend}
                  onDeactivateUser={handleDeactivateUser}
                  onDeleteUser={handleDeleteUser}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">First Name</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Last Name</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Email</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Role</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Status</th>
                    <th className="px-4 py-2 text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((u) => (
                    <UserListRow
                      key={u._id}
                      user={u}
                      dropdownOpenFor={dropdownOpenFor}
                      onToggleDropdown={toggleDropdown}
                      onEditUser={openEditUserModal}
                      onToggleSuspend={handleToggleSuspend}
                      onDeactivateUser={handleDeactivateUser}
                      onDeleteUser={handleDeleteUser}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New User"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser} disabled={isCreatingUser}>
              {isCreatingUser ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={newUserFirstName}
              onChange={(e) => setNewUserFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={newUserLastName}
              onChange={(e) => setNewUserLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
            {rolesLoading ? (
              <p className="text-gray-600">Loading roles...</p>
            ) : allRoles ? (
              <select
                className="border bg-white border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a Role --
                </option>
                {allRoles.map((role: Role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500">No roles found.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditUserSave} disabled={isUpdatingUser || !editUserId}>
              {isUpdatingUser ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={editUserFirstName}
              onChange={(e) => setEditUserFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={editUserLastName}
              onChange={(e) => setEditUserLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={editUserRole}
              onChange={(e) => setEditUserRole(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AllUser;
