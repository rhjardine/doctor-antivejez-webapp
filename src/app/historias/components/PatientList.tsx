// src/app/historias/components/PatientList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faEdit, faTrash, faUserPlus, 
  faChevronLeft, faChevronRight, faSpinner,
  faInfoCircle, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { usePatient } from '@/contexts/PatientProvider';

interface PatientListProps {
  onSelectPatient: (patientId: string) => void;
  onCreateNewPatient: () => void;
}

export default function PatientList({ onSelectPatient, onCreateNewPatient }: PatientListProps) {
  // Estados
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Contexto del paciente
  const { deletePatient } = usePatient();
  
  // Cargar pacientes al montar el componente y cuando cambie la búsqueda o página
  useEffect(() => {
    fetchPatients();
  }, [search, page]);
  
  // Función para cargar pacientes
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/patients?search=${encodeURIComponent(search)}&page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar pacientes: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setPatients(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambio en búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Resetear página al cambiar búsqueda
  };
  
  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  // Confirmar eliminación
  const confirmDelete = async (id: string) => {
    try {
      await deletePatient(id);
      setShowDeleteConfirm(null);
      fetchPatients(); // Recargar lista
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Error al eliminar el paciente');
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#293B64] dark:text-[#23BCEF] flex items-center gap-2">
          <FontAwesomeIcon icon={faSearch} className="text-[#23BCEF]" />
          Buscar Pacientes
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={handleSearchChange}
              className="w-full p-3 pr-10 border-2 border-[#23BCEF]/30 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#23BCEF]/50 focus:border-[#23BCEF] outline-none"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
            />
          </div>
          
          <button
            onClick={onCreateNewPatient}
            className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#23BCEF] to-[#293B64] text-white font-semibold hover:opacity-90 transition-opacity shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span className="hidden md:inline">Nuevo Paciente</span>
          </button>
        </div>
      </div>
      
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Tabla de pacientes */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#23BCEF]/10 to-[#293B64]/10 text-left">
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">ID</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Nombre Completo</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Identificación</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Fecha Nac.</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Edad</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Género</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold">Teléfono</th>
              <th className="px-4 py-3 text-[#293B64] dark:text-[#23BCEF] font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#23BCEF] text-2xl" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando pacientes...</p>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-[#293B64] dark:text-[#23BCEF] text-2xl mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {search ? 'No se encontraron pacientes con esa búsqueda' : 'No hay pacientes registrados'}
                  </p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{patient.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                    {`${patient.surnames || ''} ${patient.names || ''}`}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{patient.identification || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(patient.birthday)}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{patient.age || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{patient.gender || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{patient.phone || '-'}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      className="p-2 text-[#23BCEF] hover:text-[#293B64] dark:hover:text-white bg-[#23BCEF]/10 hover:bg-[#23BCEF]/20 rounded-md transition-colors"
                      title="Editar paciente"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(patient.id)}
                      className="p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Eliminar paciente"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Página {page} de {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-[#293B64] dark:text-[#23BCEF] mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              ¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}