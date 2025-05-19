// src/components/Layout/MainContent.tsx
'use client'; // MainContent necesita ser un Client Component para usar hooks

import React from 'react';
import { useAppState } from '@/contexts/AppStateProvider'; // Asegúrate que la ruta sea correcta
import { cn } from '@/utils/helpers'; // Asegúrate que la ruta sea correcta

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isSidebarCollapsed } = useAppState();

  return (
    <main // Cambiado de div a main por semántica, puedes mantener div si prefieres
      id="main-content-area" // ID opcional para debugging o estilos específicos
      className={cn(
        'flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8', // Padding interno para el contenido
        'transition-all duration-300 ease-in-out', // Para animar el cambio de margen
        // Aplicamos el margin-left dinámico aquí para empujar el contenido
        // Estas clases deben coincidir con los anchos del Sidebar (w-56 y w-16)
        // y el breakpoint 'md' donde el Sidebar se vuelve visible (hidden md:flex)
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
      )}
    >
      {children}
    </main>
  );
}