// File: src/components/admin/LatestSignUp.tsx

import React from 'react';
import { useGetLatestSignupsQuery } from '../../api/admin/adminUserApi';
import { User } from '../../types/userTypes';
import { Organization } from '../../types/organizationTypes';

const LatestSignUp: React.FC = () => {
  // Fetch the last 60 days by default
  const { data, error, isLoading } = useGetLatestSignupsQuery(60);

  if (isLoading) return <p>Loading latest signups...</p>;
  if (error) return <p className="text-red-500">Error loading latest signups.</p>;

  const latestUsers: User[] = data?.users || [];
  const latestOrgs: Organization[] = data?.organizations || [];

  return (
    <div className="space-y-8">
      {/* Latest Users Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Latest User Signups (Last 60 Days)</h2>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {latestUsers.map((u, idx) => (
                <tr key={u._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{u.email}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
              {latestUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    No recent user signups.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Organizations Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Latest Organizations (Last 60 Days)</h2>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Owner</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {latestOrgs.map((o, idx) => (
                <tr key={o._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-gray-700">{o.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {o.ownerUserId ? o.ownerUserId.toString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))}
              {latestOrgs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    No recent organizations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LatestSignUp;
