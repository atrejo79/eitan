'use client';
import Image from 'next/image';
import { useState } from 'react';
// Ya no necesitas importar Navbar aquÃ­

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderContent = () => {
    switch(activeSection) {
      case 'turnos':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Gestion de Turnos</h2>
            <p className="text-gray-600">Aqui se mostrara el contenido de turnos...</p>
          </div>
        );
      case 'pacientes':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pacientes</h2>
            <p className="text-gray-600">Aqui­ se mostrara el contenido de pacientes...</p>
          </div>
        );
      case 'historial':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Historial MÃ©dico</h2>
            <p className="text-gray-600">Aqui se mostrara el historial mÃ©dico...</p>
          </div>
        );
      case 'profesionales':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profesionales</h2>
            <p className="text-gray-600">Aqui­ se mostrara el contenido de profesionales...</p>
          </div>
        );
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">Aqui­ se mostrara el dashboard...</p>
          </div>
        );
      default:
        return (
          
          <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="mb-6">
              <Image
                src="/images/eitan-logo.png"
                alt="EiTAN Logo"
                width={80}
                height={80}
                className="mx-auto h-20 w-20 object-contain"
                priority
              />
            </div>
            <div className="mb-4">
              <Image
                src="/images/eitan-text.png"
                alt="EiTAN Salta"
                width={320}
                height={48}
                className="mx-auto h-12 w-auto object-contain"
              />
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Sistema de Gestión Médica Inteligente
            </p>
            <p className="text-gray-500">Selecciona una opción del menú para comenzar</p>
          </div>
        );
    }
  };

  return (
    // Ya no necesitas el contenedor principal aquÃ­, porque lo tienes en SidebarLayout
    <>
      {renderContent()}
    </>
  );
}