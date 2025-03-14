// File: src/pages/developerApi/DevNotificationsChatAPI.tsx
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

const DevNotificationsChatAPI: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800">
        Notifications &amp; Chat API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        Here we detail how to fetch and manage notifications, plus how to handle chat
        conversations and messages programmatically.
      </motion.p>

      {/* 1) Notifications */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          1. Notification Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>GET /notifications</strong> – <em>listNotifications</em>.  
            <br />
            Query params: <code>userId</code> (optional if taken from token), <code>isRead</code>, <code>page</code>, <code>limit</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /notifications/:id/read</strong> – <em>markNotificationRead</em>.  
            <br />
            Marks a specific notification as read.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /notifications/:id</strong> – Optionally remove a single notification.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /notifications</strong> – Remove all notifications for the user (if implemented).
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X GET https://api.yourapp.com/notifications?userId=abc123&page=1&limit=10 \\
  -H "Authorization: Bearer <TOKEN>"`}
        </motion.pre>
      </motion.section>

      {/* 2) Conversations */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          2. Conversation Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>POST /conversations</strong> – createOrFindConversation.  
            <br />
            Body: <code>orgId</code>, <code>participants[]</code>.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /conversations/:id</strong> – getConversation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /conversations/org/:orgId/user/:userId</strong> – listUserConversations.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /conversations/:id/add-participant</strong> – addParticipant.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /conversations/:id/remove-participant</strong> – removeParticipant.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /conversations/:id/rename</strong> – renameConversation (if you have named convos).
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/conversations \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orgId": "org123",
    "participants": ["userA", "userB"]
  }'`}
        </motion.pre>
      </motion.section>

      {/* 3) Messages */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          3. Message Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}>
            <strong>GET /messages/:conversationId</strong> – listMessages.  
            <br />
            Query: <code>limit</code>, <code>skip</code> for pagination.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>POST /messages</strong> – createMessage.  
            <br />
            Body: <code>conversationId</code>, <code>senderId</code>, <code>text</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PATCH /messages/:id/read</strong> – markMessageRead.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /messages/:id</strong> – deleteMessage.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/messages \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversationId": "convo456",
    "senderId": "user123",
    "text": "Hello world!"
  }'`}
        </motion.pre>
      </motion.section>

      {/* 4) Chat File Upload */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
      >
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          4. Chat Upload Route
        </motion.h3>
        <motion.p className="text-gray-700">
          If you allow file attachments, you may have a route like: <strong>POST /chat-upload</strong> with <code>multipart/form-data</code> to handle images, videos, etc.
        </motion.p>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/chat-upload \\
  -H "Authorization: Bearer <TOKEN>" \\
  -F "file=@/path/to/image.png" \\
  -F "conversationId=convo456"`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevNotificationsChatAPI;
