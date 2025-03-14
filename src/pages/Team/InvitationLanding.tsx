// File: src/pages/Invitation/InvitationLanding.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from '../../api/invitation/invitationApi';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Framer Motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const InvitationLanding: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Optional form fields for the invitee
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [password,  setPassword]  = useState('');

  // RTK Query mutations
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  // If no token, show an error UI
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="bg-white shadow-lg rounded p-6 max-w-md w-full text-center">
          <ExclamationCircleIcon className="mx-auto w-16 h-16 text-red-400 mb-4" />
          <h1 className="text-xl font-semibold mb-2 text-gray-800">No Token Provided</h1>
          <p className="text-gray-500 mb-4">
            The invitation link is missing or invalid.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Handler for "Accept" button
  const handleAccept = async () => {
    try {
      // We'll pass the fields in a body: { firstName, lastName, password }
      const result = await acceptInvitation({
        token,
        firstName,
        lastName,
        password,
      }).unwrap();

      alert('Invitation accepted! 🎉');
      // Possibly navigate to login or dashboard
      navigate('/login'); 
    } catch (err: any) {
      alert(`Could not accept invitation: ${err.data?.error || err.message}`);
    }
  };

  // Handler for "Decline" button
  const handleDecline = async () => {
    try {
      await declineInvitation(token).unwrap();
      alert('Invitation declined. ❌');
      navigate('/');
    } catch (err: any) {
      alert(`Could not decline invitation: ${err.data?.error || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AnimatePresence>
        <motion.div
          className="bg-white shadow-2xl rounded-lg max-w-md w-full p-8 text-center relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <CheckCircleIcon className="mx-auto w-16 h-16 text-green-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">You've Been Invited!</h1>
          <p className="text-gray-600 mb-6">
            Someone has invited you to join their team.
            You can optionally fill in your info below, then click "Accept."
          </p>

          {/* Optional form fields (Name, Password) */}
          <div className="space-y-3 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                If left blank, a random password may be assigned.
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAccept}
              disabled={isAccepting}
              className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition disabled:opacity-60"
            >
              {isAccepting ? 'Accepting...' : 'Accept'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDecline}
              disabled={isDeclining}
              className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition disabled:opacity-60"
            >
              {isDeclining ? 'Declining...' : 'Decline'}
            </motion.button>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Invitation Token: <span className="font-mono">{token}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InvitationLanding;
