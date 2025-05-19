// src/components/Profesionales/ProfesionalesToolbar.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileExcel, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProfesionalRolConstant } from '@/utils/constants'; // Importa el tipo de rol si es necesario para PROFESIONAL_ROLES

interface ProfesionalesToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch?: () => void; // Opcional, si no siempre se usa
  onAddProfesional: () => void;
  onExportExcel: () => void;
  
  // Props para filtros (nuevos)
  roles: ProfesionalRolConstant[]; // Para el selector de roles
  selectedRol: string;
  onRolChange: (rolId: string) => void;
  selectedEstatus: string;
  onEstatusChange: (estatus: string) => void;
}

export default function ProfesionalesToolbar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onAddProfesional,
  onExportExcel,
  roles, // Recibe los roles
  selectedRol,
  onRolChange,
  selectedEstatus,
  onEstatusChange,
}: ProfesionalesToolbarProps) {
  return (
    <div className="mb-5 p-4 bg-light-bg-card dark:bg-dark-bg-card rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
      {/* Contenedor de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-grow md:flex-grow-0">
        {/* Buscador */}
        <div className="relative w-full sm:w-auto sm:min-w-[250px] lg:min-w-[300px] flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-text-light dark:text-dark-text-light" />
          </div>
          <input
            type="text"
            id="filtro-nombre"
            placeholder="Buscar profesional..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-10 sm:pr-3 py-2.5 border border-light-border dark:border-dark-border rounded-full bg-light-bg dark:bg-dark-bg text-text-dark dark:text-dark-text placeholder-text-light dark:placeholder-dark-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary-light transition-shadow shadow-sm hover:shadow-md"
          />
          {searchTerm && onClearSearch && ( // Mostrar solo si onClearSearch está definido
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light hover:text-danger"
              title="Limpiar búsqueda"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtro por Rol */}
        <select
          id="filtro-rol"
          value={selectedRol}
          onChange={(e) => onRolChange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 border border-light-border dark:border-dark-border rounded-full bg-light-bg dark:bg-dark-bg text-text-dark dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary-light transition-shadow shadow-sm hover:shadow-md"
        >
          <option value="">Todos los Roles</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>

        {/* Filtro por Estatus */}
        <select
          id="filtro-estatus"
          value={selectedEstatus}
          onChange={(e) => onEstatusChange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 border border-light-border dark:border-dark-border rounded-full bg-light-bg dark:bg-dark-bg text-text-dark dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary-light transition-shadow shadow-sm hover:shadow-md"
        >
          <option value="">Todos los Estatus</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-end flex-shrink-0">
        <button
          onClick={onExportExcel}
          className="px-4 py-2 text-sm bg-success text-white font-medium rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success/50 shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFileExcel} /> Exportar
        </button>
        <button
          onClick={onAddProfesional}
          className="px-4 py-2 text-sm bg-primary text-white font-medium rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} /> Agregar
        </button>
      </div>
    </div>
  );
}