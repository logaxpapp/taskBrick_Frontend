// File: src/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  InformationCircleIcon,
  PlusIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { FaToolbox } from 'react-icons/fa';

import { useAppSelector } from '../app/hooks/redux';
// ^ or wherever your typed "useAppSelector" lives
import Image1 from '../assets/images/image1.png';
import Image2 from '../assets/images/image2.png';
import Image3 from '../assets/images/image3.png';
import Image4 from '../assets/images/image4.png';
import Image5 from '../assets/images/image6.png';

import WorkspaceModal from './WorkspaceModal';
import ProjectModal from './ProjectModal';
import TicketModal from './TicketModal';

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  // 1) Grab the selectedOrgName from Redux
  const selectedOrgName = useAppSelector((state) => state.organization.selectedOrgName);

  const firstName = user?.firstName ?? 'N/A';
  const lastName = user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  const userRole = user?.role ?? 'No Role';
  const profileImg = user?.profileImage || Image5;

  const [openDropdown, setOpenDropdown] = useState<
    'workspace' | 'invite' | 'project' | 'ticket' | null
  >(null);

  const toggleDropdown = (dropdown: 'workspace' | 'invite' | 'project' | 'ticket') => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <header
      className="
        flex flex-col sm:flex-row 
        items-center justify-between 
        bg-gray-50 shadow 
        px-6 py-4 
        space-y-4 sm:space-y-0
        dark:bg-gray-800
        dark:text-gray-50
      "
    >
      {/* Left side */}
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <button className="text-gray-500 hover:text-gray-700">
          <InformationCircleIcon className="w-6 h-6" />
        </button>
        <div className="flex items-center -space-x-3">
          <img
            src={Image1}
            alt="User1"
            className="w-9 h-9 border-2 border-white rounded-full"
          />
          <img
            src={Image2}
            alt="User2"
            className="w-9 h-9 border-2 border-white rounded-full"
          />
          <img
            src={Image3}
            alt="User3"
            className="w-9 h-9 border-2 border-white rounded-full"
          />
          <img
            src={Image4}
            alt="User4"
            className="w-9 h-9 border-2 border-white rounded-full"
          />
          <button className="w-9 h-9 flex items-center justify-center border-2 border-white rounded-full bg-purple-500 text-white">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {/* CREATE WORKSPACE Icon */}
        <button
          onClick={() => toggleDropdown('workspace')}
          className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
          title="Create Workspace"
        >
          <BriefcaseIcon className="w-5 h-5" />
        </button>

        {/* CREATE PROJECT Icon */}
        <button
          onClick={() => toggleDropdown('project')}
          className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600"
          title="Create Project"
        >
          <FaToolbox className="w-5 h-5" />
        </button>

        {/* CREATE TICKET Icon */}
        <button
          onClick={() => toggleDropdown('ticket')}
          className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
          title="Create Ticket"
        >
          <TicketIcon className="w-5 h-5" />
        </button>

        {/* User info & settings */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-medium leading-tight">{fullName}</span>
            <span className="text-sm text-gray-500 dark:text-gray-50 ">{userRole}</span>
           
          </div>
          <Link to="/dashboard/profile">
            <img
              src={profileImg}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </Link>
          <Link
            to="/dashboard/settings/user"
            className="text-gray-500 hover:text-gray-700"
            title="Settings"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* --- Modals (rendered conditionally) --- */}
      <WorkspaceModal
        isOpen={openDropdown === 'workspace'}
        onClose={closeDropdown}
      />
      <ProjectModal
        isOpen={openDropdown === 'project'}
        onClose={closeDropdown}
      />
      <TicketModal isOpen={openDropdown === 'ticket'} onClose={closeDropdown} />
    </header>
  );
};

export default Header;
