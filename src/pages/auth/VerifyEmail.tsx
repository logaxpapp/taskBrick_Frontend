import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVerifyOtpMutation } from '../../api/auth/authApi';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtp({ email, otp }).unwrap();
      alert(response.message || 'OTP verified successfully!');

      // ✅ Redirect to Reset Password page
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      alert(err.data?.error || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <motion.div className="flex justify-center mb-4">
          <FaEnvelopeOpenText className="text-6xl text-blue-600" />
        </motion.div>

        <motion.h1 className="text-2xl font-bold text-gray-800 mb-2">
          Enter OTP
        </motion.h1>

        <motion.p className="text-gray-600 mb-6">
          Enter the **6-digit OTP** sent to your email.
        </motion.p>

        <motion.form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            maxLength={6}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-widest"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
