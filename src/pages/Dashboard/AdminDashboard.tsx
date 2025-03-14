// File: src/pages/admin/AdminDashboard.tsx
import React from 'react';
import AdminStatistics from '../../pages/admin/AdminStatistics';
import LatestSignUp from '../../pages/admin/LatestSignUp';

const AdminDashboard: React.FC = () => {

  return (
    <div className="space-y-6">

      {/* Statistics Section */}
      <AdminStatistics />

      {/* Latest Signups Table */}
      <div className="bg-white rounded shadow p-8">
        
        <LatestSignUp />
      </div>

      {/* Another possible section: Recent logs or activity */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-sm text-gray-600">No new logs yet.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
