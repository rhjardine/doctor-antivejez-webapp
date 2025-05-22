// src/app/layout.tsx 
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

// Configuración de Font Awesome 
import { config as fontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Importa los Providers 
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { AppStateProvider } from '@/contexts/AppStateProvider';

// Importa los componentes de Layout 
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import Header from '@/components/Layout/Header';
import ThemeToggle from '@/components/ThemeToggle';

library.add(fas);
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
        <ThemeProvider>
          <AppStateProvider>
            <div className="flex min-h-screen bg-bg-page-light dark:bg-dark-bg"> {/* Contenedor Flex Principal */}
              <Sidebar user={mockUser} />
              {/* Este div debe tomar el espacio restante */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <MainContent> {/* MainContent no tiene padding propio */}
                  {children}
                </MainContent>
              </div>
              <ThemeToggle />
            </div>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}