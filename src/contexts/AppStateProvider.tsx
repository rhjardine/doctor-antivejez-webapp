// src/contexts/AppStateProvider.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface AppStateContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prevState => !prevState);
  }, []);

  const value = {
    isSidebarCollapsed,
    toggleSidebar,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState debe ser usado dentro de un AppStateProvider');
  }
  return context;
};