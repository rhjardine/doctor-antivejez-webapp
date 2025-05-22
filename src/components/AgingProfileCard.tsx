'use client';

import React from 'react';

type TrendColorIndicator = 'success' | 'warning' | 'danger' | 'info';

interface AgingProfileCardProps {
  title: string;
  biologicalAge: number;
  chronoAgeDiff: number;
  tag: string;
  vsCronoText?: string;
  trendColorIndicator?: TrendColorIndicator;
}

export default function AgingProfileCard({
  title,
  biologicalAge,
  chronoAgeDiff,
  tag,
  vsCronoText = 'vs. Edad Cronológica',
  trendColorIndicator = 'info'
}: AgingProfileCardProps) {
  // Configuración de colores según el indicador de tendencia
  const getColorClasses = () => {
    switch (trendColorIndicator) {
      case 'success':
        return {
          text: 'text-green-500',
          bg: 'bg-green-500',
          tag: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'warning':
        return {
          text: 'text-yellow-500',
          bg: 'bg-yellow-500',
          tag: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      case 'danger':
        return {
          text: 'text-red-500',
          bg: 'bg-red-500',
          tag: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
      case 'info':
      default:
        return {
          text: 'text-blue-500',
          bg: 'bg-blue-500',
          tag: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        };
    }
  };

  const colors = getColorClasses();
  const diffFormatted = Math.abs(chronoAgeDiff);
  const diffPrefix = chronoAgeDiff < 0 ? '-' : '+';
  
  // Calcular porcentaje para el círculo (valor relativo entre 20-80 años)
  const percentage = 100 - ((biologicalAge - 20) / 60) * 100;
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const circumference = 2 * Math.PI * 40; // radio 40
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

  return (
    <div className="bg-[#23BCEF] text-white p-4 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col items-center">
        {/* Etiqueta superior */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${colors.tag}`}>
          {tag}
        </span>
        
        {/* Gráfico circular */}
        <div className="relative w-24 h-24 mb-2">
          {/* Círculo de fondo */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            {/* Círculo de progreso */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          {/* Valor central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{biologicalAge}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-center">{title}</h3>
        
        {/* Diferencia con edad cronológica */}
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-100">{vsCronoText}</span>
          <p className={`text-lg font-semibold ${diffPrefix === '-' ? 'text-green-300' : 'text-red-300'}`}>
            {diffPrefix} {diffFormatted} años
          </p>
        </div>
      </div>
    </div>
  );
}