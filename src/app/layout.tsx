// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css'; // Importa tus estilos globales

// Configuración de Font Awesome
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Importa los Providers
// ASEGÚRATE DE QUE LA RUTA A TUS PROVIDERS SEA CORRECTA
// Ejemplo: si están en src/contexts/
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { AppStateProvider } from '@/contexts/AppStateProvider';

// Importa los componentes de Layout
// ASEGÚRATE DE QUE LA RUTA A TUS COMPONENTES DE LAYOUT SEA CORRECTA
// Ejemplo: si están en src/components/Layout/
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import Header from '@/components/Layout/Header';
// Ejemplo: si ThemeToggle está directamente en src/components/
import ThemeToggle from '@/components/ThemeToggle';


library.add(fas); // Añade todos los iconos sólidos
fontAwesomeConfig.autoAddCss = false;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MediLongevity AI Assistant',
  description: 'Asistente de IA para medicina de longevidad y anti-envejecimiento',
  icons: { icon: '/favicon.ico' },
};

interface UserProps {
  name: string;
  role: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mockUser: UserProps = {
    name: "Dr. Juan Carlos Mendez",
    role: "Medico Antienvejecimiento"
  };

  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* Los Providers deben envolver la lógica que depende de ellos */}
        <ThemeProvider>
          <AppStateProvider>
            <div className="flex min-h-screen bg-light-bg dark:bg-dark-bg">
              {/* Sidebar necesita 'use client' y consumir AppStateProvider */}
              <Sidebar user={mockUser} />

              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header puede necesitar 'use client' */}
                <Header />
                {/* MainContent necesita 'use client' y consumir AppStateProvider */}
                <MainContent>
                  {children}
                </MainContent>
              </div>

              {/* ThemeToggle necesita 'use client' y consumir ThemeProvider */}
              <ThemeToggle />
            </div>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}