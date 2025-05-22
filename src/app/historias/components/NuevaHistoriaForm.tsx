// src/app/historias/components/NuevaHistoriaForm.tsx 
'use client'; 
 
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUserCircle, faCamera, faChevronDown, faChevronUp, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'; 
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
import { cn } from '@/utils/helpers'; 
 
interface NuevaHistoriaFormProps { 
  initialData?: HistoriaClinicaData | null;
  onSave: (data: HistoriaClinicaData) => Promise<void>;
  onCancel: () => void; 
} 
 
const initialFormData: HistoriaClinicaData = { 
  nacionalidad: '', identificacion: '', fechaHistoria: new Date().toISOString().split('T')[0], apellidos: '', nombres: '', 
  fechaNacimiento: '', genero: '', lugarNacimiento: '', telefono: '', edoCivil: '', profesion: '', paisResidencia: '', 
  estadoProvinciaResidencia: '', direccion: '', grupoSanguineo: '', email: '', observacionesGenerales: '', 
  referidoPor: '', noHistoria: '', antecedentesFamiliares: '', antecedentesPersonales: '', 
  antecedentesGinecoObstetricos: '', medicamentosActuales: '', enfermedadActual: '', 
  examenFuncionalGeneral: '', examenFuncionalApetencias: '', examenFuncionalAdicciones: '',
  examenFuncionalCardiovascular: '', examenFuncionalEvacuacion: '', examenFuncionalSexual: '', 
  examenFuncionalMental: '', examenFuncionalIntolerancias: '', examenFuncionalSudorTemp: '', 
  examenFuncionalRespiratorio: '', examenFuncionalMiccion: '', examenFuncionalSueno: '', 
  examenFuncionalEmocional: '', taSistolica: undefined, taDiastolica: undefined, pulso: undefined, 
  peso: undefined, talla: undefined, imc: undefined, porcentajeGrasa: undefined, 
  examenFisicoCabeza: '', examenFisicoCuello: '', examenFisicoCorazon: '', examenFisicoAbdomen: '', 
  examenFisicoGenitales: '', examenFisicoPiel: '', examenFisicoTorax: '', examenFisicoPulmon: '', 
  examenFisicoLumbar: '', examenFisicoExtremidades: '', fechaLaboratorio: '', laboratorioHematologia: '', 
  laboratorioBioquimica: '', laboratorioOrina: '', laboratorioOtros: '', laboratorioHeces: '', 
  impresionDiagnostica: '', tratamiento: '', observacionesAdicionales: '', fotoUrl: '' 
}; 
 
