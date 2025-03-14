// File: src/pages/User/ListOrgUsers.tsx

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import PreDashboard from '../auth/PreDashboard';
import { RootState } from '../../app/store';
import { useAppSelector} from '../../app/hooks/redux';

import {
  useListUsersInOrgQuery,
  useRemoveUserFromOrgMutation,
} from '../../api/userOrganization/userOrganizationApi';

// (NEW) for inviting a user:
import {
  useInviteUserToOrgMutation,
  InviteUserToOrgPayload,
} from '../../api/organization/organizationApi';

import {
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// ---------------------------------------------
// Framer Motion Variants
// ---------------------------------------------
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// ---------------------------------------------
// Main Component
// ---------------------------------------------
const ListOrgUsers: React.FC = () => {
   const { selectedOrgId } = useAppSelector((state) => state.organization);

  // Logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  // If no org is selected, show a message or redirect
  if (!selectedOrgId) {
    return (
      <div className="p-8 text-gray-600">
        <PreDashboard />
      </div>
    );
  }

  // 1) Query all users for that org
  const {
    data: orgUsers,
    isLoading,
    isError,
    refetch,
  } = useListUsersInOrgQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  // 2) removeUserFromOrg mutation
  const [removeUserFromOrg] = useRemoveUserFromOrgMutation();

  // 3) local UI states
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserPivot, setSelectedUserPivot] = useState<any | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // (NEW) For inviting a user
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteUserToOrgPayload>({
    email: '',
    firstName: '',
    lastName: '',
    roleInOrg: 'member',
  });
  const [inviteUserToOrg, { isLoading: isInviting }] = useInviteUserToOrgMutation();

  // ---------------------------------------------
  // 4) Filter / search logic
  // ---------------------------------------------
  const filteredUsers = useMemo(() => {
    if (!orgUsers) return [];
    if (!searchTerm.trim()) return orgUsers;

    const lowerTerm = searchTerm.toLowerCase();
    return orgUsers.filter((pivot) => {
      const u = pivot.userId as any;
      const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      return (
        (u.email && u.email.toLowerCase().includes(lowerTerm)) ||
        (fullName && fullName.includes(lowerTerm))
      );
    });
  }, [orgUsers, searchTerm]);

  // ---------------------------------------------
  // Remove a user from org
  // ---------------------------------------------
  const handleRemoveFromOrg = async (pivotId: string, userId: string) => {
    if (!window.confirm('Remove this user from the organization?')) return;
    try {
      await removeUserFromOrg({ userId, organizationId: selectedOrgId }).unwrap();
      refetch();
    } catch (err: any) {
      alert(`Error removing user: ${err.data?.error || err.message}`);
    }
  };

  // ---------------------------------------------
  // View user detail
  // ---------------------------------------------
  const handleSelectUser = (pivot: any) => {
    setSelectedUserPivot(pivot);
    setShowUserModal(true);
  };

  // ---------------------------------------------
  // Invite user modal handlers
  // ---------------------------------------------
  const openInviteModal = () => {
    setInviteForm({
      email: '',
      firstName: '',
      lastName: '',
      roleInOrg: 'member',
    });
    setShowInviteModal(true);
  };
  const closeInviteModal = () => {
    setShowInviteModal(false);
  };

  // Submit the invite form
  const handleInviteSubmit = async () => {
    if (!inviteForm.email.trim()) {
      alert('Email is required');
      return;
    }
    try {
      await inviteUserToOrg({
        orgId: selectedOrgId,
        payload: inviteForm,
      }).unwrap();

      alert(`Invite sent to ${inviteForm.email}!`);
      closeInviteModal();
      // optionally re-fetch orgUsers if you expect an immediate pivot creation
      refetch();
    } catch (err: any) {
      alert(`Error inviting user: ${err.data?.error || err.message}`);
    }
  };

  // ---------------------------------------------
  // Render states
  // ---------------------------------------------
  if (isLoading) {
    return (
      <div className="p-8 text-gray-600 animate-pulse">
        Loading organization users...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-red-500">
        Error loading users. Please try again.
      </div>
    );
  }

  // ---------------------------------------------
  // MAIN RETURN
  // ---------------------------------------------
  return (
    <motion.div
      className="p-6 md:p-8 lg:p-10 space-y-6 text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold">Organization Users</h1>
         
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center border px-2 rounded bg-white">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="outline-none px-2 py-1 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1">
            <button
              className={clsx(
                'p-1 rounded hover:bg-gray-100',
                viewMode === 'cards' && 'bg-gray-200'
              )}
              onClick={() => setViewMode('cards')}
            >
              <Squares2X2Icon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className={clsx(
                'p-1 rounded hover:bg-gray-100',
                viewMode === 'list' && 'bg-gray-200'
              )}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* (NEW) Invite user button */}
          <button
            onClick={openInviteModal}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
          >
            Invite User
          </button>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      {filteredUsers.length === 0 ? (
        <motion.p variants={itemVariants} className="text-gray-500">
          No users match your search in .
        </motion.p>
      ) : viewMode === 'cards' ? (
        /* CARD VIEW */
        <motion.div
          variants={itemVariants}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {filteredUsers.map((pivot) => {
            const u = pivot.userId as any; 
            const fullName = (u.firstName || u.lastName)
              ? `${u.firstName ?? ''} ${u.lastName ?? ''}`
              : '';

            return (
              <AnimatePresence key={pivot._id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col rounded border border-gray-200 bg-white p-4 shadow"
                >
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-medium">
                      {fullName || u.email}
                    </h3>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Org Role: {pivot.roleInOrg || 'member'}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleSelectUser(pivot)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveFromOrg(pivot._id, u._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </motion.div>
      ) : (
        /* LIST VIEW */
        <motion.div
          variants={itemVariants}
          className="overflow-x-auto bg-white shadow rounded"
        >
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Org Role</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((pivot) => {
                const u = pivot.userId as any;
                const fullName = (u.firstName || u.lastName)
                  ? `${u.firstName ?? ''} ${u.lastName ?? ''}`
                  : '';

                return (
                  <motion.tr
                    key={pivot._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ backgroundColor: 'rgba(245,245,245,1)' }}
                    className="border-b bg-white"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-700">
                        {fullName || u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{pivot.roleInOrg || 'member'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="mr-4 text-sm text-blue-600 hover:underline"
                        onClick={() => handleSelectUser(pivot)}
                      >
                        View
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleRemoveFromOrg(pivot._id, u._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* USER DETAIL MODAL */}
      <AnimatePresence>
        {showUserModal && selectedUserPivot && (
          <motion.div
            key="userModalOverlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded bg-white p-6 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUserPivot(null);
                }}
                className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>

              <h3 className="mb-4 text-xl font-semibold text-gray-800">User Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {selectedUserPivot.userId.firstName || selectedUserPivot.userId.lastName
                    ? `${selectedUserPivot.userId.firstName ?? ''} ${selectedUserPivot.userId.lastName ?? ''}`
                    : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {selectedUserPivot.userId.email}
                </p>
                <p>
                  <span className="font-medium">Org Role:</span>{' '}
                  {selectedUserPivot.roleInOrg || 'member'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* (NEW) INVITE MODAL */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            key="inviteModalOverlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded bg-white p-6 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>

              <h3 className="mb-4 text-xl font-semibold text-gray-800">Invite New User</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={inviteForm.firstName}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={inviteForm.lastName}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Role in Org</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={inviteForm.roleInOrg}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, roleInOrg: e.target.value }))
                    }
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="lead">Lead</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteSubmit}
                  disabled={isInviting}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {isInviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ListOrgUsers;
