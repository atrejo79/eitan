"use client";

import React, { useState, useEffect } from "react";

// Íconos SVG personalizados
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Stethoscope = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H2a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2H7a.3.3 0 1 0 .2.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Definición de tipos
type Turno = {
  turno_id: number;
  profesionales: {
    matricula: string;
    usuarios: {
      nombre: string;
      apellido: string;
    },
    profesiones: {
      nombre: string;
    }
  };
  pacientes: {
    nombre: string;
    apellido: string;
    documento: string;
  };
  inicio: string;
  fin: string;
};

type Paciente = {
  paciente_id: number;
  nombre: string;
  apellido: string;
  documento: string;
};

type Profesional = {
  profesional_id: number;
  matricula: string;
  usuarios: {
    nombre: string;
    apellido: string;
  },
  profesiones: {
    nombre: string;
  }
};

export default function TurnosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [turnos, setTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data));

    fetch("/api/profesionales")
      .then((res) => res.json())
      .then((data) => setProfesionales(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    const nuevoTurno = {
      profesional_id: profesionalId,
      paciente_id: pacienteId,
      fecha,
      hora,
    };

    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoTurno),
      });

      if (!res.ok) {
        throw new Error("Error al guardar el turno");
      }

      const data = await res.json();
      setSuccessMessage("Turno guardado correctamente");

      setPacienteId("");
      setProfesionalId("");
      setFecha("");
      setHora("");

      await cargarTurnos();

      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el turno");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarTurnos = async () => {
    setIsLoadingTurnos(true);
    try {
      const res = await fetch("/api/turnos");
      const data = await res.json();

      data.sort(
        (a: Turno, b: Turno) =>
          new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
      );

      setTurnos(data);
    } catch (error) {
      console.error("Error cargando turnos", error);
      alert("Error al cargar los turnos");
    } finally {
      setIsLoadingTurnos(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date());
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const turnosPorDia = (day: Date) => {
    return turnos
      .filter((t) => {
        const inicio = new Date(t.inicio);
        return (
          inicio.getFullYear() === day.getFullYear() &&
          inicio.getMonth() === day.getMonth() &&
          inicio.getDate() === day.getDate()
        );
      })
      .sort(
        (a, b) =>
          new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
      );
  };

  // Función para obtener color según la profesión
  const getColorByProfession = (profesion: string) => {
    const colors: { [key: string]: string } = {
      'Médico': 'from-blue-400 to-blue-500',
      'Enfermero': 'from-green-400 to-green-500',
      'Odontólogo': 'from-purple-400 to-purple-500',
      'Psicólogo': 'from-pink-400 to-pink-500',
      'Nutricionista': 'from-yellow-400 to-yellow-500',
      'default': 'from-orange-400 to-yellow-400'
    };
    return colors[profesion] || colors['default'];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Calendario de turnos
        </h1>
        <p className="text-gray-600">Visualizacion de los turnos médicos del consultorio</p>
      </div>

      {/* Botón agregar turno */}
      <button
        className="mb-6 px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg 
                   hover:from-orange-500 hover:to-yellow-500 shadow-lg transform transition-all duration-200 
                   hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-5 h-5" />
        Agregar Nuevo Turno
      </button>

      {/* Calendario de turnos */}
      {isLoadingTurnos ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando turnos...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {daysOfWeek.map((day, idx) => {
            const isToday = new Date().toDateString() === day.toDateString();
            const turnosDelDia = turnosPorDia(day);
            
            return (
              <div
                key={idx}
                className={`border rounded-xl p-3 transition-all duration-200 ${
                  isToday 
                    ? 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300 shadow-lg' 
                    : 'bg-white hover:shadow-md border-gray-200'
                }`}
              >
                <div className="mb-3 text-center">
                  <h3 className={`font-bold ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>
                    {day.toLocaleDateString("es-AR", { weekday: "short" })}
                  </h3>
                  <p className={`text-2xl font-bold ${isToday ? 'text-orange-500' : 'text-gray-800'}`}>
                    {day.getDate()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day.toLocaleDateString("es-AR", { month: "short" })}
                  </p>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {turnosDelDia.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4">
                      Sin turnos
                    </p>
                  ) : (
                    turnosDelDia.map((t) => {
                      const inicio = new Date(t.inicio);
                      const fin = new Date(t.fin);
                      const colorGradient = getColorByProfession(t.profesionales.profesiones.nombre);
                      
                      return (
                        <div
                          key={t.turno_id}
                          className={`p-2 rounded-lg bg-gradient-to-r ${colorGradient} text-white shadow-sm 
                                    hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <p className="text-xs font-semibold">
                              {inicio.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {" - "}
                              {fin.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          
                          <p className="text-xs font-bold truncate">
                            Dr. {t.profesionales.usuarios.apellido}
                          </p>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            <p className="text-xs truncate opacity-90">
                              {t.pacientes.apellido} {t.pacientes.nombre}
                            </p>
                          </div>
                          
                          <p className="text-xs opacity-75 mt-1">
                            {t.profesionales.profesiones.nombre}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {/* Header del modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Nuevo Turno
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Paciente */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-400" />
                  Paciente
                </label>
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 
                           focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="" disabled hidden>Seleccione un paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.paciente_id} value={p.paciente_id}>
                      {p.apellido} {p.nombre} - DNI: {p.documento}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profesional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-orange-400" />
                  Profesional
                </label>
                <select
                  value={profesionalId}
                  onChange={(e) => setProfesionalId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 
                           focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Seleccione un profesional</option>
                  {profesionales.map((pr) => (
                    <option key={pr.profesional_id} value={pr.profesional_id}>
                      Dr. {pr.usuarios.apellido} {pr.usuarios.nombre} - {pr.profesiones.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora en la misma línea */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 
                             focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Hora */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Hora
                  </label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 
                             focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Mensaje de éxito */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">✓ {successMessage}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                           disabled:opacity-50 font-semibold transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r text-gray-700 from-orange-400 to-yellow-400 text-white 
                           rounded-lg hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 
                           font-semibold flex items-center justify-center gap-2 transform transition-all 
                           duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Guardar Turno
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}