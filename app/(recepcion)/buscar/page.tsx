import SearchComponent from "../../../components/SearchComponent";

export const metadata = {
  title: "Buscar Paciente - EiTAN Salta",
  description: "Buscar o crear pacientes en el sistema",
};

export default function BuscarPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      {/* Header principal más compacto */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
        </h1>
        <p className="text-gray-600">
          Búsqueda y registro de pacientes
        </p>
      </div>

      {/* Componente de búsqueda */}
      <SearchComponent />

      {/* Tips de ayuda más compactos */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200 max-w-3xl mx-auto">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Consejos rápidos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <p className="text-gray-700">
              Use DNI para búsquedas exactas, apellido para parciales
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <p className="text-gray-700">
              Ingrese documento sin puntos (7-8 dígitos)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <p className="text-gray-700">
              Presione Enter para buscar rápidamente
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span>
            <p className="text-gray-700">
              Campos con * son obligatorios al crear
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}