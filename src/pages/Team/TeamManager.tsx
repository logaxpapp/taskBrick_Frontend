// File: src/pages/Team/TeamManager.tsx

import React, { useState } from 'react';
import PreDashboard from '../auth/PreDashboard';
import { useSelector } from'react-redux';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  useListTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  Team,
} from '../../api/team/teamApi';
import { TeamRole } from '../../types/teamRole';
import clsx from 'clsx';
import {
  useListUsersInTeamQuery,
  useAddUserToTeamMutation,
  useRemoveUserFromTeamMutation,
  UserTeamPivot,
} from '../../api/userTeam/userTeamApi';

import { useListOrgMembersQuery } from '../../api/user/userApi'; // <-- new import
import { RootState } from '../../app/store';

import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../app/hooks/redux'; 
import { useOrgContext } from '../../contexts/OrgContext';

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

const TeamManager: React.FC = () => {
  const {selectedOrgName } = useOrgContext();
  const { selectedOrgId } = useAppSelector((state) => state.organization);

    // Grab the logged-in user from Redux
    const user = useSelector((state: RootState) => state.auth.user);



  // If no org is selected, show a message
  if (!selectedOrgId) {
    return (
      <div className="p-8 text-gray-600">
        <h1 className="text-xl font-semibold mb-4">Team Manager</h1>
        <p>
          <PreDashboard />
        </p>
      </div>
    );
  }

  // 1) Teams in this org
  const {
    data: teams,
    isLoading: teamsLoading,
    isError: teamsError,
    refetch: refetchTeams,
  } = useListTeamsQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  // 2) Users in the currently selected Team
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const {
    data: teamUsers,
    refetch: refetchTeamUsers,
  } = useListUsersInTeamQuery(selectedTeam?._id ?? '', {
    skip: !selectedTeam,
  });

  // 3) All Users in the Org (for the “Add User” dropdown)
  // If your endpoint is /users?orgId=some, use that; here we assume "listOrgMembers(orgId)".
  const {
    data: orgUsers,
    isLoading: orgUsersLoading,
    isError: orgUsersError,
  } = useListOrgMembersQuery(
    {
      userId: user?._id || '', // <-- pass the logged-in user ID
      orgId: selectedOrgId,
    },
    {
      skip: !selectedOrgId,
    }
  );

  // Mutations
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const [addUserToTeam] = useAddUserToTeamMutation();
  const [removeUserFromTeam] = useRemoveUserFromTeamMutation();

  // Local modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDesc, setEditTeamDesc] = useState('');

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // For the selected user from the dropdown
  const [selectedUserToAdd, setSelectedUserToAdd] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState('');

  // Handlers
  const handleCreateTeamModalOpen = () => {
    setNewTeamName('');
    setNewTeamDesc('');
    setShowCreateModal(true);
  };
  const handleCreateTeam = async () => {
    try {
      await createTeam({
        name: newTeamName,
        organizationId: selectedOrgId,
        description: newTeamDesc || null,
      }).unwrap();
      setShowCreateModal(false);
      refetchTeams();
    } catch (err: any) {
      alert(`Error creating team: ${err.message || err}`);
    }
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
  };

  const handleEditTeamModalOpen = (team: Team) => {
    setSelectedTeam(team);
    setEditTeamName(team.name);
    setEditTeamDesc(team.description || '');
    setShowEditModal(true);
  };
  const handleSaveEditTeam = async () => {
    if (!selectedTeam) return;
    try {
      await updateTeam({
        id: selectedTeam._id,
        updates: {
          name: editTeamName,
          description: editTeamDesc,
        },
      }).unwrap();
      setShowEditModal(false);
      refetchTeams();
    } catch (err: any) {
      alert(`Error updating team: ${err.message || err}`);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await deleteTeam(teamId).unwrap();
      refetchTeams();
      if (selectedTeam && selectedTeam._id === teamId) {
        setSelectedTeam(null);
      }
    } catch (err: any) {
      alert(`Error deleting team: ${err.message || err}`);
    }
  };

  // Add user to team, from the dropdown
  const handleAddUser = async () => {
    if (!selectedTeam) return;
    if (!selectedUserToAdd) {
      alert('Please select a user to add');
      return;
    }
    try {
      await addUserToTeam({
        userId: selectedUserToAdd,
        teamId: selectedTeam._id,
        roleInTeam: newUserRole || 'Member',
      }).unwrap();
      refetchTeamUsers();
      setShowAddUserModal(false);
      setSelectedUserToAdd('');
      setNewUserRole('');
    } catch (err: any) {
      alert(`Error adding user: ${err.message || err}`);
    }
  };

  const handleRemoveUser = async (userPivot: UserTeamPivot) => {
    if (!selectedTeam) return;
    const confirmed = window.confirm(`Remove user from team?`);
    if (!confirmed) return;
    try {
      await removeUserFromTeam({
        userId: userPivot.userId,
        teamId: selectedTeam._id,
      }).unwrap();
      refetchTeamUsers();
    } catch (err: any) {
      alert(`Error removing user: ${err.message || err}`);
    }
  };

  // Render
  if (teamsLoading) {
    return (
      <div className="p-8 text-gray-600 animate-pulse">
        Loading Teams...
      </div>
    );
  }
  if (teamsError) {
    return (
      <div className="p-8 text-red-500">
        Error loading teams. Please try again.
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 md:p-8 lg:p-10 space-y-6 text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header area */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Team Manager</h1>
          <p className="text-sm text-gray-500">Organization: {selectedOrgName}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateTeamModalOpen}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition flex items-center gap-1 text-sm"
          >
            <HiOutlinePlusCircle className="text-gray-600" />
            Create New Team
          </button>
        </div>
      </motion.div>

      <hr className="border-gray-200" />

      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Left: Team List */}
        <div className="flex-1 min-w-[300px]">
          <h2 className="text-lg font-semibold mb-4">
            All Teams (Org: {selectedOrgName})
          </h2>
          {teams && teams.length > 0 ? (
            <ul className="space-y-2">
              {teams.map((team) => (
                <li
                  key={team._id}
                  className={clsx(
                    'border rounded p-3 flex items-center justify-between transition',
                    selectedTeam && selectedTeam._id === team._id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-100'
                  )}
                >
                  <div>
                    <p
                      onClick={() => handleSelectTeam(team)}
                      className="font-medium text-gray-700 cursor-pointer hover:underline"
                    >
                      {team.name}
                    </p>
                    {team.description && (
                      <p className="text-xs text-gray-400">{team.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTeamModalOpen(team)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No teams found in {selectedOrgName}.
            </p>
          )}
        </div>

        {/* Right: Selected Team Details */}
        <div className="flex-1">
          {selectedTeam ? (
            <div className="border rounded bg-white p-4">
              <h2 className="text-lg font-semibold mb-4">
                {selectedTeam.name} - Members
              </h2>
              {teamUsers && teamUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                {teamUsers.map((pivot) => (
                  <li key={pivot._id} className="p-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        {pivot.userId.firstName} {pivot.userId.lastName}
                      </p>
                      <span className="text-xs text-gray-400">
                        Email: {pivot.userId.email}
                      </span>
                      <p className="text-xs text-gray-400">
                        Role: {pivot.roleInTeam || 'Member'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(pivot)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
              
              ) : (
                <p className="text-gray-500 text-sm">
                  No members found for this team.
                </p>
              )}
              <button
                onClick={() => setShowAddUserModal(true)}
                className="mt-4 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm flex items-center gap-1"
              >
                <HiOutlinePlusCircle className="text-gray-600" />
                Add user
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              Select a team to view details
            </p>
          )}
        </div>
      </motion.div>

      {/* CREATE TEAM MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            key="createTeamModal"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create a New Team</h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-1 rounded"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border px-3 py-1 rounded"
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT TEAM MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            key="editTeamModal"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Team</h2>
                <button onClick={() => setShowEditModal(false)}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-1 rounded"
                    value={editTeamName}
                    onChange={(e) => setEditTeamName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border px-3 py-1 rounded"
                    value={editTeamDesc}
                    onChange={(e) => setEditTeamDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditTeam}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD USER TO TEAM MODAL */}
      <AnimatePresence>
        {showAddUserModal && (
          <motion.div
            key="addUserModal"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add User to Team</h2>
                <button onClick={() => setShowAddUserModal(false)}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* If orgUsers is loading or error */}
              {orgUsersLoading && (
                <p className="text-gray-500 text-sm mb-4">Loading org users...</p>
              )}
              {orgUsersError && (
                <p className="text-red-500 text-sm mb-4">Error loading org users.</p>
              )}

              {/* If we have orgUsers, display a dropdown */}
              {orgUsers && orgUsers.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select a user
                    </label>
                    <select
                      className="w-full border px-3 py-1 rounded"
                      value={selectedUserToAdd}
                      onChange={(e) => setSelectedUserToAdd(e.target.value)}
                    >
                      <option value="">-- Choose a user --</option>
                      {orgUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.email} {u.firstName && `(${u.firstName})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role in Team
                    </label>
                    <select
                      className="w-full border px-3 py-1 rounded"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="">-- Select Role --</option>
                      {Object.values(TeamRole).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      </select>
                    
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setShowAddUserModal(false)}
                      className="bg-gray-300 px-4 py-1.5 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddUser}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                    >
                      Add User
                    </button>
                  </div>
                </div>
              )}

              {/* If no orgUsers found */}
              {orgUsers && orgUsers.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No users found in this organization.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamManager;
