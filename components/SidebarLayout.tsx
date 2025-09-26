'use client';

import React from 'react';
import Navbar from './navbar';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <Navbar />
      {/* si tenés header fijo en mobile */}
      <div className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
