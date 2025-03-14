// File: src/pages/developerApi/DevSubscriptionsEventsFeaturesAPI.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, BeakerIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const DevSubscriptionsEventsFeaturesAPI: React.FC = () => {
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
        <CreditCardIcon className="w-8 h-8 mr-2 text-indigo-500" />
        Subscription Plans, Features & Events API
      </motion.h2>

      <motion.p className="text-lg text-gray-700 mb-8">
        Endpoints for managing subscription tiers, toggling feature flags, and creating or updating calendar events in TaskBrick.
      </motion.p>

      {/* Subscription Plans */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <CreditCardIcon className="w-6 h-6 text-indigo-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            1. SubscriptionPlan Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 mb-2 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /subscriptionPlans</strong> — createPlan.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /subscriptionPlans</strong> — listPlans.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /subscriptionPlans/:id</strong> — getPlan.</motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /subscriptionPlans/:id</strong> — updatePlan.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /subscriptionPlans/:id</strong> — deletePlan.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /subscriptionPlans/:id/deactivate</strong> — deactivatePlan.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /subscriptionPlans/:id/activate</strong> — activatePlan.</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto">
          {`curl -X POST https://api.yourapp.com/subscriptionPlans \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Pro Plan",
    "price": 29.99,
    "features": ["unlimitedProjects", "prioritySupport"]
  }'`}
        </motion.pre>
      </motion.section>

      {/* Feature Toggle Routes */}
      <motion.section
        variants={sectionVariants}
        className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-center mb-4">
          <BeakerIcon className="w-6 h-6 text-blue-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            2. Feature Routes
          </motion.h3>
        </div>
        <motion.p className="text-gray-700 mb-2">
          If your app uses feature flags or “labs” features, you may have endpoints like those in <code>subscriptionRoutes.ts</code> or a separate “featureRoutes.” For instance:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><strong>POST /features</strong> — createFeature.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /features</strong> — listFeatures.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /features/:id</strong> — getFeature.</motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /features/:id</strong> — updateFeature.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /features/:id</strong> — deleteFeature.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /features/:id/activate</strong> — activateFeature.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /features/:id/deactivate</strong> — deactivateFeature.</motion.li>
        </motion.ul>
      </motion.section>

      {/* Events (Calendar) */}
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center mb-4">
          <CalendarDaysIcon className="w-6 h-6 text-green-500 mr-3" />
          <motion.h3 className="text-xl font-semibold text-gray-800">
            3. Event Routes
          </motion.h3>
        </div>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
          <motion.li variants={listItemVariants}><strong>GET /events</strong> — listEvents. Query: <code>orgId</code>, <code>start</code>, <code>end</code>.</motion.li>
          <motion.li variants={listItemVariants}><strong>POST /events</strong> — createEvent. Body: <code>orgId, title, startTime, etc.</code>.</motion.li>
          <motion.li variants={listItemVariants}><strong>GET /events/:id</strong> — getEvent.</motion.li>
          <motion.li variants={listItemVariants}><strong>PATCH /events/:id</strong> — updateEvent.</motion.li>
          <motion.li variants={listItemVariants}><strong>DELETE /events/:id</strong> — deleteEvent.</motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-3 text-sm rounded overflow-auto mt-3">
          {`curl -X POST https://api.yourapp.com/events \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orgId": "org123",
    "title": "Sprint Planning",
    "startTime": "2025-06-01T10:00:00Z",
    "endTime": "2025-06-01T11:00:00Z",
    "participants": ["userA", "userB"]
  }'`}
        </motion.pre>
      </motion.section>
    </motion.div>
  );
};

export default DevSubscriptionsEventsFeaturesAPI;