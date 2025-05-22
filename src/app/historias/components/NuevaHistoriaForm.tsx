// src/app/historias/components/NuevaHistoriaForm.tsx
'use client';

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'; // Asegúrate de importar ChangeEvent y FormEvent
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCamera, faChevronDown, faChevronUp, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HistoriaClinicaData, NacionalidadType, GeneroType, GrupoSanguineoType, EdoCivilType } from '@/types/historia'; // Ajusta la ruta si es necesario
import {
  OPCIONES_NACIONALIDAD,
  OPCIONES_GENERO_HISTORIA,
  OPCIONES_GRUPO_SANGUINEO,
  OPCIONES_EDO_CIVIL
} from '@/utils/constants'; // Ajusta la ruta si es necesario
import FormGroupInput from '@/components/GuiaPaciente/FormGroupInput'; // Ajusta la ruta si es necesario
import FormGroupSelect from '@/components/GuiaPaciente/FormGroupSelect'; // Ajusta la ruta si es necesario
import FormGroupTextarea from '@/components/GuiaPaciente/FormGroupTextarea'; // Ajusta la ruta si es necesario

interface NuevaHistoriaFormProps {
  initialData?: HistoriaClinicaData | null;
  onSave: (data: HistoriaClinicaData) => Promise<void>;
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
  ciudad: '', // Añadido
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      setFormData({...initialFormData}); // Asegurar que se use una copia para evitar mutaciones
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
    
    const birthDate = new Date(fechaNac);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const finalAge = age >= 0 ? age : '';
    setEdadCronologica(finalAge);
    setFormData(prev => ({ ...prev, edadCronologica: age >= 0 ? age : undefined }));
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
  
  const handleSubmit = async (e: FormEvent) => { // Corregido el tipo de 'e'
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      let dataToSave = { ...formData };
      if (selectedFoto) {
        console.log("Simulando subida de foto:", selectedFoto.name);
        dataToSave.fotoUrl = fotoPreview || '';
      }
      
      await onSave(dataToSave);
    } catch (error) {
      console.error("Error al guardar la historia:", error);
      alert("Ocurrió un error al guardar los datos. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  // Estilos comunes (puedes definirlos en un archivo separado si prefieres)
  const commonInputStyles = "w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-[#23BCEF] focus:border-[#23BCEF] outline-none placeholder-gray-400 dark:placeholder-gray-500";
  const commonLabelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  
  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-[#23BCEF] dark:text-[#23BCEF]">
            {initialData ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 overflow-hidden mb-3 relative group">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto paciente" className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="w-16 h-16" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Cambiar foto"
              >
                <FontAwesomeIcon icon={faCamera} size="lg" />
              </button>
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
              className="text-sm text-[#23BCEF] hover:underline mb-6"
            >
              {fotoPreview ? 'Cambiar Foto' : 'Adjuntar Foto'}
            </button>
            
            <FormGroupTextarea 
              label="Dirección:" 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Av. Principal, Edificio X, Piso Y, Apto Z, Ciudad, Estado"
              className="w-full mb-4"
              inputClassName={commonInputStyles} // Asegúrate de pasar los estilos
              labelClassName={commonLabelStyles}  // Asegúrate de pasar los estilos
            />
            
            <FormGroupTextarea 
              label="Observaciones Generales:" 
              name="observacionesGenerales" 
              value={formData.observacionesGenerales} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Alergias conocidas, condiciones preexistentes importantes, etc."
              className="w-full"
              inputClassName={commonInputStyles} // Asegúrate de pasar los estilos
              labelClassName={commonLabelStyles}  // Asegúrate de pasar los estilos
            />
          </div>
          
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              placeholder="Ej: V12345678 / PEXXXXXX"
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
              inputClassName={`${commonInputStyles} bg-gray-100 dark:bg-gray-900 cursor-not-allowed`} // Ajustado estilo para readonly
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
              label="Estado/Provincia Residencia:"  // Cambiado de "Estado/Residencia"
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
              value={formData.ciudad || ''} // Asegurar que el valor no sea undefined
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
              className="sm:col-span-2 lg:col-span-1" // Ajuste para que ocupe una columna en lg
              inputClassName={commonInputStyles}
              labelClassName={commonLabelStyles}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowSeccionDetallada(!showSeccionDetallada)}
            className="w-full flex justify-between items-center p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 font-medium transition-colors"
          >
            <span>{showSeccionDetallada ? 'Ocultar' : 'Mostrar'} Sección Detallada de Historia Clínica</span>
            <FontAwesomeIcon icon={showSeccionDetallada ? faChevronUp : faChevronDown} />
          </button>
        </div>
        
        {showSeccionDetallada && (
          <div className="space-y-5 pt-5 border-t border-gray-200 dark:border-gray-700 mt-5">
            <h3 className="text-lg font-semibold text-[#23BCEF] dark:text-[#23BCEF]">Antecedentes y Examen Funcional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {/* Aquí continuarías con el resto de los campos de la sección detallada, */}
            {/* añadiendo placeholders y asegurando que los FormGroupSelect usan las opciones correctas */}
            {/* Ejemplo para Examen Funcional */}
            <h4 className="text-md font-semibold pt-2 text-gray-700 dark:text-gray-300">Examen Funcional por Sistemas:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormGroupInput label="General:" name="examenFuncionalGeneral" value={formData.examenFuncionalGeneral || ''} onChange={handleChange} placeholder="Fiebre, astenia, pérdida de peso" inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
                {/* ... más campos del examen funcional con placeholders ... */}
            </div>
            
            {/* Ejemplo para Examen Físico */}
            <h3 className="text-lg font-semibold pt-4 text-[#23BCEF] dark:text-[#23BCEF]">Examen Físico</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <FormGroupInput label="TA (Sistólica):" name="taSistolica" type="number" value={formData.taSistolica ?? ''} onChange={handleNumberChange} placeholder="mmHg" inputClassName={commonInputStyles} labelClassName={commonLabelStyles}/>
                {/* ... más campos del examen físico con placeholders ... */}
            </div>
             {/* ... (resto de campos de examen físico, laboratorio, etc.) ... */}

          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors shadow-sm flex items-center gap-2"
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faTimes} />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#23BCEF] text-white font-semibold hover:bg-[#23BCEF]/90 focus:outline-none focus:ring-2 focus:ring-[#23BCEF] focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors shadow-md flex items-center gap-2" // Añadido focus ring
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faSave} />
            <span>{isSaving ? 'Guardando...' : (initialData ? 'Actualizar Historia' : 'Guardar Historia')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}