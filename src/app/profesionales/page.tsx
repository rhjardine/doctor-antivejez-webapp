// src/app/profesionales/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import ProfesionalesToolbar from '@/components/Profesionales/ProfesionalesToolbar';
import ProfesionalCard from '@/components/Profesionales/ProfesionalCard';
import ProfesionalesTable from '@/components/Profesionales/ProfesionalesTable';
import ProfesionalModal from '@/components/Profesionales/ProfesionalModal';
import { Profesional, CreateProfesionalData, UpdateProfesionalData } from '@/types'; // Asegúrate que los tipos para data de creación/actualización existan
import { profesionalesAPI } from '@/utils/api';
import { ITEMS_PER_PAGE_PROFESIONALES, PROFESIONAL_ROLES } from '@/utils/constants'; // Importa PROFESIONAL_ROLES para el modal

// Componentes de Carga y Error (puedes moverlos a archivos separados)
const LoadingIndicator = () => <div className="p-6 text-center text-text-medium dark:text-dark-text-medium">Cargando profesionales...</div>;
const ErrorMessage = ({ message }: { message: string }) => <div className="p-4 my-4 text-center text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-md">{message}</div>;

export default function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRolFilter, setSelectedRolFilter] = useState<string>(''); // Para el filtro del Toolbar
  const [selectedEstatusFilter, setSelectedEstatusFilter] = useState<string>(''); // Para el filtro del Toolbar
  
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed para react-paginate
  const [totalPages, setTotalPages] = useState(0);
  // const [totalProfesionalesCount, setTotalProfesionalesCount] = useState(0); // Si necesitas el total global

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
      // CORRECCIÓN: Llamar a profesionalesAPI.getAll en lugar de getProfesionales
      const response = await profesionalesAPI.getAll(params); 
      setProfesionales(response.data);
      setTotalPages(response.lastPage);
      // setTotalProfesionalesCount(response.total); 
      // setCurrentPage(response.currentPage); // Si la API devuelve 0-indexed, esto ya está bien. Si es 1-indexed, response.currentPage - 1
    } catch (err: any) {
      console.error("Error cargando profesionales:", err);
      setError(err.message || 'Error desconocido al cargar profesionales.');
      // alert('Error al cargar profesionales'); // Reemplazado por estado de error
    } finally {
      setIsLoading(false);
    }
  }, []); // ITEMS_PER_PAGE_PROFESIONALES es una constante, no necesita estar en dependencias si no cambia

  useEffect(() => {
    // Pasa los estados actuales de los filtros a fetchProfesionales
    fetchProfesionales(currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter);
  }, [currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter, fetchProfesionales]);

  // Ya no se necesita filteredProfesionales aquí si el filtrado y paginación se hacen en la API (o en el mock de la API)
  // const filteredProfesionales = useMemo(() => { ... }); 

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
      setIsLoading(true); // Indicar carga durante la operación
      try {
        await profesionalesAPI.delete(id); // CORRECCIÓN: Usar profesionalesAPI.delete
        // Para refrescar, llama a fetchProfesionales con la página actual y filtros
        fetchProfesionales(currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter); 
        alert('Profesional eliminado con éxito');
      } catch (err: any) {
        console.error("Error eliminando profesional:", err);
        setError(err.message || 'Error al eliminar profesional.');
        // alert('Error al eliminar profesional');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProfesional = async (data: CreateProfesionalData | UpdateProfesionalData) => {
    setIsLoading(true);
    try {
      if (modalMode === 'edit' && selectedProfesional?.id) {
        await profesionalesAPI.update(selectedProfesional.id, data as UpdateProfesionalData); // CORRECCIÓN
        alert('Profesional actualizado con éxito');
      } else {
        await profesionalesAPI.create(data as CreateProfesionalData); // CORRECCIÓN
        alert('Profesional agregado con éxito');
      }
      // Para refrescar y potencialmente ir a la primera página si es una adición
      fetchProfesionales(modalMode === 'add' ? 0 : currentPage, searchTerm, selectedRolFilter, selectedEstatusFilter);
      setIsModalOpen(false);
      setSelectedProfesional(null);
    } catch (err: any) {
      console.error("Error guardando profesional:", err);
      setError(err.message || 'Error al guardar profesional.');
      // alert('Error al guardar profesional');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportExcel = () => {
    alert('Exportando a Excel (simulación)...');
  };

  // Resumen de tarjetas
  const totalProfesionales = profesionales.length; // Esto será el total de la página actual si la API pagina
                                                  // Si quieres el total global, usa totalProfesionalesCount (necesitarías un estado para ello)
  const activos = profesionales.filter(p => p.estatus === "1").length;
  const inactivos = totalProfesionales - activos;

  // Renderizado condicional de contenido
  let content;
  if (isLoading && profesionales.length === 0) { // Carga inicial
    content = <LoadingIndicator />;
  } else if (error) {
    content = <ErrorMessage message={error} />;
  } else if (profesionales.length === 0) {
    content = <div className="p-6 text-center text-text-medium dark:text-dark-text-medium">No se encontraron profesionales.</div>;
  } else {
    content = (
      <ProfesionalesTable
        profesionales={profesionales} // Ahora 'profesionales' ya está paginado por la API (o el mock)
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE_PROFESIONALES} // Aunque la paginación real la haga la API, puede ser útil para mostrar info
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onEdit={handleEditProfesional}
        onDelete={handleDeleteProfesional}
        pageCount={totalPages} // Pasar totalPages a la tabla para ReactPaginate
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6"> {/* Añadido padding general a la página */}
      <h1 className="text-2xl font-bold text-text-dark dark:text-dark-text flex items-center gap-2">
        <FontAwesomeIcon icon={faUserShield} className="text-primary dark:text-primary-light" />
        Gestión de Profesionales
      </h1>

      <ProfesionalesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        // onClearSearch={() => setSearchTerm('')} // Implementa si quieres un botón de limpiar
        onAddProfesional={handleAddProfesional}
        onExportExcel={handleExportExcel}
        // Pasa los filtros y sus manejadores si el Toolbar los controla
        roles={PROFESIONAL_ROLES} // Pasa los roles para el selector de filtro
        selectedRol={selectedRolFilter}
        onRolChange={setSelectedRolFilter}
        selectedEstatus={selectedEstatusFilter}
        onEstatusChange={setSelectedEstatusFilter}
      />

      {/* Si hay un error y también datos (error en una recarga), se muestra aquí */}
      {error && profesionales.length > 0 && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfesionalCard title="Total Profesionales (Pág.)" count={totalProfesionales} colorClass="text-primary dark:text-primary-light" />
        <ProfesionalCard title="Activos (Pág.)" count={activos} colorClass="text-success" />
        <ProfesionalCard title="Inactivos (Pág.)" count={inactivos} colorClass="text-danger" />
      </div>

      {/* Indicador de carga para actualizaciones (no para la carga inicial si ya se manejó) */}
      {isLoading && profesionales.length > 0 && <div className="text-center py-4">Actualizando...</div>}
      
      {content} {/* Aquí se renderiza la tabla, el mensaje de no hay datos, o el error inicial */}

      {isModalOpen && (
        <ProfesionalModal
          isOpen={isModalOpen}
          mode={modalMode}
          profesionalData={selectedProfesional}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProfesional(null); // Limpia el profesional seleccionado al cerrar
          }}
          onSave={handleSaveProfesional}
          roles={PROFESIONAL_ROLES} // Pasa los roles al modal
        />
      )}
    </div>
  );
}