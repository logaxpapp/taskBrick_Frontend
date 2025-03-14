// File: src/features/auth/SignUp.tsx

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// ⬇ Instead of useRegisterUserMutation, import the new hook:
import { useCreateOrgAndOwnerMutation } from '../../api/organization/organizationApi';

// Framer Motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const SignUp: React.FC = () => {
  // ⬇ Switch from registerUser to createOrgAndOwner
  const [createOrgAndOwner, { isLoading: isCreateLoading }] = useCreateOrgAndOwnerMutation();

  // Local form state
  const [name, setName]       = useState('');  // <- new field for Organization name
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  // Checkbox for TOS
  const [agreed, setAgreed] = useState(false);

  // Spinner state
  const [isSigningUp, setIsSigningUp] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      alert('Please provide an organization name.');
      return;
    }
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPwd) {
      alert('Passwords do not match.');
      return;
    }
    if (!agreed) {
      alert('Please agree to the Terms & Privacy Policy.');
      return;
    }

    setIsSigningUp(true);

    try {
      // We call createOrgAndOwner
      const response = await createOrgAndOwner({
        name,
        email,
        password,
        firstName,
        lastName,
      }).unwrap();

      console.log('Org + Owner created successfully:', response);
      alert('Organization and owner created successfully!');

      // Navigate to login, or wherever
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.data?.error || error.error || 'Failed to sign up.');
    } finally {
      setIsSigningUp(false);
    }
  };

  // Button is disabled if user hasn't agreed or request is loading
  const isDisabled = !agreed || isCreateLoading || isSigningUp;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white rounded-lg border p-8 max-w-lg w-full"
      >
        <motion.h1
          variants={fadeUp}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
        >
          Create a New Organization &amp; Owner Account
        </motion.h1>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Organization Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-blue-400 focus:outline-none
              "
              placeholder="e.g. My Startup"
              required
            />
          </div>

          {/* First & Last Name */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-400 focus:outline-none
                "
                placeholder="Alice"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-400 focus:outline-none
                "
                placeholder="Johnson"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-blue-400 focus:outline-none
              "
              placeholder="alice@example.com"
              required
            />
          </div>

          {/* Password & Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-blue-400 focus:outline-none
              "
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="
                w-full px-3 py-2 border border-gray-300 rounded-md
                focus:ring-2 focus:ring-blue-400 focus:outline-none
              "
              placeholder="••••••••"
              required
            />
          </div>

          {/* Terms & Privacy checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="termsCheckbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label
              htmlFor="termsCheckbox"
              className="text-gray-600 text-sm cursor-pointer"
            >
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms
              </a>
              {' & '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`
              w-full bg-primary text-white py-2 rounded-md 
              font-medium hover:bg-blue-700 transition
              ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            disabled={isDisabled}
          >
            {isCreateLoading || isSigningUp ? 'Signing up...' : 'Sign Up'}
          </button>
        </motion.form>

        {/* Already have an account? */}
        <motion.div
          variants={fadeUp}
          className="mt-4 text-center text-sm text-gray-500"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SignUp;
