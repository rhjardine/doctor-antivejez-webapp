'use client'; 

import { useState, useEffect, useCallback } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUserShield } from '@fortawesome/free-solid-svg-icons'; 
import ProfesionalesToolbar from '@/components/Profesionales/ProfesionalesToolbar'; 
import ProfesionalCard from '@/components/Profesionales/ProfesionalCard'; 
import ProfesionalesTable from '@/components/Profesionales/ProfesionalesTable'; 
import ProfesionalModal from '@/components/Profesionales/ProfesionalModal'; 
import { Profesional, CreateProfesionalData, UpdateProfesionalData } from '@/types';
import { profesionalesAPI } from '@/utils/api'; 
import { ITEMS_PER_PAGE_PROFESIONALES, PROFESIONAL_ROLES } from '@/utils/constants';

// Componentes de Carga y Error
const LoadingIndicator = () => <div className="p-6 text-center text-text-medium dark:text-dark-text-medium">Cargando profesionales...</div>; 
const ErrorMessage = ({ message }: { message: string }) => <div className="p-4 my-4 text-center text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-md">{message}</div>; 
 
export default function ProfesionalesPage() { 
  const [profesionales, setProfesionales] = useState<Profesional[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
   
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedRolFilter, setSelectedRolFilter] = useState<string>('');
  const [selectedEstatusFilter, setSelectedEstatusFilter] = useState<string>('');
   
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add'); 
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null); 
 
  const fetchProfesionales = useCallback(async (pageToFetch: number, currentSearchTerm: string, currentRolFilter: string, currentEstatusFilter: string) => { 
    setIsLoading(true); 
    setError(null); 
    try { 
      const params = { 
        page: pageToFetch, 
        limit: ITEMS_PER_PAGE_PROFESIONALES, 
        ...(currentSearchTerm && { search: currentSearchTerm }), 
        ...(currentRolFilter && { rol: currentRolFilter }), 
        ...(currentEstatusFilter && { estatus: currentEstatusFilter }), 
      }; 
      const response = await profesionalesAPI.getAll(params);  
      setProfesionales(response.data); 
      setTotalPages(response.lastPage); 
    } catch (err: any) { 
      console.error("Error cargando profesionales:", err); 
      setError(err.message || 'Error desconocido al cargar profesionales.'); 
    } finally { 
      setIsLoading(false); 
    } 
  }, []); 
 
  useEffect(() => { 
    fetchProfesionales(currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter); 
  }, [currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter, fetchProfesionales]);
 
  const handlePageChange = (selectedItem: { selected: number }) => { 
    setCurrentPage(selectedItem.selected); 
  }; 
 
  const handleAddProfesional = () => { 
    setSelectedProfesional(null); 
    setModalMode('add'); 
    setIsModalOpen(true); 
  }; 
 
  const handleViewDetails = (prof: Profesional) => { 
    setSelectedProfesional(prof); 
    setModalMode('view'); 
    setIsModalOpen(true); 
  }; 
 
  const handleEditProfesional = (prof: Profesional) => { 
    setSelectedProfesional(prof); 
    setModalMode('edit'); 
    setIsModalOpen(true); 
  }; 
 
  const handleDeleteProfesional = async (id: number | string) => { 
    if (window.confirm('¿Está seguro de que desea eliminar este profesional?')) { 
      setIsLoading(true);
      try { 
        await profesionalesAPI.delete(id);
        fetchProfesionales(currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter);  
        alert('Profesional eliminado con éxito'); 
      } catch (err: any) { 
        console.error("Error eliminando profesional:", err); 
        setError(err.message || 'Error al eliminar profesional.'); 
      } finally { 
        setIsLoading(false); 
      } 
    } 
  }; 
 
  const handleSaveProfesional = async (data: CreateProfesionalData | UpdateProfesionalData) => { 
    setIsLoading(true); 
    try { 
      if (modalMode === 'edit' && selectedProfesional?.id) { 
        await profesionalesAPI.update(selectedProfesional.id, data as UpdateProfesionalData);
        alert('Profesional actualizado con éxito'); 
      } else { 
        await profesionalesAPI.create(data as CreateProfesionalData);
        alert('Profesional agregado con éxito'); 
      } 
      fetchProfesionales(modalMode === 'add' ? 0 : currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter); 
      setIsModalOpen(false); 
      setSelectedProfesional(null); 
    } catch (err: any) { 
      console.error("Error guardando profesional:", err); 
      setError(err.message || 'Error al guardar profesional.'); 
    } finally { 
      setIsLoading(false); 
    } 
  }; 
 
  const handleExportExcel = () => { 
    alert('Exportando a Excel (simulación)...'); 
  }; 
 
  // Resumen de tarjetas 
  const totalProfesionales = profesionales.length;
  const activos = profesionales.filter(p => p.estatus === "1").length; 
  const inactivos = totalProfesionales - activos; 
 
  // Renderizado condicional de contenido 
  let content;
  if (isLoading && profesionales.length === 0) {
    content = <LoadingIndicator />; 
  } else if (error) { 
    content = <ErrorMessage message={error} />; 
  } else if (profesionales.length === 0) { 
    content = <div className="p-6 text-center text-text-medium dark:text-dark-text-medium">No se encontraron profesionales.</div>; 
  } else { 
    content = ( 
      <ProfesionalesTable 
        profesionales={profesionales}
        currentPage={currentPage} 
        itemsPerPage={ITEMS_PER_PAGE_PROFESIONALES}
        onPageChange={handlePageChange} 
        onViewDetails={handleViewDetails} 
        onEdit={handleEditProfesional} 
        onDelete={handleDeleteProfesional} 
        pageCount={totalPages}
      /> 
    ); 
  } 
 
  return ( 
    <div className="flex flex-col w-full max-w-[calc(100vw-240px)] overflow-x-hidden px-2 md:px-4"> {/* Adjusted width calculation and padding */}
      <h1 className="text-2xl font-bold text-text-dark dark:text-dark-text flex items-center gap-2 my-4"> 
        <FontAwesomeIcon icon={faUserShield} className="text-primary dark:text-primary-light" /> 
        Gestión de Profesionales 
      </h1> 
 
      <div className="w-full flex flex-wrap items-center justify-between mb-4"> {/* Toolbar container with flex */}
        <div className="flex-1 min-w-0 mr-2"> {/* Search area */}
          <ProfesionalesToolbar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
            onAddProfesional={handleAddProfesional} 
            onExportExcel={handleExportExcel} 
            roles={PROFESIONAL_ROLES}
            selectedRol={selectedRolFilter} 
            onRolChange={setSelectedRolFilter} 
            selectedEstatus={selectedEstatusFilter} 
            onEstatusChange={setSelectedEstatusFilter} 
          /> 
        </div>
        <div className="flex-shrink-0 mt-2 sm:mt-0"> {/* Add button container */}
          <button 
            onClick={handleAddProfesional}
            className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-md"
            aria-label="Agregar profesional"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
 
      {error && profesionales.length > 0 && <ErrorMessage message={error} />} 
 
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-4"> {/* Adjusted grid and gap */}
        <ProfesionalCard title="Total Profesionales (Pág.)" count={totalProfesionales} colorClass="text-primary dark:text-primary-light" /> 
        <ProfesionalCard title="Activos (Pág.)" count={activos} colorClass="text-success" /> 
        <ProfesionalCard title="Inactivos (Pág.)" count={inactivos} colorClass="text-danger" /> 
      </div> 
 
      {isLoading && profesionales.length > 0 && <div className="text-center py-2">Actualizando...</div>} 
      
      <div className="w-full overflow-x-auto pr-2"> {/* Table container with right padding */}
        <h2 className="text-lg font-semibold mb-2">Listado de Profesionales</h2>
        {content}
      </div>
 
      {isModalOpen && ( 
        <ProfesionalModal 
          isOpen={isModalOpen} 
          mode={modalMode} 
          profesionalData={selectedProfesional} 
          onClose={() => { 
            setIsModalOpen(false); 
            setSelectedProfesional(null);
          }} 
          onSave={handleSaveProfesional} 
          roles={PROFESIONAL_ROLES}
        /> 
      )} 
    </div> 
  );
}