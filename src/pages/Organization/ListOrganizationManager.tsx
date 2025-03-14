import React, { useState } from 'react';
import {
  useListOrganizationsQuery,
  useCreateOrganizationMutation,
  useCreateOrgAndOwnerMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '../../api/organization/organizationApi';

type EditOrgState = {
  id: number | null;      // Which org is being edited
  name: string;
  description: string;
};

type CreateOrgState = {
  name: string;
  description: string;
  ownerUserId?: number;
};

type CreateOrgOwnerState = {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const ListOrganizationManager: React.FC = () => {
  // ------------------------------------------
  // 1) Query: List all orgs
  // ------------------------------------------
  const {
    data: organizations,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
    refetch: refetchOrgs,
  } = useListOrganizationsQuery();

  // ------------------------------------------
  // 2) Mutations: Create / Create+Owner / Update / Delete
  // ------------------------------------------
  const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [createOrgAndOwner, { isLoading: isCreatingOwner }] =
    useCreateOrgAndOwnerMutation();
  const [updateOrganization, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();

  // ------------------------------------------
  // 3) Local UI State
  // ------------------------------------------
  // A) Create Organization
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateOrgState>({
    name: '',
    description: '',
    ownerUserId: 0,
  });

  // B) Create Organization + Owner
  const [showCreateOwnerModal, setShowCreateOwnerModal] = useState(false);
  const [createOwnerForm, setCreateOwnerForm] = useState<CreateOrgOwnerState>({
    name: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  // C) Edit Organization
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<EditOrgState>({
    id: null,
    name: '',
    description: '',
  });

  // D) Simple error or success messages (optional)
  const [message, setMessage] = useState<string | null>(null);

  // ------------------------------------------
  // 4) Handlers
  // ------------------------------------------
  // A) Handle create organization (no owner)
  const handleCreateOrg = async () => {
    try {
      await createOrganization({
        name: createForm.name,
        description: createForm.description,
        ownerUserId: createForm.ownerUserId
        ? String(createForm.ownerUserId)
        : undefined,
      
      }).unwrap();

      setMessage('Organization created successfully!');
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', ownerUserId: 0 });
      refetchOrgs(); // refresh the list
    } catch (err: any) {
      console.error('Create org error:', err);
      setMessage(err.data?.error || 'Failed to create organization');
    }
  };

  // B) Handle create org + owner
  const handleCreateOrgAndOwner = async () => {
    try {
      await createOrgAndOwner({
        name: createOwnerForm.name,
        email: createOwnerForm.email,
        password: createOwnerForm.password,
        firstName: createOwnerForm.firstName,
        lastName: createOwnerForm.lastName,
      }).unwrap();

      setMessage('Organization + owner created successfully!');
      setShowCreateOwnerModal(false);
      setCreateOwnerForm({
        name: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      });
      refetchOrgs();
    } catch (err: any) {
      console.error('Create org+owner error:', err);
      setMessage(err.data?.error || 'Failed to create org+owner');
    }
  };

  // C) Handle edit
  const handleEditOrg = (orgId: number, name: string, description?: string) => {
    // Pre-fill form with existing org's data
    setEditForm({
      id: orgId,
      name,
      description: description || '',
    });
    setShowEditModal(true);
  };

  // D) Actually update org
  const handleUpdateOrg = async () => {
    if (!editForm.id) return;
    try {
      const { id, name, description } = editForm;
      await updateOrganization({ id, data: { name, description } }).unwrap();

      setMessage('Organization updated successfully!');
      setShowEditModal(false);
      setEditForm({ id: null, name: '', description: '' });
      refetchOrgs();
    } catch (err: any) {
      console.error('Update org error:', err);
      setMessage(err.data?.error || 'Failed to update organization');
    }
  };

  // E) Handle delete
  const handleDeleteOrg = async (orgId: number) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }
    try {
      await deleteOrganization(orgId).unwrap();
      setMessage('Organization deleted successfully!');
      refetchOrgs();
    } catch (err: any) {
      console.error('Delete org error:', err);
      setMessage(err.data?.error || 'Failed to delete organization');
    }
  };

  // ------------------------------------------
  // 5) Render
  // ------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Organization Manager</h1>

      {/* Optional message display */}
      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      {/* List section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Organizations</h2>
        <div className="space-x-2">
          {/* Button to show "Create Org" modal */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Create Org
          </button>

          {/* Button to show "Create Org+Owner" modal */}
          <button
            onClick={() => setShowCreateOwnerModal(true)}
            className="px-3 py-2 bg-purple-600 text-white rounded"
          >
            Create Org + Owner
          </button>
        </div>
      </div>

      {/* The list of orgs */}
      {isListLoading && <p>Loading organizations...</p>}
      {isListError && <p className="text-red-500">Error: {String(listError)}</p>}
      {organizations && organizations.length > 0 ? (
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Owner User ID</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b border-gray-100">
                <td className="p-2">{org.id}</td>
                <td className="p-2">{org.name}</td>
                <td className="p-2">{org.description || '—'}</td>
                <td className="p-2">{org.ownerUserId || '—'}</td>
                <td className="p-2 flex gap-2">
                <button
                    onClick={() =>
                        handleEditOrg(
                        org.id,
                        org.name,
                        org.description ?? ''  // coalesce null/undefined -> ''
                        )
                    }
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                    Edit
                    </button>

                  <button
                    onClick={() => handleDeleteOrg(org.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !isListLoading && <p>No organizations found.</p>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create Organization</h2>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Name</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Description</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Owner User ID (optional)</span>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={createForm.ownerUserId || 0}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    ownerUserId: Number(e.target.value),
                  })
                }
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrg}
                disabled={isCreating}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Org + Owner Modal */}
      {showCreateOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create Organization + Owner</h2>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Organization Name</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={createOwnerForm.name}
                onChange={(e) =>
                  setCreateOwnerForm({ ...createOwnerForm, name: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Owner Email</span>
              <input
                type="email"
                className="w-full border p-2 rounded"
                value={createOwnerForm.email}
                onChange={(e) =>
                  setCreateOwnerForm({ ...createOwnerForm, email: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Password</span>
              <input
                type="password"
                className="w-full border p-2 rounded"
                value={createOwnerForm.password}
                onChange={(e) =>
                  setCreateOwnerForm({ ...createOwnerForm, password: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">First Name (optional)</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={createOwnerForm.firstName || ''}
                onChange={(e) =>
                  setCreateOwnerForm({ ...createOwnerForm, firstName: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Last Name (optional)</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={createOwnerForm.lastName || ''}
                onChange={(e) =>
                  setCreateOwnerForm({ ...createOwnerForm, lastName: e.target.value })
                }
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreateOwnerModal(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrgAndOwner}
                disabled={isCreatingOwner}
                className="px-3 py-2 bg-purple-600 text-white rounded"
              >
                {isCreatingOwner ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Organization Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Organization</h2>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Name</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm font-semibold">Description</span>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrg}
                disabled={isUpdating}
                className="px-3 py-2 bg-yellow-600 text-white rounded"
              >
                {isUpdating ? 'Updating...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* You could show spinner overlays if you like, or handle isLoading states in modals */}
      {(isCreating || isCreatingOwner || isUpdating || isDeleting) && (
        <div className="mt-4 text-sm italic text-gray-500">
          Processing request...
        </div>
      )}
    </div>
  );
};

export default ListOrganizationManager;
