// src/app/historias/components/NuevaHistoriaForm.tsx
'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faCamera, faSave, faTimes, faStethoscope, faIdCard,
  faChevronDown, faChevronUp, faCheckCircle, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import type { Patient } from '@prisma/client';

import { OPCIONES_NACIONALIDAD, OPCIONES_GENERO_HISTORIA, OPCIONES_GRUPO_SANGUINEO, OPCIONES_EDO_CIVIL } from '@/utils/constants';
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput';
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect';
import FormGroupTextarea from '@/components/GuiaPaciente/FormGroupTextarea';

interface NuevaHistoriaFormProps {
  initialData?: Partial<Patient> | null;
  onSave: (data: Patient) => Promise<void>;
  onCancel: () => void;
  patientId?: string;
}

// Extendemos Partial<Patient> para incluir campos del formulario detallado
interface FormData extends Partial<Patient> {
  referidoPor?: string;
  noHistoria?: string;
  antecedentesFamiliares?: string;
  // ... otros campos detallados si los necesitas
}


const initialFormData: FormData = {
  nationality: 'Venezolano(a)',
  gender: 'Femenino',
  // ... inicializar otros campos con valores por defecto
};

export default function NuevaHistoriaForm({ initialData, onSave, onCancel, patientId }: NuevaHistoriaFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [edadCronologica, setEdadCronologica] = useState<number | string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSeccionDetallada, setShowSeccionDetallada] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dataToLoad = initialData || initialFormData;
    const formattedData = {
      ...dataToLoad,
      birth_date: dataToLoad.birth_date ? new Date(dataToLoad.birth_date).toISOString().split('T')[0] : '',
      history_date: dataToLoad.history_date ? new Date(dataToLoad.history_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };
    setFormData(formattedData as any);
    if (formattedData.birth_date) {
      calculateAge(formattedData.birth_date);
    }
    setFotoPreview(initialData?.photo_url || null);
    setIsSuccess(false);
    setSaveError(null);
  }, [initialData]);

  const calculateAge = (fechaNac: string) => {
    if (!fechaNac) { setEdadCronologica(''); return; }
    const birthDate = new Date(fechaNac);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    setEdadCronologica(age >= 0 ? age : '');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'birth_date') calculateAge(value);
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    setSaveError(null);

    const isEditMode = !!patientId;
    const apiUrl = isEditMode ? `/api/patients/${patientId}` : '/api/patients';
    const apiMethod = isEditMode ? 'PUT' : 'POST';

    // Excluimos los campos opcionales que no están en el modelo Patient
    const { referidoPor, noHistoria, antecedentesFamiliares, ...patientData } = formData;
    const dataToSend = { ...patientData, photo_url: fotoPreview };

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || `Error del servidor`);

      setIsSuccess(true);
      setTimeout(() => onSave(responseData), 1500);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Error desconocido');
      setIsSaving(false);
    }
  };

  const commonInputStyles = "w-full p-2.5 border-2 border-[rgb(35,188,239)]/30 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[rgb(35,188,239)]/50 focus:border-[rgb(35,188,239)] outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:border-[rgb(35,188,239)]/50";
  const commonLabelStyles = "block text-sm font-semibold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-1";

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 rounded-xl shadow-2xl w-full border-2 border-[rgb(35,188,239)]/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(35,188,239)] to-[rgb(41,59,100)] rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faStethoscope} className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)] bg-clip-text text-transparent dark:text-white">
                {patientId ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete la información del paciente</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgb(35,188,239)]/10 to-[rgb(41,59,100)]/10 rounded-full border border-[rgb(35,188,239)]/20">
            <FontAwesomeIcon icon={faIdCard} className="text-[rgb(35,188,239)]" />
            <span className="text-sm font-medium text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)]">Datos del Paciente</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {fotoPreview ? <img src={fotoPreview} alt="Foto" className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-gray-400" />}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faCamera} size="lg" />
                </button>
              </div>
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-[#23BCEF] hover:underline">
              {fotoPreview ? 'Cambiar Foto' : 'Adjuntar Foto'}
            </button>
            <FormGroupTextarea label="Dirección:" name="address" value={formData.address || ''} onChange={handleChange} rows={4} placeholder="Av. Principal, Edificio X..." className="w-full" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
            <FormGroupTextarea label="Observaciones:" name="general_observations" value={formData.general_observations || ''} onChange={handleChange} rows={4} placeholder="Alergias, condiciones..." className="w-full" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
          </div>

          <div className="md:col-span-4 bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <h3 className="text-lg font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faIdCard} /> Información Personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroupSelect label="Nacionalidad *" name="nationality" value={formData.nationality} onChange={handleChange} options={OPCIONES_NACIONALIDAD} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Identificación (C.I./Pasaporte) *" name="identification_number" value={formData.identification_number} onChange={handleChange} required placeholder="V12345678" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Fecha Historia *" name="history_date" type="date" value={String(formData.history_date || '').split('T')[0]} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Apellidos *" name="surnames" value={formData.surnames} onChange={handleChange} required placeholder="Ingrese apellidos" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Nombres *" name="names" value={formData.names} onChange={handleChange} required placeholder="Ingrese nombres" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Fecha Nacimiento *" name="birth_date" type="date" value={String(formData.birth_date || '').split('T')[0]} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Edad Cronológica" name="edadCronologica" value={String(edadCronologica)} readOnly inputClassName={`${commonInputStyles} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Género *" name="gender" value={formData.gender} onChange={handleChange} options={OPCIONES_GENERO_HISTORIA} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Lugar Nacimiento" name="birth_place" value={formData.birth_place || ''} onChange={handleChange} placeholder="Ciudad, País" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Teléfono" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} placeholder="+58 412 1234567" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Edo. Civil" name="marital_status" value={formData.marital_status || ''} onChange={handleChange} options={OPCIONES_EDO_CIVIL} selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Profesión" name="occupation" value={formData.occupation || ''} onChange={handleChange} placeholder="Ej: Administrador" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="País Residencia" name="country" value={formData.country || ''} onChange={handleChange} placeholder="País" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Estado/Provincia" name="state_province" value={formData.state_province || ''} onChange={handleChange} placeholder="Estado" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Ciudad" name="city" value={formData.city || ''} onChange={handleChange} placeholder="Ciudad" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Grupo Sanguíneo" name="blood_type" value={formData.blood_type || ''} onChange={handleChange} options={OPCIONES_GRUPO_SANGUINEO} selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="E-mail" name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="correo@ejemplo.com" className="sm:col-span-2 lg:col-span-1" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={() => setShowSeccionDetallada(!showSeccionDetallada)} className="w-full flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] font-semibold transition-all">
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faStethoscope} /> {showSeccionDetallada ? 'Ocultar' : 'Mostrar'} Sección Detallada de Historia Clínica</span>
            <FontAwesomeIcon icon={showSeccionDetallada ? faChevronUp : faChevronDown} />
          </button>
        </div>

        {showSeccionDetallada && (
          <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)]">Antecedentes y Examen Funcional (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroupInput label="Referido por:" name="referidoPor" value={formData.referidoPor || ''} onChange={handleChange} placeholder="Nombre del médico" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="No. Historia (Opcional):" name="noHistoria" value={formData.noHistoria || ''} onChange={handleChange} placeholder="Número de historia anterior" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
            </div>
            <FormGroupTextarea label="Antecedentes Familiares:" name="antecedentesFamiliares" value={formData.antecedentesFamiliares || ''} onChange={handleChange} rows={3} placeholder="Ej: Madre con Diabetes, Padre con Hipertensión." inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
            {/* Aquí irían el resto de los campos de la sección detallada */}
          </div>
        )}

        {saveError && (
          <div className="my-4 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg" role="alert">
            <p className="font-bold">Error al guardar</p>
            <p>{saveError}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button type="button" onClick={onCancel} disabled={isSaving || isSuccess} className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-all hover:scale-105">
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
          </button>
          <button type="submit" disabled={isSaving || isSuccess} className={`px-8 py-3 rounded-lg font-bold text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg ${isSuccess ? 'bg-green-500' : 'bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)]'} disabled:opacity-70 disabled:cursor-not-allowed`}>
            {isSaving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : isSuccess ? <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" />}
            {isSaving ? 'Guardando...' : isSuccess ? '¡Guardado!' : (patientId ? 'Actualizar Historia' : 'Guardar Historia')}
          </button>
        </div>
      </form>
    </div>
  );
}
