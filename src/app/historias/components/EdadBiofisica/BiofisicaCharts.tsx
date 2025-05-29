// src/app/historias/components/EdadBiofisica/BiofisicaChart.tsx
import React from 'react';
import { BiofisicaField } from '@/app/historias/types/biofisica';

interface BiofisicaChartProps {
  field: BiofisicaField;
  chronologicalAge: number;
}

export default function BiofisicaChart({ field, chronologicalAge }: BiofisicaChartProps) {
  // Calcular el diferencial de edad para este campo
  const differential = field.absolute_value !== null 
    ? field.absolute_value - chronologicalAge 
    : null;
  
  // Determinar el color basado en el diferencial
  const getBarColor = () => {
    if (differential === null) return '#9CA3AF'; // Gris para datos faltantes
    if (differential <= -7) return '#10B981'; // Verde para rejuvenecido
    if (differential >= 7) return '#EF4444';  // Rojo para envejecido
    return '#F59E0B';                         // Amarillo para normal
  };
  
  // Calcular el porcentaje para la barra (valor relativo entre 20-100 años)
  const calculatePercentage = () => {
    if (field.absolute_value === null) return 0;
    
    // Normalizar la edad absoluta a un porcentaje (asumiendo rango 20-100 años)
    const min = 20;
    const max = 100;
    const normalized = Math.max(min, Math.min(field.absolute_value, max));
    return ((normalized - min) / (max - min)) * 100;
  };
  
  // Texto para el diferencial
  const getDifferentialText = () => {
    if (differential === null) return '';
    if (differential === 0) return 'Igual a edad cronológica';
    return `${Math.abs(differential)} años ${differential < 0 ? 'menor' : 'mayor'}`;
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-all">
      <div className="flex items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4 min-w-[120px] text-right">
          {field.translate
            .replace(' (cm)', '')
            .replace(' (seg)', '')
            .replace(' (mmHg)', '')}:
        </span>
        <div className="flex-grow">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${calculatePercentage()}%`,
                backgroundColor: getBarColor()
              }}
            ></div>
          </div>
        </div>
        <span className="ml-2 text-sm font-semibold">
          {field.absolute_value !== null ? field.absolute_value.toFixed(0) : '-'}
        </span>
      </div>
      
      {differential !== null && (
        <div className="text-right text-xs mt-1" style={{ color: getBarColor() }}>
          {getDifferentialText()}
        </div>
      )}
    </div>
  );
}