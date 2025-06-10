// src/app/historias/components/PatientListClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono específico
import type { Patient } from '@prisma/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PatientListClientProps {
  // Recibe la lista de pacientes ya cargada desde el Server Component padre
  initialPatients: Patient[];
  onSelectPatient: (patientId: string) => void;
  // Añadimos la prop para el botón de crear
  onCreateNewPatient: () => void;
}

// LA CORRECCIÓN CLAVE: Añadir la palabra "default" aquí.
export default function PatientListClient({ 
  initialPatients, 
  onSelectPatient, 
  onCreateNewPatient 
}: PatientListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // La lógica de filtrado se queda en el cliente para que la búsqueda sea instantánea
  const filteredPatients = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    if (!lowerSearch) return initialPatients;
    return initialPatients.filter(p =>
      (p.names && p.names.toLowerCase().includes(lowerSearch)) ||
      (p.surnames && p.surnames.toLowerCase().includes(lowerSearch)) ||
      (p.identification_number && p.identification_number.toLowerCase().includes(lowerSearch))
    );
  }, [initialPatients, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden m-4">
      <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={onCreateNewPatient}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Crear Nuevo Paciente
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre Completo</th>
              <th scope="col" className="px-6 py-3">Identificación</th>
              <th scope="col" className="px-6 py-3">F. Nacimiento</th>
              <th scope="col" className="px-6 py-3">Edad</th>
              <th scope="col" className="px-6 py-3">Género</th>
              <th scope="col" className="px-6 py-3">Teléfono</th>
              <th scope="col" className="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
              <tr key={patient.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{`${patient.names} ${patient.surnames}`}</td>
                <td className="px-6 py-4">{patient.identification_number}</td>
                <td className="px-6 py-4">{format(new Date(patient.birth_date), 'dd/MM/yyyy', { locale: es })}</td>
                <td className="px-6 py-4">{patient.chronological_age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.phone_number || 'N/A'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectPatient(patient.id)}
                    className="font-medium text-cyan-600 dark:text-cyan-500 hover:underline"
                  >
                    Ver Expediente
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron pacientes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}