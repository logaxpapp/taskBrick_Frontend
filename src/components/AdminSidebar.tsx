// File: src/components/Layout/AdminSidebar.tsx
import React, { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  FolderOpenIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';
import NavLinks from './NavLink'; // same reusable link logic as your other sidebar
import LogoutButton from '../pages/auth/LogoutButton';

/**
 * Example Admin Sidebar
 * - Collapsible
 * - Has admin-specific routes
 */
const AdminSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // Toggle entire sidebar
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setOpenDropdown(null); // close submenus when collapsing
  };

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col bg-white text-gray-800 border-r border-gray-300 shadow-lg transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <Link to="/admin" className="flex items-center space-x-2">
          {!isCollapsed && (
            <p className="text-lg font-bold text-blue-700">Admin Portal</p>
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

      {/* Navigation Links */}
      <nav className="flex-1 px-2 mt-2 overflow-y-auto">
        <NavLinks
          to="/admin"
          label="Admin Dashboard"
          icon={<ChartPieIcon />}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Users"
          icon={<UserGroupIcon />}
          subLinks={[
            { to: '/admin/users', label: 'All Users' },
            { to: '/admin/admin-user-manager', label: 'Admin User' },
            // etc.
          ]}
          isOpen={openDropdown === 'Users'}
          onToggle={() => toggleDropdown('Users')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Roles"
          icon={<ShieldCheckIcon />}
          subLinks={[
            { to: '/admin/role-permission', label: 'Manage Roles' },
            { to: '/admin/permissions', label: 'Permissions' },
          ]}
          isOpen={openDropdown === 'Roles'}
          onToggle={() => toggleDropdown('Roles')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Settings"
          icon={<Cog6ToothIcon />}
          subLinks={[
            { to: '/admin/settings/general', label: 'General' },
            { to: '/admin/settings/billing', label: 'Billing' },
            { to: '/admin/settings/system', label: 'System Info' },
          ]}
          isOpen={openDropdown === 'Settings'}
          onToggle={() => toggleDropdown('Settings')}
          isCollapsed={isCollapsed}
        />

        <NavLinks
          label="Reports"
          icon={<FolderOpenIcon />}
          subLinks={[
            { to: '/admin/logs', label: 'Logs' },
            { to: '/admin/metrics', label: 'Metrics' },
          ]}
          isOpen={openDropdown === 'Reports'}
          onToggle={() => toggleDropdown('Reports')}
          isCollapsed={isCollapsed}
        />
        <NavLinks
          label="Organizations"
          icon={<FolderOpenIcon />}
            subLinks={[
                { to: '/admin/organization-manager', label: 'All Organizations' },
                { to: '/admin/subscription', label: 'Subscription' },
                { to: '/admin/features', label: 'Features' },
                { to: '/admin/subscription-plan', label: 'Subscription Plan ' },
            ]}
            isOpen={openDropdown === 'Organizations'}
            onToggle={() => toggleDropdown('Organizations')}
            isCollapsed={isCollapsed}
        />
      </nav>

      {/* Logout */}
      <div className="p-2">
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminSidebar;
