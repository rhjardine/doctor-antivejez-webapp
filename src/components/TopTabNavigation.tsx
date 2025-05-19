// src/components/TopTabNavigation.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
// --- AÑADE faNotesMedical Y LOS OTROS ICONOS QUE USAS AQUÍ ---
import {
  faUserCircle, // Asumo que este es para 'Ficha Paciente' (antes 'Datos Generales')
  faNotesMedical, // <--- AÑADIDO
  faFlask,
  faHeartbeat,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
// -----------------------------------------------------------
import { cn } from '@/utils/helpers';

// Actualiza este tipo si lo exportas desde aquí
export type HistoriaTabId = 'historia-medica' | 'edad-biologica' | 'guia-paciente' | 'alimentacion-nutrigenomica';

interface TabConfig {
  id: HistoriaTabId;
  label: string;
  icon: IconDefinition; // Usa IconDefinition
}

// Configuración de las pestañas con iconos importados
const TABS: TabConfig[] = [
  // Ajusta el icono para 'historia-medica' si faUserCircle no es el deseado
  { id: 'historia-medica', label: 'Historia Médica', icon: faNotesMedical }, // Ahora faNotesMedical está definido
  { id: 'edad-biologica', label: 'Edad Biológica', icon: faFlask },
  { id: 'guia-paciente', label: 'Guía del Paciente', icon: faHeartbeat },
  { id: 'alimentacion-nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faUtensils },
];

interface TopTabNavigationProps {
  activeTab: HistoriaTabId;
  onTabChange: (tabId: HistoriaTabId) => void;
}

export default function TopTabNavigation({ activeTab, onTabChange }: TopTabNavigationProps) {
  return (
    <div className="border-b border-light-border dark:border-dark-border">
      <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-thin pb-px" aria-label="Tabs de Historia">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'group inline-flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              'transition-colors duration-200 ease-in-out',
              activeTab === tab.id
                ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                : 'border-transparent text-text-medium hover:text-text-dark hover:border-gray-300 dark:text-dark-text-medium dark:hover:text-dark-text dark:hover:border-gray-600'
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <FontAwesomeIcon
              icon={tab.icon}
              className={cn( 'h-4 w-4', activeTab === tab.id ? 'text-primary dark:text-primary-light' : 'text-text-light group-hover:text-text-medium dark:text-dark-text-light dark:group-hover:text-dark-text-medium')}
              aria-hidden="true"
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}