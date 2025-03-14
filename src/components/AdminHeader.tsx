import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
  PlusIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  UserPlusIcon,
  XMarkIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { FaToolbox } from 'react-icons/fa';
import { useAppSelector } from '../app/hooks/redux'; 
import Image1 from '../assets/images/image1.png';
import Image2 from '../assets/images/image2.png';
import Image3 from '../assets/images/image3.png';
import Image4 from '../assets/images/image4.png';
// 🚨 The old default for the profile was Image5:
import Image5 from '../assets/images/image6.png'; // or "image6", as your import name suggests

const AdminHeader: React.FC = () => {
  // 1) Grab the user from Redux
  const { user } = useAppSelector((state) => state.auth);

  // 2) Derive name + role
  const firstName = user?.firstName ?? 'N/A';
  const lastName = user?.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  const userRole = user?.role ?? 'No Role';

  // 3) NEW: Derive user’s profile image or fallback
  const profileImg = user?.profileImage || Image5;

  console.log(`Logged in as ${fullName} (${userRole}) with profileImg:`, profileImg);

  // Manage dropdown states
  const [openDropdown, setOpenDropdown] = useState<
    'workspace' | 'invite' | 'project' | 'ticket' | null
  >(null);

  const toggleDropdown = (dropdown: 'workspace' | 'invite' | 'project' | 'ticket') => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <header className="relative flex items-center justify-between bg-gray-50 shadow px-6 py-4">
      {/* Left: Search Bar */}
      <div className="flex-1">
        <div className="relative max-w-sm rounded-3xl">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-2.5 left-3" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ backgroundColor: '#F3F4F6' }}
          />
        </div>
      </div>

      {/* Right: Icons, Avatars, Profile, and Create Actions */}
      <div className="flex items-center gap-4">
        {/* Info Icon */}
        <button className="text-gray-500 hover:text-gray-700">
          <InformationCircleIcon className="w-6 h-6" />
        </button>

        {/* Group Avatars + Plus */}
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

        {/* CREATE WORKSPACE Icon */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('workspace')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            title="Create Workspace"
          >
            <BriefcaseIcon className="w-5 h-5" />
          </button>
          {openDropdown === 'workspace' && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create a New Workspace</h3>
                <button onClick={closeDropdown}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter workspace name"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Team Size
                  </label>
                  <select className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Select team size</option>
                    <option>1-5</option>
                    <option>6-20</option>
                    <option>21-50</option>
                    <option>50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Role
                  </label>
                  <select className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Select your role</option>
                    <option>Manager</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    alert('Workspace created!');
                    closeDropdown();
                  }}
                >
                  Create Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEND INVITE Icon */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('invite')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600"
            title="Send Invite"
          >
            <UserPlusIcon className="w-5 h-5" />
          </button>
          {openDropdown === 'invite' && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add People to Your Workspace</h3>
                <button onClick={closeDropdown}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Names or Emails <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria, maria@company.com"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-around mt-3">
                  {/* Example external integrations */}
                  <button className="flex items-center px-2 py-1 border rounded hover:bg-gray-100">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="Google"
                      className="w-5 h-5 mr-1"
                    />
                    Google
                  </button>
                  <button className="flex items-center px-2 py-1 border rounded hover:bg-gray-100">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
                      alt="Slack"
                      className="w-5 h-5 mr-1"
                    />
                    Slack
                  </button>
                  <button className="flex items-center px-2 py-1 border rounded hover:bg-gray-100">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg"
                      alt="MS"
                      className="w-5 h-5 mr-1"
                    />
                    MS
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    className="underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://policies.google.com/terms"
                    className="underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>{' '}
                  apply.
                </p>
                <button
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  onClick={() => {
                    alert('Invite sent!');
                    closeDropdown();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CREATE PROJECT Icon */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('project')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
            title="Create Project"
          >
            <FaToolbox className="w-5 h-5" />
          </button>
          {openDropdown === 'project' && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create a New Project</h3>
                <button onClick={closeDropdown}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter project description"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  onClick={() => {
                    alert('Project created!');
                    closeDropdown();
                  }}
                >
                  Create Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CREATE TICKET Icon */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('ticket')}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white hover:bg-orange-600"
            title="Create Ticket"
          >
            <TicketIcon className="w-5 h-5" />
          </button>
          {openDropdown === 'ticket' && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create a New Ticket</h3>
                <button onClick={closeDropdown}>
                  <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ticket Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter ticket title"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter ticket description"
                    className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  ></textarea>
                </div>
                <button
                  className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                  onClick={() => {
                    alert('Ticket created!');
                    closeDropdown();
                  }}
                >
                  Create Ticket
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Name / Profile + Gear */}
        <div className="flex items-center gap-3">
          {/* Display user info from Redux */}
          <div className="flex flex-col text-right">
            <span className="font-medium leading-tight">{fullName}</span>
            <span className="text-sm text-gray-500">{userRole}</span>
          </div>

          {/* 🔹 Use user.profileImage or fallback to Image5 */}
          <Link to="/dashboard/profile">
            <img
              src={profileImg}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
          </Link>

          <Link to="/dashboard/settings/user" className="text-gray-500 hover:text-gray-700" title="Settings">
            <Cog6ToothIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};



export default AdminHeader;
