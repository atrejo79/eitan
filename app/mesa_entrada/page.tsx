'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MesaEntradaPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Mesa de Entrada - Consultorio Eitan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.nombre}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Panel de Recepción</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Registrar Paciente</h3>
              <p className="text-gray-600 mb-4">Agregar nuevo paciente</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Nuevo Paciente
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Agendar Turno</h3>
              <p className="text-gray-600 mb-4">Programar consulta</p>
              <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Nuevo Turno
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Ver Agenda</h3>
              <p className="text-gray-600 mb-4">Turnos del día</p>
              <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">
                Ver Agenda
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}