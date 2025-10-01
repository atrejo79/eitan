import NavbarProfesional from '@/components/NavBarProfesional';

export default function ProfesionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarProfesional />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}