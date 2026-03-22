import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/educator/Navbar';
import Sidebar from '../../components/educator/Sidebar';
import Footer from '../../components/educator/Footer';

const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white">

      {/* 1. Educator Navbar (Top) */}
      <Navbar />

      {/* 2. Main Layout: Sidebar (Left) & Nested Content (Right) */}
      <div className="flex">
        <Sidebar />

        {/* 3. Outlet Wrapper: Takes up remaining width */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      {/* 4. Educator Footer (Bottom) */}
      <Footer />

    </div>
  );
};

export default Educator;
