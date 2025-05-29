// components/PatientHeader.tsx
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Patient } from '@/types';

interface PatientHeaderProps {
  patient: Patient;
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="flex items-center bg-bg-card-light dark:bg-bg-card-dark p-6 rounded-lg shadow-lg border border-border-light dark:border-border-dark">
      {/* Foto del paciente */}
      <div className="mr-6">
        {patient.fotoUrl ? (
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-primary shadow-lg">
            <Image
              src={patient.fotoUrl}
              alt={`Foto de ${patient.name}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-primary" />
          </div>
        )}
      </div>
      
      {/* Datos del paciente */}
      <div className="flex-1">
        <div className="text-2xl font-bold text-text-light-base dark:text-text-dark-base mb-1">
          {patient.name}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-text-light-medium dark:text-text-dark-medium">
            <span className="font-medium">Edad:</span> {patient.age} años
          </div>
          <div className="text-text-light-medium dark:text-text-dark-medium">
            <span className="font-medium">Género:</span> {patient.gender}
          </div>
        </div>
      </div>
      
      {/* Indicadores de salud */}
      <div className="flex space-x-6">
        <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-text-light-medium dark:text-text-dark-medium mb-1">Edad Biológica</p>
          <p className="text-xl font-bold text-primary">{patient.biologicalAge}</p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-text-light-medium dark:text-text-dark-medium mb-1">Tendencia</p>
          <p className={`text-xl font-bold ${patient.trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {patient.trend > 0 ? '+' : ''}{patient.trend}
          </p>
        </div>
        <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-text-light-medium dark:text-text-dark-medium mb-1">Salud</p>
          <p className="text-xl font-bold text-green-500">{patient.healthScore}%</p>
        </div>
      </div>
    </div>
  );
}