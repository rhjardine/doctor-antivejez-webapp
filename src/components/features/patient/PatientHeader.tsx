'use client';

import type { Patient } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faVenusMars, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';

interface PatientHeaderProps {
  patient: Partial<Patient>;
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  const patientName = `${patient.names || ''} ${patient.surnames || ''}`;
  const age = patient.chronological_age ? `${patient.chronological_age} años` : 'N/A';
  
  return (
    <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-700 dark:to-blue-800 text-white rounded-xl shadow-lg">
      <div className="flex items-center space-x-6">
        <FontAwesomeIcon icon={faUserCircle} className="h-20 w-20 text-white/80" />
        <div>
          <h1 className="text-3xl font-bold">{patientName}</h1>
          <div className="flex items-center space-x-6 mt-2 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBirthdayCake} />
              <span>{age}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVenusMars} />
              <span>{patient.gender || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
