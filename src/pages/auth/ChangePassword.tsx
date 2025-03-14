import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useChangePasswordMutation } from '../../api/auth/authApi'; // Or your path
import { FaLock } from 'react-icons/fa';
import { useAppDispatch } from '../../app/hooks/redux'; // If needed
import { useNavigate } from 'react-router-dom';
// import { setTokens } from '../../features/auth/authSlice'; // If needed

// Motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  // If you have a dispatch
  const dispatch = useAppDispatch();

  // RTK mutation
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await changePassword({ oldPassword, newPassword }).unwrap();
      alert(result.message || 'Password changed successfully!');
      // Maybe navigate somewhere
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.data?.error || 'Change password failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={fadeUp}
          className="text-2xl font-bold text-gray-800 mb-6 text-center"
        >
          Change Password
        </motion.h1>

        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center mb-4"
        >
          <FaLock className="text-4xl text-blue-500" />
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`
              w-full bg-purple-600 text-white py-2 px-4 rounded-md
              hover:bg-purple-700 transition
              ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Update Password'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
