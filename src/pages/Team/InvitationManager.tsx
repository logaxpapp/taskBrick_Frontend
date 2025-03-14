// File: src/pages/Invitation/InvitationManager.tsx

import React, { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import PreDashboard from '../auth/PreDashboard';
// Hooks from RTK Query
import {
  useListInvitationsQuery,
  useCreateInvitationMutation,
  useUpdateInvitationMutation,
  useDeleteInvitationMutation,
  Invitation,
} from '../../api/invitation/invitationApi';

import {
  useListTeamsQuery,
 
} from '../../api/team/teamApi';

// Child components
import InvitationFilterBar from './InvitationFilterBar';
import InvitationList from './InvitationList';
import CreateInvitationModal from './CreateInvitationModal';
import EditInvitationModal from './EditInvitationModal';

// Import your org context, so we can read `selectedOrgId`.
import { useAppSelector } from '../../app/hooks/redux'; 

// Basic container variants for framer motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
};

const InvitationManager: React.FC = () => {
  // 1) Read the current org from context
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  // 2) If no org selected, show a fallback
  if (!selectedOrgId) {
    return (
      <div className="p-8 text-gray-600">
        <PreDashboard />
      </div>
    );
  }

  // 3) Local states
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('list');

  // 4) Query the teams for this org
  //    So we pass selectedOrgId to the hook
  const {
    data: teams,
    isLoading: isTeamsLoading,
  } = useListTeamsQuery(selectedOrgId, {
    skip: !selectedOrgId,
  });

  // 5) Invitations query: only if we have a selectedTeamId
  const {
    data: invitations,
    isLoading: isInvitesLoading,
    isError: isInvitesError,
    refetch: refetchInvitations,
  } = useListInvitationsQuery(
    { teamId: selectedTeamId ?? '' },
    {
      skip: !selectedTeamId, // skip fetching if no team is chosen
    }
  );

  // 6) RTK mutations for invitations
  const [createInvitation] = useCreateInvitationMutation();
  const [updateInvitation] = useUpdateInvitationMutation();
  const [deleteInvitation] = useDeleteInvitationMutation();

  // 7) Modal states for create + edit
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 8) Form data for creating
  const [inviteForm, setInviteForm] = useState<{
    email: string;
    teamId: string;
    roleInTeam?: string | null;
  }>({
    email: '',
    teamId: '',
    roleInTeam: '',
  });

  // 9) Data for editing
  const [editData, setEditData] = useState<Invitation | null>(null);

  //////////////////
  // CREATE Handler
  //////////////////
  const handleOpenCreateModal = () => {
    setInviteForm({
      email: '',
      teamId: selectedTeamId || '', // if null, fallback to empty
      roleInTeam: '',
    });
    setShowCreateModal(true);
  };

  const handleCreate = async () => {
    if (!inviteForm.email.trim()) {
      alert('Email is required.');
      return;
    }
    if (!inviteForm.teamId) {
      alert('Please select a team.');
      return;
    }
    try {
      await createInvitation({
        email: inviteForm.email,
        teamId: inviteForm.teamId,
        roleInTeam: inviteForm.roleInTeam || null,
      }).unwrap();
      setShowCreateModal(false);
      // Re-fetch
      refetchInvitations();
    } catch (err: any) {
      alert(`Error creating invitation: ${err.data?.error || err.message}`);
    }
  };

  //////////////////
  // EDIT Handler
  //////////////////
  const handleOpenEditModal = (inv: Invitation) => {
    setEditData(inv);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    try {
      await updateInvitation({
        id: editData._id,
        updates: {
          email: editData.email,
          roleInTeam: editData.roleInTeam || null,
          status: editData.status,
        },
      }).unwrap();
      setShowEditModal(false);
      refetchInvitations();
    } catch (err: any) {
      alert(`Error updating invitation: ${err.data?.error || err.message}`);
    }
  };

  //////////////////
  // DELETE Handler
  //////////////////
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invitation?')) return;
    try {
      await deleteInvitation(id).unwrap();
      refetchInvitations();
    } catch (err: any) {
      alert(`Error deleting invitation: ${err.data?.error || err.message}`);
    }
  };

  //////////////////
  // Searching logic
  //////////////////
  const filteredInvitations = useMemo(() => {
    if (!invitations) return [];
    const lowerTerm = searchTerm.trim().toLowerCase();
    if (!lowerTerm) return invitations;

    return invitations.filter((inv) =>
      inv.email.toLowerCase().includes(lowerTerm) ||
      (inv.roleInTeam || '').toLowerCase().includes(lowerTerm) ||
      inv.status.toLowerCase().includes(lowerTerm)
    );
  }, [invitations, searchTerm]);

  return (
    <motion.div
      className="p-6 md:p-8 lg:p-10 space-y-6 text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SELECT TEAM DROPDOWN */}
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium text-gray-700">Select a Team:</label>
        <select
          value={selectedTeamId ?? ''} 
          onChange={(e) => {
            const val = e.target.value;
            setSelectedTeamId(val || null);
          }}
          className="border px-2 py-1"
        >
          <option value="">-- None --</option>
          {teams &&
            teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
        </select>

        {/* Only show "Create Invitation" if a team is chosen */}
        {selectedTeamId && (
          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Create Invitation
          </button>
        )}
      </div>

      {/* If no team selected, show a message */}
      {!selectedTeamId && (
        <p className="text-gray-600">
          Please select a team to view or create invitations.
        </p>
      )}

      {/* If we have a team, show the filter bar + invitation list */}
      {selectedTeamId && (
        <>
          <InvitationFilterBar
            selectedTeamId={selectedTeamId}
            setSelectedTeamId={setSelectedTeamId}
            teams={teams}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            refetchInvitations={refetchInvitations}
            isTeamsLoading={isTeamsLoading}
            isInvitesLoading={isInvitesLoading}
          />

          <InvitationList
            invites={filteredInvitations}
            viewMode={viewMode}
            isError={isInvitesError}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* CREATE INVITATION MODAL */}
      <CreateInvitationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        teams={teams || []}
        inviteForm={inviteForm}
        setInviteForm={setInviteForm}
        handleCreate={handleCreate}
      />

      {/* EDIT INVITATION MODAL */}
      <EditInvitationModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        editData={editData}
        setEditData={setEditData}
        handleSaveEdit={handleSaveEdit}
      />
    </motion.div>
  );
};

export default InvitationManager;
