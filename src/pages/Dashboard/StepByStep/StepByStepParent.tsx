// File: src/pages/StepByStepParent.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, Cog6ToothIcon, HomeIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import StepIntro from './StepIntro';
import StepOneCreateUser from './StepOneCreateUser';
import StepTwoUserSetting from './StepTwoUserSetting';
import StepThreeProjectSetup from './StepThreeProjectSetup';
import StepByStepUser from './StepByStepUser';
import StepSixLabelsAndWatchers from './StepSixLabelsAndWatchers';
import StepSevenIssueHistory from './StepSevenIssueHistory';
import StepFourBoardAndColumns from './StepFourBoardAndColumns';
import StepFiveIssues from './StepFiveIssues';
import StepEightNotificationsAndChat from './StepEightNotificationsAndChat';
import StepNineFormsAndComments from './StepNineFormsAndComments';
import StepTenPortfoliosAndBudgets from './StepTenPortfoliosAndBudgets';
import StepElevenRisksTimesheetsResourcesStatus from './StepElevenRisksTimesheetsResourcesStatus';
import StepTwelveSprintsAndRetros from './StepTwelveSprintsAndRetros';
import StepThirteenSubscriptionFeaturesEvents from './StepThirteenSubscriptionFeaturesEvents';
import StepFourteenAttachmentsAndWorkLogs from './StepFourteenAttachmentsAndWorkLogs';

type TabKey =
  | 'intro'
  | 'createUser'
  | 'userSetting'
  | 'projectSetup'
  | 'user'
  | 'labelsAndWatchers'
  | 'issueHistory'
  | 'boardAndColumns'
  | 'issues'
  | 'notificationsAndChat'
  | 'formsAndComments'
  | 'portfoliosAndBudgets'
  | 'risksTimesheetsResourcesStatus'
  | 'sprintsAndRetros'
  | 'subscriptionFeaturesEvents'
  | 'attachmentsAndWorkLogs';

const StepByStepParent: React.FC = () => {
  // Tab logic
  const [activeTab, setActiveTab] = useState<TabKey>('intro');
  // Sidebar collapse logic
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Helper to render a navigation item
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
        key={tabKey}
        onClick={() => setActiveTab(tabKey)}
        className={`flex items-center w-full space-x-2 rounded px-3 py-2 text-left transition-colors 
          ${isActive ? 'bg-gray-200 text-blue-800' : 'text-gray-900 hover:bg-blue-700 hover:text-white'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-5 w-5 text-purple-500" />
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
        className="flex flex-col bg-gray-100 transition-all duration-300"
      >
        {/* TOP SECTION (Logo/Title + Collapse Button) */}
        <div className="flex items-center justify-between px-3 py-4">
          {!isCollapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold text-gray-800"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Step-by-Step
            </motion.h2>
          )}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-200 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HomeModernIcon className="h-6 w-6 font-bold text-gray-950" />
          </motion.button>
        </div>

        {/* NAV ITEMS */}
        <nav className="mt-2 flex-1 space-y-1 px-2">
          <NavItem tabKey="intro" label="Intro" Icon={HomeIcon} />
          <NavItem tabKey="createUser" label="Create User" Icon={UserIcon} />
          <NavItem tabKey="userSetting" label="User Settings" Icon={Cog6ToothIcon} />
          <NavItem tabKey="projectSetup" label="Project Setup" Icon={HomeIcon} />
          <NavItem tabKey="user" label="User" Icon={UserIcon} />
          <NavItem tabKey="labelsAndWatchers" label="Labels & Watchers" Icon={Cog6ToothIcon} />
          <NavItem tabKey="issueHistory" label="Issue History" Icon={Cog6ToothIcon} />
          <NavItem tabKey="boardAndColumns" label="Board & Columns" Icon={Cog6ToothIcon} />
          <NavItem tabKey="issues" label="Issues" Icon={Cog6ToothIcon} />
          <NavItem tabKey="notificationsAndChat" label="Notifications & Chat" Icon={Cog6ToothIcon} />
          <NavItem tabKey="formsAndComments" label="Forms & Comments" Icon={Cog6ToothIcon} />
          <NavItem tabKey="portfoliosAndBudgets" label="Portfolios & Budgets" Icon={Cog6ToothIcon} />
          <NavItem
            tabKey="risksTimesheetsResourcesStatus"
            label="Risks, Timesheets, Resources, & Status"
            Icon={Cog6ToothIcon}
          />
          <NavItem tabKey="sprintsAndRetros" label="Sprints & Retros" Icon={Cog6ToothIcon} />
          <NavItem
            tabKey="subscriptionFeaturesEvents"
            label="Subscription, Features, & Events"
            Icon={Cog6ToothIcon}
          />
          <NavItem tabKey="attachmentsAndWorkLogs" label="Attachments & Work Logs" Icon={Cog6ToothIcon} />
        </nav>

        {/* FOOTER (optional) */}
        <div className="px-2 py-3">
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-gray-400"
            >
              © 2025 TaskBrick
            </motion.p>
          )}
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {/* If you are using Framer Motion v5, you can include mode="wait" here.
            Otherwise, remove the mode prop if using an older version */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'intro' && <StepIntro />}
            {activeTab === 'createUser' && <StepOneCreateUser />}
            {activeTab === 'userSetting' && <StepTwoUserSetting />}
            {activeTab === 'projectSetup' && <StepThreeProjectSetup />}
            {activeTab === 'user' && <StepByStepUser />}
            {activeTab === 'labelsAndWatchers' && <StepSixLabelsAndWatchers />}
            {activeTab === 'issueHistory' && <StepSevenIssueHistory />}
            {activeTab === 'boardAndColumns' && <StepFourBoardAndColumns />}
            {activeTab === 'issues' && <StepFiveIssues />}
            {activeTab === 'notificationsAndChat' && <StepEightNotificationsAndChat />}
            {activeTab === 'formsAndComments' && <StepNineFormsAndComments />}
            {activeTab === 'portfoliosAndBudgets' && <StepTenPortfoliosAndBudgets />}
            {activeTab === 'risksTimesheetsResourcesStatus' && <StepElevenRisksTimesheetsResourcesStatus />}
            {activeTab === 'sprintsAndRetros' && <StepTwelveSprintsAndRetros />}
            {activeTab === 'subscriptionFeaturesEvents' && <StepThirteenSubscriptionFeaturesEvents />}
            {activeTab === 'attachmentsAndWorkLogs' && <StepFourteenAttachmentsAndWorkLogs />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StepByStepParent;
