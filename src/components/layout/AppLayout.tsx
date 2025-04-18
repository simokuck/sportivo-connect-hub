
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { Toaster } from "@/components/ui/toaster";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <CollapsibleSidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default AppLayout;
