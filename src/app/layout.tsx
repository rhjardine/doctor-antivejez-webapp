// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppStateProvider } from '@/contexts/AppStateProvider';
import { PatientProvider } from '@/contexts/PatientProvider'; // Nuevo import
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Doctor Antivejez - Medicina Antienvejecimiento',
  description: 'Plataforma de medicina antienvejecimiento para profesionales de la salud',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AppStateProvider>
          <PatientProvider> {/* Nuevo provider */}
            <div className="flex min-h-screen bg-bg-light dark:bg-bg-dark">
              <Sidebar 
                user={{
                  name: 'Dr. Juan C. Mendez',
                  role: 'Médico Antienvejecimiento'
                }}
              />
              <MainContent>
                {children}
              </MainContent>
            </div>
          </PatientProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}