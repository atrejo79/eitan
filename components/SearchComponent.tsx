"use client";

import { useState } from "react";

// Íconos SVG personalizados
const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const UserX = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="18" y1="8" x2="23" y2="13"></line>
    <line x1="23" y1="8" x2="18" y2="13"></line>
  </svg>
);

type Paciente = {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  obra_social_id?: number;
  obras_sociales?: {
    nombre: string;
  };
};

export default function SearchComponent() {
  const [busquedaTipo, setBusquedaTipo] = useState<"documento" | "apellido">("documento");
  const [busquedaValor, setBusquedaValor] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [notFound, setNotFound] = useState(false);

  const upperFirst = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const buscarPacientes = async () => {
    if (!busquedaValor) {
      alert("Por favor, ingrese un valor de búsqueda.");
      return;
    }

    // Validaciones según tipo de búsqueda
    if (busquedaTipo === "documento") {
      const documentoLimpio = busquedaValor.replace(/\D/g, '');
      if (documentoLimpio.length < 7 || documentoLimpio.length > 8) {
        alert("El documento debe tener entre 7 y 8 dígitos.");
        return;
      }
    }

    if (busquedaTipo === "apellido") {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(busquedaValor)) {
        alert("El apellido solo debe contener letras.");
        return;
      }
    }

    setLoading(true);
    setNotFound(false);
    
    try {
      const query = busquedaTipo === "documento"
        ? `documento=${busquedaValor.replace(/\D/g, '')}`
        : `apellido=${busquedaValor}`;
      
      const res = await fetch(`/api/buscar-pacientes?${query}`);
      const data: Paciente[] = await res.json();
      
      setPacientes(data);

      if (data.length === 0) {
        setNotFound(true);
        setSelectedPaciente(null);
      } else if (data.length === 1) {
        setSelectedPaciente(data[0]);
      } else {
        setSelectedPaciente(null);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert("Error al realizar la búsqueda. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarPacientes();
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Buscar Paciente</h2>
          <p className="text-sm text-gray-600">Encuentre rápidamente la información del paciente</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="space-y-4 mb-6">
        {/* Tipo de búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBusquedaTipo("documento")}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${busquedaTipo === "documento" 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <CreditCard className="w-5 h-5" />
              Documento
            </button>
            <button
              onClick={() => setBusquedaTipo("apellido")}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${busquedaTipo === "apellido" 
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md transform scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <User className="w-5 h-5" />
              Apellido
            </button>
          </div>
        </div>

        {/* Campo de búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {busquedaTipo === "documento" ? "Número de Documento" : "Apellido del Paciente"}
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={busquedaValor}
              onChange={(e) => setBusquedaValor(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                busquedaTipo === "documento" 
                  ? "Ej: 12345678" 
                  : "Ej: García"
              }
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                       focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={buscarPacientes}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg 
                       hover:from-orange-500 hover:to-yellow-500 shadow-md transform transition-all 
                       duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {/* Si hay varios pacientes */}
      {pacientes.length > 1 && !selectedPaciente && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Se encontraron {pacientes.length} pacientes:
          </label>
          <div className="space-y-2">
            {pacientes.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPaciente(p)}
                className="w-full p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 
                         border border-gray-200 hover:border-orange-300 rounded-lg transition-all duration-200 
                         text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg group-hover:bg-orange-100 transition-colors">
                      <User className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {upperFirst(p.apellido)}, {upperFirst(p.nombre)}
                      </p>
                      <p className="text-sm text-gray-600">DNI: {p.documento}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paciente seleccionado o único resultado */}
      {selectedPaciente && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Información del Paciente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Nombre Completo</p>
                  <p className="font-semibold text-gray-800">
                    {upperFirst(selectedPaciente.apellido)}, {upperFirst(selectedPaciente.nombre)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Documento</p>
                  <p className="font-semibold text-gray-800">{selectedPaciente.documento}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-semibold text-gray-800">
                    {formatearFecha(selectedPaciente.fecha_nacimiento)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPaciente.email || "-"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Teléfono</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPaciente.telefono || "-"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-xs text-gray-600">Obra Social</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPaciente.obras_sociales?.nombre || "Particular"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-orange-200">
            <button
              onClick={() => {
                setSelectedPaciente(null);
                setPacientes([]);
                setBusquedaValor("");
              }}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Nueva búsqueda
            </button>
          </div>
        </div>
      )}

      {/* No encontrado */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <UserX className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-semibold mb-2">
            No se encontró ningún paciente
          </p>
          <p className="text-red-600 text-sm">
            Verifique que los datos ingresados sean correctos
          </p>
        </div>
      )}
    </div>
  );
}