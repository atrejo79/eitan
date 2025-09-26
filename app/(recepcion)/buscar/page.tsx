import SearchComponent from "../../../components/SearchComponent";

export const metadata = {
  title: "Buscar Paciente",
  description: "Buscar o crear pacientes en el sistema",
};

export default function BuscarPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Pacientes</h1>
      <div className="w-full max-w-lg">
        <SearchComponent />
      </div>
    </main>
  );
}
