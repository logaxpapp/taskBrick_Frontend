// File: src/components/LogoutButton.tsx

import React from 'react';
import { useAppDispatch } from '../../app/hooks/redux';
import { useLogoutUserMutation } from '../../api/auth/authApi';
import { clearAuth } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import { LogOut } from 'lucide-react'; // Import the LogOut icon
import { motion } from 'framer-motion';

const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      navigate('/login', { replace: true });
    } catch (error) {
      // Consider showing a user-friendly error message (e.g., using a toast)
      // instead of just logging to the console.
      console.error('Logout failed:', error);  // Keep for debugging, but don't expose to the user directly.
    }
  };

  return (
    <motion.button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full px-4 py-2 rounded-md text-red-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }} // More specific animation
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </>
      )}
    </motion.button>
  );
};

export default LogoutButton;