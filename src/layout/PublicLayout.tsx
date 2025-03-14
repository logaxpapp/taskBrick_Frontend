// src/layout/PublicLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../pages/Home/Header';
import Footer from '../pages/Home/Footer';

const PublicLayout: React.FC = () => {
  return (
    <>
      <Header />
      {/* "Outlet" is where nested routes get rendered */}
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
