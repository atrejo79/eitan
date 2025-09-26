'use client';

import { useState } from 'react';
import Navbar from './navbar';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <Navbar onSectionChange={setActiveSection} activeSection={activeSection} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}