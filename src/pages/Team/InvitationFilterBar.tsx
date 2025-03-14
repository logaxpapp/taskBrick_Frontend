// File: src/pages/Invitation/InvitationFilterBar.tsx

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { HiOutlineRefresh } from 'react-icons/hi';
import { MagnifyingGlassIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { Team } from '../../api/team/teamApi';

interface InvitationFilterBarProps {
  selectedTeamId: string | null; // <-- match the type in InvitationManager
  setSelectedTeamId: React.Dispatch<React.SetStateAction<string | null>>;
  teams?: Team[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  viewMode: 'cards' | 'list';
  setViewMode: React.Dispatch<React.SetStateAction<'cards' | 'list'>>;
  refetchInvitations: () => void;
  isTeamsLoading: boolean;
  isInvitesLoading: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const InvitationFilterBar: React.FC<InvitationFilterBarProps> = ({
  selectedTeamId,
  setSelectedTeamId,
  teams,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  refetchInvitations,
  isTeamsLoading,
  isInvitesLoading,
}) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left side: Team Filter + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Team Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-gray-600">Team:</label>
          <select
            className="border px-2 py-1 rounded text-sm"
            // Because selectedTeamId is string|null, fallback to '' if null
            value={selectedTeamId ?? ''}
            onChange={(e) => {
              const val = e.target.value || null;
              setSelectedTeamId(val);
            }}
          >
            <option value="">-- All Teams --</option>
            {isTeamsLoading ? (
              <option disabled>Loading teams...</option>
            ) : (
              teams &&
              teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center border px-2 rounded bg-white max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invites..."
            className="outline-none px-2 py-1 text-sm flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Right side: view toggle + refresh */}
      <div className="flex items-center gap-2">
        {isInvitesLoading && <p className="text-xs text-gray-500">Loading...</p>}
        <button
          onClick={refetchInvitations}
          className="
            px-3 py-2 border border-gray-300 rounded
            hover:bg-gray-100 transition flex items-center gap-1 text-sm
          "
        >
          <HiOutlineRefresh className="text-gray-600" />
          Refresh
        </button>

        <div className="flex items-center gap-1">
          <button
            className={`
              p-1 rounded hover:bg-gray-100
              ${viewMode === 'cards' ? 'bg-gray-200' : ''}
            `}
            onClick={() => setViewMode('cards')}
          >
            <Squares2X2Icon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className={`
              p-1 rounded hover:bg-gray-100
              ${viewMode === 'list' ? 'bg-gray-200' : ''}
            `}
            onClick={() => setViewMode('list')}
          >
            <ListBulletIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InvitationFilterBar;
