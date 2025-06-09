// src/app/historias/components/PatientList.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPenToSquare, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

// Definimos el tipo para los datos de un paciente, debe coincidir con el de la API
interface Patient {
  id: string;
  names: string;
  surnames: string;
  identification_number: string;
  birth_date: string; // La API lo enviará como string ISO
  chronological_age: number;
  gender: string;
  phone_number: string | null;
}

interface PatientListProps {
  onSelectPatient: (patientId: string) => void;
  onCreateNewPatient: () => void;
}

// Aseguramos que el componente se exporta como una constante nombrada
export const PatientList: React.FC<PatientListProps> = ({ onSelectPatient, onCreateNewPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/patients?search=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Error al cargar la lista de pacientes');
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió');
        setPatients([]); // Importante: en caso de error, inicializar como array vacío
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
        fetchPatients();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-full p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#293B64] dark:text-white">
          Buscar Pacientes
        </h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:border-[#23BCEF] transition-colors"
          />
          <button
            onClick={onCreateNewPatient}
            className="bg-[#23BCEF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#1faade] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['ID', 'Nombre Completo', 'Identificación', 'Fecha Nac.', 'Edad', 'Género', 'Teléfono', 'Acciones'].map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23BCEF] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Cargando...</p>
                </td>
              </tr>
            ) : !patients || patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-[#293B64] dark:text-[#23BCEF] text-3xl mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No hay pacientes registrados</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{patient.id.substring(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{`${patient.names} ${patient.surnames}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{patient.identification_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{format(new Date(patient.birth_date), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{patient.chronological_age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{patient.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{patient.phone_number || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onSelectPatient(patient.id)} className="text-[#23BCEF] hover:text-[#1faade] flex items-center gap-1">
                      <FontAwesomeIcon icon={faPenToSquare} />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
