'use client';

import React, { useEffect, useState } from 'react';

// Íconos SVG personalizados
const UserPlus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="6" x2="20" y2="12"></line>
    <line x1="17" y1="9" x2="23" y2="9"></line>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
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

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
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

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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
    
    // Validar fecha antes de enviar
    if (dobRaw && dobError) {
      return;
    }
    
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

      setSuccessMessage('Paciente registrado correctamente');

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
      }, 1500);
    } catch (err: any) {
      alert('Error: ' + (err?.message ?? 'Error inesperado'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gestión de Pacientes
        </h1>
        <p className="text-gray-600">Administra la información de los pacientes del consultorio</p>
      </div>

      {/* Botón agregar paciente */}
      <button
        className="mb-6 px-6 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg 
                   hover:from-orange-500 hover:to-yellow-500 shadow-lg transform transition-all duration-200 
                   hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus className="w-5 h-5" />
        Registrar Nuevo Paciente
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                Registrar Nuevo Paciente
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="Ingrese el nombre"
                      value={form.nombre}
                      onChange={onChange('nombre')}
                      required
                    />
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="Ingrese el apellido"
                      value={form.apellido}
                      onChange={onChange('apellido')}
                      required
                    />
                  </div>

                  {/* Documento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-400" />
                      Documento *
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="DNI sin puntos"
                      value={form.documento}
                      onChange={onChange('documento')}
                      required
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      Fecha de Nacimiento
                    </label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200
                               ${dobError ? 'border-red-500' : 'border-gray-300'}`}
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
                    {dobError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {dobError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-400" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-400" />
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="correo@ejemplo.com"
                      value={form.email}
                      onChange={onChange('email')}
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      Teléfono *
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                      placeholder="Número de teléfono"
                      value={form.telefono}
                      onChange={onChange('telefono')}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Obra Social */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Cobertura Médica
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Obra Social
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                             focus:ring-orange-400 focus:border-transparent transition-all duration-200
                             appearance-none bg-white"
                    value={form.obra_social_id ?? ''}
                    onChange={onChange('obra_social_id')}
                  >
                    <option value="">Seleccione una obra social</option>
                    {obras.map(o => (
                      <option key={o.obra_social_id} value={o.obra_social_id}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mensaje de éxito */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
              )}

              {/* Nota informativa */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-700">
                  * Los campos marcados con asterisco son obligatorios
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                  disabled={isLoading || (!!dobRaw && !!dobError)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white 
                           rounded-lg hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 
                           disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 
                           transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Registrar Paciente
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