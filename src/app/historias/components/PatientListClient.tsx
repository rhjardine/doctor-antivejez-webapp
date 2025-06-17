'use client';

import React, { useState, useMemo } from 'react';
import type { Patient } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faEdit, faTrash, faUserMd, 
  faSpinner, faExclamationTriangle, faVialCircleCheck 
} from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/UI/Modal'; // Asegúrate de que esta importación sea correcta para tu modal

interface PatientListClientProps {
  initialPatients: Patient[];
  onGoToDetail: (patientId: string, targetTab?: 'historia_medica' | 'edad_biologica') => void;
  onCreateNew: () => void;
}

export default function PatientListClient({
  initialPatients,
  onGoToDetail,
  onCreateNew,
}: PatientListClientProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);

  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    const lowercasedFilter = searchTerm.toLowerCase();
    return patients.filter(patient =>
      (patient.names?.toLowerCase() || '').includes(lowercasedFilter) ||
      (patient.surnames?.toLowerCase() || '').includes(lowercasedFilter) ||
      (patient.identification_number || '').includes(lowercasedFilter) ||
      (patient.email?.toLowerCase() || '').includes(lowercasedFilter)
    );
  }, [patients, searchTerm]);

  const handleDeleteClick = (patientId: number) => {
    setPatientToDelete(patientId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (patientToDelete === null) return;

    setIsDeleting(patientToDelete);
    try {
      const response = await fetch(`/api/patients/${patientToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el paciente');
      }
      setPatients(prev => prev.filter(p => p.id !== patientToDelete));
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      alert('No se pudo eliminar al paciente.'); // Reemplazar con una notificación más elegante
    } finally {
      setIsDeleting(null);
      setPatientToDelete(null);
      setShowConfirmModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setPatientToDelete(null);
  };

  const formatDate = (dateString: Date | string | null): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#23BCEF] to-[#293B64] rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUserMd} className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Gestión de Pacientes
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#23BCEF] to-[#293B64] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <FontAwesomeIcon icon={faPlus} />
          Nuevo Paciente
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, cédula o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#23BCEF] focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Paciente</th>
              <th scope="col" className="px-6 py-3">Identificación</th>
              <th scope="col" className="px-6 py-3">Edad</th>
              <th scope="col" className="px-6 py-3">Contacto</th>
              <th scope="col" className="px-6 py-3">Fecha Registro</th>
              <th scope="col" className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#23BCEF] to-[#293B64] flex items-center justify-center text-white font-bold">
                        {(patient.names || ' ')[0]}{(patient.surnames || ' ')[0]}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-white">{patient.names} {patient.surnames}</div>
                        <div className="text-gray-500 dark:text-gray-400">{patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.nationality}-{patient.identification_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.chronological_age} años</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{patient.phone_number}</div>
                    <div className="text-gray-500 dark:text-gray-400">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(patient.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* BOTÓN LÁPIZ (Ver/Editar Historia) */}
                      <button
                        onClick={() => onGoToDetail(patient.id.toString(), 'historia_medica')}
                        className="p-2 text-cyan-500 hover:bg-cyan-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver / Editar Historia"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {/* BOTÓN TESTS (Edad Biológica) */}
                      <button
                        onClick={() => onGoToDetail(patient.id.toString(), 'edad_biologica')}
                        className="p-2 text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver Tests y Edad Biológica"
                      >
                        <FontAwesomeIcon icon={faVialCircleCheck} />
                      </button>
                      {/* BOTÓN ELIMINAR */}
                      <button
                        onClick={() => handleDeleteClick(patient.id)}
                        disabled={isDeleting === patient.id}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        {isDeleting === patient.id ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faTrash} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl mb-4" />
                    <p>{searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados.'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <Modal title="Confirmar Eliminación" onClose={handleCancelDelete}>
          <p className="text-gray-700 dark:text-gray-300 mb-6">¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end space-x-3">
            <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancelar</button>
            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}