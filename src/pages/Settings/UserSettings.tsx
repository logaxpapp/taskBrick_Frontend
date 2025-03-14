// File: src/pages/UserSettings.tsx

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { v4 as uuid } from 'uuid';

// Hooks & Redux
import { useAppSelector, useAppDispatch } from '../../app/hooks/redux';
import {
  setTheme as setThemeAction,
  setMode as setModeAction,
  setBgColor as setBgColorAction,
  setNotifications as setNotificationsAction,
  setFontSize as setFontSizeAction,
} from '../../features/theme/themeSlice';
import UserSettingManager from './UserSettingManager';

// Toast
import { ToastProps, ToastVariant } from '../../components/UI/Toast/Toast';
import ToastContainer from '../../components/UI/Toast/ToastContainer';

// Framer Motion variants
const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const UserSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  // If you have an authenticated user (optional):
  const { user } = useAppSelector((state) => state.auth);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';

  // Read current theme from Redux
  const storedTheme = useAppSelector((state) => state.theme);

  // Local state mirrors Redux
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>(storedTheme.mode);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(storedTheme.fontSize);
  const [bgColor, setBgColor] = useState(storedTheme.bgColor);
  const [notifications, setNotifications] = useState(storedTheme.notifications);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  // Sync local state if Redux changes
  useEffect(() => {
    setMode(storedTheme.mode);
    setFontSize(storedTheme.fontSize);
    setBgColor(storedTheme.bgColor);
    setNotifications(storedTheme.notifications);
  }, [storedTheme]);

  // Toast state
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const addToast = (message: string, variant: ToastVariant = 'info') => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, message, variant, duration: 3000 }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handler for saving
  const handleSaveSettings = async () => {
    try {
      setLoading(true);

      // Dispatch a single setTheme action
      dispatch(
        setThemeAction({
          mode,
          fontSize,
          bgColor,
          notifications,
        })
      );

      // Simulate async (like an API call)
      await new Promise((resolve) => setTimeout(resolve, 600));
      addToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      addToast('Failed to save settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Example color presets
  const colorPresets = ['#ffffff', '#f8f9fa', '#e7e5e4', '#fde68a', '#c4b5fd', '#fecaca'];

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Top Header / Hero Section */}
      <div className="bg-white py-8 px-6  shadow-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-sm text-purple-500 mt-1 opacity-90 font-medium">
              Customize your theme, notifications, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Wrapper */}
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row mt-6">
          {/* Sidebar */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="show"
            className="md:w-64 w-full px-4 md:px-0 mb-6 md:mb-0"
          >
            <div className="bg-white rounded-lg shadow p-4 md:mr-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={user?.profileImage || 'https://via.placeholder.com/150'}
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-700">{fullName}</p>
                  <p className="text-gray-500 text-sm">Member</p>
                </div>
              </div>

              <hr className="my-4" />

              {/* Navigation Links that match the settings sections */}
              <nav className="flex flex-col space-y-2">
                {/* Link anchors could match IDs on your main content sections */}
                <a
                  href="#theme-mode"
                  className="text-gray-600 hover:text-indigo-500 hover:bg-gray-50 p-2 rounded"
                >
                  Theme
                </a>
                <a
                  href="#text-preferences"
                  className="text-gray-600 hover:text-indigo-500 hover:bg-gray-50 p-2 rounded"
                >
                  Text Preferences
                </a>
                <a
                  href="#invitations"
                  className="text-gray-600 hover:text-indigo-500 hover:bg-gray-50 p-2 rounded"
                >
                  Invitations
                </a>
                <a
                  href="#notifications"
                  className="text-gray-600 hover:text-indigo-500 hover:bg-gray-50 p-2 rounded"
                >
                  Notifications
                </a>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            className="flex-1 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Greeting Card */}
            <motion.div
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h2 className="text-xl font-semibold mb-2">Welcome, {fullName}!</h2>
              <p className="text-sm text-gray-500">
                Use the settings below to personalize your experience.
              </p>
              <UserSettingManager />
            </motion.div>

            {/* THEME MODE */}
            <motion.div
              id="theme-mode"
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={mode === 'light'}
                    onChange={() => setMode('light')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Light</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={mode === 'dark'}
                    onChange={() => setMode('dark')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Dark</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={mode === 'system'}
                    onChange={() => setMode('system')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">System</span>
                </label>
              </div>
            </motion.div>

            {/* FONT SIZE SETTINGS (Text Preferences) */}
            <motion.div
              id="text-preferences"
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold mb-4">Text Preferences</h3>
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="fontSize"
                    value="small"
                    checked={fontSize === 'small'}
                    onChange={() => setFontSize('small')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Small</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="fontSize"
                    value="medium"
                    checked={fontSize === 'medium'}
                    onChange={() => setFontSize('medium')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Medium</span>
                </label>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="fontSize"
                    value="large"
                    checked={fontSize === 'large'}
                    onChange={() => setFontSize('large')}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Large</span>
                </label>
              </div>
            </motion.div>

            {/* INVITATIONS SECTION (just a placeholder to match the link) */}
            <motion.div
              id="invitations"
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold mb-4">Invitations</h3>
              <p className="text-sm text-gray-500">
                This is where you could manage user invitations, invite new members, track
                sent invites, etc.
              </p>
              {/* Add your invitations-related UI here */}
            </motion.div>

            {/* NOTIFICATIONS & LANGUAGE */}
            <motion.div
              id="notifications"
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-10 sm:space-y-0">
                {/* Notifications Toggle */}
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                      className="form-checkbox text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">Enable Notifications</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Get email or push notifications for new tasks and updates.
                  </p>
                </div>

                {/* Language Select (not currently in Redux) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* BACKGROUND COLOR SETTINGS (Optional: we can keep it or move it) */}
            <motion.div
              className="bg-white rounded-lg shadow p-6 mb-6"
              variants={cardVariants}
            >
              <h3 className="text-lg font-semibold mb-4">Background Color</h3>
              <p className="text-sm text-gray-500 mb-2">
                Choose a custom background color or select a preset:
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Color
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10 border-none mt-1 cursor-pointer"
                    title="Select a custom color"
                  />
                  <span className="ml-2 text-gray-700">{bgColor}</span>
                </div>
                <div className="flex space-x-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${
                        bgColor === color
                          ? 'border-indigo-500'
                          : 'border-gray-300 hover:border-indigo-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBgColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* SAVE BUTTON */}
            <motion.div variants={cardVariants} className="mb-10">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
