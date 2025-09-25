"use client";

import React, { useState, useEffect } from "react";

// Definición de la clase "Turno"
type Turno = {
  id: number;
  // Dentro del turno tengo los datos del profesional
  profesionales: {
    nombre: string;
    apellido: string;
    profesion: string;
  };
  // Y los datos del paciente
  pacientes: {
    nombre: string;
    apellido: string;
    dni: string;
  };
  // Además de las fechas y hora de inicio y fin
  inicio: string;
  fin: string;
};

// Definición de la clase "Paciente"
type Paciente = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
};

// Definición de la clase "Profesional"
type Profesional = {
  id: number;
  nombre: string;
  apellido: string;
  profesion: string;
};

export default function TurnosPage() {
  // Definición de "variables" (estados locales que usan useState de NextJS)
  // Estado de control de apertura y cierre del modal
  const [isOpen, setIsOpen] = useState(false);
  // Estados de array para llenar las opciones del Select
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  // Estados para guardar los valores del formulario de registro de turno
  const [pacienteId, setPacienteId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  // Estado para el control del loader del registro de turno
  const [isLoading, setIsLoading] = useState(false);
  // Estado para mostrar el mensaje de éxito en el modal del formulario
  const [successMessage, setSuccessMessage] = useState("");
  // Estados para visualizar los turnos
  const [isLoadingTurnos, setIsLoadingTurnos] = useState(true);
  const [turnos, setTurnos] = useState<Turno[]>([]);

  // Efecto de NextJS para ejecutar llamadas a las API
  useEffect(() => {
    // Cargar pacientes
    fetch("/api/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data));

    // Cargar profesionales
    fetch("/api/profesionales")
      .then((res) => res.json())
      .then((data) => setProfesionales(data));
  }, []); // En este caso no lo uso pero yo podría haber agregado aqui un "estado" (definidos arriba) para que el código dentro de este Effect se ejecute cada vez que cambie el valor
  // Por ejemplo, si tuviese [isOpen], cada vez que modifico el valor de ese estado con setIsOpen() se ejecutaría el código de adentro

  // Handler del evento de hacer submit del formualrio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Omito el comportamiento por defecto del submit
    setIsLoading(true); // Activo el loader
    setSuccessMessage(""); // Borro cualquier mensaje de éxito

    // Defino el "payload" que voy a enviar el post endpoint
    const nuevoTurno = {
      profesional_id: profesionalId,
      paciente_id: pacienteId,
      fecha, // Esto es lo mismo que poner fecha: fecha,
      hora,
    };

    try {
      const res = await fetch("/api/turnos", { // Defino el endpoint donde voy a hacer el POST
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoTurno), // Paso en JSON el payload que arme previamente
      });

      // Si ocurrió algún error en el backend
      if (!res.ok) {
        throw new Error("Error al guardar el turno");
      }

      // Obtengo el json del resultado
      const data = await res.json();

      // Muestro mensaje de éxito
      setSuccessMessage("✅ Turno guardado correctamente");

      // Reiniciar los campos del formulario
      setPacienteId("");
      setProfesionalId("");
      setFecha("");
      setHora("");

      // Actualizar listado de turnos
      await cargarTurnos();

      // Cerrar modal después de un tiempo (1500 = 1,5 sec)
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(""); // También borro el mensaje de éxito al cerrar el modal
      }, 1500);
    } catch (error) {
      // Esto se debería cambiar por un mensaje de error personalizado
      console.error(error);
      alert("❌ No se pudo guardar el turno");
    } finally {
      setIsLoading(false);
    }
  };

  // Función que se encarga de obtener los turnos desde la api
  const cargarTurnos = async () => {
    // Mostrar un loader
    setIsLoadingTurnos(true);
    try {
      // Obtener turnos desde la api
      const res = await fetch("/api/turnos");
      // Convertir el resultado a json
      const data = await res.json();

      // Ordenar por fecha y hora
      data.sort(
        (a: Turno, b: Turno) =>
          new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
      );

      // Setear el estado "turnos" con los resultados del get a la api de turnos
      setTurnos(data);
    } catch (error) {
      console.error("Error cargando turnos", error);
      alert("❌ Error al cargar los turnos");
    } finally {
      // Ocultar el loader
      setIsLoadingTurnos(false);
    }
  };

  // Efecto para cargar los turnos al ingresar a la página
  useEffect(() => {
    cargarTurnos();
  }, []);

  // 📅 Funciones para calcular la semana actual
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay(); // 0=Dom, 1=Lun...
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // que empiece en Lunes
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

  // Y por último los elementos los elementos html de la vista 
  return (
    <div className="p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"> 
        Turnos
      </h1>

      {/* Botón abrir modal */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        Agregar turno
      </button>

      {/* Loader mientras carga turnos */}
      {isLoadingTurnos ? (
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          Cargando turnos...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4 mt-6">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            >
              <h3 className="font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
                {day.toLocaleDateString("es-AR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </h3>
              <div className="space-y-2">
                {turnosPorDia(day).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">
                    Sin turnos
                  </p>
                ) : (
                  turnosPorDia(day).map((t) => {
                    const inicio = new Date(t.inicio);
                    const fin = new Date(t.fin);
                    return (
                      <div
                        key={t.id}
                        className="p-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-sm"
                      >
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {t.profesionales.apellido} {t.profesionales.nombre}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Paciente: {t.pacientes.apellido} {t.pacientes.nombre}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {inicio.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {fin.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal (sólo visible cuando el estado isOpen es true) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Nuevo Turno
            </h2>

            {/* handleSubmit es el handler que va a ejecutar el post a la api */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Paciente */}
              <div>
                <label className="block text-sm font-medium mb-1">Paciente</label>
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)} // Cuando se cambia el valor se actualiza el estado "pacienteId"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  required
                >
                  <option value="">Seleccione un paciente</option>
                  {/* Utilizo el estado pacientes que se carga en el useEffect */}
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.apellido} {p.nombre} ({p.dni})
                    </option>
                  ))}
                </select>
              </div>

              {/* Profesional */}
              <div>
                <label className="block text-sm font-medium mb-1">Profesional</label>
                <select
                  value={profesionalId}
                  onChange={(e) => setProfesionalId(e.target.value)} // Cuando se cambia el valor se actualiza el estado "profesionalId"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  required
                >
                  <option value="">Seleccione un profesional</option>
                  {/* Utilizo el estado profesionales que se carga en el useEffect */}
                  {profesionales.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.apellido} {pr.nombre} ({pr.profesion})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)} // Cuando se cambia el valor se actualiza el estado "fecha"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium mb-1">Hora</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)} // Cuando se cambia el valor se actualiza el estado "hora"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              {/* Mensaje de éxito (sólo visible cuando exista algún mensaje) */}
              {successMessage && (
                <p className="text-green-600 dark:text-green-400 text-sm">
                  {successMessage}
                </p>
              )}

              {/* Botones del modal*/}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit" // Al hacer el botón de tipo submit, este accione el evento submit del formulario
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                  ) : (
                    "Guardar"
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