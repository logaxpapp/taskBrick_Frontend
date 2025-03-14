// File: src/components/Layout/Sidebar.tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import {
  HomeIcon,
  FolderOpenIcon,
  BugAntIcon,
  ChartPieIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  HomeModernIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../app/hooks/redux'; 
import NavLinks from './NavLink';
import LogoutButton from '../pages/auth/LogoutButton';


const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // 1) Grab the selectedOrgName from Redux
  const selectedOrgName = useAppSelector(
    (state) => state.organization.selectedOrgName
  );

  // Toggle function for dropdowns
  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // Toggle entire sidebar
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setOpenDropdown(null);
  };

  return (
    <div
      className={clsx(
        'h-auto flex flex-col bg-white dark:bg-gray-700 dark:text-gray-50 text-gray-800 border-r border-gray-300 shadow-lg transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <HomeModernIcon className="h-8 w-8 text-[#192bc2] font-extrabold" />
          {!isCollapsed && (
            <p className="text-lg font-bold">
              Task<span className="text-[#192bc2] font-bold">Brick</span>
            </p>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <FaAngleDoubleRight className="text-xl" />
          ) : (
            <FaAngleDoubleLeft className="text-xl" />
          )}
        </button>
      </div>

      {/* Show the org name if we have it */}
      {!isCollapsed && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200  dark:bg-gray-600 dark:border-gray-500">
          <p className="text-sm text-customBlue font-semibold">
            <span className="font-semibold text-red-700">Org:</span>{' '}
            {selectedOrgName ?? 'No org selected'}
          </p>
        </div>
      )}

      <nav className="flex-1 px-2 mt-2 overflow-y-auto">
        {!isCollapsed && (
          <h3 className="uppercase text-xs text-gray-400 px-3 mb-2 mt-3">
            MAIN
          </h3>
        )}

        {/* Dashboard */}
        <NavLinks
          to="/dashboard"
          label="Dashboard"
          icon={<HomeIcon />}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Projects"
          icon={<FolderOpenIcon />}
          subLinks={[
            { to: 'dashboard/projects', label: 'Board' },
            { to: '/dashboard/project-manager', label: 'Projects' },
            { to: '/dashboard/label-manager', label: 'Labels' },
            { to: '/dashboard/issue-type-manager', label: 'Issue Types' },
          ]}
          isOpen={openDropdown === 'Projects'}
          onToggle={() => toggleDropdown('Projects')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Issues"
          icon={<BugAntIcon />}
          subLinks={[
            { to: '/dashboard/issues', label: 'All Issues' },
            { to: '/dashboard/my-issues', label: 'My Issues' },
            { to: '/dashboard/issues-watched-by-me', label: 'Watched Issues' },
            { to: '/dashboard/sprint-manager', label: 'Sprints' },
            { to: '/dashboard/sprint-issue', label: 'Sprint Issues' },
          ]}
          isOpen={openDropdown === 'Issues'}
          onToggle={() => toggleDropdown('Issues')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Reports"
          icon={<ChartPieIcon />}
          subLinks={[
            { to: '/dashboard/velocity', label: 'Velocity Chart' },
            { to: '/dashboard/burndown', label: 'Burndown Chart' },
            { to: '/dashboard/burnup', label: 'Burnup Chart' },
            { to: '/dashboard/sprint-report', label: 'Sprint Report' },
          ]}
          isOpen={openDropdown === 'Reports'}
          onToggle={() => toggleDropdown('Reports')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="People"
          icon={<UserGroupIcon />}
          subLinks={[
            { to: '/dashboard/users', label: 'Users' },
            { to: '/dashboard/team-manager', label: 'Teams' },
            { to: '/dashboard/invitations', label: 'Invitations' },
          ]}
          isOpen={openDropdown === 'People'}
          onToggle={() => toggleDropdown('People')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Settings"
          icon={<Cog6ToothIcon />}
          subLinks={[
            { to: '/dashboard/profile', label: 'Profile' },
            { to: '/dashboard/notification', label: 'Notifications' },
            { to: '/settings/integrations', label: 'Integrations' },
            { to: '/dashboard/subscription', label: 'Billing' },
            { to: '/dashboard/subscription-plan', label: 'Subscription Plan' },
            { to: '/dashboard/settings/user', label: 'User Settings' },
          ]}
          isOpen={openDropdown === 'Settings'}
          onToggle={() => toggleDropdown('Settings')}
          isCollapsed={isCollapsed}
        />

        {!isCollapsed && <hr className="my-3 border-gray-200" />}

        {!isCollapsed && (
          <h3 className="uppercase text-xs text-gray-400 px-3 mb-2">OTHER</h3>
        )}

        <NavLinks
          label="Admin"
          icon={<ShieldCheckIcon />}
          subLinks={[
            { to: '/dashboard/role-permission', label: 'Manage Roles' },
            { to: '/admin/permissions', label: 'Manage Permissions' },
            { to: '/dashboard/admin-metrics', label: 'System' },
            { to: '/dashboard/logs', label: 'Logs' },
      
            { to: '/admin/community-qa', label: 'Q$A' },
          ]}
          isOpen={openDropdown === 'Admin'}
          onToggle={() => toggleDropdown('Admin')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Messaging"
          icon={<HeartIcon />}
          subLinks={[{ to: '/dashboard/chat', label: 'Chat' }]}
          isOpen={openDropdown === 'Messaging'}
          onToggle={() => toggleDropdown('Messaging')}
          isCollapsed={isCollapsed}
        />
        <NavLinks
          label="Management"
          icon={<ShieldCheckIcon />}
          subLinks={[
            { to: '/dashboard/portfolio', label: 'Porfolio' },
            { to: '/dashboard/project-details', label: 'Manegement' },
          ]}
          isOpen={openDropdown === 'Management'}
          onToggle={() => toggleDropdown('Management')}
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="p-2 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
