// File: src/components/Header/WorkspaceModal.tsx
import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useAppSelector, useAppDispatch } from '../app/hooks/redux';
import { useCreateOrganizationMutation } from '../api/organization/organizationApi';
import { useListOrgsForUserQuery } from '../api/userOrganization/userOrganizationApi';
import { setSelectedOrg } from '../app/store/slices/organizationSlice';
import { useNavigate } from 'react-router-dom';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // <-- GET DISPATCH
  
  const { user } = useAppSelector((state) => state.auth);

  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Query user orgs
  const { data: userOrgs, isLoading: orgsLoading } = useListOrgsForUserQuery(
    user?._id || '',
    { skip: !user?._id }
  );

  // Create org mutation
  const [createOrg, { isLoading: isOrgCreating }] = useCreateOrganizationMutation();

  if (!isOpen) return null;

  const handleCreateWorkspace = async () => {
    if (!user?._id) {
      alert('No user logged in!');
      return;
    }
    try {
      await createOrg({
        name: newWorkspaceName,
        description: newWorkspaceDesc || null,
        ownerUserId: user._id,
      }).unwrap();

      alert('Workspace created!');
      setNewWorkspaceName('');
      setNewWorkspaceDesc('');
      setShowCreateForm(false);
    } catch (err: any) {
      alert(`Failed to create workspace: ${err.data?.error || err.message}`);
    }
  };

  // 3) Switch org using Redux
  const handleSwitchOrg = (orgId: string, orgName: string) => {
    dispatch(setSelectedOrg({ selectedOrgId: orgId, selectedOrgName: orgName }));
    onClose();
    navigate('/dashboard');
  };

  return (
    <>
      {/* Overlay behind the modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          fixed left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-sm
          bg-white border border-gray-200 
          rounded-xl shadow-2xl p-6
          z-50
          animate-fadeIn
        "
        style={{ animationDuration: '0.2s' }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Workspaces</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Toggle Create-Form Header */}
        <div className="flex items-center mb-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center px-2 py-1 bg-blue-100 text-blue-600
                       rounded-md hover:bg-blue-200 transition"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">
              {showCreateForm ? 'Hide Form' : 'Create Workspace'}
            </span>
          </button>
        </div>

        {/* Create Workspace Form (hidden or shown) */}
        {showCreateForm && (
          <div
            className="
              border border-gray-200 p-3 mb-4 rounded-md
              animate-fadeIn
            "
            style={{ animationDuration: '0.2s' }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Workspace Name
                </label>
                <input
                  type="text"
                  placeholder="Enter workspace name"
                  className="
                    w-full px-3 py-2 
                    border border-gray-300 
                    rounded-md 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500
                    mt-1
                  "
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Optionally describe this workspace"
                  className="
                    w-full px-3 py-2 
                    border border-gray-300 
                    rounded-md 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500
                    mt-1
                  "
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                />
              </div>

              <button
                className="
                  w-full py-2 
                  bg-blue-600 text-white
                  rounded-md 
                  hover:bg-blue-700 
                  transition
                  disabled:opacity-60
                "
                onClick={handleCreateWorkspace}
                disabled={isOrgCreating}
              >
                {isOrgCreating ? 'Creating...' : 'Create Workspace'}
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="my-4" />

        {/* Existing Orgs */}
        <div>
          <h4 className="font-semibold text-md mb-2 text-gray-800">Your Organizations</h4>
          {orgsLoading && (
            <p className="text-gray-500 text-sm">Loading orgs...</p>
          )}
          {!orgsLoading && (!userOrgs || userOrgs.length === 0) && (
            <p className="text-gray-500 text-sm">No organizations found.</p>
          )}
          {userOrgs && userOrgs.length > 0 && (
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
              {userOrgs.map((pivot) => {
                const orgDoc = pivot.organizationId as any;
                const orgId = orgDoc?._id || pivot.organizationId;
                const orgName = orgDoc?.name ?? `Org ${orgId}`;

                return (
                  <li
                    key={pivot._id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Org Name:</span>{' '}
                        <span className="text-blue-700">{orgName}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Role:</span>{' '}
                        {pivot.roleInOrg || 'Member'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSwitchOrg(orgId, orgName)}
                      className="
                        text-sm text-white 
                        bg-blue-500 hover:bg-blue-600
                        px-3 py-1 rounded-md
                        transition
                      "
                    >
                      Switch
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkspaceModal;
