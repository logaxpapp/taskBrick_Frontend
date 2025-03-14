import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-10 max-w-lg w-full text-center border border-green-200"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="flex justify-center"
        >
          <FaCheckCircle className="text-green-500 text-7xl mb-4" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Password Reset Successful!
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          You have successfully updated your password. You can now log in with your new password.
        </motion.p>

        <motion.button
          onClick={() => navigate('/login')}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all transform hover:scale-105"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Go to Login
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResetSuccess;
