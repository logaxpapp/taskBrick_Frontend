import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { motion, Variants } from 'framer-motion';
import { useForgotPasswordMutation } from '../../api/auth/authApi';
import { FaKey } from 'react-icons/fa';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate(); // ✅ Use React Router navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email }).unwrap();
      alert(response.message || 'Password reset email sent!');
      
      // ✅ Redirect to Verify Email page with email as a URL param
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      alert(err.data?.error || 'Error sending reset email');
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
          className="text-2xl font-bold text-gray-800 mb-4 text-center"
        >
          Forgot Password
        </motion.h1>

        <motion.div variants={fadeUp} className="flex items-center justify-center mb-4">
          <FaKey className="text-4xl text-purple-600" />
        </motion.div>

        <motion.p variants={fadeUp} className="text-center text-gray-600 mb-6">
          Enter your email address below to reset your password
        </motion.p>

        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset password'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
