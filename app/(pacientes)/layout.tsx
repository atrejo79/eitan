import ReceptionSidebarLayout from '../../components/SidebarLayout';

export default function PacientesLayout({ children }: { children: React.ReactNode }) {
  return <ReceptionSidebarLayout>{children}</ReceptionSidebarLayout>;
}