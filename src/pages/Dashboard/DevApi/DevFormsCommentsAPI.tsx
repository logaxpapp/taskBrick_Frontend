// File: src/pages/developerApi/DevFormsCommentsAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { DocumentPlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const DevFormsCommentsAPI: React.FC = () => {
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
        <DocumentPlusIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Forms & Comments API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Create/manage forms and add/remove comments on issues or other entities.
      </motion.p>

      {/* 1) Form Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <DocumentPlusIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. Form Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>GET /forms</strong> — <em>listForms</em>. Optional <code>?organizationId=xxx</code> filter.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /forms</strong> — <em>createForm</em>. Body: <code>title</code>, <code>description</code>, <code>fields</code>, <code>organizationId</code>...
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /forms/:id</strong> — <em>getForm</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /forms/:id</strong> — <em>updateForm</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /forms/:id</strong> — <em>deleteForm</em>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /forms/:id/submit</strong> — <em>submitForm</em>. Body might have <code>answers</code> array.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/forms \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Bug Report Form",
    "description": "For users to submit bug details",
    "organizationId": "org123",
    "fields": [
      {"label": "Description", "type": "text", "required": true},
      {"label": "Severity", "type": "select", "options": ["Low","Medium","High"]}
    ]
  }'`}
        </motion.pre>
      </motion.section>

      {/* 2) Comment Routes */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Comment Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /comments</strong> — <em>addComment</em>. Body: <code>issueId</code>, <code>commentText</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /comments</strong> — <em>listComments</em>. Query param <code>?issueId=xxx</code> to filter.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /comments/:id</strong> — <em>deleteComment</em>.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-4">
          {`curl -X POST https://api.yourapp.com/comments \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "issueId": "issue789",
    "commentText": "Having the same bug on iOS..."
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevFormsCommentsAPI;