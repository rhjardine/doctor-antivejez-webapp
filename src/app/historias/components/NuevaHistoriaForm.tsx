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
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput'; // Asumo que este componente existe o lo crearás
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect'; // Asumo que este componente existe o lo crearás
import FormGroupTextarea from '@/components/GuiaPaciente/FormGroupTextarea'; // Asumo que este componente existe o lo crearás

// Importar usePatient (Asegúrate de que PatientProvider esté configurado y envolviendo esta parte de la app)
import { usePatient } from '@/contexts/PatientProvider'; // Asumo que la ruta es correcta

interface NuevaHistoriaFormProps {
  initialData?: HistoriaClinicaData | null;
  onSave: (data: HistoriaClinicaData) => Promise<void>; // onSave ahora recibe la historia guardada
  onCancel: () => void;
}

const initialFormData: HistoriaClinicaData = {
  // ... (el resto de initialFormData como lo tenías antes) ...
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
  // patientId será añadido dinámicamente si hay un currentPatient
};

export default function NuevaHistoriaForm({ initialData, onSave, onCancel }: NuevaHistoriaFormProps) {
  const [formData, setFormData] = useState<HistoriaClinicaData>(initialData || initialFormData);
  const [edadCronologica, setEdadCronologica] = useState<number | string>('');
  const [showSeccionDetallada, setShowSeccionDetallada] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(initialData?.fotoUrl || null);
  
  // Nuevos estados añadidos
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar el contexto de paciente
  const { currentPatient, savePatientHistory } = usePatient(); // Asegúrate de que PatientProvider esté implementado y funcione

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
      setFormData({...initialFormData}); // Resetea al estado inicial si no hay initialData
      setEdadCronologica('');
      setFotoPreview(null);
      setSelectedFoto(null);
    }
  }, [initialData]);

  const calculateAge = (fechaNac: string) => {
    if (!fechaNac) {
      setEdadCronologica('');
      setFormData(prev => ({ ...prev, edadCronologica: undefined }));
      return;
    }
    try {
      const birthDate = new Date(fechaNac);
      if (isNaN(birthDate.getTime())) { // Verifica si la fecha es válida
        setEdadCronologica('');
        setFormData(prev => ({ ...prev, edadCronologica: undefined }));
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
      setFormData(prev => ({ ...prev, edadCronologica: age >= 0 ? age : undefined }));
    } catch (error) {
      console.error("Error calculando edad:", error);
      setEdadCronologica('');
      setFormData(prev => ({ ...prev, edadCronologica: undefined }));
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
      // Aquí podrías añadir validación de tamaño o tipo de archivo si es necesario
      setSelectedFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Modificado handleSubmit para usar savePatientHistory
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveError(null); // Resetea errores previos

      // Preparar datos para guardar
      let dataToSave: HistoriaClinicaData = { ...formData };

      // Si hay un paciente activo, asociar la historia
      if (currentPatient?.id) {
        // Asegúrate de que tu tipo HistoriaClinicaData tenga un campo opcional patientId
        // Si no lo tiene, necesitas añadirlo a la definición del tipo.
        (dataToSave as any).patientId = currentPatient.id; // Usamos 'as any' si patientId no está en el tipo, pero es mejor añadirlo
      }

      // Si hay foto seleccionada
      if (selectedFoto) {
        // Aquí iría la lógica REAL para subir la foto a un servidor (ej. a un bucket S3, Firebase Storage, etc.)
        // Por ahora, simulamos y usamos el preview local. En un caso real, la subida devolvería una URL.
        console.log("Simulando subida de foto:", selectedFoto.name);
        // dataToSave.fotoUrl = await uploadFileAndGetURL(selectedFoto); // Ejemplo de función de subida
        dataToSave.fotoUrl = fotoPreview || ''; // Mantenemos el preview como placeholder
      }

      // Guardar usando la función del contexto (esta función debería devolver la historia guardada/actualizada)
      const savedHistory = await savePatientHistory(dataToSave); // Asume que savePatientHistory devuelve la historia

      // Llamar al callback de onSave con la historia guardada (que podría tener un ID asignado por el backend, etc.)
      await onSave(savedHistory);
      // Podrías mostrar un toast de éxito aquí
    } catch (error) {
      console.error("Error al guardar la historia:", error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar la historia.';
      setSaveError(errorMessage);
      // Podrías mostrar un toast de error aquí
    } finally {
      setIsSaving(false);
    }
  };

  const commonInputStyles = "w-full p-3 border-2 border-[rgb(35,188,239)]/30 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[rgb(35,188,239)]/50 focus:border-[rgb(35,188,239)] outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 hover:border-[rgb(35,188,239)]/50";
  const commonLabelStyles = "block text-sm font-semibold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-2";

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-2xl w-full border-2 border-[rgb(35,188,239)]/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ... (Header como lo tenías) ... */}
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

        {/* ... (Sección principal con Foto y Formulario como lo tenías) ... */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          {/* Columna izquierda - Foto y observaciones */}
          <div className="md:col-span-1 flex flex-col items-center">
             {/* ... (Código de Foto y Observaciones como lo tenías) ... */}
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

          {/* Columna derecha - Formulario principal */}
          <div className="md:col-span-4">
             {/* ... (Sección de información personal como la tenías) ... */}
            <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-[rgb(35,188,239)]/20 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-[rgb(35,188,239)]" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ... (Todos tus FormGroupInput y FormGroupSelect para info personal) ... */}
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

        {/* ... (Botón de Mostrar/Ocultar Sección Detallada como lo tenías) ... */}
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
             {/* ... (Todo el contenido de la sección detallada como lo tenías) ... */}
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

            <FormGroupTextarea
              label="Antecedentes Personales:"
              name="antecedentesPersonales"
              value={formData.antecedentesPersonales || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Ej: Asma diagnosticada en la infancia, apendicectomía a los 15 años."
              inputClassName={commonInputStyles}
              labelClassName={commonLabelStyles}
            />

            {(formData.genero === 'Femenino' || formData.genero === 'Femenino Deportivo') && (
              <FormGroupTextarea
                label="Antecedentes Gineco-Obstétricos:"
                name="antecedentesGinecoObstetricos"
                value={formData.antecedentesGinecoObstetricos || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Menarquia, FUM, Gesta, Para, Abortos, Cesáreas, MAC."
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
            )}

            <FormGroupTextarea
              label="Medicamentos Actuales:"
              name="medicamentosActuales"
              value={formData.medicamentosActuales || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Nombre del medicamento, dosis, frecuencia. Ej: Losartán 50mg OD."
              inputClassName={commonInputStyles}
              labelClassName={commonLabelStyles}
            />

            <FormGroupTextarea
              label="Enfermedad Actual / Motivo de Consulta:"
              name="enfermedadActual"
              value={formData.enfermedadActual || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción detallada de los síntomas actuales y su evolución."
              inputClassName={commonInputStyles}
              labelClassName={commonLabelStyles}
            />

            {/* Examen Funcional */}
            <h4 className="text-lg font-semibold pt-4 text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] flex items-center gap-2">
              <FontAwesomeIcon icon={faStethoscope} className="text-[rgb(35,188,239)]" />
              Examen Funcional por Sistemas:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormGroupInput
                label="General:"
                name="examenFuncionalGeneral"
                value={formData.examenFuncionalGeneral || ''}
                onChange={handleChange}
                placeholder="Fiebre, astenia, pérdida de peso"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
              {/* Agregar más campos del examen funcional aquí */}
            </div>

            {/* Examen Físico */}
            <h3 className="text-lg font-semibold pt-6 text-[rgb(41,59,100)] dark:text-[rgb(35,188,239)] flex items-center gap-2">
              <FontAwesomeIcon icon={faStethoscope} className="text-[rgb(35,188,239)]" />
              Examen Físico
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <FormGroupInput
                label="TA (Sistólica):"
                name="taSistolica"
                type="number"
                value={formData.taSistolica ?? ''}
                onChange={handleNumberChange}
                placeholder="mmHg"
                inputClassName={commonInputStyles}
                labelClassName={commonLabelStyles}
              />
              {/* Agregar más campos del examen físico aquí */}
            </div>
          </div>
        )}

        {/* Mostrar mensaje de error si existe */}
        {saveError && (
          <div className="my-4 rounded-md border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
            <p className="font-bold">Error al guardar</p>
            <p>{saveError}</p>
          </div>
        )}

        {/* Botones de acción */}
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