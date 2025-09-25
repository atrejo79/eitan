import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SidebarLayout from '../components/SidebarLayout'; // ¡Importa el nuevo componente!

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EiTAN Salta - Sistema de Gestión Médica',
  description: 'Sistema de Gestión Médica Inteligente para EiTAN Salta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
