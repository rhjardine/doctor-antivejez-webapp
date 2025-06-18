'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faTimes, faUserCircle, faCamera, faStethoscope, faIdCard, faChevronUp, faChevronDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { createOrUpdatePatient } from '@/lib/actions/patientActions';
import type { Patient } from '@prisma/client';
// Asumimos que estos helpers existen en la ruta especificada
import { OPCIONES_NACIONALIDAD, OPCIONES_GENERO_HISTORIA, OPCIONES_GRUPO_SANGUINEO, OPCIONES_EDO_CIVIL } from '@/utils/constants';
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput';
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect';
import FormGroupTextarea from '@/components/GuiaPaciente/FormGroupTextarea';

// Botón de envío con estado de carga automático
function SubmitButton({ isEditMode, isSuccess }: { isEditMode: boolean, isSuccess: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || isSuccess}
      className={`px-8 py-3 rounded-lg font-bold text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg ${isSuccess ? 'bg-green-500' : 'bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)]'} disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {pending ? <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" /> : isSuccess ? <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" />}
      {pending ? 'Guardando...' : isSuccess ? '¡Guardado!' : (isEditMode ? 'Actualizar Historia' : 'Guardar Historia')}
    </button>
  );
}

interface PatientFormProps {
  patient?: Patient | null; // El paciente a editar (opcional)
}

/**
 * Formulario completo para crear o editar un paciente, utilizando React Hooks y Server Actions.
 */
export default function PatientForm({ patient }: PatientFormProps) {
  const router = useRouter();
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createOrUpdatePatient, initialState);
  
  const [edadCronologica, setEdadCronologica] = useState<number | string>('');
  const [showSeccionDetallada, setShowSeccionDetallada] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(patient?.photo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (patient?.birth_date) {
      calculateAge(new Date(patient.birth_date).toISOString().split('T')[0]);
    }
  }, [patient]);
  
  const calculateAge = (fechaNac: string) => {
    if (!fechaNac) { setEdadCronologica(''); return; }
    const birthDate = new Date(fechaNac);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    setEdadCronologica(age >= 0 ? age : '');
  };

  const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    calculateAge(e.target.value);
  };
  
  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoPreview(URL.createObjectURL(file));
    }
  };
  
  const commonInputStyles = "w-full p-2.5 border-2 border-[rgb(35,188,239)]/30 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[rgb(35,188,239)]/50 focus:border-[rgb(35,188,239)] outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:border-[rgb(35,188,239)]/50";
  const commonLabelStyles = "block text-sm font-semibold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-1";

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 rounded-xl shadow-2xl w-full border-2 border-[rgb(35,188,239)]/20">
      <form action={dispatch} className="space-y-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[rgb(35,188,239)] to-[rgb(41,59,100)] rounded-full flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faStethoscope} className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)] bg-clip-text text-transparent dark:text-white">
                  {patient ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
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
                {fotoPreview ? <img src={fotoPreview} alt="Foto del Paciente" className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-gray-400" />}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faCamera} size="lg" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFotoChange} className="hidden" accept="image/*" />
              </div>
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-[#23BCEF] hover:underline">
              {fotoPreview ? 'Cambiar Foto' : 'Adjuntar Foto'}
            </button>
            <FormGroupTextarea label="Dirección:" name="address" defaultValue={patient?.address || ''} rows={4} placeholder="Av. Principal, Edificio X..." className="w-full" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
            <FormGroupTextarea label="Observaciones:" name="general_observations" defaultValue={patient?.general_observations || ''} rows={4} placeholder="Alergias, condiciones..." className="w-full" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
          </div>

          <div className="md:col-span-4 bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <h3 className="text-lg font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faIdCard} /> Información Personal
            </h3>
            {patient && <input type="hidden" name="id" value={patient.id} />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroupSelect label="Nacionalidad *" name="nationality" defaultValue={patient?.nationality || 'V'} options={OPCIONES_NACIONALIDAD} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Identificación *" name="document_number" defaultValue={patient?.document_number || ''} required placeholder="V12345678" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Fecha Historia *" name="history_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Apellidos *" name="surnames" defaultValue={patient?.surnames || ''} required placeholder="Ingrese apellidos" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Nombres *" name="names" defaultValue={patient?.names || ''} required placeholder="Ingrese nombres" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Fecha Nacimiento *" name="birth_date" type="date" defaultValue={patient?.birth_date ? new Date(patient.birth_date).toISOString().split('T')[0] : ''} onChange={handleBirthDateChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Edad Cronológica" name="edadCronologica" value={String(edadCronologica)} readOnly inputClassName={`${commonInputStyles} bg-gray-100 dark:bg-gray-700 cursor-not-allowed`} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Género *" name="gender" defaultValue={patient?.gender || 'Femenino'} options={OPCIONES_GENERO_HISTORIA} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Lugar Nacimiento" name="birth_place" defaultValue={patient?.birth_place || ''} placeholder="Ciudad, País" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Teléfono" name="phone" defaultValue={patient?.phone || ''} placeholder="+58 412 1234567" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Edo. Civil" name="marital_status" defaultValue={patient?.marital_status || ''} options={OPCIONES_EDO_CIVIL} selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Profesión" name="occupation" defaultValue={patient?.occupation || ''} placeholder="Ej: Administrador" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="País Residencia" name="country" defaultValue={patient?.country || ''} placeholder="País" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Estado/Provincia" name="state_province" defaultValue={patient?.state_province || ''} placeholder="Estado" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="Ciudad" name="city" defaultValue={patient?.city || ''} placeholder="Ciudad" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupSelect label="Grupo Sanguíneo" name="blood_type" defaultValue={patient?.blood_type || ''} options={OPCIONES_GRUPO_SANGUINEO} selectClassName={commonInputStyles} labelClassName={commonLabelStyles} />
              <FormGroupInput label="E-mail" name="email" type="email" defaultValue={patient?.email || ''} placeholder="correo@ejemplo.com" className="sm:col-span-2 lg:col-span-1" inputClassName={commonInputStyles} labelClassName={commonLabelStyles} />
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
             {/* ... Campos de la sección detallada ... */}
           </div>
        )}

        <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-all">
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
          </button>
          <SubmitButton isEditMode={!!patient} isSuccess={state.message === 'redirect'} />
        </div>
        
        {state.message && state.message !== 'redirect' && (
            <div className="mt-4 p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
                <p className="font-bold">Error al Guardar:</p>
                <p>{state.message}</p>
            </div>
        )}
      </form>
    </div>
  );
}
