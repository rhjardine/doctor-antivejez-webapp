// src/components/PatientHeader.tsx
'use client'; // Necesario si usas hooks o interactividad, o si este componente es importado por un Client Component.

import React from 'react'; // Importa React
import { Patient } from '@/types'; // Verifica esta ruta
import { formatDate } from '@/utils/helpers'; // Verifica esta ruta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// --- IMPORTA EL ICONO ESPECÍFICO AQUÍ ARRIBA ---
import { faUser, faUserMd } from '@fortawesome/free-solid-svg-icons'; // O faUserCircle, el que prefieras y vayas a usar.
// Si solo usas faUser, puedes quitar faUserMd. Si usas faUserMd, puedes quitar faUser.
// O si quieres usar otro ícono como faUserDoctor, impórtalo: import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
// ---------------------------------------------

interface PatientHeaderProps {
  patient: Patient;
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="flex items-center p-5 bg-white dark:bg-[#2E3A4A] rounded-lg shadow-sm mb-6 transition-all duration-300 border-l-4 border-blue-500 dark:border-blue-400 hover:shadow-md hover:-translate-y-0.5">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#242F3F] mr-4 flex items-center justify-center text-blue-500 dark:text-blue-400 text-2xl transition-transform duration-200 flex-shrink-0 hover:scale-105">
        {/* --- USA EL ICONO IMPORTADO --- */}
        {/* Elige cuál icono quieres mostrar. Por ejemplo, faUser: */}
        <FontAwesomeIcon icon={faUser} />
        {/* O si prefieres faUserMd: */}
        {/* <FontAwesomeIcon icon={faUserMd} /> */}
        {/* ----------------------------- */}
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-[#E0E6ED] mb-1">
          {patient.name}
        </h2>
        <div className="text-gray-600 dark:text-[#B8C4CF] text-sm">
          {patient.age} years • {patient.gender} • ID: {patient.id}
        </div>
      </div>

      <div className="flex gap-5 ml-auto flex-wrap">
        <div className="text-center transition-all duration-200 p-2 rounded-md hover:bg-blue-500/5 flex-grow min-w-[100px]">
          <div className="text-xs text-gray-500 dark:text-[#B8C4CF] mb-1">
            Biological Age
          </div>
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400 break-words">
            {patient.biologicalAge}
            {patient.trend && (
              <span className={`text-sm font-medium ml-1 ${patient.trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({patient.trend > 0 ? '+' : ''}{patient.trend})
              </span>
            )}
          </div>
        </div>

        <div className="text-center transition-all duration-200 p-2 rounded-md hover:bg-blue-500/5 flex-grow min-w-[100px]">
          <div className="text-xs text-gray-500 dark:text-[#B8C4CF] mb-1">
            Health Score
          </div>
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400 break-words">
            {patient.healthScore}/100
          </div>
        </div>

        <div className="text-center transition-all duration-200 p-2 rounded-md hover:bg-blue-500/5 flex-grow min-w-[100px]">
          <div className="text-xs text-gray-500 dark:text-[#B8C4CF] mb-1">
            Last Checkup
          </div>
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400 break-words">
            {patient.lastCheckup ? formatDate(patient.lastCheckup) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}