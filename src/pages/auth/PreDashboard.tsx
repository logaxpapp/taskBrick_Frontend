// File: src/pages/PreDashboard.tsx

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useListOrgsForUserQuery } from '../../api/userOrganization/userOrganizationApi';
import { useAppSelector } from '../../app/hooks/redux';
import { useDispatch } from 'react-redux';
import { setSelectedOrg } from '../../app/store/slices/organizationSlice';

// Framer variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const PreDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.auth.user);

  // 1) Query user’s organizations
  const {
    data: orgs,
    isLoading,
    isError,
    error,
  } = useListOrgsForUserQuery(user?._id || '', {
    skip: !user?._id,
  });

  // Loading & error UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-auto flex flex-col items-center justify-center text-red-600">
        <p className="font-semibold text-lg">Error loading organizations.</p>
        <p className="mt-2 text-sm text-gray-500">
          {error && typeof error === 'object' && 'message' in error
            ? (error as any).message
            : 'Please try again later.'}
        </p>
      </div>
    );
  }

  if (!orgs || orgs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            No Organizations Found
          </h2>
          <p className="text-gray-600">
            You are not currently a member of any organizations.
          </p>
        </div>
      </div>
    );
  }

  // If there's an array of orgs, user must choose
  const handleSelectOrg = (orgId: string, orgName: string) => {
    // Dispatch to Redux store so it's persisted
    dispatch(setSelectedOrg({ selectedOrgId: orgId, selectedOrgName: orgName }));
    // Navigate to main dashboard
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center 
                 bg-gradient-to-br from-white via-gray-50 to-gray-200 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        variants={fadeUp}
        className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight"
      >
        Who&apos;s Using TaskBricks?
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="max-w-xl text-center text-gray-600 mb-8"
      >
        Select the organization you want to access. Each org has its own workspace,
        teams, and projects—keep them separate or share with friends and coworkers!
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
          w-full max-w-5xl
        "
      >
        {orgs.map((record) => {
          const orgDoc = record.organizationId as any;
          const orgId =
            orgDoc?._id ||
            (typeof record.organizationId === 'string'
              ? record.organizationId
              : null);
          const orgName = orgDoc?.name || `Organization ${orgId}`;

          return (
            <motion.div
              key={record._id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectOrg(orgId, orgName)}
              className="
                relative
                bg-white
                rounded-xl
                shadow-md
                px-6 py-8
                border border-gray-200
                hover:shadow-xl
                transition-shadow duration-300
                cursor-pointer
                flex flex-col
                items-center
                text-center hover:border-2 hover:border-blue-500
                group
              "
            >
              {/* Sample org avatar or letter */}
              <div className="w-14 py-3 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
                {orgName.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-xl font-semibold text-gray-800">{orgName}</h2>
              <p className="mt-2 text-sm text-gray-600">
                Role:&nbsp;
                <span className="font-medium text-blue-600">
                  {record.roleInOrg || 'Member'}
                </span>
              </p>

              {/* Optional: Show org ID or other details */}
              <p className="mt-4 text-xs text-gray-400">
                Org ID: <span className="font-mono">{orgId}</span>
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default PreDashboard;
