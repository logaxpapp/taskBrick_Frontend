// src/pages/users/components/UserGridItem.tsx

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineDotsVertical, HiLockClosed, HiLockOpen, HiPencilAlt } from 'react-icons/hi';

import Button from '../../components/UI/Button';
import AvatarDefault from '../../assets/images/image4.png';

const dropdownVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export interface UserGridItemProps {
  user: any; // Or your User type
  dropdownOpenFor: string | null;
  onToggleDropdown: (userId: string) => void;

  onEditUser: (user: any) => void;
  onToggleSuspend: (user: any) => void;
  onDeactivateUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserGridItem: React.FC<UserGridItemProps> = ({
  user,
  dropdownOpenFor,
  onToggleDropdown,
  onEditUser,
  onToggleSuspend,
  onDeactivateUser,
  onDeleteUser,
}) => {
  // If user.role is an object, we convert to string
  const roleText =
    typeof user.role === 'string'
      ? user.role
      : user.role?.name
      ? user.role.name
      : '(No role)';

  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img
          src={user.profileImage || AvatarDefault}
          alt={user.email}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">{roleText}</p>
        </div>
      </div>

      {/* Actions Dropdown */}
      <div className="relative mt-auto">
        <Button
          variant="outline"
          size="xs"
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
                <span className="flex items-center gap-2">
                  <HiPencilAlt className="w-4 h-4" />
                  Edit
                </span>
              </button>
              <button
                onClick={() => {
                  onToggleDropdown(user._id);
                  onToggleSuspend(user);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                {user.isActive ? (
                  <span className="flex items-center gap-2">
                    <HiLockClosed className="w-4 h-4" />
                    Suspend
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HiLockOpen className="w-4 h-4" />
                    Unsuspend
                  </span>
                )}
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
    </div>
  );
};

export default UserGridItem;
