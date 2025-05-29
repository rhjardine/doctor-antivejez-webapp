// src/components/GuiaPaciente/CollapsibleSection.tsx
'use client';
import React, { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/utils/helpers';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode; // Para un icono a la izquierda del título
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  titleClassName,
  contentClassName,
  icon,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-5 border border-border-light dark:border-border-dark rounded-lg overflow-hidden shadow-sm">
      <legend
        className={cn(
          "cursor-pointer p-3 sm:p-4 bg-secondary text-white flex justify-between items-center transition-colors duration-200 ease-in-out hover:bg-secondary-light",
          titleClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span className="font-semibold text-base sm:text-lg">{title}</span>
        </div>
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="transition-transform duration-300 ease-in-out w-4 h-4" />
      </legend>
      {/* Contenido colapsable */}
      <div
        id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0", // max-h grande para permitir contenido variable
          contentClassName
        )}
      >
        {/* El padding se aplica aquí para que no afecte la animación de max-height */}
        {isOpen && (
            <fieldset className="border-none p-4 sm:p-5 bg-bg-card-light dark:bg-bg-card-dark">
                {children}
            </fieldset>
        )}
      </div>
    </div>
  );
}