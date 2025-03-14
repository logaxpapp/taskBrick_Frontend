// File: src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAppDispatch } from '../../app/hooks/redux';
import { setTokens, setUser } from '../../features/auth/authSlice';
import { useLoginUserMutation } from '../../api/auth/authApi';
import { useNavigate } from 'react-router-dom';

// Framer Motion variants
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

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Local form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Only enable the button if password is not empty
  const canSubmit = password.trim().length > 0;

  const handleGoogleLogin = () => {
    alert('Google Login not yet implemented');
  };

  const handleAppleLogin = () => {
    alert('Apple Login not yet implemented');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1) Call the RTK Query login mutation
      const result = await loginUser({ email, password }).unwrap();
      console.log('Login result:', result);

      // 2) The server sets refresh token via HTTP-only cookie
      //    The response includes { accessToken, user }
      if (result.accessToken) {
        dispatch(setTokens({ accessToken: result.accessToken }));
      }

      if (result.user) {
        console.log('User from server:', result.user);
        dispatch(setUser(result.user));
      } else {
        alert(result.message || 'No user info returned');
        return;
      }

      // 3) Check the user's role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/pre-dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      alert(err.data?.error || err.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
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
          Login to your account
        </motion.h1>

        {/* Social logins */}
        <motion.button
          variants={fadeUp}
          onClick={handleGoogleLogin}
          className="
            w-full flex items-center justify-center
            bg-[#192bc2] text-white
            py-2 px-4 mb-6
            rounded-md hover:bg-[#14228c]
            transition
          "
        >
          <FcGoogle className="text-xl mr-2 bg-white rounded-full" />
          <span>Login with Google</span>
        </motion.button>

        <motion.button
          variants={fadeUp}
          onClick={handleAppleLogin}
          className="
            w-full flex items-center justify-center
            bg-black text-white
            py-2 px-4 mb-6
            rounded-md hover:bg-gray-900
            transition
          "
        >
          <FaApple className="text-xl mr-2" />
          <span>Login with Apple</span>
        </motion.button>

        {/* Divider */}
        <motion.div variants={fadeUp} className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </motion.div>

        {/* Email/Password Form */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleEmailLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="
              w-full px-4 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="
              w-full px-4 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={`
              w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md
              hover:bg-gray-300 transition
              ${(!canSubmit || isLoading) ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? 'Logging in...' : 'Login with Email'}
          </button>
        </motion.form>

        {/* Sign up link */}
        <motion.div
          variants={fadeUp}
          className="text-center mt-4 text-sm text-gray-500"
        >
          Don&rsquo;t have an account?{' '}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Create a free account
          </a>
        </motion.div>

        {/* Terms/Privacy disclaimer */}
        <motion.div
          variants={fadeUp}
          className="mt-6 text-xxs text-gray-600 leading-5 text-center"
        >
          By logging in, you agree to our{' '}
          <a
            href="/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Terms of Use
          </a>{' '}
          and{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600  leading-5"
            style={{ wordBreak: 'break-word' }} // Ensures long URLs break correctly
          >
            Privacy Policy
          </a>
          , as well as our use of cookies and other technologies to support
          website functionality, analytics, preferences, and marketing to
          improve your experience with the services we provide.
          <br />
          For more information on our data collection and usage, refer to our{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Privacy Policy
          </a>
          .
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
