'use client';

import React from 'react';

interface ResultIndicatorProps {
  differential: number | null; // La diferencia entre edad calculada y cronológica
  label: string;
}

// Función para determinar el color basado en las reglas
const getStatus = (diff: number | null): { color: string; text: string } => {
  if (diff === null) return { color: 'bg-gray-400', text: 'Pendiente' };
  if (diff <= -7) return { color: 'bg-green-500', text: 'Óptimo' };
  if (diff > -7 && diff < 7) return { color: 'bg-yellow-500', text: 'Normal' };
  return { color: 'bg-red-500', text: 'Envejecido' };
};

export const ResultIndicator: React.FC<ResultIndicatorProps> = ({ differential, label }) => {
  if (differential === null) {
    return null; // No mostrar nada si no hay cálculo
  }

  const { color, text } = getStatus(differential);

  return (
    <div className="flex flex-col items-center justify-center space-y-1 w-full">
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{label}</span>
      <div className={`w-full h-2.5 rounded-full ${color} transition-colors duration-500`}></div>
      <span className={`text-xs font-bold`} style={{ color: color.replace('bg-', '') }}>{text}</span>
    </div>
  );
};
