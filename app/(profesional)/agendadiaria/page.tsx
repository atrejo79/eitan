"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Íconos SVG personalizados
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6"></polyline>
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

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22,4 12,14.01 9,11.01"></polyline>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

type EstadoTurno = "reservado" | "confirmado" | "cancelado" | "no_show" | "atendido";

type Turno = {
  turno_id: number;
  inicio: string;
  fin?: string;
  estado: EstadoTurno;
  pacientes?: { 
    nombre: string;
    apellido: string;
    documento?: string;
  } | null;
  profesionales?: { 
    usuarios: { 
      nombre: string; 
      apellido: string;
    };
    profesiones?: {
      nombre: string;
    };
  };
  obras_sociales?: {
    nombre: string;
  } | null;
};

type UserData = {
  user_id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  profesional_id?: number;
};

function formatearFecha(fechaStr: string) {
  const fecha = new Date(`${fechaStr}T00:00:00`);
  return fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatearHora(fechaStr: string) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Función para obtener color según estado
const getEstadoColor = (estado: EstadoTurno, ocupado: boolean) => {
  if (!ocupado) return "from-green-400 to-green-500";
  
  const colors: { [key: string]: string } = {
    'confirmado': 'from-blue-400 to-blue-500',
    'atendido': 'from-purple-400 to-purple-500',
    'cancelado': 'from-red-400 to-red-500',
    'no_show': 'from-gray-400 to-gray-500',
    'reservado': 'from-yellow-400 to-yellow-500'
  };
  return colors[estado] || 'from-orange-400 to-yellow-400';
};

const getEstadoLabel = (estado: EstadoTurno) => {
  const labels: { [key: string]: string } = {
    'confirmado': 'Confirmado',
    'atendido': 'Atendido',
    'cancelado': 'Cancelado',
    'no_show': 'No asistió',
    'reservado': 'Reservado'
  };
  return labels[estado] || estado;
};

export default function AgendaDiariaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener datos del usuario desde localStorage
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Estados
  const [profesionalId, setProfesionalId] = useState<number | null>(null);
  const [fechaActual, setFechaActual] = useState<string>(() => {
    return searchParams.get("fecha") || new Date().toISOString().split("T")[0];
  });
  const [filtroTurno, setFiltroTurno] = useState<"todos" | "maniana" | "tarde">(
    (searchParams.get("horario") as any) || "todos"
  );
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "ocupados" | "libres">(
    (searchParams.get("estado") as any) || "todos"
  );

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(false);

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser) as UserData;
      setUserData(user);
      
      // Si el usuario es un profesional, usar su ID
      if (user.profesional_id) {
        setProfesionalId(user.profesional_id);
      }
    }
  }, []);

  // Cargar turnos del profesional + fecha
  useEffect(() => {
    if (!profesionalId || !fechaActual) return;

    setIsLoadingTurnos(true);

    const qs = new URLSearchParams({
      profesional_id: String(profesionalId),
      fecha: fechaActual,
    });
    if (filtroTurno !== "todos") qs.set("horario", filtroTurno);
    if (filtroEstado !== "todos") qs.set("estado", filtroEstado);

    fetch(`/api/agendadiaria?${qs.toString()}`)
      .then((r) => r.json())
      .then(setTurnos)
      .finally(() => setIsLoadingTurnos(false));
  }, [
    profesionalId,   // 1
    fechaActual,     // 2
    filtroTurno,     // 3  <- SIEMPRE incluido
    filtroEstado,    // 4  <- SIEMPRE incluido
  ]);

  // Sincronizar URL cuando cambien los filtros clave
  useEffect(() => {
    const params = new URLSearchParams();
    if (profesionalId) params.set("profesional_id", profesionalId.toString());
    if (fechaActual) params.set("fecha", fechaActual);
    if (filtroTurno && filtroTurno !== "todos") params.set("horario", filtroTurno);
    if (filtroEstado && filtroEstado !== "todos") params.set("estado", filtroEstado);
    router.replace(`?${params.toString()}`);
  }, [profesionalId, fechaActual, filtroTurno, filtroEstado, router]);

  // Cambiar día con botones
  const cambiarDia = (dias: number) => {
    const fecha = new Date(`${fechaActual}T00:00:00`);
    fecha.setDate(fecha.getDate() + dias);
    setFechaActual(fecha.toISOString().split("T")[0]);
  };

  // Ir a hoy
  const irAHoy = () => {
    setFechaActual(new Date().toISOString().split("T")[0]);
  };

  // Aplicar filtros a los turnos
  let turnosFiltrados = [...turnos];
  if (filtroTurno === "maniana") {
    turnosFiltrados = turnosFiltrados.filter((t) => {
      const h = new Date(t.inicio).getHours();
      return h >= 8 && h < 12;
    });
  } else if (filtroTurno === "tarde") {
    turnosFiltrados = turnosFiltrados.filter((t) => {
      const h = new Date(t.inicio).getHours();
      return h >= 12 && h <= 18;
    });
  }
  if (filtroEstado === "ocupados") {
    turnosFiltrados = turnosFiltrados.filter((t) => t.pacientes);
  } else if (filtroEstado === "libres") {
    turnosFiltrados = turnosFiltrados.filter((t) => !t.pacientes);
  }

  // Calcular estadísticas
  const totalTurnos = turnosFiltrados.length;
  const turnosOcupados = turnosFiltrados.filter(t => t.pacientes).length;
  const turnosLibres = totalTurnos - turnosOcupados;

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      {/* Header con info del profesional */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Agenda Diaria
            </h1>
            {userData && (
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                <span className="font-semibold">Dr. {userData.apellido} {userData.nombre}</span>
                {userData.rol && <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full ml-2">{userData.rol}</span>}
              </p>
            )}
          </div>
          
          {/* Botón Hoy */}
          <button
            onClick={irAHoy}
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg 
                     hover:from-orange-500 hover:to-yellow-500 shadow-md transform transition-all 
                     duration-200 hover:scale-[1.02] active:scale-[0.98] font-semibold"
          >
            Ir a Hoy
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto">
        {/* Navegación de fechas */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6 border border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => cambiarDia(-1)}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 
                       hover:shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-center flex-1">
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {formatearFecha(fechaActual)}
              </h2>
              {fechaActual === new Date().toISOString().split("T")[0] && (
                <span className="text-sm text-orange-500 font-medium">Hoy</span>
              )}
            </div>

            <button
              onClick={() => cambiarDia(1)}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 
                       hover:shadow-md active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Filtros y estadísticas */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-gray-700">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Calendario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                Fecha
              </label>
              <input
                type="date"
                value={fechaActual}
                onChange={(e) => setFechaActual(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                Horario
              </label>
              <select
                value={filtroTurno}
                onChange={(e) => setFiltroTurno(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              >
                <option value="todos">Todos los horarios</option>
                <option value="maniana">Mañana (8:00 - 12:00)</option>
                <option value="tarde">Tarde (12:00 - 18:00)</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                         focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              >
                <option value="todos">Todos los estados</option>
                <option value="ocupados">Ocupados</option>
                <option value="libres">Disponibles</option>
              </select>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{totalTurnos}</p>
              <p className="text-sm text-gray-600">Total turnos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{turnosOcupados}</p>
              <p className="text-sm text-gray-600">Ocupados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{turnosLibres}</p>
              <p className="text-sm text-gray-600">Disponibles</p>
            </div>
          </div>
        </div>

        {/* Lista de turnos */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Turnos del día
          </h3>

          {isLoadingTurnos ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando turnos...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {turnosFiltrados.length > 0 ? (
                turnosFiltrados.map((turno) => {
                  const ocupado = !!turno.pacientes;
                  const colorGradient = getEstadoColor(turno.estado, ocupado);
                  const horaFin = turno.fin || (() => {
                    const inicio = new Date(turno.inicio);
                    inicio.setMinutes(inicio.getMinutes() + 30);
                    return inicio.toISOString();
                  })();
                  
                  return (
                    <div
                      key={turno.turno_id}
                      onClick={() => setTurnoSeleccionado(turno)}
                      className={`p-4 rounded-lg bg-gradient-to-r ${colorGradient} text-white shadow-sm 
                               hover:shadow-lg transform transition-all duration-200 hover:scale-[1.01] 
                               cursor-pointer`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="bg-white/20 rounded-lg p-2">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">
                              {formatearHora(turno.inicio)} - {formatearHora(horaFin)}
                            </p>
                            {ocupado ? (
                              <div>
                                <p className="font-semibold">
                                  {turno.pacientes?.apellido}, {turno.pacientes?.nombre}
                                </p>
                                {turno.pacientes?.documento && (
                                  <p className="text-sm opacity-90">
                                    DNI: {turno.pacientes.documento}
                                  </p>
                                )}
                                {turno.obras_sociales && (
                                  <p className="text-sm opacity-90">
                                    {turno.obras_sociales.nombre}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="font-medium opacity-90">
                                Turno disponible
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {ocupado && (
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                              {getEstadoLabel(turno.estado)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No hay turnos programados para esta fecha
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Intenta seleccionar otra fecha o ajustar los filtros
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {turnoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {/* Header del modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Detalle del Turno
              </h3>
              <button
                onClick={() => setTurnoSeleccionado(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Horario</p>
                <p className="font-bold text-lg text-gray-800">
                  {formatearHora(turnoSeleccionado.inicio)}
                  {turnoSeleccionado.fin && ` - ${formatearHora(turnoSeleccionado.fin)}`}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Paciente</p>
                <p className="font-semibold text-gray-800">
                  {turnoSeleccionado.pacientes ? (
                    <>
                      {turnoSeleccionado.pacientes.apellido}, {turnoSeleccionado.pacientes.nombre}
                      {turnoSeleccionado.pacientes.documento && (
                        <span className="text-gray-600 text-sm ml-2">
                          (DNI: {turnoSeleccionado.pacientes.documento})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-green-500">Disponible</span>
                  )}
                </p>
              </div>

              {turnoSeleccionado.obras_sociales && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Obra Social</p>
                  <p className="font-semibold text-gray-800">
                    {turnoSeleccionado.obras_sociales.nombre}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium
                              bg-gradient-to-r ${getEstadoColor(turnoSeleccionado.estado, !!turnoSeleccionado.pacientes)}`}>
                  {getEstadoLabel(turnoSeleccionado.estado)}
                </span>
              </div>

              {turnoSeleccionado.profesionales && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Profesional</p>
                  <p className="font-semibold text-gray-800">
                    Dr. {turnoSeleccionado.profesionales.usuarios.apellido}{" "}
                    {turnoSeleccionado.profesionales.usuarios.nombre}
                  </p>
                  {turnoSeleccionado.profesionales.profesiones && (
                    <p className="text-sm text-gray-600">
                      {turnoSeleccionado.profesionales.profesiones.nombre}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Botón cerrar */}
            <div className="mt-6">
              <button
                onClick={() => setTurnoSeleccionado(null)}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white 
                         rounded-lg hover:from-orange-500 hover:to-yellow-500 font-semibold 
                         transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
