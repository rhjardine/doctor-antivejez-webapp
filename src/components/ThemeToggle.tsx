// src/components/ThemeToggle.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/contexts/ThemeProvider'; // Asegúrate que la ruta sea correcta
import { cn } from '@/utils/helpers';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 opacity-50 z-50" aria-hidden="true" />
    );
  }

  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
        "w-12 h-12 rounded-full",
        "flex items-center justify-center cursor-pointer shadow-lg",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "bg-primary dark:bg-dark-primary text-white dark:text-text-dark", // Ajusta estos colores según tu tailwind.config.ts
        "hover:bg-primary-dark dark:hover:bg-primary",
        "focus:ring-primary-dark dark:focus:ring-primary"
      )}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="h-5 w-5" />
    </button>
  );
}