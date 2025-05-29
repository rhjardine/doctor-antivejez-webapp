// src/components/Layout/MainContent.tsx
'use client';
import React from 'react';
import { useAppState } from '@/contexts/AppStateProvider';
import { cn } from '@/utils/helpers';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isSidebarCollapsed } = useAppState();
  
  return (
    <main
      id="main-content-area"
      className={cn(
        // Base styles
        'flex-1',
        'min-h-screen',
        'overflow-y-auto overflow-x-hidden',
        // Transition only on margin-left to make it smoother
        'transition-[margin-left] duration-200 ease-in-out',
        // Responsive margin adjustments
        'ml-0', // No margin on mobile by default
        // Apply margin only on medium screens and up
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-56',
        // Ensure content doesn't overflow
        'w-[calc(100vw-0px)]', // Mobile full width
        'md:w-[calc(100vw-64px)]', // Medium screens with collapsed sidebar (16rem = 64px)
        !isSidebarCollapsed && 'md:w-[calc(100vw-224px)]', // Medium screens with expanded sidebar (56rem = 224px)
        // No padding - let children handle padding
        'p-0'
      )}
    >
      {children}
    </main>
  );
}