// File: src/pages/auth/AcceptInvite.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// If you have an RTK Query endpoint for "acceptInvite":
import { useAcceptInviteMutation } from '../../api/auth/authApi';

// You can replace this with any local or remote image/illustration.
import SampleInviteImage from '../../assets/images/undraw_online-collaboration_xon8.png';

// --- Framer Variants ---
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.2 },
  },
  exit: { opacity: 0 },
};

const cardVariants = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 160, damping: 20 },
  },
  exit: { y: 50, opacity: 0 },
};

const AcceptInvite: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract the token + orgId from ?token=xx&orgId=yy
  const token = searchParams.get('token') || '';
  const orgId = searchParams.get('orgId') || '';

  // We'll keep a local form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Track success, error, or loading states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();

  // If token or orgId missing, we can handle that
  useEffect(() => {
    if (!token || !orgId) {
      setErrorMsg('Missing or invalid invite token/orgId.');
    }
  }, [token, orgId]);

  // Handler: Accept the invite => set password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setErrorMsg('Please enter a password and confirm it.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      // Call your backend "acceptInvite" endpoint
      const result = await acceptInvite({ token, orgId, newPassword }).unwrap();
      // Suppose it returns { message: string }
      setSuccessMsg(result.message || 'Invite accepted!');
    } catch (err: any) {
      setErrorMsg(err?.data?.error || err.message || 'An error occurred.');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Container for the split layout */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4">
          {/* LEFT COLUMN: Illustration / Brand Section */}
          <motion.div
            className="hidden md:flex flex-col justify-center items-center"
            variants={cardVariants}
          >
            <img
              src={SampleInviteImage}
              alt="Invite Illustration"
              className="max-w-xs mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">Welcome!</h2>
            <p className="text-sm text-gray-600 mt-2 px-6 text-center">
              You’ve been invited to join an organization on our platform.
              Let’s finalize your setup to get started!
            </p>
          </motion.div>

          {/* RIGHT COLUMN: Form Card */}
          <motion.div
            className="relative flex flex-col bg-white rounded-lg shadow-lg p-6 mx-auto w-full max-w-md"
            variants={cardVariants}
          >
            {/* Close Icon */}
            <button
              onClick={() => navigate('/')}
              className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 focus:outline-none"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 text-center mt-2 mb-4">
              Accept Invitation
            </h2>

            {/* If there's no token or orgId, show a quick error */}
            {!token || !orgId ? (
              <div className="text-red-500 text-center">{errorMsg}</div>
            ) : (
              <>
                {/* success / error messages */}
                {errorMsg && (
                  <motion.div
                    className="mb-2 text-sm text-red-600 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    className="mb-4 text-sm text-green-600 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p>{successMsg}</p>
                    <p className="mt-2">
                      You may now{' '}
                      <Link
                        to="/login"
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        login
                      </Link>
                      .
                    </p>
                  </motion.div>
                )}

                {/* Only show the form if we haven't succeeded yet */}
                {!successMsg && (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isAccepting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'w-full flex justify-center items-center py-2 mt-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all',
                        isAccepting && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {isAccepting ? 'Accepting...' : 'Accept Invite'}
                    </motion.button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AcceptInvite;
