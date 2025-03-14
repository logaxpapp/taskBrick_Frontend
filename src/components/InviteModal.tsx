// File: src/components/Header/InviteModal.tsx

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Redux + API hooks
import { useAppSelector } from '../app/hooks/redux';

// Org context for switching
import { useOrgContext } from '../contexts/OrgContext';

// For navigation after switching
import { useNavigate } from 'react-router-dom';

// Import your TeamRole enum (or WorkspaceRole) from where you defined it
import { TeamRole } from '../types/teamRole';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setSelectedOrg } = useOrgContext();

  // Current user from Redux state
  const { user } = useAppSelector((state) => state.auth);

  // Invite input (names/emails)
  const [inviteInput, setInviteInput] = useState('');
  // New: Role selection
  const [inviteRole, setInviteRole] = useState<string>('');

  if (!isOpen) return null;

  // Example placeholder for sending an invitation
  const handleInvite = () => {
    // Here, you'd call an actual API, e.g.:
    // await sendInvitation({ email: inviteInput, role: inviteRole }).unwrap();
    alert(`Invite sent to: ${inviteInput}, role: ${inviteRole || 'N/A'}`);
    setInviteInput('');
    setInviteRole('');
    onClose();
  };

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />

    <div
          className="
          fixed left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-sm
          bg-white border border-gray-200 
          rounded-xl shadow-2xl p-6
          z-50
          animate-fadeIn
        "
        style={{ animationDuration: '0.2s' }}
      >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-green-800">
          Add People to Your Workspace
        </h3>
        <button onClick={onClose}>
          <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Invite Form */}
      <div className="space-y-4">
        {/* Invite Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Names or Emails <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Maria, maria@company.com"
            className="
              w-full mt-1 px-3 py-2 
              border rounded 
              focus:outline-none 
              focus:ring-1 focus:ring-green-500
            "
            value={inviteInput}
            onChange={(e) => setInviteInput(e.target.value)}
          />
        </div>

        {/* Role Dropdown (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            className="
              w-full mt-1 px-3 py-2 
              border rounded 
              focus:outline-none 
              focus:ring-1 focus:ring-green-500
            "
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            {Object.values(TeamRole).map((roleValue) => (
              <option key={roleValue} value={roleValue}>
                {roleValue}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            (Optional) If left blank, a default role may be assigned.
          </p>
        </div>

        {/* Example external integrations */}
        <div className="flex justify-around mt-3">
          <button className="flex items-center px-2 py-1 border border-green-200 rounded hover:bg-green-100 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5 mr-1"
            />
            <span className="text-xs text-gray-700 font-medium">Google</span>
          </button>
          <button className="flex items-center px-2 py-1 border border-green-200 rounded hover:bg-green-100 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
              alt="Slack"
              className="w-5 h-5 mr-1"
            />
            <span className="text-xs text-gray-700 font-medium">Slack</span>
          </button>
          <button className="flex items-center px-2 py-1 border border-green-200 rounded hover:bg-green-100 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg"
              alt="MS"
              className="w-5 h-5 mr-1"
            />
            <span className="text-xs text-gray-700 font-medium">MS</span>
          </button>
        </div>

        {/* reCAPTCHA message */}
        <p className="text-xs text-gray-500">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>

        {/* "Add" (Send Invitation) Button */}
        <button
          className="
            w-full bg-green-600 text-white
            py-2 rounded 
            hover:bg-green-700
            transition
          "
          onClick={handleInvite}
        >
          Add
        </button>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-300" />

      {/* If you want to show or switch existing orgs, you can do so here */}
      {/* e.g., <button onClick={() => handleSwitchOrg('id', 'name')}>Switch Org</button> */}
    </div>
    </>
  );
};

export default InviteModal;
