import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface TestBiologicoCardProps {
  title: string;
  value?: number | null;
  icon: IconProp;
  isClickable?: boolean;
  onClick?: () => void;
}

/**
 * Componente de Card reutilizable para mostrar los resultados de los tests de edad biológica.
 * @param {TestBiologicoCardProps} props - Props para configurar la card.
 */
export default function TestBiologicoCard({ title, value, icon, isClickable = false, onClick }: TestBiologicoCardProps) {
  const cardClasses = `
    p-6 rounded-xl shadow-lg flex flex-col items-center justify-center 
    text-white transition-all duration-300
    ${isClickable ? 'bg-[#23BCEF] hover:bg-[#1fa9d6] hover:scale-105 cursor-pointer' : 'bg-[#293B64] cursor-default'}
  `;

  return (
    <div className={cardClasses} onClick={isClickable ? onClick : undefined}>
      <FontAwesomeIcon icon={icon} className="text-3xl mb-3" />
      <h4 className="text-md font-semibold uppercase tracking-wider mb-2">{title}</h4>
      {value !== null && value !== undefined ? (
        <p className="text-5xl font-bold">{Math.round(value)}</p>
      ) : (
        <p className="text-lg font-semibold">-</p>
      )}
      <p className="text-sm font-light">años</p>
    </div>
  );
}

