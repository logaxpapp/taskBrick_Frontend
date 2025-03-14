import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResetPasswordMutation } from '../../api/auth/authApi';
import { FaUnlockAlt } from 'react-icons/fa';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(''); // ✅ Renamed from token to otp
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const urlOtp = searchParams.get('otp'); // ✅ Extract OTP from URL
    if (urlOtp) setOtp(urlOtp);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await resetPassword({ email, otp, newPassword }).unwrap(); // ✅ Send email, otp, and newPassword
      alert(response.message || 'Password reset successful!');
      navigate('/reset-success');
    } catch (err: any) {
      alert(err.data?.error || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-custom flex items-center justify-center px-4">
      <motion.div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <motion.div className="flex justify-center mb-4">
          <FaUnlockAlt className="text-6xl text-green-600" />
        </motion.div>

        <motion.h1 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Your Password
        </motion.h1>

        <motion.p className="text-gray-600 mb-6">
          Enter your new password below.
        </motion.p>

        <motion.form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
