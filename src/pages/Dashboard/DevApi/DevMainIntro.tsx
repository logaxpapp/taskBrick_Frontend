// File: src/pages/developerApi/DevMainIntro.tsx

import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const DevMainIntro: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome to TaskBrick Developer API
      </motion.h1>

      <motion.p className="text-lg text-gray-700 mb-8">
        Our Developer API lets you integrate TaskBrick’s features into your own applications, 
        automate tasks, and create rich custom workflows. Below, you’ll find a breakdown of 
        how authentication works, our major endpoints (users, teams, organizations, etc.), 
        and links to deeper topics like webhooks or advanced configuration.
      </motion.p>

      {/* 1) Authentication & Tokens */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          1. Authentication & Tokens
        </motion.h2>
        <motion.p className="text-gray-700 mb-2">
          All endpoints are protected by the <code>authMiddleware</code>, meaning you must 
          include a valid <strong>JWT access token</strong> in your request headers:
        </motion.p>
        <motion.pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{`GET /api/some-secure-endpoint
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json`}
        </motion.pre>
        <motion.p className="text-gray-700 my-2">
          You can obtain this token by logging in or using our OAuth flows. If your access 
          token expires, you can use the <strong>refresh token</strong> endpoints to get a 
          new one. Refer to <code>authService.ts</code> and <code>authController.ts</code> 
          for full details.
        </motion.p>
      </motion.section>

      {/* 2) Major Endpoints */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          2. Major Endpoints & Controllers
        </motion.h2>
        <motion.p className="text-gray-700 mb-4">
          TaskBrick’s backend is composed of several key route files and corresponding 
          service/controller layers. Here’s a quick overview of the most common:
        </motion.p>
        <motion.ul className="list-disc list-inside space-y-1 text-gray-700">
          <motion.li variants={listItemVariants}>
            <strong>/users</strong> – <em>userRoutes.ts</em>. Create, update, or delete users 
            and check if a user is active or not.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>/organizations</strong> – <em>organizationRoutes.ts</em>. Manage top-level 
            organizations (create, invite users, remove users).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>/user-org</strong> – <em>userOrganizationRoutes.ts</em>. Associate users 
            with organizations (roleInOrg, membership).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>/teams</strong> – <em>teamService.ts</em> plus <em>userTeamRoutes.ts</em>. 
            Manage teams within an org, add users to teams, remove them, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>/invitations</strong> – <em>invitationRoutes.ts</em>. Create and manage 
            invitations to teams/orgs, accept or decline them.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>/auth</strong> – <em>authController.ts</em>. Handle login, register, 
            password resets, and token refresh logic.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700 mt-4">
          Each route file calls a corresponding <strong>Service</strong> layer 
          (e.g., <code>UserService</code>, <code>OrganizationService</code>) for database operations, 
          then returns JSON responses to the client.
        </motion.p>
      </motion.section>

      {/* 3) Quick Code Example */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          3. Quick Code Example
        </motion.h2>
        <motion.p className="text-gray-700 mb-2">
          Here’s a short snippet (in Node.js or any language) showing how to call the 
          <code>/users</code> endpoint with an access token:
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`// Using fetch (Node.js or modern browsers)
async function listUsers(accessToken) {
  const response = await fetch('https://api.yourapp.com/users', {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${accessToken}\`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}`}
        </motion.pre>
        <motion.p className="text-gray-700 mt-2">
          A similar pattern applies to <code>/teams</code>, <code>/organizations</code>, 
          or any other secured route—just include your Bearer token in the headers.
        </motion.p>
      </motion.section>

      {/* 4) Next Steps */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          4. Next Steps
        </motion.h2>
        <motion.p className="text-gray-700 mb-2">
          From here, you can jump into each specific domain to learn more:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <motion.li variants={listItemVariants}>
            “User Routes” for user CRUD details
          </motion.li>
          <motion.li variants={listItemVariants}>
            “Team Routes” for creating teams and adding members
          </motion.li>
          <motion.li variants={listItemVariants}>
            ... and so on
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          Happy coding—let’s build something awesome with TaskBrick’s Developer API!
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevMainIntro;
