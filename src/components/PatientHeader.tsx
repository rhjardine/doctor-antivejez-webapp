// src/components/PatientHeader.tsx
'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faVenusMars } from '@fortawesome/free-solid-svg-icons';

interface PatientHeaderProps {
  patient: {
    id: string;
    name?: string;
    names?: string;
    surnames?: string;
    age: number;
    gender: string;
    biologicalAge?: number;
    trend?: number;
    healthScore?: number;
  };
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  // Obtener nombre completo (compatibilidad con ambos formatos)
  const fullName = patient.name || `${patient.surnames || ''} ${patient.names || ''}`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#23BCEF]/20 to-[#293B64]/20 flex items-center justify-center text-[#23BCEF] border-4 border-[#23BCEF]/30 shadow-md">
          <FontAwesomeIcon icon={faUser} className="text-4xl" />
        </div>
        
        {/* Información básica */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-2xl font-bold text-[#293B64] dark:text-[#23BCEF]">
            {fullName}
          </h1>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-[#23BCEF]" />
              <span>Edad: {patient.age} años</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FontAwesomeIcon icon={faVenusMars} className="text-[#23BCEF]" />
              <span>Género: {patient.gender}</span>
            </div>
            
            {patient.id && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                  ID: {patient.id}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Métricas */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="bg-[#23BCEF]/10 rounded-lg p-3 text-center min-w-[90px]">
            <p className="text-xs font-medium text-[#293B64] dark:text-gray-300">
              Edad Biológica
            </p>
            <p className="text-2xl font-bold text-[#23BCEF]">
              {patient.biologicalAge?.toFixed(1) || '-'}
            </p>
          </div>
          
          {patient.trend !== undefined && (
            <div className={`rounded-lg p-3 text-center min-w-[90px] ${
              patient.trend < 0 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              <p className="text-xs font-medium">
                Tendencia
              </p>
              <p className="text-2xl font-bold">
                {patient.trend > 0 ? '+' : ''}{patient.trend.toFixed(1)}
              </p>
            </div>
          )}
          
          {patient.healthScore !== undefined && (
            <div className={`rounded-lg p-3 text-center min-w-[90px] ${
              patient.healthScore > 80 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : patient.healthScore > 60 
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              <p className="text-xs font-medium">
                Salud
              </p>
              <p className="text-2xl font-bold">
                {patient.healthScore}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}