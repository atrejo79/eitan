'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Íconos SVG personalizados
const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Guardar info del usuario
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 🎯 AQUÍ SE HACE LA REDIRECCIÓN
        router.push(data.redirectPath);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Círculos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* Tarjeta de login */}
      <div className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/images/eitan-logo.png" 
                alt="EiTAN Logo" 
                className="w-12 h-12 object-contain filter brightness-0 invert"
              />
            </div>
          </div>
          <img 
            src="/images/eitan-text.png" 
            alt="EiTAN Salta" 
            className="h-10 object-contain mx-auto mb-2"
          />
          <p className="text-gray-500 text-sm font-medium">Sistema de Gestión Médica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo de email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                required
                className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
                         focus:border-transparent transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@eitansalta.com"
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 text-gray-700 rounded-lg shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
                         focus:border-transparent transition-all duration-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Recordar y olvidé contraseña */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Botón de ingreso */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white 
                     bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 
                     disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base
                     transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </div>
            ) : 'Ingresar al Sistema'}
          </button>
        </form>

        {/* Pie de página */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 EiTAN Salta - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}