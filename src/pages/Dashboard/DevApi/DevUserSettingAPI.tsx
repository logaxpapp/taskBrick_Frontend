// File: src/pages/developerApi/DevUserSettingAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const DevUserSettingAPI: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-xl font-bold mb-4">
        User Settings API
      </motion.h2>
      <motion.p className="text-gray-700 mb-4">
        This document outlines how to integrate with TaskBrick’s User Settings functionality via REST API.
        You can retrieve, update, or reset a user’s settings by calling the endpoints shown below.
      </motion.p>

      {/* 1. Get User Settings */}
      <motion.section variants={sectionVariants} className="mb-8">
        <motion.h3 className="text-lg font-semibold mb-2">
          1. Get User Settings
        </motion.h3>
        <motion.p className="text-gray-700 mb-2">
          Fetch or auto-create default settings for a specific user:
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto">
{`GET /api/user-settings/:userId
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json

Response:
{
  "_id": "<SETTING_DOC_ID>",
  "userId": "<USER_ID>",
  "invitationExpirationHours": 48,
  ...
}`}
        </motion.pre>
        <motion.p className="text-gray-700 mt-2">
          The controller calls <code>UserSettingService.getUserSetting(userId)</code> to either find an existing record or create one with default values.
        </motion.p>
      </motion.section>

      {/* 2. Update User Settings */}
      <motion.section variants={sectionVariants} className="mb-8">
        <motion.h3 className="text-lg font-semibold mb-2">
          2. Update User Settings
        </motion.h3>
        <motion.p className="text-gray-700 mb-2">
          Change one or more fields (e.g., <code>invitationExpirationHours</code>):
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto">
{`PATCH /api/user-settings/:userId
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json

Body:
{
  "invitationExpirationHours": 72
}

Response:
{
  "_id": "<SETTING_DOC_ID>",
  "userId": "<USER_ID>",
  "invitationExpirationHours": 72,
  ...
}`}
        </motion.pre>
        <motion.p className="text-gray-700 mt-2">
          Internally uses <code>UserSettingService.updateUserSetting(userId, updates)</code> and returns the updated settings document.
        </motion.p>
      </motion.section>

      {/* 3. Reset User Settings */}
      <motion.section variants={sectionVariants} className="mb-8">
        <motion.h3 className="text-lg font-semibold mb-2">
          3. Reset User Settings
        </motion.h3>
        <motion.p className="text-gray-700 mb-2">
          Restore all fields to their default values (e.g., 48-hour invitation expiration):
        </motion.p>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto">
{`POST /api/user-settings/:userId/reset
Authorization: Bearer <YOUR_ACCESS_TOKEN>

Response:
{
  "_id": "<SETTING_DOC_ID>",
  "userId": "<USER_ID>",
  "invitationExpirationHours": 48,
  ...
}`}
        </motion.pre>
        <motion.p className="text-gray-700 mt-2">
          The controller calls <code>UserSettingService.resetUserSetting(userId)</code> to revert any modifications to default values.
        </motion.p>
      </motion.section>

      {/* 4. Security & Middleware */}
      <motion.section variants={sectionVariants}>
        <motion.h3 className="text-lg font-semibold mb-2">
          4. Security & Middleware
        </motion.h3>
        <motion.p className="text-gray-700">
          All requests require a valid <strong>Bearer token</strong>, enforced by our <code>authMiddleware</code>.
          Ensure you have the proper scopes or roles to manage a user’s settings. If you get <em>401 Unauthorized</em> or <em>403 Forbidden</em>,
          verify the user is authenticated and has permission to update these settings.
        </motion.p>
      </motion.section>
    </motion.div>
  );
};

export default DevUserSettingAPI;
