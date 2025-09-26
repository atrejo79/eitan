'use client';

import NavbarProfesional from './NavBarProfesional';

export default function ProfesionalSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <NavbarProfesional />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
