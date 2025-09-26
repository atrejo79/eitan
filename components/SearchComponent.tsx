"use client";

import { useState } from "react";

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
  const [busquedaTipo, setBusquedaTipo] = useState<"documento" | "apellido">(
    "documento"
  );
  const [busquedaValor, setBusquedaValor] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [askCreate, setAskCreate] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  );

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
    if (!busquedaValor) return alert("Ingrese valor de búsqueda.");

    // Validaciones según tipo de búsqueda
    if (busquedaTipo === "documento" && !/^\d{8}$/.test(busquedaValor)) {
      return alert("Documento inválido. Debe tener 8 dígitos.");
    }

    if (busquedaTipo === "apellido") {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(busquedaValor)) {
        return alert("Apellido inválido. Solo letras permitidas.");
      }
      setBusquedaValor(
        busquedaValor.charAt(0).toUpperCase() + busquedaValor.slice(1).toLowerCase()
      );
    }

    setLoading(true);
    try {
      const query =
        busquedaTipo === "documento"
          ? `documento=${busquedaValor}`
          : `apellido=${busquedaValor}`;
      const res = await fetch(`/api/buscar-pacientes?${query}`);
      const data: Paciente[] = await res.json();
      setPacientes(data);

      if (data.length === 0) {
        // Preguntar si desea crear ficha
        setAskCreate(true);
        setShowForm(false);
        setSelectedPaciente(null);
      } else if (data.length === 1) {
        // Mostrar paciente encontrado
        const p = data[0];
        setSelectedPaciente(p);
        setShowForm(false);
        setAskCreate(false);
      } else {
        // Varios pacientes
        setSelectedPaciente(null);
        setShowForm(false);
        setAskCreate(false);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearPaciente = async () => {
    // Validaciones frontend
    if (!nuevo.nombre.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)) {
      return alert("Nombre inválido (solo letras).");
    }
    if (!nuevo.apellido.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/)) {
      return alert("Apellido inválido (solo letras).");
    }
    if (!nuevo.documento.match(/^[0-9]{8}$/)) {
      return alert("Documento debe tener 8 dígitos.");
    }
    if (nuevo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevo.email)) {
      return alert("Email inválido.");
    }
    if (
      nuevo.telefono &&
      !/^\+?\d{7,15}$/.test(nuevo.telefono)
    ) {
      return alert(
        "Teléfono inválido (7-15 dígitos, opcional + al inicio)."
      );
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
        alert("Paciente creado con éxito.");
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

    // Autocompletado del formulario con valor buscado
    setNuevo((prev) => ({
      ...prev,
      documento: busquedaTipo === "documento" ? busquedaValor : prev.documento,
      apellido: busquedaTipo === "apellido" ? busquedaValor : prev.apellido,
    }));
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Buscar Paciente</h2>

      <div className="flex gap-2 mb-4 items-center">
        <select
          value={busquedaTipo}
          onChange={(e) => setBusquedaTipo(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="documento">Documento</option>
          <option value="apellido">Apellido</option>
        </select>
        <input
          type="text"
          value={busquedaValor}
          onChange={(e) => setBusquedaValor(e.target.value)}
          placeholder={
            busquedaTipo === "documento" ? "Número de documento" : "Apellido"
          }
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          onClick={buscarPacientes}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}

      {/* Lista desplegable si hay varios pacientes */}
      {pacientes.length > 1 && !selectedPaciente && (
        <div className="mb-4">
          <label className="font-bold mb-1 block">Seleccione paciente:</label>
          <select
            className="border px-2 py-1 rounded w-full"
            onChange={(e) => {
              const p = pacientes.find(
                (p, i) => p.id === Number(e.target.value) || i === Number(e.target.value)
              );
              setSelectedPaciente(p || null);
            }}
          >
            <option value="">-- Seleccione --</option>
            {pacientes.map((p, index) => (
              <option
                key={p.id ?? index}
                value={p.id ?? index}
              >
                {upperFirst(p.nombre)} {upperFirst(p.apellido)} - {p.documento}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mostrar datos del paciente seleccionado */}
      {selectedPaciente && (
        <div className="mb-4 p-2 border rounded bg-gray-50">
          <p>
            <strong>Nombre:</strong> {upperFirst(selectedPaciente.nombre)}
          </p>
          <p>
            <strong>Apellido:</strong> {upperFirst(selectedPaciente.apellido)}
          </p>
          <p>
            <strong>Documento:</strong> {selectedPaciente.documento}
          </p>
          <p>
            <strong>Email:</strong> {selectedPaciente.email || "-"}
          </p>
          <p>
            <strong>Teléfono:</strong> {selectedPaciente.telefono || "-"}
          </p>
          <p>
            <strong>Fecha Nacimiento:</strong>{" "}
            {selectedPaciente.fecha_nacimiento || "-"}
          </p>
          <p>
            <strong>Obra Social:</strong>{" "}
            {selectedPaciente.obra_social_id ?? "-"}
          </p>
        </div>
      )}

      {/* Preguntar si crear nueva ficha */}
      {askCreate && (
        <div className="mb-4 p-2 border rounded bg-yellow-100">
          <p>No se encontró el paciente. ¿Desea crear una nueva ficha?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={handleCreateYes}
            >
              Sí
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => setAskCreate(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Formulario para nuevo paciente */}
      {showForm && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Crear nueva ficha</h3>
          <div className="grid gap-2">
            <input
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) =>
                setNuevo({ ...nuevo, nombre: e.target.value })
              }
              className="border px-2 py-1 rounded"
              required
            />
            <input
              placeholder="Apellido"
              value={nuevo.apellido}
              onChange={(e) =>
                setNuevo({ ...nuevo, apellido: e.target.value })
              }
              className="border px-2 py-1 rounded"
              required
            />
            <input
              placeholder="Documento"
              value={nuevo.documento}
              onChange={(e) =>
                setNuevo({ ...nuevo, documento: e.target.value })
              }
              className="border px-2 py-1 rounded"
              required
            />
            <input
              placeholder="Email"
              value={nuevo.email}
              onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="Teléfono"
              value={nuevo.telefono}
              onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="Fecha de Nacimiento (AAAA/MM/DD)"
              value={nuevo.fecha_nacimiento}
              onChange={(e) =>
                setNuevo({ ...nuevo, fecha_nacimiento: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              placeholder="Obra Social (ID)"
              type="number"
              value={nuevo.obra_social_id ?? ""}
              onChange={(e) =>
                setNuevo({
                  ...nuevo,
                  obra_social_id: Number(e.target.value) || undefined,
                })
              }
              className="border px-2 py-1 rounded"
            />

            <button
              onClick={crearPaciente}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
              Crear Paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
