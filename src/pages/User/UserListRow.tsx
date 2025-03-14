// src/pages/users/components/UserListRow.tsx

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Button from '../../components/UI/Button';

const dropdownVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export interface UserListRowProps {
  user: any; // Or your User type
  dropdownOpenFor: string | null;
  onToggleDropdown: (userId: string) => void;

  onEditUser: (user: any) => void;
  onToggleSuspend: (user: any) => void;
  onDeactivateUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

// A single row in the “list/table” view
const UserListRow: React.FC<UserListRowProps> = ({
  user,
  dropdownOpenFor,
  onToggleDropdown,
  onEditUser,
  onToggleSuspend,
  onDeactivateUser,
  onDeleteUser,
}) => {
  // Convert user.role to text if it’s an object
  const roleText =
    typeof user.role === 'string'
      ? user.role
      : user.role?.name
      ? user.role.name
      : '(No role)';

  return (
    <tr className="hover:bg-gray-50 transition duration-150 ease-in-out border-b last:border-0">
      <td className="px-4 py-3 text-sm">{user.firstName}</td>
      <td className="px-4 py-3 text-sm">{user.lastName}</td>
      <td className="px-4 py-3 text-sm">{user.email}</td>
      <td className="px-4 py-3 text-sm">{roleText}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {user.isActive ? 'Active' : 'Suspended'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="relative">
          <Button
            size="xs"
            variant="outline"
            onClick={() => onToggleDropdown(user._id)}
            leftIcon={HiOutlineDotsVertical}
          >
            Actions
          </Button>
          <AnimatePresence>
            {dropdownOpenFor === user._id && (
              <motion.div
                className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-50"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <button
                  onClick={() => {
                    onToggleDropdown(user._id);
                    onEditUser(user);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onToggleDropdown(user._id);
                    onToggleSuspend(user);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                  {user.isActive ? 'Suspend' : 'Unsuspend'}
                </button>
                <button
                  onClick={() => {
                    onToggleDropdown(user._id);
                    onDeactivateUser(user._id);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => {
                    onToggleDropdown(user._id);
                    onDeleteUser(user._id);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </tr>
  );
};

export default UserListRow;
