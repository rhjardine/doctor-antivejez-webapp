// src/app/historias/components/PatientListContainer.tsx (NUEVO)
import { getPatients } from '@/lib/actions/patients';
import { PatientListClient } from './PatientListClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PatientListContainerProps {
  onSelectPatient: (patientId: string) => void;
  onCreateNew: () => void;
}

// Este es un Server Component, por lo tanto PUEDE ser async y NO lleva 'use client'
export async function PatientListContainer({ onSelectPatient, onCreateNew }: PatientListContainerProps) {
  // 1. Obtiene los datos en el servidor ANTES de renderizar
  const patients = await getPatients();

  // 2. Renderiza la UI principal y pasa los datos al componente cliente para la interactividad
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Buscar Pacientes</h1>
        {/* Este botón necesita estar en el componente cliente padre que maneja el estado de la vista */}
        <button
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon="plus" />
          <span>Nuevo Paciente</span>
        </button>
      </div>
      {/* Pasamos los datos ya cargados al componente de cliente */}
      <PatientListClient initialPatients={patients} onSelectPatient={onSelectPatient} />
    </div>
  );
}