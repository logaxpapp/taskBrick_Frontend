// File: src/pages/developerApi/DevProjectAPI.tsx
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

const DevProjectAPI: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800">
        Project &amp; ProjectMember API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        This doc covers how to create, update, and delete projects in TaskBrick,
        as well as add or remove members via our REST endpoints. The{' '}
        <code className="bg-gray-100 px-1 ml-1">projectController</code> and{' '}
        <code className="bg-gray-100 px-1 ml-1">projectMemberController</code> files power these operations.
      </motion.p>

      {/* 1) Project Endpoints */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          1. Project Endpoints
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-4 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /api/projects</strong> — Create a new project (requires <em>organizationId</em>).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /api/projects</strong> — List projects by <em>organizationId</em> query param.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /api/projects/:id</strong> — Retrieve details of a specific project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /api/projects/:id</strong> — Update project fields (e.g., name, description).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /api/projects/:id</strong> — Permanently remove a project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /api/projects/:id/members</strong> — Add a user to the project (body: userId, roleInProject).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /api/projects/:id/members</strong> — Remove a user from the project (body: userId).
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          Middleware such as <code>authMiddleware</code> ensures only authenticated users can access these routes.{' '}
          <code>checkProjectOrgMiddleware</code> validates that the user belongs to the org that owns the project.
        </motion.p>
      </motion.section>

      {/* Example cURL for create project */}
      <motion.div variants={sectionVariants} className="bg-gray-50 p-3 rounded mb-8 text-sm overflow-auto">
        <motion.p className="mb-1 font-semibold">Example: Create a Project</motion.p>
        <motion.pre>
{`curl -X POST https://api.yourapp.com/api/projects \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Marketing Launch",
    "description": "Project for Q3 campaign",
    "organizationId": "org123"
  }'`}
        </motion.pre>
      </motion.div>

      {/* 2) ProjectMember Endpoints */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          2. ProjectMember Endpoints
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-4 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /api/project-members/add</strong> — Adds a user to a project (body: projectId, userId, roleInProject).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /api/project-members/remove</strong> — Removes a user from a project (body: projectId, userId).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /api/project-members/:projectId</strong> — Lists all members for a given project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /api/project-members/update-role</strong> (optional) — Update a user’s <em>roleInProject</em>.
          </motion.li>
        </motion.ul>
        <motion.p className="text-gray-700">
          Internally, these routes call <code className="bg-gray-100 px-1 ml-1">ProjectMemberService</code>, which modifies or reads from the <code>ProjectMember</code> Mongoose model.
        </motion.p>
      </motion.section>

      {/* Example cURL for adding a member */}
      <motion.div variants={sectionVariants} className="bg-gray-50 p-3 rounded text-sm overflow-auto">
        <motion.p className="mb-1 font-semibold">Example: Add a Project Member</motion.p>
        <motion.pre>
{`curl -X POST https://api.yourapp.com/api/project-members/add \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj789",
    "userId": "user456",
    "roleInProject": "collaborator"
  }'`}
        </motion.pre>
      </motion.div>

      {/* 3) Tips & Security */}
      <motion.section variants={sectionVariants} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          3. Security &amp; Tips
        </motion.h3>
        <motion.p className="text-gray-700">
          - Ensure you have the correct org membership (via <code>checkProjectOrgMiddleware</code>) before allowing project operations. <br />
          - Keep roles consistent (e.g., <em>owner</em>, <em>manager</em>, <em>collaborator</em>) across your front-end and back-end definitions.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevProjectAPI;
