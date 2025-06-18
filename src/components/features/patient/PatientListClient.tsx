'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Patient } from '@prisma/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
// Asumiremos que la acción de eliminar se manejará aquí.
// import { deletePatient } from '@/lib/actions/patientActions';

/**
 * Componente de Cliente para mostrar y gestionar la lista de pacientes.
 * Recibe los datos iniciales del servidor y maneja la interactividad.
 */
export default function PatientListClient({ initialPatients }: { initialPatients: Patient[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado en el cliente para una búsqueda instantánea
  const filteredPatients = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    if (!lowerSearch) return initialPatients;
    return initialPatients.filter(p =>
      `${p.names} ${p.surnames}`.toLowerCase().includes(lowerSearch) ||
      p.document_number?.toLowerCase().includes(lowerSearch) ||
      p.email?.toLowerCase().includes(lowerSearch)
    );
  }, [initialPatients, searchTerm]);
  
  const handleViewPatient = (id: string) => {
    // Redirige al detalle del paciente
    router.push(`/historias/${id}`);
  };

  const handleCreatePatient = () => {
    // Redirige al formulario de nuevo paciente
    router.push('/historias/nuevo');
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar a ${name}? Esta acción no se puede deshacer.`)) {
        // Aquí se llamaría a la Server Action para eliminar
        // const result = await deletePatient(id);
        // alert(result.message); 
        alert(`Simulando eliminación del paciente con ID: ${id}`);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        <button
          onClick={handleCreatePatient}
          className="w-full sm:w-auto px-4 py-2 bg-[#23BCEF] text-white font-bold rounded-lg hover:bg-[#1fa9d6] transition-colors flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Nuevo Paciente
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Paciente</th>
              <th scope="col" className="px-6 py-3">Identificación</th>
              <th scope="col" className="px-6 py-3">Edad</th>
              <th scope="col" className="px-6 py-3">Contacto</th>
              <th scope="col" className="px-6 py-3">Fecha Registro</th>
              <th scope="col" className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
              <tr key={patient.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{`${patient.surnames}, ${patient.names}`}</td>
                <td className="px-6 py-4">{patient.document_number}</td>
                <td className="px-6 py-4">{patient.chronological_age}</td>
                <td className="px-6 py-4">{patient.phone || patient.email}</td>
                <td className="px-6 py-4">{patient.createdAt ? format(new Date(patient.createdAt), 'dd/MM/yyyy') : 'N/A'}</td>
                <td className="px-6 py-4 flex justify-center items-center gap-4">
                  <button onClick={() => handleViewPatient(patient.id)} title="Ver/Editar Historia" className="text-cyan-500 hover:text-cyan-700">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button onClick={() => handleDelete(patient.id, `${patient.names} ${patient.surnames}`)} title="Eliminar Paciente" className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No se encontraron pacientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
