// File: src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import DefaultImage from '../../assets/images/image1.png';


import { 
  useUpdateProfileMutation, 
  useChangePasswordMutation 
} from '../../api/auth/authApi';
import { uploadImage } from '../../utils/CloudinaryUpload';

// Toast components
import ToastContainer from '../../components/UI/Toast/ToastContainer';
import { ToastProps, ToastVariant } from '../../components/UI/Toast/Toast';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const ProfilePage: React.FC = () => {
  // 1) Reusable toast state
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  // 2) Helper to add a toast
  const addToast = (message: string, variant: ToastVariant = 'info') => {
    const id = uuidv4(); 
    const newToast = {
      id,
      message,
      variant,
      duration: 3000, // auto-dismiss in 3s
    };
    setToasts((prev) => [...prev, newToast]);
  };

  // 3) Helper to remove a toast by id
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Grab the logged-in user from Redux
  const user = useSelector((state: RootState) => state.auth.user);

  // Local form states
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // For uploading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // For changing password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // RTK Query
  const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangePwdLoading }] = useChangePasswordMutation();

  // If user changes in Redux, re-sync local form (optional)
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  /** Handle file input */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /** Upload to Cloudinary, store returned URL in state */
  const handleUploadImage = async () => {
    if (!selectedFile) return;
    try {
      const url = await uploadImage(selectedFile, {
        folder: 'Taskbrick',
        tags: ['profile'],
      });
      setProfileImage(url);
      addToast('Profile image uploaded', 'success');
    } catch (error: any) {
      addToast(error.message || 'Upload failed', 'error');
    }
  };

  /** Submit updated profile fields to server */
  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile({
        firstName,
        lastName,
        profileImage,
      }).unwrap();
      addToast(result.message, 'success');
    } catch (err: any) {
      addToast(err.data?.error || err.error || 'Failed to update profile', 'error');
    }
  };

  /** Submit oldPassword/newPassword to change password */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      addToast('Please enter old and new password', 'warning');
      return;
    }
    try {
      const result = await changePassword({ oldPassword, newPassword }).unwrap();
      addToast(result.message, 'success');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      addToast(err.data?.error || err.error || 'Failed to change password', 'error');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-xl">
          Please log in to see your profile.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header Section with a subtle background gradient */}
      <header className="bg-gray-16 mb-8 text-gray-700 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-lg opacity-90">
            Manage your personal information and account details
          </p>
        </motion.div>
      </header>

      <motion.div
        className="max-w-5xl mx-auto px-4 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Card container for the main profile content */}
        <motion.div
          className="bg-white shadow-md rounded-lg p-6 mb-10"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center md:items-start">
              <motion.img
                key={profileImage} // re-trigger animation on new upload
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src={profileImage || DefaultImage} // Fallback to default image
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />

              <div className="flex flex-col space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  className="text-sm"
                />
                <button
                  onClick={handleUploadImage}
                  disabled={!selectedFile}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {selectedFile ? 'Upload Image' : 'Select a file first'}
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isUpdateLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 mt-4"
              >
                {isUpdateLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Change Password Section */}
        <motion.div
          className="bg-white shadow-md rounded-lg p-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-purple-200"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-purple-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={isChangePwdLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isChangePwdLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProfilePage;
