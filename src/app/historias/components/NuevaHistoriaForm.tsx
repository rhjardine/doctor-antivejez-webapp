// src/app/historias/components/NuevaHistoriaForm.tsx
'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCamera, faChevronDown, faChevronUp, faSave, faTimes, faStethoscope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { HistoriaClinicaData, NacionalidadType, GeneroType, GrupoSanguineoType, EdoCivilType } from '@/types/historia';
import {
  OPCIONES_NACIONALIDAD,
  OPCIONES_GENERO_HISTORIA,
  OPCIONES_GRUPO_SANGUINEO,
  OPCIONES_EDO_CIVIL
} from '@/utils/constants';
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput';
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect';
import FormGroupTextarea from '@/components/GuiaPaciente/FormGroupTextarea';
import { usePatient } from '@/contexts/PatientProvider';

interface NuevaHistoriaFormProps {
  initialData?: HistoriaClinicaData | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const initialFormData: HistoriaClinicaData = {
  nacionalidad: '' as NacionalidadType,
  identificacion: '',
  fechaHistoria: new Date().toISOString().split('T')[0],
  apellidos: '',
  nombres: '',
  fechaNacimiento: '',
  genero: '' as GeneroType,
  lugarNacimiento: '',
  telefono: '',
  edoCivil: '' as EdoCivilType,
  profesion: '',
  paisResidencia: '',
  estadoProvinciaResidencia: '',
  ciudad: '',
  direccion: '',
  grupoSanguineo: '' as GrupoSanguineoType,
  email: '',
  observacionesGenerales: '',
  referidoPor: '',
  noHistoria: '',
  antecedentesFamiliares: '',
  antecedentesPersonales: '',
  antecedentesGinecoObstetricos: '',
  medicamentosActuales: '',
  enfermedadActual: '',
  examenFuncionalGeneral: '',
  examenFuncionalApetencias: '',
  examenFuncionalAdicciones: '',
  examenFuncionalCardiovascular: '',
  examenFuncionalEvacuacion: '',
  examenFuncionalSexual: '',
  examenFuncionalMental: '',
  examenFuncionalIntolerancias: '',
  examenFuncionalSudorTemp: '',
  examenFuncionalRespiratorio: '',
  examenFuncionalMiccion: '',
  examenFuncionalSueno: '',
  examenFuncionalEmocional: '',
  taSistolica: undefined,
  taDiastolica: undefined,
  pulso: undefined,
  peso: undefined,
  talla: undefined,
  imc: undefined,
  porcentajeGrasa: undefined,
  examenFisicoCabeza: '',
  examenFisicoCuello: '',
  examenFisicoCorazon: '',
  examenFisicoAbdomen: '',
  examenFisicoGenitales: '',
  examenFisicoPiel: '',
  examenFisicoTorax: '',
  examenFisicoPulmon: '',
  examenFisicoLumbar: '',
  examenFisicoExtremidades: '',
  fechaLaboratorio: '',
  laboratorioHematologia: '',
  laboratorioBioquimica: '',
  laboratorioOrina: '',
  laboratorioOtros: '',
  laboratorioHeces: '',
  impresionDiagnostica: '',
  tratamiento: '',
  observacionesAdicionales: '',
  fotoUrl: '',
};

export default function NuevaHistoriaForm({ initialData, onSave, onCancel }: NuevaHistoriaFormProps) {
  const [formData, setFormData] = useState<HistoriaClinicaData>(initialData || initialFormData);
  const [edadCronologica, setEdadCronologica] = useState<number | string>('');
  const [showSeccionDetallada, setShowSeccionDetallada] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(initialData?.fotoUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentPatient } = usePatient();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.fechaNacimiento) {
        calculateAge(initialData.fechaNacimiento);
      } else {
        setEdadCronologica('');
      }
      setFotoPreview(initialData.fotoUrl || null);
    } else {
      setFormData({ ...initialFormData });
      setEdadCronologica('');
      setFotoPreview(null);
      setSelectedFoto(null);
    }
  }, [initialData]);

  const calculateAge = (fechaNac: string) => {
    if (!fechaNac) {
      setEdadCronologica('');
      return;
    }
    try {
      const birthDate = new Date(fechaNac);
      if (isNaN(birthDate.getTime())) {
        setEdadCronologica('');
        return;
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      const finalAge = age >= 0 ? age : '';
      setEdadCronologica(finalAge);
    } catch (error) {
      console.error("Error calculando edad:", error);
      setEdadCronologica('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'fechaNacimiento') {
      calculateAge(value);
    }
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : parseFloat(value) }));
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };
  
  // *** INICIO DE LA MODIFICACIÓN CLAVE ***
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    // Mapeo de datos del formulario al formato que espera la API de Prisma
    const dataToSend = {
      surnames: formData.apellidos,
      names: formData.nombres,
      identification_number: formData.identificacion,
      nationality: formData.nacionalidad,
      birth_date: formData.fechaNacimiento,
      gender: formData.genero,
      birth_place: formData.lugarNacimiento,
      marital_status: formData.edoCivil,
      occupation: formData.profesion,
      address: formData.direccion,
      country: formData.paisResidencia,
      state_province: formData.estadoProvinciaResidencia,
      city: formData.ciudad,
      phone_number: formData.telefono,
      email: formData.email,
      blood_type: formData.grupoSanguineo,
      general_observations: formData.observacionesGenerales,
      // La fotoUrl se manejaría aquí después de subir el archivo
      photo_url: fotoPreview, 
    };

    try {
      // Llamada directa a la nueva API Route que usa Prisma
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // Si el backend devuelve un error, lo capturamos y mostramos
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error del servidor al guardar la historia.');
      }

      const savedHistory = await response.json();
      
      // Llamamos a la función onSave del componente padre para que la app reaccione
      await onSave(savedHistory);

    } catch (error) {
      console.error("Error en handleSubmit:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar.';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  // *** FIN DE LA MODIFICACIÓN CLAVE ***

  const commonInputStyles = "w-full p-3 border-2 border-[rgb(35,188,239)]/30 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[rgb(35,188,239)]/50 focus:border-[rgb(35,188,239)] outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:border-[rgb(35,188,239)]/50";
  const commonLabelStyles = "block text-sm font-semibold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-2";

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-2xl w-full border-2 border-[rgb(35,188,239)]/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(35,188,239)] to-[rgb(41,59,100)] rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faStethoscope} className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)] bg-clip-text text-transparent">
                {initialData ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
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
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[rgb(35,188,239)]/20 to-[rgb(41,59,100)]/20 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden border-4 border-[rgb(35,188,239)]/30 shadow-xl relative group">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto paciente" className="w-full h-full object-cover" />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} className="w-20 h-20 text-[rgb(35,188,239)]/50" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-gradient-to-t from-[rgb(41,59,100)]/80 to-transparent flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full"
                  title="Cambiar foto"
                >
                  <FontAwesomeIcon icon={faCamera} size="lg" />
                </button>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[rgb(35,188,239)] to-[rgb(41,59,100)] rounded-full flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCamera} className="text-white text-xs" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-[rgb(35,188,239)] hover:text-[rgb(41,59,100)] transition-colors duration-300 mb-6 px-4 py-2 rounded-full border border-[rgb(35,188,239)]/30 hover:bg-[rgb(35,188,239)]/10"
            >
              {fotoPreview ? 'Cambiar Foto' : 'Adjuntar Foto'}
            </button>

            <div className="w-full bg-gradient-to-br from-[rgb(35,188,239)]/5 to-[rgb(41,59,100)]/5 p-4 rounded-lg border border-[rgb(35,188,239)]/20 mb-4">
              <FormGroupTextarea
                label="Dirección:"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows={3}
                placeholder="Av. Principal, Edificio X, Piso Y, Apto Z, Ciudad, Estado"
                className="w-full"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
            </div>

            <div className="w-full bg-gradient-to-br from-[rgb(35,188,239)]/5 to-[rgb(41,59,100)]/5 p-4 rounded-lg border border-[rgb(35,188,239)]/20">
              <FormGroupTextarea
                label="Observaciones Generales:"
                name="observacionesGenerales"
                value={formData.observacionesGenerales}
                onChange={handleChange}
                rows={3}
                placeholder="Alergias conocidas, condiciones preexistentes importantes, etc."
                className="w-full"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-[rgb(35,188,239)]/20 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-[rgb(35,188,239)]" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormGroupSelect
                  label="Nacionalidad: *"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  options={OPCIONES_NACIONALIDAD}
                  required
                  selectClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Identificación (C.I./Pasaporte): *"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: V12345678 / PEXXXX"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Fecha Historia: *"
                  name="fechaHistoria"
                  type="date"
                  value={formData.fechaHistoria}
                  onChange={handleChange}
                  required
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Apellidos: *"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese apellidos completos"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Nombres: *"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese nombres completos"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Fecha Nacimiento: *"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                  placeholder="AAAA-MM-DD"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Edad Cronológica:"
                  name="edadCronologica"
                  value={String(edadCronologica)}
                  readOnly
                  inputClassName={`${commonInputStyles} bg-gradient-to-r from-[rgb(35,188,239)]/10 to-[rgb(41,59,100)]/10 cursor-not-allowed font-semibold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)]`}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupSelect
                  label="Género: *"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  options={OPCIONES_GENERO_HISTORIA}
                  required
                  selectClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Lugar Nacimiento:"
                  name="lugarNacimiento"
                  value={formData.lugarNacimiento}
                  onChange={handleChange}
                  placeholder="Ciudad, País de nacimiento"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Teléfono:"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +58 412 1234567"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupSelect
                  label="Edo. Civil:"
                  name="edoCivil"
                  value={formData.edoCivil}
                  onChange={handleChange}
                  options={OPCIONES_EDO_CIVIL}
                  selectClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Profesión:"
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  placeholder="Ej: Ingeniero de Software"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="País Residencia:"
                  name="paisResidencia"
                  value={formData.paisResidencia}
                  onChange={handleChange}
                  placeholder="País actual de residencia"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Estado/Provincia Residencia:"
                  name="estadoProvinciaResidencia"
                  value={formData.estadoProvinciaResidencia}
                  onChange={handleChange}
                  placeholder="Estado o provincia actual"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="Ciudad:"
                  name="ciudad"
                  value={formData.ciudad || ''}
                  onChange={handleChange}
                  placeholder="Ciudad de residencia"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupSelect
                  label="Grupo Sanguíneo:"
                  name="grupoSanguineo"
                  value={formData.grupoSanguineo}
                  onChange={handleChange}
                  options={OPCIONES_GRUPO_SANGUINEO}
                  selectClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
                <FormGroupInput
                  label="E-mail:"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="sm:col-span-2 lg:col-span-1"
                  inputClassName={commonInputStyles}
                  labelClassName={commonLabelStyles}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-[rgb(35,188,239)]/20">
          <button
            type="button"
            onClick={() => setShowSeccionDetallada(!showSeccionDetallada)}
            className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-[rgb(35,188,239)]/10 to-[rgb(41,59,100)]/10 hover:from-[rgb(35,188,239)]/20 hover:to-[rgb(41,59,100)]/20 rounded-xl text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] font-semibold transition-all duration-300 border-2 border-[rgb(35,188,239)]/20 hover:border-[rgb(35,188,239)]/40 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-3">
              <FontAwesomeIcon icon={faStethoscope} className="text-[rgb(35,188,239)]" />
              {showSeccionDetallada ? 'Ocultar' : 'Mostrar'} Sección Detallada de Historia Clínica
            </span>
            <FontAwesomeIcon
              icon={showSeccionDetallada ? faChevronUp : faChevronDown}
              className={`transition-transform duration-300 ${showSeccionDetallada ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showSeccionDetallada && (
          <div className="space-y-6 pt-6 border-t-2 border-[rgb(35,188,239)]/20 mt-6 bg-gradient-to-br from-[rgb(35,188,239)]/5 to-[rgb(41,59,100)]/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] flex items-center gap-3">
              <FontAwesomeIcon icon={faStethoscope} className="text-[rgb(35,188,239)]" />
              Antecedentes y Examen Funcional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroupInput
                label="Referido por:"
                name="referidoPor"
                value={formData.referidoPor || ''}
                onChange={handleChange}
                placeholder="Nombre del médico o persona referente"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
              <FormGroupInput
                label="No. Historia (Opcional):"
                name="noHistoria"
                value={formData.noHistoria || ''}
                onChange={handleChange}
                placeholder="Número de historia clínica anterior"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
            </div>
            <FormGroupTextarea
              label="Antecedentes Familiares:"
              name="antecedentesFamiliares"
              value={formData.antecedentesFamiliares || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Madre con Diabetes Mellitus Tipo 2, Padre con Hipertensión Arterial."
              inputClassName={commonInputStyles}
              labelClassName={commonLabelStyles}
            />
            {/* ... Resto de los campos de la sección detallada ... */}
          </div>
        )}
        
        {saveError && (
          <div className="my-4 rounded-md border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
            <p className="font-bold">Error al guardar</p>
            <p>{saveError}</p>
          </div>
        )}
        
        <div className="mt-8 flex justify-end gap-4 border-t-2 border-[rgb(35,188,239)]/20 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-3 rounded-xl border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faTimes} />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[rgb(35,188,239)] to-[rgb(41,59,100)] px-8 py-3 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-[rgb(35,188,239)]/90 hover:to-[rgb(41,59,100)]/90 focus:outline-none focus:ring-4 focus:ring-[rgb(35,188,239)]/30 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faSave} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Guardando...' : (initialData ? 'Actualizar Historia' : 'Guardar Historia')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
