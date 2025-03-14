// File: src/pages/developerApi/DevTwoTeamRoutes.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const DevTwoTeamRoutes: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <UserGroupIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Team & User-Team Endpoints
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        The <strong>teamService</strong> manages CRUD operations for teams, while <strong>userTeamRoutes.ts</strong> handles endpoints for adding/removing users to/from a team.
      </motion.p>

      {/* TeamService */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <UsersIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            TeamService Highlights
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 mt-2 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><code>createTeam</code> – Creates a new team under a specific org.</motion.li>
          <motion.li variants={listItemVariants}><code>listTeamsForOrg</code> – Returns all teams in a given org.</motion.li>
          <motion.li variants={listItemVariants}><code>updateTeam</code> – Updates fields like name, description, etc.</motion.li>
          <motion.li variants={listItemVariants}><code>deleteTeam</code> – Permanently removes a team.</motion.li>
        </motion.ul>
      </motion.section>

      {/* UserTeamRoutes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            userTeamRoutes.ts Endpoints (Protected)
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 mt-2 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><code>POST /user-team/add</code> – Add a user to a team (roleInTeam, etc.).</motion.li>
          <motion.li variants={listItemVariants}><code>POST /user-team/remove</code> – Remove a user from a team.</motion.li>
          <motion.li variants={listItemVariants}><code>GET /user-team/user/:userId</code> – List teams a user belongs to.</motion.li>
          <motion.li variants={listItemVariants}><code>GET /user-team/team/:teamId</code> – List users belonging to a team.</motion.li>
        </motion.ul>
      </motion.section>

      {/* Example cURL */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <motion.p className="text-gray-700">
          Example cURL for creating a new team:
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded mt-2 overflow-auto">
          {`curl -X POST https://api.yourapp.com/teams \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Frontend Team",
    "organizationId": "60f8c831789g...",
    "description": "Focus on the UI/UX layer"
  }'`}
        </motion.pre>
        <motion.p className="text-gray-700 mt-4">
          After creating a team, you can add users with <code>POST /user-team/add</code>.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevTwoTeamRoutes;