'use client';

import React, { useState } from 'react';

// Definición de la clase Formulario Cliente
type Form = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
};

export default function RegistrarPacientePage() {
  const [isOpen, setIsOpen] = useState(false);     // abre/cierra modal
  const [isLoading, setIsLoading] = useState(false); // loader del botón
  const [successMessage, setSuccessMessage] = useState(''); // mensaje ✅
  const [form, setForm] = useState<Form>({
    nombre: '', apellido: '', dni: '', email: '', telefono: '',
  });

  const onChange = (name: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar');

      // ÉXITO: mensaje + limpiar formulario
      setSuccessMessage('✅ Paciente guardado correctamente');
      setForm({ nombre: '', apellido: '', dni: '', email: '', telefono: '' });

      // Cerrar el modal
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage('');
      }, 1200);
    } catch (err: any) {
      alert('❌ ' + (err?.message ?? 'Error inesperado'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Pacientes
      </h1>

      {/* Botón para abrir el modal */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        Agregar paciente
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Registrar paciente
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={onChange('nombre')}
                  required
                />
              </div>
              <div>
                <input
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={onChange('apellido')}
                  required
                />
              </div>
              <div>
                <input
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="DNI"
                  value={form.dni}
                  onChange={onChange('dni')}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange('email')}
                  required
                />
              </div>
              <div>
                <input
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={onChange('telefono')}
                  required
                />
              </div>

              {successMessage && (
                <p className="text-green-600 dark:text-green-400 text-sm">
                  {successMessage}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  ) : (
                    'Guardar'
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
