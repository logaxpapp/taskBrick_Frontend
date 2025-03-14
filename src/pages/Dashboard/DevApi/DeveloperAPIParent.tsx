// File: src/pages/DeveloperAPIParent.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusIcon, CpuChipIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';

import DevMainIntro from './DevMainIntro';
import DevOneUserRoutes from './DevOneUserRoutes';
import DevTwoTeamRoutes from './DevTwoTeamRoutes';
import DevOrganRoutes from './DevOrganRoutes';
import DevProjectRoutes from './DevProjectAPI';
import DevUserSetting from './DevUserSettingAPI';
import DevBoardAPI from './DevBoardAPI';
import DevIssueAPI from './DevIssueAPI';
import DevLabelsAndWatchersAPI from './DevLabelsAndWatchersAPI';
import DevIssueHistoryAPI from './DevIssueHistoryAPI';
import DevNotificationsChatAPI from './DevNotificationsChatAPI';
import DevFormsCommentsAPI from './DevFormsCommentsAPI';
import DevPortfolioBudgetAPI from './DevPortfolioBudgetAPI';
import DevRiskTimesheetResourceStatusAPI from './DevRiskTimesheetResourceStatusAPI';
import DevSprintsRetrosAPI from './DevSprintsRetrosAPI';
import DevSubscriptionsEventsFeaturesAPI from './DevSubscriptionsEventsFeaturesAPI';
import DevAttachmentsWorkLogsAPI from './DevAttachmentsWorkLogsAPI';

type TabKey =
  | 'overview'
  | 'userRoutes'
  | 'teamRoutes'
  | 'organRoutes'
  | 'projectRoutes'
  | 'userSetting'
  | 'board'
  | 'issue'
  | 'labelsAndWatchers'
  | 'issueHistory'
  | 'notificationsAndChat'
  | 'formsAndComments'
  | 'portfoliosAndBudgets'
  | 'risksTimesheetsResourcesStatus'
  | 'sprintsAndRetros'
  | 'subscriptionFeaturesEvents'
  | 'attachmentsAndWorkLogs';

const DeveloperAPIParent: React.FC = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * NavItem Component:
   * Renders a navigation button with an icon, label, and active state,
   * plus Framer Motion animations for hover and tap.
   */
  const NavItem = ({
    tabKey,
    label,
    Icon,
  }: {
    tabKey: TabKey;
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }) => {
    const isActive = activeTab === tabKey;
    return (
      <motion.button
        onClick={() => setActiveTab(tabKey)}
        className={`flex items-center w-full space-x-2 rounded px-3 py-2 text-left transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-blue-700 hover:text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-5 w-5" />
        {/* Only show the label if the sidebar is expanded */}
        {!isCollapsed && <span>{label}</span>}
      </motion.button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ width: isCollapsed ? 64 : 256 }}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col bg-gray-800 transition-all duration-300"
      >
        {/* Top Section: Title & Collapse Button */}
        <div className="flex items-center justify-between px-3 py-4">
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-bold text-white"
            >
              Developer API
            </motion.h2>
          )}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-200 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MinusIcon className="h-6 w-6" />
          </motion.button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="mt-2 flex-1 space-y-1 px-2">
          <NavItem tabKey="overview" label="Overview" Icon={CpuChipIcon} />
          <NavItem tabKey="userRoutes" label="User Routes" Icon={UserGroupIcon} />
          <NavItem tabKey="teamRoutes" label="Team Routes" Icon={UsersIcon} />
          <NavItem tabKey="organRoutes" label="Organ Routes" Icon={UserGroupIcon} />
          <NavItem tabKey="projectRoutes" label="Project Routes" Icon={CpuChipIcon} />
          <NavItem tabKey="userSetting" label="User Settings" Icon={UserGroupIcon} />
          <NavItem tabKey="board" label="Board API" Icon={CpuChipIcon} />
          <NavItem tabKey="issue" label="Issue API" Icon={CpuChipIcon} />
          <NavItem tabKey="labelsAndWatchers" label="Labels & Watchers" Icon={CpuChipIcon} />
          <NavItem tabKey="issueHistory" label="Issue History" Icon={CpuChipIcon} />
          <NavItem tabKey="notificationsAndChat" label="Notifications & Chat" Icon={CpuChipIcon} />
          <NavItem tabKey="formsAndComments" label="Forms & Comments" Icon={CpuChipIcon} />
          <NavItem tabKey="portfoliosAndBudgets" label="Portfolios & Budgets" Icon={CpuChipIcon} />
          <NavItem
            tabKey="risksTimesheetsResourcesStatus"
            label="Risks, Timesheets & Resources Status"
            Icon={CpuChipIcon}
          />
          <NavItem tabKey="sprintsAndRetros" label="Sprints & Retros" Icon={CpuChipIcon} />
          <NavItem
            tabKey="subscriptionFeaturesEvents"
            label="Subscription, Features & Events"
            Icon={CpuChipIcon}
          />
          <NavItem
            tabKey="attachmentsAndWorkLogs"
            label="Attachments & Work Logs"
            Icon={CpuChipIcon}
          />
        </nav>

        {/* OPTIONAL FOOTER */}
        {!isCollapsed && (
          <div className="px-2 py-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-gray-400"
            >
              © 2025 TaskBrick
            </motion.p>
          </div>
        )}
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <DevMainIntro />}
            {activeTab === 'userRoutes' && <DevOneUserRoutes />}
            {activeTab === 'teamRoutes' && <DevTwoTeamRoutes />}
            {activeTab === 'organRoutes' && <DevOrganRoutes />}
            {activeTab === 'projectRoutes' && <DevProjectRoutes />}
            {activeTab === 'userSetting' && <DevUserSetting />}
            {activeTab === 'board' && <DevBoardAPI />}
            {activeTab === 'issue' && <DevIssueAPI />}
            {activeTab === 'labelsAndWatchers' && <DevLabelsAndWatchersAPI />}
            {activeTab === 'issueHistory' && <DevIssueHistoryAPI />}
            {activeTab === 'notificationsAndChat' && <DevNotificationsChatAPI />}
            {activeTab === 'formsAndComments' && <DevFormsCommentsAPI />}
            {activeTab === 'portfoliosAndBudgets' && <DevPortfolioBudgetAPI />}
            {activeTab === 'risksTimesheetsResourcesStatus' && <DevRiskTimesheetResourceStatusAPI />}
            {activeTab === 'sprintsAndRetros' && <DevSprintsRetrosAPI />}
            {activeTab === 'subscriptionFeaturesEvents' && <DevSubscriptionsEventsFeaturesAPI />}
            {activeTab === 'attachmentsAndWorkLogs' && <DevAttachmentsWorkLogsAPI />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DeveloperAPIParent;
