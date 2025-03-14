// File: src/pages/RolePermissionsPage.tsx

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
  useGetRoleQuery,
  useListPermissionsQuery,
  useAddPermissionsToRoleMutation,
  useRemovePermissionsFromRoleMutation,
} from '../../api/rolePermission/rolePermissionApi';
import { Permission } from '../../types/rolePermissionTypes';

const RolePermissionsPage: React.FC = () => {
  // Get the roleId from the URL
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  // API hooks
  const { data: roleData, isLoading, error } = useGetRoleQuery(roleId!);
  const { data: allPerms } = useListPermissionsQuery();
  const [addPerms] = useAddPermissionsToRoleMutation();
  const [removePerms] = useRemovePermissionsFromRoleMutation();

  // Local state for checkboxes, search, and pagination
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Use an empty array if roleData is not yet loaded
  const assignedPerms = roleData ? roleData.permissions : [];
  const assignedSet = new Set(assignedPerms.map((p) => p._id));
  // "Available" permissions are those not assigned
  const availablePermsAll = allPerms ? allPerms.filter((p) => !assignedSet.has(p._id)) : [];

  // Apply search filter to available permissions
  const filteredAvailable = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return availablePermsAll.filter((p) => p.name.toLowerCase().includes(searchLower));
  }, [availablePermsAll, searchTerm]);

  // Apply pagination to the filtered list
  const total = filteredAvailable.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = filteredAvailable.slice(startIndex, endIndex);

  // Toggle checkbox selection for a permission
  function togglePerm(permId: string) {
    setSelectedPerms((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  }

  // Handle adding selected permissions
  async function handleAdd() {
    if (selectedPerms.length === 0) return;
    try {
      await addPerms({ roleId: roleId!, permissionIds: selectedPerms }).unwrap();
      setSelectedPerms([]);
    } catch (err) {
      console.error('Failed to add permissions:', err);
    }
  }

  // Handle removing selected permissions
  async function handleRemove() {
    if (selectedPerms.length === 0) return;
    try {
      await removePerms({ roleId: roleId!, permissionIds: selectedPerms }).unwrap();
      setSelectedPerms([]);
    } catch (err) {
      console.error('Failed to remove permissions:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-blue-600 hover:text-blue-800"
            title="Go Back"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Manage Permissions</h1>
        </div>

        {isLoading || error || !roleData ? (
          <div className="text-center">
            {isLoading ? (
              <p>Loading role information...</p>
            ) : error ? (
              <p className="text-red-500">Error loading role information.</p>
            ) : (
              <p>No role data available.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Role: <span className="text-blue-600">{roleData.name}</span>
              </h2>
              <p className="text-sm text-gray-600">
                Use the checkboxes below to add or remove permissions for this role.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* LEFT COLUMN: Currently Assigned Permissions */}
              <div>
                <h3 className="font-semibold mb-2">
                  Currently Assigned ({assignedPerms.length})
                </h3>
                {assignedPerms.length === 0 ? (
                  <p className="text-sm text-gray-500">None</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto border p-2 rounded space-y-1">
                    {assignedPerms.map((perm: Permission) => (
                      <label key={perm._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPerms.includes(perm._id)}
                          onChange={() => togglePerm(perm._id)}
                        />
                        <span>{perm.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Available Permissions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Available to Add</h3>
                  <input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                    style={{ width: '150px' }}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto border p-2 rounded space-y-1">
                  {pageData.map((perm: Permission) => (
                    <label key={perm._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm._id)}
                        onChange={() => togglePerm(perm._id)}
                      />
                      <span>{perm.name}</span>
                    </label>
                  ))}
                  {pageData.length === 0 && (
                    <p className="text-sm text-gray-500">No matching permissions.</p>
                  )}
                </div>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                    className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="px-2 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 justify-end mt-6">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Selected
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Remove Selected
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RolePermissionsPage;
