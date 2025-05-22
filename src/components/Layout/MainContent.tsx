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
        'flex-1 w-full',  
        'overflow-y-auto overflow-x-hidden', 
        // SIN PADDING GLOBAL AQUÍ 
        'transition-all duration-300 ease-in-out',  
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-56' 
      )} 
    > 
      {children} 
    </main> 
  ); 
}