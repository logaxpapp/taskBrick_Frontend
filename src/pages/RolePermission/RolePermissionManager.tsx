// File: src/components/admin/RolePermissionManager.tsx
import React, { useState } from 'react';
import RolesSection from './RolesSection';
import PermissionsSection from './PermissionsSection';
import PermissionMappingManager from './PermissionMappingManager';
import UserManager from './UserManager';

function RolePermissionManager() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'mappings' | 'users'>(
    'roles'
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Role & Permission Manager</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b pb-2">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-2 ${
            activeTab === 'roles'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Roles
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`pb-2 ${
            activeTab === 'permissions'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Permissions
        </button>

        <button
          onClick={() => setActiveTab('mappings')}
          className={`pb-2 ${
            activeTab === 'mappings'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Mappings
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600 font-semibold'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Users
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'roles' && <RolesSection />}
      {activeTab === 'permissions' && <PermissionsSection />}
      {activeTab === 'mappings' && <PermissionMappingManager />}
      {activeTab === 'users' && <UserManager />}
    </div>
  );
}

export default RolePermissionManager;
