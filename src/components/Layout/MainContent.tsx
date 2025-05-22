// src/components/Layout/MainContent.tsx
'use client';

import { useAppState } from '@/contexts/AppStateProvider';
import { cn } from '@/utils/helpers';
import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isSidebarCollapsed } = useAppState();

  return (
    <main
      id="main-content"
      className={cn(
        'transition-all duration-300 ease-in-out', // Transición suave
        'flex-1 overflow-y-auto overflow-x-hidden',
        'pt-08 px-2 md:px-4', // Padding superior para el header
        isSidebarCollapsed ? 'md:ml-08' : 'md:ml-28' // Margen izquierdo dinámico
      )}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </main>
  );
}
