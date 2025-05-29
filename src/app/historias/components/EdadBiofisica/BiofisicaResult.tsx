// src/app/historias/components/EdadBiofisica/BiofisicaResult.tsx
import React from 'react';

interface BiofisicaResultProps {
  biologicalAge: number;
  chronologicalAge: number;
  differential: number;
}

export default function BiofisicaResult({ 
  biologicalAge, 
  chronologicalAge, 
  differential 
}: BiofisicaResultProps) {
  // Determinar categoría y color
  const getCategory = () => {
    if (differential <= -7) return { text: 'REJUVENECIDO', color: '#10B981' }; // Verde
    if (differential >= 7) return { text: 'ENVEJECIDO', color: '#EF4444' };    // Rojo
    return { text: 'NORMAL', color: '#F59E0B' };                              // Amarillo
  };
  
  const category = getCategory();
  
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Resumen de Edad Biológica
      </h3>
      
      <div className="flex justify-center space-x-8">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Edad Cronológica</div>
          <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">{chronologicalAge}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">años</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Edad Biofísica</div>
          <div className="text-3xl font-bold" style={{ color: category.color }}>{biologicalAge}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">años</div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <span 
          className="inline-block px-4 py-2 rounded-full font-semibold text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.text}
        </span>
        
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {differential === 0 
            ? 'Tu edad biofísica coincide con tu edad cronológica'
            : `Tu cuerpo es biológicamente ${Math.abs(differential)} años ${differential < 0 ? 'más joven' : 'más viejo'} que tu edad cronológica`
          }
        </p>
      </div>
    </div>
  );
}