// src/components/Profesionales/ProfesionalesTable.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faExclamationTriangle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Profesional, ProfesionalRol } from '@/types';
import { cn } from '@/utils/helpers';
import { ITEMS_PER_PAGE_PROFESIONALES, FORM_LIMIT, LIMITED_ROLES_PROFESIONALES, FORM_LIMIT_WARNING_THRESHOLD } from '@/utils/constants'; // Importa constantes
import ReactPaginate from 'react-paginate'; // Necesitarás instalar react-paginate: npm install react-paginate @types/react-paginate

interface ProfesionalesTableProps {
  profesionales: Profesional[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  onViewDetails: (profesional: Profesional) => void;
  onEdit: (profesional: Profesional) => void;
  onDelete: (id: number | string) => void;
}

export default function ProfesionalesTable({
  profesionales,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
}: ProfesionalesTableProps) {

  const pageCount = Math.ceil(profesionales.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = profesionales.slice(offset, offset + itemsPerPage);

  const getFormStatusUI = (profesional: Profesional) => {
    const isLimitedRole = LIMITED_ROLES_PROFESIONALES.includes(profesional.rol as ProfesionalRol);
    let statusClass = '';
    let icon = null;
    let title = '';

    if (isLimitedRole) {
      if (profesional.formularios >= FORM_LIMIT) {
        statusClass = 'text-danger';
        icon = faExclamationTriangle;
        title = `Límite (${FORM_LIMIT}) alcanzado - Requiere renovación`;
      } else if (profesional.formularios >= FORM_LIMIT_WARNING_THRESHOLD) {
        statusClass = 'text-warning';
        icon = faExclamationCircle;
        title = `Cerca del límite (${FORM_LIMIT}) de formularios`;
      }
    }
    return { statusClass, icon, title };
  };


  return (
    <div className="bg-light-bg-card dark:bg-dark-bg-card p-4 sm:p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-text-dark dark:text-dark-text mb-4">
        Listado de Profesionales
      </h3>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
          <thead className="bg-light-bg dark:bg-dark-bg">
            <tr>
              {['Nombre y Apellido', 'Cédula', 'Correo', 'Rol', 'Estatus', 'Formularios', 'Acciones'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-medium dark:text-dark-text-medium uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {currentPageData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-text-light dark:text-dark-text-light">
                  No se encontraron profesionales con los filtros aplicados.
                </td>
              </tr>
            ) : (
              currentPageData.map((prof) => {
                const formStatus = getFormStatusUI(prof);
                return (
                  <tr key={prof.id} className="hover:bg-light-bg/50 dark:hover:bg-dark-bg/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-dark dark:text-dark-text">{prof.nombre} {prof.apellido}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-medium dark:text-dark-text-medium">{prof.cedula}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-medium dark:text-dark-text-medium">{prof.correo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-medium dark:text-dark-text-medium">{prof.rol}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={cn(
                        "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full",
                        prof.estatus === '1' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      )}>
                        {prof.estatus === '1' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className={cn("px-4 py-3 whitespace-nowrap text-sm", formStatus.statusClass)}>
                      {prof.formularios}
                      {formStatus.icon && <FontAwesomeIcon icon={formStatus.icon} className="ml-1.5" title={formStatus.title} />}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => onViewDetails(prof)} className="text-info hover:text-info/80" title="Ver Detalles"><FontAwesomeIcon icon={faEye} /></button>
                      <button onClick={() => onEdit(prof)} className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary" title="Editar"><FontAwesomeIcon icon={faEdit} /></button>
                      <button onClick={() => onDelete(prof.id)} className="text-danger hover:text-danger/80" title="Eliminar"><FontAwesomeIcon icon={faTrashAlt} /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            previousLabel={'« Ant'}
            nextLabel={'Sig »'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={'flex items-center space-x-1 sm:space-x-2 text-sm'}
            pageClassName={'mx-0.5'}
            pageLinkClassName={'px-3 py-1.5 rounded-md border border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg transition-colors'}
            previousClassName={'mx-0.5'}
            previousLinkClassName={'px-3 py-1.5 rounded-md border border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg transition-colors'}
            nextClassName={'mx-0.5'}
            nextLinkClassName={'px-3 py-1.5 rounded-md border border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg transition-colors'}
            breakClassName={'mx-0.5'}
            breakLinkClassName={'px-3 py-1.5 rounded-md border border-light-border dark:border-dark-border'}
            activeClassName={'!border-transparent'}
            activeLinkClassName={'!bg-primary !text-white !border-primary dark:!bg-primary-light dark:!text-secondary'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
            forcePage={currentPage} // Sincroniza con el estado
          />
        </div>
      )}
    </div>
  );
}