export default function NuevaHistoriaForm({ initialData, onSave, onCancel }: NuevaHistoriaFormProps) { 
  const [formData, setFormData] = useState<HistoriaClinicaData>(initialData || initialFormData); 
  const [edadCronologica, setEdadCronologica] = useState<number | string>(''); 
  const [showSeccionDetallada, setShowSeccionDetallada] = useState(false); 
  const [selectedFoto, setSelectedFoto] = useState<File | null>(null); 
  const [fotoPreview, setFotoPreview] = useState<string | null>(initialData?.fotoUrl || null); 
  const fileInputRef = useRef<HTMLInputElement>(null); 
 
  useEffect(() => { 
    if (initialData) { 
      setFormData(initialData); 
      if (initialData.fechaNacimiento) { 
        calculateAge(initialData.fechaNacimiento); 
      } 
      setFotoPreview(initialData.fotoUrl || null); 
    } 
  }, [initialData]); 
 
  const calculateAge = (fechaNac: string) => {
    if (!fechaNac) { 
      setEdadCronologica(''); 
      return; 
    } 
    const birthDate = new Date(fechaNac); 
    const today = new Date(); 
    let age = today.getFullYear() - birthDate.getFullYear(); 
    const m = today.getMonth() - birthDate.getMonth(); 
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { 
      age--; 
    } 
    setEdadCronologica(age >= 0 ? age : ''); 
    setFormData(prev => ({ ...prev, edadCronologica: age >=0 ? age : undefined })); 
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
 
  const handleSubmit = async (e: FormEvent) => { 
    e.preventDefault(); 
    let dataToSave = { ...formData };
    if (selectedFoto) { 
      console.log("Simulando subida de foto:", selectedFoto.name); 
      dataToSave.fotoUrl = fotoPreview || ''; 
    } 
    await onSave(dataToSave); 
  }; 
   
  const commonInputStyles = "w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-primary focus:border-primary outline-none"; 
  const commonLabelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"; 
 
  return ( 
    <div className="p-4 sm:p-6 bg-bg-card-light dark:bg-bg-card-dark rounded-lg shadow-xl w-full max-w-5xl mx-auto"> 
      <form onSubmit={handleSubmit} className="space-y-6"> 
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-border-light dark:border-border-dark"> 
          <h2 className="text-2xl font-semibold text-primary dark:text-primary-light"> 
            {initialData ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'} 
          </h2> 
        </div> 
 
        {/* Sección Foto y Datos Principales */} 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start"> 
          <div className="md:col-span-1 flex flex-col items-center"> 
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden mb-2 relative group"> 
              {fotoPreview ? ( 
                <img src={fotoPreview} alt="Foto paciente" className="w-full h-full object-cover" /> 
              ) : ( 
                <FontAwesomeIcon icon={faUserCircle} className="w-20 h-20" /> 
              )}
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                title="Cambiar foto" 
              > 
                <FontAwesomeIcon icon={faCamera} size="2x" /> 
              </button> 
            </div> 
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoChange} className="hidden" /> 
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-primary hover:underline"> 
              {fotoPreview ? 'Cambiar Foto' : 'Adjuntar Foto'} 
            </button> 
          </div> 
 
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5"> 
            <FormGroupSelect label="Nacionalidad:" name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} options={OPCIONES_NACIONALIDAD} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles} /> 
            <FormGroupInput label="Identificación (C.I./Pasaporte):" name="identificacion" value={formData.identificacion} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Fecha Historia:" name="fechaHistoria" type="date" value={formData.fechaHistoria} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Apellidos:" name="apellidos" value={formData.apellidos} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Nombres:" name="nombres" value={formData.nombres} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Fecha Nacimiento:" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} required inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Edad Cronológica:" name="edadCronologica" value={String(edadCronologica)} readOnly
              inputClassName={`${commonInputStyles} bg-gray-100 dark:bg-gray-800`} labelClassName={commonLabelStyles}/> 
            <FormGroupSelect label="Género:" name="genero" value={formData.genero} onChange={handleChange} options={OPCIONES_GENERO_HISTORIA} required selectClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Lugar Nacimiento:" name="lugarNacimiento" value={formData.lugarNacimiento} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Teléfono:" name="telefono" value={formData.telefono} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupSelect label="Edo. Civil:" name="edoCivil" value={formData.edoCivil} onChange={handleChange} options={OPCIONES_EDO_CIVIL} selectClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Profesión:" name="profesion" value={formData.profesion} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="País Residencia:" name="paisResidencia" value={formData.paisResidencia} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="Estado/Provincia Residencia:" name="estadoProvinciaResidencia" value={formData.estadoProvinciaResidencia} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupSelect label="Grupo Sanguíneo:" name="grupoSanguineo" value={formData.grupoSanguineo} onChange={handleChange} options={OPCIONES_GRUPO_SANGUINEO} selectClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupInput label="E-mail:" name="email" type="email" value={formData.email} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
          </div> 
        </div> 
        
        <FormGroupTextarea label="Dirección:" name="direccion" value={formData.direccion} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
        <FormGroupTextarea label="Observaciones Generales:" name="observacionesGenerales" value={formData.observacionesGenerales} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
        
        {/* Botón para mostrar/ocultar sección detallada */} 
        <div className="pt-4 border-t border-border-light dark:border-border-dark"> 
          <button
            type="button" 
            onClick={() => setShowSeccionDetallada(!showSeccionDetallada)} 
            className="w-full flex justify-between items-center p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-text-light-base dark:text-text-dark-base font-medium transition-colors" 
          > 
            <span>{showSeccionDetallada ? 'Ocultar' : 'Mostrar'} Sección Detallada de Historia Clínica</span> 
            <FontAwesomeIcon icon={showSeccionDetallada ? faChevronUp : faChevronDown} /> 
          </button> 
        </div> 
 
        {/* Sección Detallada (Condicional) */} 
        {showSeccionDetallada && ( 
          <div className="space-y-5 pt-5 border-t border-gray-200 dark:border-gray-700 mt-5"> 
            <h3 className="text-lg font-semibold text-primary dark:text-primary-light">Antecedentes y Examen Funcional</h3> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> 
              <FormGroupInput label="Referido por:" name="referidoPor" value={formData.referidoPor || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="No. Historia (Opcional):" name="noHistoria" value={formData.noHistoria || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
            <FormGroupTextarea label="Antecedentes Familiares:" name="antecedentesFamiliares" value={formData.antecedentesFamiliares || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupTextarea label="Antecedentes Personales:" name="antecedentesPersonales" value={formData.antecedentesPersonales || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            { (formData.genero === 'Femenino' || formData.genero === 'Femenino Deportivo') && 
              <FormGroupTextarea label="Antecedentes Gineco-Obstétricos:" name="antecedentesGinecoObstetricos" value={formData.antecedentesGinecoObstetricos || ''} onChange={handleChange}
                rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            } 
            <FormGroupTextarea label="Medicamentos que está tomando:" name="medicamentosActuales" value={formData.medicamentosActuales || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupTextarea label="Enfermedad Actual / Motivo de Consulta:" name="enfermedadActual" value={formData.enfermedadActual || ''} onChange={handleChange} rows={4} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
 
            <h4 className="text-md font-semibold pt-2 text-gray-700 dark:text-gray-300">Examen Funcional por Sistemas:</h4> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"> 
              <FormGroupInput label="General:" name="examenFuncionalGeneral" value={formData.examenFuncionalGeneral || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Apetencias (Apetito/Sed):" name="examenFuncionalApetencias" value={formData.examenFuncionalApetencias || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Adicciones:" name="examenFuncionalAdicciones" value={formData.examenFuncionalAdicciones || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Cardiovascular:" name="examenFuncionalCardiovascular" value={formData.examenFuncionalCardiovascular || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Evacuación:" name="examenFuncionalEvacuacion" value={formData.examenFuncionalEvacuacion || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Sexual:" name="examenFuncionalSexual" value={formData.examenFuncionalSexual || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Mental:" name="examenFuncionalMental" value={formData.examenFuncionalMental || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
              <FormGroupInput label="Intolerancias:" name="examenFuncionalIntolerancias" value={formData.examenFuncionalIntolerancias || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Sudor/Temperatura:" name="examenFuncionalSudorTemp" value={formData.examenFuncionalSudorTemp || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Respiratorio:" name="examenFuncionalRespiratorio" value={formData.examenFuncionalRespiratorio || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Micción:" name="examenFuncionalMiccion" value={formData.examenFuncionalMiccion || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Sueño:" name="examenFuncionalSueno" value={formData.examenFuncionalSueno || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Emocional:" name="examenFuncionalEmocional" value={formData.examenFuncionalEmocional || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
 
            <h3 className="text-lg font-semibold pt-4 text-primary dark:text-primary-light">Examen Físico</h3> 
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4"> 
              <FormGroupInput label="TA (Sistólica):" name="taSistolica" type="number" value={formData.taSistolica ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="TA (Diastólica):" name="taDiastolica" type="number" value={formData.taDiastolica ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Pulso (ppm):" name="pulso" type="number" value={formData.pulso ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="Peso (kg):" name="peso" type="number" value={formData.peso ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
              <FormGroupInput label="Talla (cm):" name="talla" type="number" value={formData.talla ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupInput label="IMC (kg/m²):" name="imc" type="number" value={formData.imc ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
              <FormGroupInput label="% Grasa Corporal:" name="porcentajeGrasa" type="number" value={formData.porcentajeGrasa ?? ''} onChange={handleNumberChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> 
              <FormGroupTextarea label="Cabeza:" name="examenFisicoCabeza" value={formData.examenFisicoCabeza || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Cuello:" name="examenFisicoCuello" value={formData.examenFisicoCuello || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Corazón:" name="examenFisicoCorazon" value={formData.examenFisicoCorazon || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Abdomen:" name="examenFisicoAbdomen" value={formData.examenFisicoAbdomen || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Genitales:" name="examenFisicoGenitales" value={formData.examenFisicoGenitales || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Piel y Faneras:" name="examenFisicoPiel" value={formData.examenFisicoPiel || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Tórax:" name="examenFisicoTorax" value={formData.examenFisicoTorax || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Pulmones:" name="examenFisicoPulmon" value={formData.examenFisicoPulmon || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
              <FormGroupTextarea label="Lumbar:" name="examenFisicoLumbar" value={formData.examenFisicoLumbar || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Extremidades:" name="examenFisicoExtremidades" value={formData.examenFisicoExtremidades || ''} onChange={handleChange} rows={2} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
 
            <h3 className="text-lg font-semibold pt-4 text-primary dark:text-primary-light">Laboratorio</h3> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> 
              <FormGroupInput label="Fecha Laboratorio:" name="fechaLaboratorio" type="date" value={formData.fechaLaboratorio || ''} onChange={handleChange} inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"> 
              <FormGroupTextarea label="Hematología:" name="laboratorioHematologia" value={formData.laboratorioHematologia || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Bioquímica:" name="laboratorioBioquimica" value={formData.laboratorioBioquimica || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Orina:" name="laboratorioOrina" value={formData.laboratorioOrina || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Heces:" name="laboratorioHeces" value={formData.laboratorioHeces || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
              <FormGroupTextarea label="Otros Laboratorios:" name="laboratorioOtros" value={formData.laboratorioOtros || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            </div> 
            
            <h3 className="text-lg font-semibold pt-4 text-primary dark:text-primary-light">Impresión Diagnóstica y Tratamiento</h3> 
            <FormGroupTextarea label="Impresión Diagnóstica:" name="impresionDiagnostica" value={formData.impresionDiagnostica || ''}
              onChange={handleChange} rows={4} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupTextarea label="Tratamiento:" name="tratamiento" value={formData.tratamiento || ''} onChange={handleChange} rows={4} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
            <FormGroupTextarea label="Observaciones Adicionales (Fin de Historia):" name="observacionesAdicionales" value={formData.observacionesAdicionales || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} labelClassName={commonLabelStyles}/> 
          </div> 
        )} 
 
        {/* Botones de Acción */} 
        <div className="flex justify-end gap-3 pt-6 border-t border-border-light dark:border-border-dark mt-8"> 
          <button
            type="button" 
            onClick={onCancel} 
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors shadow-sm" 
          > 
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> 
            Cancelar 
          </button> 
          <button
            type="submit" 
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md inline-flex items-center gap-2" 
          > 
            <FontAwesomeIcon icon={faSave} className="mr-2" /> 
            {initialData ? 'Actualizar Historia' : 'Guardar Historia'} 
          </button> 
        </div> 
      </form> 
    </div> 
  ); 
}