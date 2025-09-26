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

const UserPlus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="6" x2="20" y2="12"></line>
    <line x1="17" y1="9" x2="23" y2="9"></line>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22,4 12,14.01 9,11.01"></polyline>
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
};

export default function SearchComponent() {
  const [busquedaTipo, setBusquedaTipo] = useState<"documento" | "apellido">("documento");
  const [busquedaValor, setBusquedaValor] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [askCreate, setAskCreate] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  const [nuevo, setNuevo] = useState<Omit<Paciente, "id">>({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    obra_social_id: undefined,
  });

  const upperFirst = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const buscarPacientes = async () => {
    if (!busquedaValor) {
      alert("Por favor, ingrese un valor de búsqueda.");
      return;
    }

    // Validaciones según tipo de búsqueda
    if (busquedaTipo === "documento" && !/^\d{7,8}$/.test(busquedaValor)) {
      alert("El documento debe tener 7 u 8 dígitos.");
      return;
    }

    if (busquedaTipo === "apellido") {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(busquedaValor)) {
        alert("El apellido solo debe contener letras.");
        return;
      }
    }

    setLoading(true);
    try {
      const query = busquedaTipo === "documento"
        ? `documento=${busquedaValor}`
        : `apellido=${busquedaValor}`;
      const res = await fetch(`/api/buscar-pacientes?${query}`);
      const data: Paciente[] = await res.json();
      setPacientes(data);

      if (data.length === 0) {
        setAskCreate(true);
        setShowForm(false);
        setSelectedPaciente(null);
      } else if (data.length === 1) {
        setSelectedPaciente(data[0]);
        setShowForm(false);
        setAskCreate(false);
      } else {
        setSelectedPaciente(null);
        setShowForm(false);
        setAskCreate(false);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert("Error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const crearPaciente = async () => {
    // Validaciones frontend
    if (!nuevo.nombre.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)) {
      alert("El nombre solo debe contener letras.");
      return;
    }
    if (!nuevo.apellido.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)) {
      alert("El apellido solo debe contener letras.");
      return;
    }
    if (!nuevo.documento.match(/^[0-9]{7,8}$/)) {
      alert("El documento debe tener 7 u 8 dígitos.");
      return;
    }
    if (nuevo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevo.email)) {
      alert("Ingrese un email válido.");
      return;
    }
    if (nuevo.telefono && !/^\+?\d{7,15}$/.test(nuevo.telefono)) {
      alert("Ingrese un teléfono válido (7-15 dígitos).");
      return;
    }

    const pacienteParaCrear = {
      ...nuevo,
      nombre: upperFirst(nuevo.nombre),
      apellido: upperFirst(nuevo.apellido),
    };

    try {
      const res = await fetch("/api/buscar-pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteParaCrear),
      });

      if (res.ok) {
        alert("Paciente creado exitosamente.");
        setShowForm(false);
        setAskCreate(false);
        setNuevo({
          nombre: "",
          apellido: "",
          documento: "",
          email: "",
          telefono: "",
          fecha_nacimiento: "",
          obra_social_id: undefined,
        });
        // Buscar de nuevo para mostrar el paciente creado
        await buscarPacientes();
      } else {
        const err = await res.json();
        alert("Error al crear paciente: " + err.error);
      }
    } catch (error) {
      console.error("Error al crear paciente:", error);
      alert("Error al crear paciente.");
    }
  };

  const handleCreateYes = () => {
    setShowForm(true);
    setAskCreate(false);
    setNuevo((prev) => ({
      ...prev,
      documento: busquedaTipo === "documento" ? busquedaValor : prev.documento,
      apellido: busquedaTipo === "apellido" ? busquedaValor : prev.apellido,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarPacientes();
    }
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
          <p className="text-sm text-gray-600">Busque o registre nuevos pacientes</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="space-y-4 mb-6">
        {/* Tipo de búsqueda */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setBusquedaTipo("documento")}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${busquedaTipo === "documento" 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <CreditCard className="w-5 h-5" />
            Documento
          </button>
          <button
            onClick={() => setBusquedaTipo("apellido")}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${busquedaTipo === "apellido" 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <User className="w-5 h-5" />
            Apellido
          </button>
        </div>

        {/* Campo de búsqueda */}
        <div className="flex gap-3">
          <input
            type="text"
            value={busquedaValor}
            onChange={(e) => setBusquedaValor(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={busquedaTipo === "documento" ? "Ej: 12345678" : "Ej: García"}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                     focus:ring-orange-400 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={buscarPacientes}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg 
                     hover:from-orange-500 hover:to-yellow-500 shadow-md transform transition-all 
                     duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block"></span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 inline mr-2" />
                Buscar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resultados - Múltiples pacientes */}
      {pacientes.length > 1 && !selectedPaciente && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Se encontraron {pacientes.length} pacientes:
          </p>
          <div className="space-y-2">
            {pacientes.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPaciente(p)}
                className="w-full p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 
                         border border-gray-200 hover:border-orange-300 rounded-lg transition-all duration-200 
                         text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600 group-hover:text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {upperFirst(p.apellido)}, {upperFirst(p.nombre)}
                    </p>
                    <p className="text-sm text-gray-600">DNI: {p.documento}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Paciente seleccionado */}
      {selectedPaciente && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Información del Paciente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Nombre:</span> {upperFirst(selectedPaciente.nombre)}</p>
              <p className="text-sm"><span className="font-semibold">Apellido:</span> {upperFirst(selectedPaciente.apellido)}</p>
              <p className="text-sm"><span className="font-semibold">Documento:</span> {selectedPaciente.documento}</p>
              <p className="text-sm"><span className="font-semibold">Fecha Nac.:</span> {selectedPaciente.fecha_nacimiento || "-"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-semibold">Email:</span> {selectedPaciente.email || "-"}</p>
              <p className="text-sm"><span className="font-semibold">Teléfono:</span> {selectedPaciente.telefono || "-"}</p>
              <p className="text-sm"><span className="font-semibold">Obra Social ID:</span> {selectedPaciente.obra_social_id || "-"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preguntar si crear nueva ficha */}
      {askCreate && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <UserX className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-amber-800 font-semibold mb-4">
            No se encontró ningún paciente. ¿Desea crear una nueva ficha?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-all duration-200 font-semibold flex items-center gap-2"
              onClick={handleCreateYes}
            >
              <CheckCircle className="w-5 h-5" />
              Sí, crear ficha
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                       transition-all duration-200 font-semibold"
              onClick={() => setAskCreate(false)}
            >
              No, cancelar
            </button>
          </div>
        </div>
      )}

      {/* Formulario para nuevo paciente */}
      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            Crear Nueva Ficha de Paciente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre *</label>
              <input
                placeholder="Ingrese nombre"
                value={nuevo.nombre}
                onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Apellido *</label>
              <input
                placeholder="Ingrese apellido"
                value={nuevo.apellido}
                onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Documento *</label>
              <input
                placeholder="DNI sin puntos"
                value={nuevo.documento}
                onChange={(e) => setNuevo({ ...nuevo, documento: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                placeholder="correo@ejemplo.com"
                value={nuevo.email}
                onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
              <input
                placeholder="Número de teléfono"
                value={nuevo.telefono}
                onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha Nacimiento</label>
              <input
                type="date"
                value={nuevo.fecha_nacimiento}
                onChange={(e) => setNuevo({ ...nuevo, fecha_nacimiento: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Obra Social (ID)</label>
              <input
                type="number"
                placeholder="ID de obra social"
                value={nuevo.obra_social_id ?? ""}
                onChange={(e) => setNuevo({
                  ...nuevo,
                  obra_social_id: Number(e.target.value) || undefined,
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                       transition-all duration-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={crearPaciente}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg 
                       hover:from-green-600 hover:to-green-700 shadow-md transform transition-all 
                       duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Crear Paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}