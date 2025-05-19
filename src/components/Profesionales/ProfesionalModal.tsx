// src/components/Profesionales/ProfesionalModal.tsx
'use client';

import React, { useEffect, useState, FormEvent } from 'react'; // Importa React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { Profesional, CreateProfesionalData, UpdateProfesionalData, ProfesionalRolType } from '@/types'; // Asegúrate que los tipos Create/Update estén definidos
import { PROFESIONAL_ROLES, ProfesionalRolConstant } from '@/utils/constants'; // Importa PROFESIONAL_ROLES y su tipo
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput';
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect';
// import { cn } from '@/utils/helpers'; // cn no se usa en este archivo, se puede quitar

type ModalMode = 'add' | 'edit' | 'view';

interface ProfesionalModalProps {
  isOpen: boolean;
  mode: ModalMode;
  profesionalData?: Profesional | null;
  onClose: () => void;
  onSave: (data: CreateProfesionalData | UpdateProfesionalData) => void; // Usa los tipos más específicos
  roles: ProfesionalRolConstant[]; // Recibe los roles para el selector
}

// Define un tipo más preciso para el estado del formulario al añadir
type NewProfesionalFormState = Omit<Profesional, 'id' | 'fechaRegistro' | 'formularios'> & { formularios?: number };


const initialFormState: NewProfesionalFormState = {
  nombre: '',
  apellido: '',
  cedula: '',
  correo: '',
  rol: '', // Será el ID del rol, ej: 'medico' o 'coach'
  estatus: '1', // Activo por defecto
  telefono: '',
  especialidad: '',
  // formularios se inicializará en 0 para nuevos
};

export default function ProfesionalModal({
  isOpen,
  mode,
  profesionalData,
  onClose,
  onSave,
  roles, // Usa la prop roles
}: ProfesionalModalProps) {
  // El estado del formulario puede ser un Profesional completo (para editar/ver) o el estado inicial (para añadir)
  const [formData, setFormData] = useState<Profesional | NewProfesionalFormState>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if ((mode === 'edit' || mode === 'view') && profesionalData) {
        setFormData(profesionalData);
      } else if (mode === 'add') {
        setFormData({ ...initialFormState, formularios: 0 }); // Resetea y asegura formularios en 0
      }
    } else {
      // Opcional: resetear el formulario cuando el modal se cierra si no se guardó
      // setFormData({ ...initialFormState, formularios: 0 });
    }
  }, [isOpen, mode, profesionalData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.correo || !formData.rol) {
      alert('Por favor, completa todos los campos obligatorios: Nombre, Apellido, Cédula, Correo y Rol.');
      return;
    }
    // Prepara los datos para guardar. El tipo exacto depende de si es 'add' o 'edit'
    if (mode === 'edit' && 'id' in formData) {
        const { id, fechaRegistro, ...updateData } = formData as Profesional; // Excluye campos que no se actualizan o son manejados por el backend
        onSave(updateData as UpdateProfesionalData); // Asegura que updateData coincida con UpdateProfesionalData
    } else {
        const { fechaRegistro, ...createData } = formData as NewProfesionalFormState;
        onSave(createData as CreateProfesionalData); // Asegura que createData coincida con CreateProfesionalData
    }
  };

  const modalTitle = mode === 'add' ? 'Añadir Profesional' : mode === 'edit' ? 'Editar Profesional' : 'Detalles del Profesional';
  const isViewMode = mode === 'view';

  const commonInputStyles = "w-full p-2.5 border border-light-border/70 dark:border-dark-border/70 rounded-lg text-sm bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary/50 focus:border-primary-light outline-none transition-all duration-150 ease-in-out shadow-sm hover:border-primary/70 dark:hover:border-primary-light/50";
  const disabledStyles = isViewMode ? "disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:opacity-70" : "";


  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300 opacity-100" // Asegura opacidad inicial
      // onClick={onClose} // Quitado para evitar cierre accidental si el contenido del modal es más pequeño que el viewport
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin"
        // onClick={(e) => e.stopPropagation()} // No es necesario si el overlay no cierra al hacer clic
      >
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-light-border dark:border-dark-border">
          <h3 id="modal-title" className="text-xl font-semibold text-primary dark:text-primary-light">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="p-1 text-text-light hover:text-danger dark:text-dark-text-light dark:hover:text-danger rounded-full hover:bg-danger/10"
            aria-label="Cerrar modal"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroupInput label="Nombre:" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          <FormGroupInput label="Apellido:" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          <FormGroupInput label="Cédula:" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          <FormGroupInput label="Correo:" id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} required disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          <FormGroupInput label="Teléfono:" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          <FormGroupInput label="Especialidad:" id="especialidad" name="especialidad" value={formData.especialidad || ''} onChange={handleChange} disabled={isViewMode} inputClassName={`${commonInputStyles} ${disabledStyles}`} />
          
          <FormGroupSelect label="Rol:" id="rol" name="rol" value={String(formData.rol)} onChange={handleChange} required disabled={isViewMode} selectClassName={`${commonInputStyles} ${disabledStyles}`}>
            <option value="" disabled>Seleccione un Rol</option>
            {/* CORRECCIÓN DE KEY Y VALUE: Usa rol.id para el value y rol.id (o un string único) para la key */}
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </FormGroupSelect>
          
          <FormGroupSelect label="Estatus:" id="estatus" name="estatus" value={String(formData.estatus)} onChange={handleChange} disabled={isViewMode} selectClassName={`${commonInputStyles} ${disabledStyles}`}>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </FormGroupSelect>
          
          {/* Mostrar formularios solo si es modo edición/vista y el dato existe */}
          {(mode === 'edit' || mode === 'view') && 'formularios' in formData && (
             <FormGroupInput 
                label="Formularios Usados:" 
                id="formularios" 
                name="formularios" 
                type="number" 
                value={(formData as Profesional).formularios ?? 0} 
                readOnly // Siempre readOnly desde el modal
                inputClassName={`${commonInputStyles} bg-gray-100 dark:bg-gray-700/50 cursor-default`} 
             />
          )}


          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-5 border-t border-light-border dark:border-dark-border mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-light-border dark:border-dark-border text-text-medium dark:text-dark-text-medium hover:bg-gray-100 dark:hover:bg-dark-bg font-medium transition-colors shadow-sm hover:shadow"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}