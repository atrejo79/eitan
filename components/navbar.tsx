'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/* ---------- Íconos SVG ---------- */
type IconProps = { className?: string };

const Calendar = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Users = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FileText = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const UserCheck = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17,11 19,13 23,9"></polyline>
  </svg>
);

const BarChart3 = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const LogIn = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10,17 15,12 10,7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const Menu = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
/* ---------- Fin íconos ---------- */

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: 'turnos', label: 'Calendario', icon: Calendar, href: '/turnos' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, href: '/pacientes' },
    { id: 'historial', label: 'Buscar Pacientes', icon: FileText, href: '/buscar' },
    { id: 'profesionales', label: 'Profesionales', icon: UserCheck, href: '/profesionales' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  ];

  const loginHref = '/login';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const itemClasses = (active: boolean) =>
    `w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
    }`;

  const handleLogout = () => {
    try {
      localStorage.clear();
      // si usás algo en sessionStorage/cookies, limpiarlo acá
    } finally {
      setIsMobileMenuOpen(false);
      router.push(loginHref);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            <img src="/images/eitan-logo.png" alt="EiTAN Logo" className="w-12 h-12 object-contain" />
            <img src="/images/eitan-text.png" alt="EiTAN Salta" className="h-8 object-contain" />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map(({ id, label, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              className={itemClasses(isActive(href))}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Login / Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-orange-600 rounded-lg transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-3 rotate-180" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src="/images/eitan-logo.png" alt="EiTAN Logo" className="w-6 h-6 object-contain" />
            <img src="/images/eitan-text.png" alt="EiTAN Salta" className="h-5 object-contain" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-2">
              {menuItems.map(({ id, label, icon: Icon, href }) => (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={itemClasses(isActive(href))}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href={loginHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-orange-600 rounded-lg transition-all duration-200"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  <span className="font-medium">Login</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-orange-600 rounded-lg transition-all duration-200"
                >
                  <LogIn className="w-5 h-5 mr-3 rotate-180" />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
