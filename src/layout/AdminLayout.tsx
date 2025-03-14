// File: src/layout/AdminLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks/redux';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader'; 

const AdminLayout: React.FC = () => {
  const { mode, bgColor } = useAppSelector((state) => state.theme);

  return (
    <div
      className={`flex w-full min-h-screen ${mode === 'dark' ? 'dark' : ''}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-4 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
