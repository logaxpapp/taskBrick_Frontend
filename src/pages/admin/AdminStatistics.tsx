// File: src/components/admin/AdminStatistics.tsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBuilding,
  FaTasks,
  FaClock,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaBug,
  FaTag,
  FaColumns,
  FaUserShield,
} from 'react-icons/fa';
import { useGetDashboardCountsQuery } from '../../api/admin/adminUserApi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AdminStatistics: React.FC = () => {
  const { data, error, isLoading } = useGetDashboardCountsQuery();

  // Placeholder for system uptime
  const systemUptime = '99.9%';

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading dashboard counts...</p>;
  }
  if (error) {
    return <p className="p-4 text-red-500">Error loading counts.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Cards Container */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1) Total Users */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-3">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-semibold text-gray-800">
              {data?.users ?? 0}
            </p>
          </div>
        </motion.div>

        {/* 2) Total Organizations */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-green-100 text-green-600 rounded-full mr-3">
            <FaBuilding size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Organizations</p>
            <p className="text-xl font-semibold text-gray-800">
              {data?.organizations ?? 0}
            </p>
          </div>
        </motion.div>

        {/* 3) Total Projects */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-3">
            <FaTasks size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-xl font-semibold text-gray-800 py-4">
              {data?.projects ?? 0}
            </p>
          </div>
        </motion.div>

        {/* 4) Total Teams */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-teal-100 text-teal-600 rounded-full mr-3">
            <FaUserFriends size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Teams</p>
            <p className="text-xl font-semibold text-gray-800 py-4">
              {data?.teams ?? 0}
            </p>
          </div>
        </motion.div>

        {/* 5) Total Issues */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-red-100 text-red-600 rounded-full mr-3">
            <FaBug size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Issues</p>
            <p className="text-xl font-semibold text-gray-800 py-4">
              {data?.issues ?? 0}
            </p>
          </div>
        </motion.div>

        {/* 6) System Uptime (Placeholder) */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full mr-3 ">
            <FaClock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 ">System Uptime</p>
            <p className="text-xl font-semibold text-gray-800 py-4">{systemUptime}</p>
          </div>
        </motion.div>

        {/* 7) Pending Invitations */}
        <motion.div
          className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          variants={cardVariants}
        >
          <div className="p-3 bg-pink-100 text-pink-600 rounded-full mr-3">
            <FaEnvelopeOpenText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Invitations</p>
            <p className="text-xl font-semibold text-gray-800 py-4">
              {data?.invitations.pending ?? 0}
            </p>
          </div>
        </motion.div>
        {/* 8) Total Boards */}
<motion.div
  className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  variants={cardVariants}
>
  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mr-3">
    <FaColumns size={24} /> {/* Or any icon you prefer */}
  </div>
  <div>
    <p className="text-sm text-gray-500">Total Boards</p>
    <p className="text-xl font-semibold text-gray-800 py-4">
      {data?.boards ?? 0}
    </p>
  </div>
</motion.div>

{/* 9) Total Labels */}
<motion.div
  className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  variants={cardVariants}
>
  <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mr-3">
    <FaTag size={24} />
  </div>
  <div>
    <p className="text-sm text-gray-500">Total Labels</p>
    <p className="text-xl font-semibold text-gray-800 py-4">
      {data?.labels ?? 0}
    </p>
  </div>
</motion.div>

{/* 10) Total Roles */}
<motion.div
  className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  variants={cardVariants}
>
  <div className="p-3 bg-gray-100 text-gray-600 rounded-full mr-3">
    <FaUserShield size={24} /> {/* e.g. user-shield icon */}
  </div>
  <div>
    <p className="text-sm text-gray-500">Total Roles</p>
    <p className="text-xl font-semibold text-gray-800 py-4">
      {data?.roles ?? 0}
    </p>
  </div>
</motion.div>

      </motion.div>
    </div>
  );
};

export default AdminStatistics;
