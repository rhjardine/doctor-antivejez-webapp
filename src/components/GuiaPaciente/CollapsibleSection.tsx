// src/components/GuiaPaciente/CollapsibleSection.tsx
'use client';

import { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, type IconProp } from '@fortawesome/free-solid-svg-icons'; // Importa IconProp
import { cn } from '@/utils/helpers';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  initialCollapsed?: boolean;
  icon?: IconProp; // Usar IconProp
  titleClassName?: string;
  contentClassName?: string;
  id?: string; // Para accesibilidad (aria-controls)
}

export default function CollapsibleSection({
  title,
  children,
  initialCollapsed = true,
  icon,
  titleClassName,
  contentClassName,
  id
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const contentId = id ? `${id}-content` : undefined;

  return (
    <div className="mb-5 rounded-lg shadow-sm border border-light-border dark:border-dark-border overflow-hidden">
      <h3 className="m-0" id={id}> {/* Título como h3 para semántica */}
        <button
          type="button"
          className={cn(
            "w-full p-3 text-left flex justify-between items-center cursor-pointer",
            "bg-secondary text-white dark:bg-dark-bg-card dark:text-dark-text", // Colores corporativos
            "hover:bg-secondary-light dark:hover:bg-dark-bg",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg-card",
            titleClassName
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
        >
          <span className="font-semibold flex items-center gap-2">
            {icon && <FontAwesomeIcon icon={icon} className="w-4 h-4" />}
            {title}
          </span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={cn("transition-transform duration-300 ease-in-out", !isCollapsed && "rotate-180")}
          />
        </button>
      </h3>
      {!isCollapsed && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={id}
          className={cn("p-4 bg-light-bg-card dark:bg-dark-bg-card", contentClassName)}
        >
          {children}
        </div>
      )}
    </div>
  );
}