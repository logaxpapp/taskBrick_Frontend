// src/components/admin/UserManager.tsx

import React, { useCallback, useState, useEffect } from 'react';
import { FaSync, FaUserEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useListUsersQuery, useUpdateUserMutation } from '../../api/user/userApi';
import { User } from '../../types/userTypes';
import TableSearchSortPagination from './TableSearchSortPagination';
import { useListRolesQuery } from '../../api/rolePermission/rolePermissionApi';
import type { Role } from '../../types/rolePermissionTypes';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/Pagination';

interface TableParams {
  search: string;
  page: number;
  pageSize: number;
  sortField: string;
  sortDir: 'asc' | 'desc';
}

function UserManager() {
  const { data: allUsers, isLoading, error, refetch } = useListUsersQuery();
  const [tableParams, setTableParams] = useState<TableParams>({
    search: '',
    page: 1,
    pageSize: 10,
    sortField: 'email',
    sortDir: 'asc',
  });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleParamsChange = useCallback((newParams: Partial<TableParams>) => {
    setTableParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  }, []);

  function openRoleModal(user: User) {
    setSelectedUser(user);
    setShowRoleModal(true);
  }

  // Loading/Error states
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 flex justify-center items-center"
      >
        <FaSync className="animate-spin text-blue-500 text-2xl" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 text-red-500 flex items-center justify-center"
      >
        Error loading users.
        <button onClick={() => refetch()} className="ml-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          <FaSync className="inline-block mr-1" />
          Retry
        </button>
      </motion.div>
    );
  }

  if (!allUsers) {
    return <p className="p-6 text-center text-gray-500">No users found.</p>;
  }

  const searchTerm = tableParams.search.toLowerCase();
  let filtered = allUsers.filter((u) => {
    const fullName = (u.firstName + ' ' + u.lastName).toLowerCase();
    const email = u.email.toLowerCase();
    return email.includes(searchTerm) || fullName.includes(searchTerm);
  });

  filtered.sort((a, b) => {
    let fieldA: string = '';
    let fieldB: string = '';

    if (tableParams.sortField === 'email') {
      fieldA = a.email.toLowerCase();
      fieldB = b.email.toLowerCase();
    } else if (tableParams.sortField === 'firstName') {
      fieldA = (a.firstName || '').toLowerCase();
      fieldB = (b.firstName || '').toLowerCase();
    } else if (tableParams.sortField === 'lastName') {
      fieldA = (a.lastName || '').toLowerCase();
      fieldB = (b.lastName || '').toLowerCase();
    } else if (tableParams.sortField === 'isActive') {
      fieldA = a.isActive?.toString() ?? 'false';
      fieldB = b.isActive?.toString() ?? 'false';
    }

    if (fieldA < fieldB) return tableParams.sortDir === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return tableParams.sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / tableParams.pageSize) || 1;
  const startIndex = (tableParams.page - 1) * tableParams.pageSize;
  const endIndex = startIndex + tableParams.pageSize;
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => refetch()}
          className="mt-4 md:mt-0 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center"
        >
          <FaSync className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Search, Sort & Pagination Controls */}
      <TableSearchSortPagination
        currentSearch={tableParams.search}
        currentPage={tableParams.page}
        pageSize={tableParams.pageSize}
        sortField={tableParams.sortField}
        sortDir={tableParams.sortDir}
        totalItems={total}
        onChangeParams={handleParamsChange}
      />

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedUsers.map((u) => (
                <motion.tr
                  key={u._id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-4 py-3 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {typeof u.role === 'object' && u.role ? (u.role as Role).name : u.role}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openRoleModal(u)}
                      className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center"
                      title="Change Role"
                    >
                      <FaUserEdit className="mr-1" />
                      Change
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {tableParams.page > totalPages && totalPages > 0 && (
        <p className="text-sm text-red-500">Page {tableParams.page} is out of range.</p>
      )}

      {/* Role Change Modal */}
      <AnimatePresence>
        {showRoleModal && selectedUser && (
          <ChangeRoleModal
            user={selectedUser}
            onClose={() => setShowRoleModal(false)}
            onRoleUpdated={() => refetch()}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UserManager;

function ChangeRoleModal({
  user,
  onClose,
  onRoleUpdated,
}: {
  user: User;
  onClose: () => void;
  onRoleUpdated: () => void;
}) {
  const { data: allRoles = [], isLoading: rolesLoading } = useListRolesQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  useEffect(() => {
    if (typeof user.role === 'string') {
      setSelectedRoleId(user.role);
    }
  }, [user.role]);

  const handleSave = async () => {
    if (!selectedRoleId) return;
    try {
      await updateUser({ userId: user._id, data: { role: selectedRoleId } }).unwrap();
      onRoleUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update user role:', err);
      alert('Error updating role. Check console.');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          Change Role for <span className="text-blue-500">{user.email}</span>
        </h3>
        {rolesLoading ? (
          <p className="text-gray-600">Loading roles...</p>
        ) : allRoles ? (
          <select
            className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={isUpdating}
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

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors disabled:opacity-50"
            disabled={isUpdating}
          >
            <FaTimes className="inline-block mr-1" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 flex items-center"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <FaSync className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck className="mr-1" />
                Save
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
