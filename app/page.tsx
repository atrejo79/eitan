'use client';

import { useState } from 'react';
// Ya no necesitas importar Navbar aquí

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderContent = () => {
    switch(activeSection) {
      case 'turnos':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Gestión de Turnos</h2>
            <p className="text-gray-600">Aquí se mostrará el contenido de turnos...</p>
          </div>
        );
      case 'pacientes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pacientes</h2>
            <p className="text-gray-600">Aquí se mostrará el contenido de pacientes...</p>
          </div>
        );
      case 'historial':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Historial Médico</h2>
            <p className="text-gray-600">Aquí se mostrará el historial médico...</p>
          </div>
        );
      case 'profesionales':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profesionales</h2>
            <p className="text-gray-600">Aquí se mostrará el contenido de profesionales...</p>
          </div>
        );
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">Aquí se mostrará el dashboard...</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="text-center">
              <div className="mb-6">
                <img
                  src="/images/eitan-logo.png"
                  alt="EiTAN Logo"
                  className="w-20 h-20 object-contain mx-auto"
                />
              </div>
              <div className="mb-4">
                <img
                  src="/images/eitan-text.png"
                  alt="EiTAN Salta"
                  className="h-12 object-contain mx-auto"
                />
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Sistema de Gestión Médica Inteligente
              </p>
              <p className="text-gray-500">
                Selecciona una opción del menú para comenzar
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    // Ya no necesitas el contenedor principal aquí, porque lo tienes en SidebarLayout
    <>
      {renderContent()}
    </>
  );
}
