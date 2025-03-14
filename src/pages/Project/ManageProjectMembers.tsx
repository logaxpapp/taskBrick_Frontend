// File: src/pages/ManageProjectMembers.tsx

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ManageProjectMembersProps {
  projectId: string;
  orgUsers: any[];   // Or a proper user type
  onClose: () => void;
}

const ManageProjectMembers: React.FC<ManageProjectMembersProps> = ({
  projectId,
  orgUsers,
  onClose,
}) => {
  // For demonstration, you might fetch the project details or members here.
  // Or maybe you pass them in via props. 
  // Example: const { data: projectMembers, refetch } = useGetProjectMembersQuery(projectId)

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Header with back arrow */}
      <div className="flex items-center border-b pb-3 mb-4">
        <button
          onClick={onClose}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          title="Go Back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Project Members
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Project ID: <span className="font-semibold">{projectId}</span>
      </p>

      {/* Example: Display org users, check who is in the project, etc. */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {orgUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            {/* Example: button to add or remove from the project */}
            <button className="text-blue-600 hover:underline text-xs">
              Add / Remove
            </button>
          </div>
        ))}
      </div>

      {/* Possibly a footer with "Done" or "Save" buttons, etc. */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm
                     hover:bg-gray-100 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ManageProjectMembers;
