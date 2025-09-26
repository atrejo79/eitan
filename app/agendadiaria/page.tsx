"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type EstadoTurno = "reservado" | "confirmado" | "cancelado" | "no_show" | "atendido";

type Turno = {
  turno_id: number;
  inicio: string;
  estado: EstadoTurno;
  pacientes?: { nombre: string } | null;
  profesionales?: { usuarios: { nombre: string; apellido: string } };
};

type Profesional = {
  profesional_id: number;
  usuarios: { nombre: string; apellido: string };
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

export default function AgendaDiariaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 👉 Estados iniciales leídos desde la URL
  const [profesionalId, setProfesionalId] = useState<number | null>(() => {
    const v = searchParams.get("profesional_id");
    return v ? Number(v) : null;
  });
  const [fechaActual, setFechaActual] = useState<string>(() => {
    return searchParams.get("fecha") || new Date().toISOString().split("T")[0];
  });
  const [filtroTurno, setFiltroTurno] = useState<"todos" | "maniana" | "tarde">(
    (searchParams.get("horario") as any) || "todos"
  );
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "ocupados" | "libres">(
    (searchParams.get("estado") as any) || "todos"
  );

  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);

  // 📡 cargar profesionales
  useEffect(() => {
    fetch("/api/profesionales")
      .then((res) => res.json())
      .then((data) => setProfesionales(data));
  }, []);

  // 📡 cargar turnos del profesional + fecha
  useEffect(() => {
    if (!profesionalId) return;
    fetch(`/api/agendadiaria?profesional_id=${profesionalId}&fecha=${fechaActual}`)
      .then((res) => res.json())
      .then((data) => setTurnos(data));
  }, [profesionalId, fechaActual]);

  // 🔗 sincronizar URL cuando cambien los filtros clave
  useEffect(() => {
    const params = new URLSearchParams();
    if (profesionalId) params.set("profesional_id", profesionalId.toString());
    if (fechaActual) params.set("fecha", fechaActual);
    if (filtroTurno && filtroTurno !== "todos") params.set("horario", filtroTurno);
    if (filtroEstado && filtroEstado !== "todos") params.set("estado", filtroEstado);
    router.replace(`?${params.toString()}`);
  }, [profesionalId, fechaActual, filtroTurno, filtroEstado, router]);

  // 🔄 cambiar día con botones
  const cambiarDia = (dias: number) => {
    const fecha = new Date(`${fechaActual}T00:00:00`);
    fecha.setDate(fecha.getDate() + dias);
    setFechaActual(fecha.toISOString().split("T")[0]);
  };

  // 🔎 aplicar filtros a los turnos
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

  return (
    <main className="p-6 min-h-screen bg-gray-900 text-gray-100">
      {/* Selector de profesional fuera del bloque */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Profesional
        </label>
        <select
          className="bg-gray-800 px-4 py-2 rounded text-sm w-72"
          value={profesionalId ?? ""}
          onChange={(e) => setProfesionalId(Number(e.target.value))}
        >
          <option value="">Seleccione un profesional</option>
          {profesionales.map((p) => (
            <option key={p.profesional_id} value={p.profesional_id}>
              {p.usuarios.nombre} {p.usuarios.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* Bloque principal */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Agenda diaria
        </h1>

        {/* Navegación entre días + título fecha */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <button
            onClick={() => cambiarDia(-1)}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition text-sm"
          >
            ⬅ Día anterior
          </button>

          <h2 className="text-base font-semibold capitalize text-center">
            {formatearFecha(fechaActual)}
          </h2>

          <button
            onClick={() => cambiarDia(1)}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition text-sm"
          >
            Día siguiente ➡
          </button>
        </div>

        {/* Filtros en una sola fila */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="flex flex-col flex-1">
            <label className="block text-xs text-gray-400 mb-1">Calendario</label>
            <input
              type="date"
              value={fechaActual}
              onChange={(e) => setFechaActual(e.target.value)}
              className="bg-gray-700 px-3 py-2 rounded text-sm"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="block text-xs text-gray-400 mb-1">Horario</label>
            <select
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value as any)}
              className="bg-gray-700 px-3 py-2 rounded text-sm"
            >
              <option value="todos">Todos</option>
              <option value="maniana">Mañana (8–12)</option>
              <option value="tarde">Tarde (12–18)</option>
            </select>
          </div>

          <div className="flex flex-col flex-1">
            <label className="block text-xs text-gray-400 mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="bg-gray-700 px-3 py-2 rounded text-sm"
            >
              <option value="todos">Todos</option>
              <option value="ocupados">Ocupados</option>
              <option value="libres">Disponibles</option>
            </select>
          </div>
        </div>

        {/* Lista de turnos */}
        <div className="space-y-3">
          {turnosFiltrados.length > 0 ? (
            turnosFiltrados.map((turno) => {
              const ocupado = !!turno.pacientes;
              return (
                <div
                  key={turno.turno_id}
                  onClick={() => setTurnoSeleccionado(turno)}
                  className={`flex justify-between items-center p-4 rounded-lg shadow text-sm cursor-pointer
                    bg-gray-700 hover:bg-gray-600 transition 
                    border-l-4 ${
                      ocupado ? "border-blue-400" : "border-green-500"
                    }`}
                >
                  <div className="font-bold text-base w-20 text-blue-300">
                    {formatearHora(turno.inicio)}
                  </div>
                  <div className="flex-1 ml-3">
                    {ocupado ? (
                      <p className="font-semibold">{turno.pacientes?.nombre}</p>
                    ) : (
                      <p className="italic text-gray-400">Disponible</p>
                    )}
                  </div>
                  {ocupado && (
                    <span className="text-xs italic text-gray-400">
                      {turno.estado}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-400">
              No hay turnos en esta fecha.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {turnoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-xl border border-gray-700">
            <h3 className="text-lg font-bold text-blue-400 mb-4">
              Detalle del turno
            </h3>
            <p>
              <span className="font-semibold">Hora:</span>{" "}
              {formatearHora(turnoSeleccionado.inicio)}
            </p>
            <p>
              <span className="font-semibold">Paciente:</span>{" "}
              {turnoSeleccionado.pacientes?.nombre ?? "Disponible"}
            </p>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {turnoSeleccionado.estado}
            </p>
            <p>
              <span className="font-semibold">Profesional:</span>{" "}
              {turnoSeleccionado.profesionales?.usuarios.nombre}{" "}
              {turnoSeleccionado.profesionales?.usuarios.apellido}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setTurnoSeleccionado(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm"
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
