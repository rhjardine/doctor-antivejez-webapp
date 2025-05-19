// src/components/UI/AgingProfileCard.tsx
'use client';

import React from 'react';
import { cn } from '@/utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faEquals } from '@fortawesome/free-solid-svg-icons';

// Define un tipo más explícito para el color semántico que esperamos
type TrendColor = 'success' | 'warning' | 'danger' | 'info';

interface AgingProfileCardProps {
  title: string;
  biologicalAge: number;
  chronoAgeDiff: number; 
  tag?: string;
  vsCronoText?: string;
  // 'color' ahora determinará el color del círculo y el texto de diferencia, 
  // la card principal siempre será azul primario.
  trendColorIndicator: TrendColor; 
}

export default function AgingProfileCard({
  title,
  biologicalAge,
  chronoAgeDiff,
  tag,
  vsCronoText = "vs. Edad Cronológica",
  trendColorIndicator, // Esta prop indicará el color de tendencia para el círculo
}: AgingProfileCardProps) {
  
  const getCircleAndDiffStyles = (): { ring: string; text: string; icon: any } => {
    switch (trendColorIndicator) {
      case 'success': // Verde (mejor)
        return { ring: 'border-success', text: 'text-success', icon: faArrowDown };
      case 'warning': // Amarillo (ligeramente peor/advertencia)
        return { ring: 'border-warning', text: 'text-warning', icon: faArrowUp };
      case 'danger':  // Rojo (peor)
        return { ring: 'border-danger', text: 'text-danger', icon: faArrowUp };
      case 'info':    // Azul/Neutro
      default:
        return { ring: 'border-info', text: 'text-info', icon: faEquals };
    }
  };

  const { ring: circleBorderColor, text: diffTextColor, icon: diffIcon } = getCircleAndDiffStyles();

  return (
    // CARD PRINCIPAL: Siempre con fondo azul cielo (bg-primary) y texto blanco
    <div className="bg-primary text-white p-4 rounded-xl shadow-lg flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {tag && (
        // Tag con fondo blanco/muy claro y texto primario para contraste
        <span className="text-xs font-medium bg-white/20 dark:bg-white/10 text-white py-0.5 px-2 rounded-full mb-2 self-start">
          {tag}
        </span>
      )}
      <h4 className="text-sm font-semibold mb-1.5 leading-tight h-10 flex items-center justify-center">
        {title}
      </h4>
      
      {/* CÍRCULO: Fondo blanco para destacar, borde con color de tendencia */}
      <div className={cn(
        "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] flex items-center justify-center my-3",
        "bg-white", // Fondo blanco para el círculo
        circleBorderColor // Borde con color de tendencia (verde, amarillo, rojo)
      )}>
        {/* Número de la edad biológica con el color de tendencia */}
        <span className={cn(
          "text-3xl sm:text-4xl font-bold",
          diffTextColor // El número de la edad ahora usa el color de tendencia
        )}>
          {biologicalAge}
        </span>
        <span className={cn(
            "absolute bottom-3 sm:bottom-4 text-[10px] sm:text-xs",
            "text-gray-600 dark:text-gray-500" // Texto "años" en un color neutro dentro del círculo blanco
        )}>
          años
        </span>
      </div>

      {/* Texto de Diferencia: usa el color de tendencia */}
      <p className={cn(
        "text-base font-bold mt-1 flex items-center gap-1",
        diffTextColor // Color del texto de diferencia (verde, amarillo, rojo)
      )}>
        <FontAwesomeIcon icon={diffIcon} /> 
        {chronoAgeDiff > 0 ? `+${chronoAgeDiff}` : chronoAgeDiff} 
        <span className="font-medium text-sm">años</span>
      </p>
      <p className="text-xs opacity-80 mt-0.5"> {/* Texto "vs Edad..." con opacidad para menor énfasis */}
        {vsCronoText}
      </p>
    </div>
  );
}