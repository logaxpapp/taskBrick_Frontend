// File: src/pages/developerApi/DevRiskTimesheetResourceStatusAPI.tsx
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

const DevRiskTimesheetResourceStatusAPI: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="p-8 space-y-8"
    >
      <motion.h2 className="text-3xl font-bold mb-6 text-gray-800">
        Risks, Timesheets, Resource Allocation, &amp; Status Reports API
      </motion.h2>
      <motion.p className="text-lg text-gray-700 mb-8">
        This covers the endpoints for managing project risks, logging time with timesheets,
        allocating resources, and generating status reports in TaskBrick.
      </motion.p>

      {/* 1) Project Risk Routes */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          1. Project Risk Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /projectRisks</strong> – create risk. Provide <code>projectId</code>, <code>description</code>, <code>likelihood</code>, <code>impact</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectRisks/:id</strong> – get risk by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectRisks/project/:projectId</strong> – list all risks for a project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PUT /projectRisks/:id</strong> – update risk fields.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /projectRisks/:id</strong> – remove risk.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectRisks/project/:projectId/summary</strong> – aggregator (risk summary).
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/projectRisks \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj123",
    "description": "Potential vendor delay",
    "likelihood": "High",
    "impact": "Severe",
    "mitigationPlan": "Follow up weekly with vendor"
  }'
`}
        </motion.pre>
      </motion.section>

      {/* 2) Project Timesheet Routes */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          2. Project Timesheet Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /projectTimesheets</strong> – create timesheet entry for a project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectTimesheets/:id</strong> – get a single timesheet entry by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectTimesheets/project/:projectId</strong> – list entries, optionally by date range.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PUT /projectTimesheets/:id</strong> – update an existing entry.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /projectTimesheets/:id</strong> – remove an entry.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /projectTimesheets/project/:projectId/total-hours</strong> – aggregator: sum of hours.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/projectTimesheets \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj123",
    "startDate": "2025-03-01T00:00:00Z",
    "endDate": "2025-03-02T00:00:00Z",
    "totalHours": 8,
    "description": "Backend integration"
  }'
`}
        </motion.pre>
      </motion.section>

      {/* 3) Resource Allocation Routes */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          3. Resource Allocation Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /resourceAllocations</strong> – create allocation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /resourceAllocations/:id</strong> – get one allocation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /resourceAllocations/project/:projectId</strong> – list all allocations for a project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PUT /resourceAllocations/:id</strong> – update an allocation (percentage, dates, etc.).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /resourceAllocations/:id</strong> – remove resource allocation.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /resourceAllocations/project/:projectId/total-allocation</strong> – aggregator for total resource load.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/resourceAllocations \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj123",
    "resourceName": "Jane (Backend Dev)",
    "allocationPercentage": 50
  }'
`}
        </motion.pre>
      </motion.section>

      {/* 4) Status Report Routes */}
      <motion.section variants={sectionVariants} className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          4. Status Report Routes
        </motion.h3>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /statusReports</strong> – create a status report. Body includes <code>projectId</code>, <code>reportDate</code>, <code>progressSummary</code>, etc.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /statusReports/:id</strong> – get single report by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /statusReports/project/:projectId</strong> – list all status reports for a project.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PUT /statusReports/:id</strong> – update an existing status report.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /statusReports/:id</strong> – remove a report.
          </motion.li>
        </motion.ul>
        <motion.pre className="bg-gray-100 p-2 text-sm rounded overflow-auto mt-3">
{`curl -X POST https://api.yourapp.com/statusReports \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "proj123",
    "reportDate": "2025-04-01T00:00:00Z",
    "progressSummary": "Completed Sprint 3, started Sprint 4",
    "risks": ["Budget overrun risk at 70% spend"],
    "issues": ["Delayed vendor shipment"],
    "nextSteps": ["Finalize QA testing, plan release schedule"]
  }'
`}
        </motion.pre>
      </motion.section>

      {/* 5) Timesheet Routes (if separate from projectTimesheets) */}
      <motion.section variants={sectionVariants} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <motion.h3 className="text-xl font-semibold mb-2 text-gray-800">
          5. (Optional) Timesheet Routes
        </motion.h3>
        <motion.p className="text-gray-700 mb-2">
          If your system uses a separate <code>timesheetRoutes.ts</code> from <code>projectTimesheetRoutes.ts</code> (maybe for user-level timesheets), the endpoints might look like:
        </motion.p>
        <motion.ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <motion.li variants={listItemVariants}>
            <strong>POST /timesheets</strong> – createTimesheetEntry.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /timesheets/:id</strong> – get entry by ID.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /timesheets/project/:projectId</strong> – list entries (user-based, date range, etc.).
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>PUT /timesheets/:id</strong> – update timesheet.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>DELETE /timesheets/:id</strong> – remove entry.
          </motion.li>
          <motion.li variants={listItemVariants}>
            <strong>GET /timesheets/project/:projectId/total-hours</strong> – aggregator for total hours by user, etc.
          </motion.li>
        </motion.ul>
      </motion.section>
    </motion.div>
  );
};

export default DevRiskTimesheetResourceStatusAPI;
