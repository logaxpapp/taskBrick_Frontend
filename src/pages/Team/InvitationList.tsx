// File: src/pages/Invitation/InvitationList.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitation } from '../../api/invitation/invitationApi';

// If you’re using the same Team interface as in your code:
interface PopulatedTeam {
  _id: string;
  name: string;
  organizationId?: string;
  description?: string;
  // etc...
}

// Our Invitation interface might have teamId as either a string or an object
// with { _id, name, ... } if we used .populate('teamId')
interface InvitationListProps {
  invites: Invitation[];
  viewMode: 'cards' | 'list';
  isError: boolean;
  onEdit: (inv: Invitation) => void;
  onDelete: (id: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invites,
  viewMode,
  isError,
  onEdit,
  onDelete,
}) => {
  if (isError) {
    return <p className="text-red-500 text-sm">Error loading invitations.</p>;
  }

  if (!invites || invites.length === 0) {
    return <p className="text-gray-500 text-sm mt-4">No invitations found.</p>;
  }

  // Helper to get the display name for teamId
  const getTeamDisplay = (inv: Invitation) => {
    // If teamId is an object (populated), try .name
    // If it’s just a string, show that string
    const t = inv.teamId as unknown;

    if (t && typeof t === 'object' && (t as PopulatedTeam).name) {
      return (t as PopulatedTeam).name;  // e.g. "Backend"
    } else {
      return String(inv.teamId); // fallback if unpopulated => shows the ID
    }
  };

  // Card view
  if (viewMode === 'cards') {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
        {invites.map((inv) => (
          <AnimatePresence key={inv._id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 shadow rounded p-4 flex flex-col"
            >
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {inv.email}
              </p>
              <p className="text-xs text-gray-400">
                Team: {getTeamDisplay(inv)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Role: {inv.roleInTeam || 'Member'}
              </p>
              <p className="text-xs text-gray-400 mt-1 capitalize">
                Status: {inv.status}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => onEdit(inv)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(inv._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="overflow-x-auto bg-white border border-gray-100 rounded shadow mt-4">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Team</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Expires</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {invites.map((inv) => (
            <motion.tr
              key={inv._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ backgroundColor: 'rgba(245,245,245,1)' }}
              className="border-b"
            >
              <td className="px-4 py-2">{inv.email}</td>
              <td className="px-4 py-2">{getTeamDisplay(inv)}</td>
              <td className="px-4 py-2">{inv.roleInTeam || 'Member'}</td>
              <td className="px-4 py-2 capitalize">{inv.status}</td>
              <td className="px-4 py-2">
                {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onEdit(inv)}
                  className="text-xs text-blue-600 mr-3 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(inv._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationList;
