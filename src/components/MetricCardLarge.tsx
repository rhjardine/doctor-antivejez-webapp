// Ejemplo de cómo podría ser MetricCardLarge.tsx
// src/components/MetricCardLarge.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/utils/helpers'; // Asumiendo que tienes cn

interface MetricCardLargeProps {
  title: string;
  value: string | number;
  icon: IconProp;
  unit?: string;
  cardColor?: string; // Ej: "bg-primary text-white", "bg-success text-white"
  className?: string; // Para clases adicionales de hover/focus
}

export default function MetricCardLarge({
  title,
  value,
  icon,
  unit,
  cardColor = 'bg-info text-white', // Color por defecto si no se especifica
  className,
}: MetricCardLargeProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-full',
        cardColor, // Aplica el color de fondo y texto
        className    // Aplica clases adicionales
      )}
    >
      <FontAwesomeIcon icon={icon} className="text-3xl mb-2 opacity-80" />
      <h3 className="text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-4xl font-bold">
        {value} {unit && <span className="text-lg font-normal">{unit}</span>}
      </p>
    </div>
  );
}