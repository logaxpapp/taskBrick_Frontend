// File: src/components/admin/RolesSection.tsx

import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from "../../api/rolePermission/rolePermissionApi";
import { Role, Permission } from "../../types/rolePermissionTypes";
import Modal from "../../components/UI/Modal"; // your custom modal component

function RolesSection() {
  const { data: roles, isLoading, error } = useListRolesQuery();
  const [createRole] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  // Searching, creating
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // For editing
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleName, setEditRoleName] = useState("");

  // Track which rows are expanded to show full permission list
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  if (isLoading) return <p>Loading Roles...</p>;
  if (error) return <p className="text-red-500">Error fetching roles</p>;
  if (!roles) return null;

  // Filter roles by search
  const filteredRoles = roles.filter((r: Role) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CREATE
  async function handleCreateRole(newName: string) {
    try {
      await createRole({ name: newName, permissionIds: [] }).unwrap();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create role:", err);
      alert("Create role failed. Check console.");
    }
  }

  // DELETE
  async function handleDeleteRole(roleId: string) {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(roleId).unwrap();
    } catch (err) {
      console.error("Failed to delete role:", err);
      alert("Delete role failed. Check console.");
    }
  }

  // EDIT
  function startEditRole(r: Role) {
    setEditRoleId(r._id);
    setEditRoleName(r.name);
  }
  async function handleUpdateRole() {
    if (!editRoleId) return;
    try {
      await updateRole({
        roleId: editRoleId,
        data: { name: editRoleName },
      }).unwrap();
      setEditRoleId(null);
      setEditRoleName("");
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  }

  // Toggle row expansion for viewing full permission list
  function toggleExpandRow(roleId: string) {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top section: search + create button */}
      <div className="flex items-center justify-between">
        <input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        />
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center space-x-2"
        >
          <FaPlus />
          <span>Create Role</span>
        </button>
      </div>

      {/* The main roles table */}
      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 w-1/4">
                Role Name
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Permissions (Preview)
              </th>
              <th className="px-4 py-2 text-gray-700 font-semibold w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(role => {
              // 1) show a "preview" of maybe 2 or 3 permissions
              const previewCount = 3;
              const totalPerms = role.permissions.length;
              const previewPerms = role.permissions.slice(0, previewCount);
              const isExpanded = expandedRows.has(role._id);

              return (
                <React.Fragment key={role._id}>
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2">
                      {/* If editing */}
                      {editRoleId === role._id ? (
                        <input
                          value={editRoleName}
                          onChange={(e) => setEditRoleName(e.target.value)}
                          className="border p-1 rounded w-full focus:ring focus:ring-blue-300"
                        />
                      ) : (
                        role.name
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {/* Collapsed view: show only a few perm names, plus a toggle */}
                      {previewPerms.map((p: Permission) => p.name).join(", ")}
                      {totalPerms > previewCount && !isExpanded ? (
                        <span className="text-sm text-gray-500">
                          {` and ${totalPerms - previewCount} more...`}
                        </span>
                      ) : null}
                    </td>

                    <td className="px-4 py-2 flex items-center gap-2">
                      {editRoleId === role._id ? (
                        <button
                          onClick={handleUpdateRole}
                          className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 transition"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditRole(role)}
                          className=" text-yellow-500 px-2 py-1 rounded  hover:bg-gray-400 transition flex items-center space-x-1"
                        >
                          <FaEdit />
                         
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRole(role._id)}
                        className="text-red-400 px-1 py-1 rounded  hover:bg-red-700 transition flex items-center space-x-1"
                      >
                        <FaTrash />
                       
                      </button>
                      <Link
                        to={`/admin/role-permissions/${role._id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition flex items-center space-x-1"
                      >
                        <span>Permissions</span>
                      </Link>

                      {/* Toggle expand button */}
                      <button
                        onClick={() => toggleExpandRow(role._id)}
                        className="text-gray-500 hover:text-gray-700 ml-auto flex items-center"
                        title="Show/Hide all permissions"
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row for listing *all* perms */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={3} className="px-4 py-2 bg-gray-50">
                          <div className="p-2 border rounded bg-white shadow-sm">
                            <h4 className="font-semibold mb-2 text-gray-700">
                              All Permissions:
                            </h4>
                            {role.permissions.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                No permissions assigned.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {role.permissions.map((perm: Permission) => (
                                  <span
                                    key={perm._id}
                                    className="px-2 py-1 text-sm border rounded bg-gray-100 text-gray-800"
                                  >
                                    {perm.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}

            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                  No matching roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Role Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New Role"
          >
            <CreateRoleForm
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateRole}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RolesSection;

/** A small form inside the modal to create a new role by name only. */
function CreateRoleForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (newName: string) => void;
}) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Role Name
        </label>
        <input
          className="border p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="e.g. 'Support Manager'"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>
    </form>
  );
}
