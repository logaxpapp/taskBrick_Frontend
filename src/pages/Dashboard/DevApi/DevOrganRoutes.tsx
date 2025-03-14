// File: src/pages/stepByStep/StepIntro.tsx
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

const DevOrganRoutes: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome to TaskBrick Step-by-Step Guides
      </motion.h1>

      <motion.p className="text-lg text-gray-700 mb-8">
        This comprehensive series of tutorials will show you how to set up and manage your entire TaskBrick environment. We’ll start with the fundamentals of creating organizations, adding owners, inviting users, and more. Let’s dive in!
      </motion.p>

      {/* 1) Highlight Organization Setup */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          1. Organization Setup
        </motion.h2>
        <motion.p className="text-gray-700 mb-2">
          An <strong>organization</strong> is the top-level container in TaskBrick that holds users, teams, and projects. The{' '}
          <code className="bg-gray-100 px-1 ml-1">organizationRoutes.ts</code> file exposes the core endpoints for org management:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-4">
          <motion.li variants={listItemVariants}>
            <code>POST /api/organizations/create-with-owner</code> – <strong>createOrgAndOwner</strong>. Create a new organization <em>and</em> its owner user in one go. This also sets up default boards and sample tasks.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>POST /api/organizations</code> – <strong>createOrganization</strong>. Create an organization referencing an existing user as the owner (optional).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>GET /api/organizations</code> – <strong>listOrganizations</strong>. Get a list of all organizations.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>GET /api/organizations/:id</code> – <strong>getOrganization</strong>. Retrieve details for a single organization by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>PATCH /api/organizations/:id</code> – <strong>updateOrganization</strong>. Update fields like name, description, or the owner user.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>DELETE /api/organizations/:id</code> – <strong>deleteOrganization</strong>. Permanently remove an organization (and all references to it).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>GET /api/organizations/:orgId/all-users</code> – <strong>listAllOrgUsers</strong>. Retrieve all users in the org (including pending invitations).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>DELETE /api/organizations/:orgId/users/:userId</code> – <strong>removeUserFromOrg</strong>. Remove a user from an org (including any teams or projects in that org).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>POST /api/organizations/:orgId/invite-user</code> – <strong>inviteUserToOrg</strong>. Invite a user by email; creates them if they don’t exist, or adds them to the org if they do.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          By leveraging these endpoints, you can manage your organization from the ground up—from a fresh create-with-owner process to inviting new collaborators.
        </motion.p>
      </motion.section>

      {/* 2) Highlight User-Organization Relationship */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          2. Linking Users to Organizations
        </motion.h2>
        <motion.p className="text-gray-700 mb-2">
          In TaskBrick, the <strong>UserOrganization</strong> “pivot” or “join” table maps users to organizations. The{' '}
          <code className="bg-gray-100 px-1 ml-1">userOrganizationRoutes.ts</code> file exposes endpoints to manage these associations:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-4">
          <motion.li variants={listItemVariants}>
            <code>POST /user-org/add</code> – <strong>addUserToOrg</strong>. Manually add a user to an org (with an optional <code>roleInOrg</code>).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>POST /user-org/remove</code> – <strong>removeUserFromOrg</strong>. Manually remove a user from an org (and optionally handle cleanup).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>GET /user-org/user/:userId</code> – <strong>listOrgsForUser</strong>. Shows all organizations a specific user belongs to.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <code>GET /user-org/org/:organizationId</code> – <strong>listUsersInOrg</strong>. Lists all users in a given organization (via pivot).
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          Under the hood, these routes call into the <strong>UserOrganizationService</strong>, which uses Mongoose models to write/read that pivot data. It’s important for ensuring your app knows who belongs to which organization—necessary for permissions, notifications, and more.
        </motion.p>
      </motion.section>

      {/* 3) Quick Example */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <motion.h2 className="text-xl font-semibold mb-2 text-gray-800">
          3. Quick Example Flow
        </motion.h2>
        <motion.ol className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>Create Org + Owner:</strong>
            <br />
            <code className="bg-gray-100 p-1 block mt-1">
              POST /api/organizations/create-with-owner
            </code>
            <small className="block pl-4">
              Body includes org name, email, password, etc. Returns new <code>Organization</code> and <code>User</code> doc.
            </small>
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>List All Orgs:</strong>
            <br />
            <code className="bg-gray-100 p-1 block mt-1">GET /api/organizations</code>
            <small className="block pl-4">See your newly created org in the list.</small>
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Invite a user to Org:</strong>
            <br />
            <code className="bg-gray-100 p-1 block mt-1">
              POST /api/organizations/:orgId/invite-user
            </code>
            <small className="block pl-4">
              Body includes <code>email</code>, <code>roleInOrg</code> (optional), etc.
            </small>
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>Remove user from Org:</strong>
            <br />
            <code className="bg-gray-100 p-1 block mt-1">
              DELETE /api/organizations/:orgId/users/:userId
            </code>
          </motion.li>
        </motion.ol>
        <motion.p className="text-gray-700 mt-4">
          That’s it! You now know how to set up your own org, invite collaborators, and remove them as needed. In the next steps, we’ll dive deeper into user management, teams, projects, and more.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevOrganRoutes;
// File: src/pages/Dashboard/DevApi/DevOrganRoutes.tsx