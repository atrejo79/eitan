'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrarPacientePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', email: '', telefono: ''
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg('❌ ' + (data?.error ?? 'No se pudo guardar'));
        return;
      }

      // (opcional) si querés refrescar listas del lado servidor:
      router.refresh();

      // ir siempre a /pacientes (mejor replace para no dejar el form en el historial)
      router.replace('/pacientes');
      return;

      // volver a la página anterior si existe y es del mismo origen; si no, ir al Home
      const sameOrigin =
        typeof document !== 'undefined' &&
        document.referrer?.startsWith(window.location.origin);

      setTimeout(() => {
        if (sameOrigin) router.back();
        else router.push('/');
      }, 400); // deja ver el mensaje un instante
    } catch {
      setMsg('❌ Error de red/servidor');
    } finally {
      setLoading(false);
    }
  }

  const i = (p: any) => (
    <input
      className="border p-2 rounded"
      required
      {...p}
      onChange={(e: any) => setForm((f) => ({ ...f, [p.name]: e.target.value }))}
    />
  );

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-4">Registrar paciente</h1>
      <form onSubmit={onSubmit} className="grid gap-5">
        {i({ name: 'nombre', placeholder: 'Nombre', value: form.nombre, autoComplete: 'given-name' })}
        {i({ name: 'apellido', placeholder: 'Apellido', value: form.apellido, autoComplete: 'family-name' })}
        {i({ name: 'dni', placeholder: 'DNI', value: form.dni })}
        {i({ name: 'email', placeholder: 'Email', value: form.email, type: 'email', autoComplete: 'email' })}
        {i({ name: 'telefono', placeholder: 'Teléfono', value: form.telefono, autoComplete: 'tel' })}
        <button className="border rounded p-2" type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}