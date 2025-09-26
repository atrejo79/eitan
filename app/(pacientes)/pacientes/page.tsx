'use client';

import React, { useEffect, useState } from 'react';

/** ---------------- helpers para DOB ---------------- */
const HOY = new Date();
const MAX_YEAR = HOY.getFullYear();
const MIN_YEAR = MAX_YEAR - 120;

function diasEnMes(year: number, month1a12: number) {
  return new Date(year, month1a12, 0).getDate();
}

// formatea lo tipeado a "DD/MM/AAAA"
function toSlashedDDMMYYYY(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8); // solo números, máx 8
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// valida y devuelve ISO "YYYY-MM-DD" aceptando "/" o espacio como separador
function parseDDMMYYYY(raw: string): { iso?: string; error?: string } {
  const m = raw.match(/^(\d{2})[\/\s](\d{2})[\/\s](\d{4})$/);
  if (!m) return {};
  const dd = Number(m[1]), mm = Number(m[2]), yy = Number(m[3]);
  if (yy < MIN_YEAR || yy > MAX_YEAR || mm < 1 || mm > 12) return { error: 'Fecha inválida' };
  const maxDia = diasEnMes(yy, mm);
  if (dd < 1 || dd > maxDia) return { error: 'Fecha inválida' };
  const date = new Date(Date.UTC(yy, mm - 1, dd));
  if (date > HOY) return { error: 'No puede ser futura' };
  return { iso: `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` };
}

/** ---------------- tipos ---------------- */
type Form = {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  obra_social_id: number | null;
};

type ObraSocial = {
  obra_social_id: number;
  nombre: string;
};

export default function RegistrarPacientePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [obras, setObras] = useState<ObraSocial[]>([]);

  const [form, setForm] = useState<Form>({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    obra_social_id: null,
  });

  // estado del input crudo "DD MM AAAA"
  const [dobRaw, setDobRaw] = useState('');
  const [dobError, setDobError] = useState('');

  // cargar obras sociales cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const res = await fetch('/api/obras_sociales', { cache: 'no-store' });
      if (!res.ok) {
        console.error('No se pudo obtener obras sociales');
        return;
      }
      const json = await res.json();
      const items: ObraSocial[] = Array.isArray(json) ? json : (json.items ?? []);
      setObras(items);
    })();
  }, [isOpen]);

  const onChange =
    (name: keyof Form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let value: any = e.target.value;
        if (name === 'obra_social_id') value = value ? Number(value) : null;
        setForm(f => ({ ...f, [name]: value }));
      };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const payload = {
        ...form,
        fecha_nacimiento: form.fecha_nacimiento || null,
        obra_social_id: form.obra_social_id ?? null,
      };

      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar');

      setSuccessMessage('✅ Paciente guardado correctamente');

      // reset
      setForm({
        nombre: '',
        apellido: '',
        documento: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        obra_social_id: null,
      });
      setDobRaw('');
      setDobError('');

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
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        Agregar paciente
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Registrar paciente</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Nombre</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={onChange('nombre')}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Apellido</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={onChange('apellido')}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Documento</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Documento"
                  value={form.documento}
                  onChange={onChange('documento')}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange('email')}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Telefono</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={onChange('telefono')}
                  required
                />
              </div>

              <div>
                <label className="text-sm">Obra social</label>
                <select
                  className="w-full p-2 border rounded"
                  value={form.obra_social_id ?? ''}
                  onChange={onChange('obra_social_id')}
                >
                  {obras.map(o => (
                    <option key={o.obra_social_id} value={o.obra_social_id}>
                      {o.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm">Fecha de nacimiento</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="DD/MM/AAAA"
                  inputMode="numeric"
                  value={dobRaw}
                  onChange={(e) => {
                    const v = toSlashedDDMMYYYY(e.target.value);
                    setDobRaw(v);
                    const { iso, error } = parseDDMMYYYY(v);
                    setDobError(error ?? '');
                    setForm(f => ({ ...f, fecha_nacimiento: iso ?? '' }));
                  }}
                  onBlur={() => {
                    if (dobRaw && !parseDDMMYYYY(dobRaw).iso) setDobError('Fecha inválida');
                  }}
                />
              </div>


              {successMessage && (
                <p className="md:col-span-2 text-green-600 text-sm">{successMessage}</p>
              )}

              <div className="md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 flex items-center gap-2"
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
