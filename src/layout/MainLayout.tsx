// File: src/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAppSelector } from '../app/hooks/redux';

const MainLayout: React.FC = () => {
  const { mode, bgColor } = useAppSelector((state) => state.theme);

  return (
    <div
      className={`flex w-full min-h-screen ${
        mode === 'dark' ? 'dark' : 'light'
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col dark:bg-gray-700">
        <Header />
        <main className="p-4 flex-1 dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
