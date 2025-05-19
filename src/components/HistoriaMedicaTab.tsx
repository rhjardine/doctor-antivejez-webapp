// src/components/HistoriaMedicaTab.tsx
'use client';

import { useState, ChangeEvent, FormEvent, useRef } from 'react'; // Añadido useRef
import { Patient } from '@/types';
import FormGroupInput from './GuiaPaciente/FormGroupInput';
import FormGroupTextarea from './GuiaPaciente/FormGroupTextarea';
import FormGroupSelect from './GuiaPaciente/FormGroupSelect';
import { cn } from '@/utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faFlask, faNotesMedical, faHeartPulse, faStethoscope, faVials,
  faCamera // Icono para la foto
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Image from 'next/image'; // Para mostrar la imagen de perfil

// (Interfaz FichaFormData como antes, asegúrate de que esté completa)
interface FichaFormData extends Patient { /* ... todos tus campos ... */ fotoUrl?: string; fotoFile?: File | null; referidoPor?: string; noHistoria?: string; lugarNacimiento?: string; antecedentesFamiliares?: string; antecedentesPersonales?: string; ginecoObstetricos?: string; medicamentosActuales?: string; enfermedadActual?: string; examenFuncional_general?: string; examenFuncional_apetencias?: string; examenFuncional_adicciones?: string; examenFuncional_cardiovascular?: string; examenFuncional_evacuacion?: string; examenFuncional_sexual?: string; examenFuncional_mental?: string; examenFuncional_intolerancias?: string; examenFuncional_sudorTemp?: string; examenFuncional_respiratorio?: string; examenFuncional_miccion?: string; examenFuncional_sueno?: string; examenFuncional_emocional?: string; examenFuncional_aversiones?: string; examenFisico_ta?: string; examenFisico_pulso?: string; examenFisico_peso?: string; examenFisico_talla?: string; examenFisico_imc?: string; examenFisico_grasa?: string; examenFisico_cabeza?: string; examenFisico_cuello?: string; examenFisico_corazon?: string; examenFisico_abdomen?: string; examenFisico_genitales?: string; examenFisico_piel?: string; examenFisico_torax?: string; examenFisico_pulmon?: string; examenFisico_lumbar?: string; examenFisico_extremidades?: string; laboratorio_fecha?: string; laboratorio_hematologia?: string; laboratorio_bioquimica?: string; laboratorio_orina?: string; laboratorio_heces?: string; laboratorio_otros?: string; impresionDiagnostica?: string; tratamiento?: string; observaciones?: string; nacionalidad?: string; apellidos?: string; nombres?: string; estadoCivil?: string; telefono?: string; profesion?: string; direccion?: string; email?: string; pais?: string; ciudad?: string; grupoSanguineo?: string; }


// --- Componente de Sección Estilizado (como antes, pero ajustaremos el fondo de la tarjeta) ---
interface SectionProps { title: string; icon?: IconProp; children: React.ReactNode; className?: string; }
const FormSection: React.FC<SectionProps> = ({ title, icon, children, className }) => (
  // Fondo de tarjeta blanco/casi blanco, con sombra más pronunciada
  <section className={cn("bg-light-bg-card dark:bg-dark-bg-card p-4 sm:p-6 rounded-xl shadow-xl mb-8", className)}>
    <h3 className="text-xl font-semibold mb-5 text-primary dark:text-primary-light border-b-2 border-primary/20 dark:border-primary-light/20 pb-3 flex items-center gap-3">
      {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
      {title}
    </h3>
    {children}
  </section>
);

export default function HistoriaMedicaTab({ patient }: { patient: Patient }) {
  const [formData, setFormData] = useState<FichaFormData>({
    ...patient,
    // ... (TODOS los campos inicializados como antes, asegúrate que fotoUrl y fotoFile estén)
    fotoUrl: patient.fotoUrl || '/assets/default-avatar.png', // Placeholder
    fotoFile: null,
    // ... (resto de campos)
    referidoPor: patient.referidoPor || '', noHistoria: patient.noHistoria || '', lugarNacimiento: patient.lugarNacimiento || '', antecedentesFamiliares: patient.antecedentesFamiliares || '', antecedentesPersonales: patient.antecedentesPersonales || '', ginecoObstetricos: patient.ginecoObstetricos || '', medicamentosActuales: patient.medicamentosActuales || '', enfermedadActual: patient.enfermedadActual || '', examenFuncional_general: patient.examenFuncional_general || '', examenFuncional_apetencias: patient.examenFuncional_apetencias || '', examenFuncional_adicciones: patient.examenFuncional_adicciones || '', examenFuncional_cardiovascular: patient.examenFuncional_cardiovascular || '', examenFuncional_evacuacion: patient.examenFuncional_evacuacion || '', examenFuncional_sexual: patient.examenFuncional_sexual || '', examenFuncional_mental: patient.examenFuncional_mental || '', examenFuncional_intolerancias: patient.examenFuncional_intolerancias || '', examenFuncional_sudorTemp: patient.examenFuncional_sudorTemp || '', examenFuncional_respiratorio: patient.examenFuncional_respiratorio || '', examenFuncional_miccion: patient.examenFuncional_miccion || '', examenFuncional_sueno: patient.examenFuncional_sueno || '', examenFuncional_emocional: patient.examenFuncional_emocional || '', examenFuncional_aversiones: patient.examenFuncional_aversiones || '', examenFisico_ta: patient.examenFisico_ta || '', examenFisico_pulso: patient.examenFisico_pulso || '', examenFisico_peso: patient.examenFisico_peso || '', examenFisico_talla: patient.examenFisico_talla || '', examenFisico_imc: patient.examenFisico_imc || '', examenFisico_grasa: patient.examenFisico_grasa || '', examenFisico_cabeza: patient.examenFisico_cabeza || '', examenFisico_cuello: patient.examenFisico_cuello || '', examenFisico_corazon: patient.examenFisico_corazon || '', examenFisico_abdomen: patient.examenFisico_abdomen || '', examenFisico_genitales: patient.examenFisico_genitales || '', examenFisico_piel: patient.examenFisico_piel || '', examenFisico_torax: patient.examenFisico_torax || '', examenFisico_pulmon: patient.examenFisico_pulmon || '', examenFisico_lumbar: patient.examenFisico_lumbar || '', examenFisico_extremidades: patient.examenFisico_extremidades || '', laboratorio_fecha: patient.laboratorio_fecha || '', laboratorio_hematologia: patient.laboratorio_hematologia || '', laboratorio_bioquimica: patient.laboratorio_bioquimica || '', laboratorio_orina: patient.laboratorio_orina || '', laboratorio_heces: patient.laboratorio_heces || '', laboratorio_otros: patient.laboratorio_otros || '', impresionDiagnostica: patient.impresionDiagnostica || '', tratamiento: patient.tratamiento || '', observaciones: patient.observaciones || '', nacionalidad: patient.nacionalidad || '', apellidos: patient.apellidos || (patient.name ? patient.name.split(' ').slice(1).join(' ') : ''), nombres: patient.nombres || (patient.name ? patient.name.split(' ')[0] : ''), estadoCivil: patient.estadoCivil || '', telefono: patient.telefono || '', profesion: patient.profesion || '', direccion: patient.direccion || '', email: patient.email || '', pais: patient.pais || '', ciudad: patient.ciudad || '', grupoSanguineo: patient.grupoSanguineo || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        fotoFile: file,
        fotoUrl: URL.createObjectURL(file) // Para previsualización
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Crear FormData para enviar al backend si hay fotoFile
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'fotoFile' && value instanceof File) {
        submissionData.append(key, value);
      } else if (key !== 'fotoUrl' && value !== null && value !== undefined) { // No enviar fotoUrl, sí otros datos
        submissionData.append(key, String(value));
      }
    });
    // Lógica para enviar submissionData a la API
    console.log("Ficha Paciente a Enviar:", formData); // Muestra el estado
    // console.log("FormData para API:", submissionData); // Muestra lo que se enviaría
    alert('Ficha del paciente guardada (simulación).');
  };

  // Estilos comunes para inputs, ahora con un fondo ligeramente diferente para destacar sobre la tarjeta
  const commonInputStyles = "w-full p-2.5 border border-light-border/50 dark:border-dark-border/50 rounded-lg text-sm bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary/60 focus:border-primary outline-none transition-all duration-150 ease-in-out shadow-sm hover:border-primary/70 dark:hover:border-primary-light/70";
  const commonTextareaStyles = `${commonInputStyles} min-h-[80px]`; // Estilo base para textareas

  return (
    // Fondo general de la pestaña, puedes usar un gradiente sutil aquí si lo deseas
    <form onSubmit={handleSubmit} className="space-y-10 p-1"> {/* Aumentado el espacio entre secciones */}
      {/* Sección Datos Personales con fondo azul claro */}
      <FormSection
        title="Datos Personales"
        icon={faUserCircle}
        // Aplicando un fondo azul claro a esta sección específica
        className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary-light/10 dark:to-primary-light/5 !shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative group">
                <Image
                    src={formData.fotoUrl || '/assets/default-avatar.png'}
                    alt="Foto del Paciente"
                    width={100} // Tamaño aumentado
                    height={100}
                    className="rounded-full object-cover border-4 border-white dark:border-dark-bg-card shadow-lg"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
                    title="Cambiar foto"
                >
                    <FontAwesomeIcon icon={faCamera} className="w-4 h-4"/>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFotoChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-secondary dark:text-primary-light">{formData.nombres} {formData.apellidos}</h2>
                <p className="text-text-medium dark:text-dark-text-medium">{formData.profesion || 'Profesión no especificada'}</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          {/* Campos con placeholders detallados */}
          <FormGroupInput label="Nacionalidad" id="nacionalidad" name="nacionalidad" value={formData.nacionalidad || ''} onChange={handleChange} placeholder="Ej: Venezolana" inputClassName={commonInputStyles} />
          <FormGroupInput label="Identificación" id="identificacion" name="id" value={formData.id} onChange={handleChange} placeholder="Ej: V-12.345.678" readOnly inputClassName={commonInputStyles} />
          {/* Nombres y Apellidos ya se muestran arriba, pero los dejamos como inputs si se pueden editar */}
          <FormGroupInput label="Apellidos Completos" id="apellidos" name="apellidos" value={formData.apellidos || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Nombres Completos" id="nombres" name="nombres" value={formData.nombres || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Fecha Nacimiento" id="fechaNacimiento" name="lastCheckup" type="date" value={formData.lastCheckup || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Edad Cronológica" id="edadCronologica" name="age" type="number" value={formData.age} onChange={handleChange} readOnly inputClassName={commonInputStyles} />
          <FormGroupSelect label="Género" id="genero" name="gender" value={formData.gender} onChange={handleChange} selectClassName={commonInputStyles}>
            <option value="Female">Femenino</option><option value="Male">Masculino</option><option value="Other">Otro</option>
          </FormGroupSelect>
          <FormGroupInput label="Estado Civil" id="estadoCivil" name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleChange} placeholder="Ej: Soltera" inputClassName={commonInputStyles} />
          <FormGroupInput label="Teléfono" id="telefono" name="telefono" type="tel" value={formData.telefono || ''} onChange={handleChange} placeholder="Ej: +58 412 3456789" inputClassName={commonInputStyles} />
          <FormGroupInput label="Profesión / Ocupación" id="profesion" name="profesion" value={formData.profesion || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Dirección Completa" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} fullWidth={true} inputClassName={commonInputStyles} />
          <FormGroupInput label="E-mail" id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="usuario@ejemplo.com" inputClassName={commonInputStyles} />
          <FormGroupInput label="País de Residencia" id="pais" name="pais" value={formData.pais || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Ciudad de Residencia" id="ciudad" name="ciudad" value={formData.ciudad || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupSelect label="Grupo Sanguíneo" id="grupoSanguineo" name="grupoSanguineo" value={formData.grupoSanguineo || ''} onChange={handleChange} selectClassName={commonInputStyles}>
            <option value="">Seleccione...</option>
            <option value="A+">A+</option> <option value="A-">A-</option> <option value="B+">B+</option> <option value="B-">B-</option>
            <option value="AB+">AB+</option> <option value="AB-">AB-</option> <option value="O+">O+</option> <option value="O-">O-</option>
          </FormGroupSelect>
          <FormGroupInput label="Referido por" id="referidoPor" name="referidoPor" value={formData.referidoPor || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="No. Historia Clínica" id="noHistoria" name="noHistoria" value={formData.noHistoria || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Lugar de Nacimiento" id="lugarNacimiento" name="lugarNacimiento" value={formData.lugarNacimiento || ''} onChange={handleChange} inputClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Antecedentes" icon={faNotesMedical}>
        <div className="space-y-4">
          <FormGroupTextarea label="Familiares (Padres, hermanos, abuelos. Enfermedades relevantes)" id="antecedentesFamiliares" name="antecedentesFamiliares" value={formData.antecedentesFamiliares || ''} onChange={handleChange} rows={4} textareaClassName={commonTextareaStyles} />
          <FormGroupTextarea label="Personales (Enfermedades previas, cirugías, alergias)" id="antecedentesPersonales" name="antecedentesPersonales" value={formData.antecedentesPersonales || ''} onChange={handleChange} rows={4} textareaClassName={commonTextareaStyles} />
          <FormGroupTextarea label="GinecoObstétricos (Si aplica)" id="ginecoObstetricos" name="ginecoObstetricos" value={formData.ginecoObstetricos || ''} onChange={handleChange} rows={3} textareaClassName={commonTextareaStyles} />
        </div>
      </FormSection>

      <FormSection title="Enfermedad Actual y Medicamentos" icon={faHeartPulse}>
        <FormGroupTextarea label="Medicamentos que está tomando actualmente (Nombre, dosis, frecuencia)" id="medicamentosActuales" name="medicamentosActuales" value={formData.medicamentosActuales || ''} onChange={handleChange} rows={4} textareaClassName={commonTextareaStyles} />
        <FormGroupTextarea label="Enfermedad Actual / Motivo de Consulta" id="enfermedadActual" name="enfermedadActual" value={formData.enfermedadActual || ''} onChange={handleChange} rows={5} textareaClassName={commonTextareaStyles} />
      </FormSection>

      <FormSection title="Examen Funcional (Por Sistemas)" icon={faStethoscope}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormGroupInput label="General (Fiebre, fatiga, cambios de peso)" name="examenFuncional_general" value={formData.examenFuncional_general || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Astenia ocasional"/>
          <FormGroupInput label="Apetencias / Aversiones" name="examenFuncional_apetencias" value={formData.examenFuncional_apetencias || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Deseo de dulces, aversión a grasas"/>
          <FormGroupInput label="Adicciones (Tabaco, alcohol, otros)" name="examenFuncional_adicciones" value={formData.examenFuncional_adicciones || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Fumador social"/>
          <FormGroupInput label="Cardiovascular (Palpitaciones, dolor torácico, edema)" name="examenFuncional_cardiovascular" value={formData.examenFuncional_cardiovascular || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Evacuación (Frecuencia, consistencia, cambios)" name="examenFuncional_evacuacion" value={formData.examenFuncional_evacuacion || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: 1 vez/día, normal"/>
          <FormGroupInput label="Sexual (Libido, disfunciones)" name="examenFuncional_sexual" value={formData.examenFuncional_sexual || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Mental (Memoria, concentración, ánimo)" name="examenFuncional_mental" value={formData.examenFuncional_mental || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Intolerancias Alimentarias Conocidas" name="examenFuncional_intolerancias" value={formData.examenFuncional_intolerancias || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Lactosa, gluten"/>
          <FormGroupInput label="Sudoración / Temperatura Corporal" name="examenFuncional_sudorTemp" value={formData.examenFuncional_sudorTemp || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Sudoración nocturna ocasional"/>
          <FormGroupInput label="Respiratorio (Tos, disnea, sibilancias)" name="examenFuncional_respiratorio" value={formData.examenFuncional_respiratorio || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Micción (Frecuencia, urgencia, disuria)" name="examenFuncional_miccion" value={formData.examenFuncional_miccion || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Sueño (Calidad, cantidad, insomnio)" name="examenFuncional_sueno" value={formData.examenFuncional_sueno || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: 7-8 horas, reparador"/>
          <FormGroupInput label="Estado Emocional General" name="examenFuncional_emocional" value={formData.examenFuncional_emocional || ''} onChange={handleChange} inputClassName={commonInputStyles} placeholder="Ej: Estable, ansioso a veces"/>
        </div>
      </FormSection>

      <FormSection title="Examen Físico" icon={faStethoscope}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <FormGroupInput label="TA" name="examenFisico_ta" value={formData.examenFisico_ta || ''} onChange={handleChange} placeholder="Ej: 120/80 mmHg" inputClassName={commonInputStyles} />
          <FormGroupInput label="Pulso" name="examenFisico_pulso" value={formData.examenFisico_pulso || ''} onChange={handleChange} placeholder="Ej: 70 lpm" inputClassName={commonInputStyles} />
          <FormGroupInput label="Peso" name="examenFisico_peso" value={formData.examenFisico_peso || ''} onChange={handleChange} placeholder="Ej: 65 kg" inputClassName={commonInputStyles} />
          <FormGroupInput label="Talla" name="examenFisico_talla" value={formData.examenFisico_talla || ''} onChange={handleChange} placeholder="Ej: 1.70 m" inputClassName={commonInputStyles} />
          <FormGroupInput label="IMC" name="examenFisico_imc" value={formData.examenFisico_imc || ''} onChange={handleChange} placeholder="Ej: 22.5" inputClassName={commonInputStyles} />
          <FormGroupInput label="% Grasa" name="examenFisico_grasa" value={formData.examenFisico_grasa || ''} onChange={handleChange} placeholder="Ej: 18%" inputClassName={commonInputStyles} />
          <FormGroupInput label="Cabeza" name="examenFisico_cabeza" value={formData.examenFisico_cabeza || ''} onChange={handleChange} placeholder="Normocéfalo..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Piel y Faneras" name="examenFisico_piel" value={formData.examenFisico_piel || ''} onChange={handleChange} placeholder="Hidratada, elástica..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Cuello" name="examenFisico_cuello" value={formData.examenFisico_cuello || ''} onChange={handleChange} placeholder="Simétrico, móvil..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Tórax" name="examenFisico_torax" value={formData.examenFisico_torax || ''} onChange={handleChange} placeholder="Simétrico, expansibilidad..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Corazón" name="examenFisico_corazon" value={formData.examenFisico_corazon || ''} onChange={handleChange} placeholder="Ruidos cardíacos rítmicos..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Pulmón" name="examenFisico_pulmon" value={formData.examenFisico_pulmon || ''} onChange={handleChange} placeholder="Murmullo vesicular audible..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Abdomen" name="examenFisico_abdomen" value={formData.examenFisico_abdomen || ''} onChange={handleChange} placeholder="Blando, depresible..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Lumbar" name="examenFisico_lumbar" value={formData.examenFisico_lumbar || ''} onChange={handleChange} placeholder="Puño-percusión (-)..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Genitales" name="examenFisico_genitales" value={formData.examenFisico_genitales || ''} onChange={handleChange} placeholder="Diferido o hallazgos..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Extremidades" name="examenFisico_extremidades" value={formData.examenFisico_extremidades || ''} onChange={handleChange} placeholder="Simétricas, pulsos presentes..." inputClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Laboratorio" icon={faVials}>
        <div className="flex items-center mb-4 gap-2">
            <span className="text-sm font-medium text-light-text-medium dark:text-dark-text-medium">Fecha:</span>
            <FormGroupInput label="" id="laboratorio_fecha" name="laboratorio_fecha" type="date" value={formData.laboratorio_fecha || ''} onChange={handleChange} className="!mb-0 w-auto" inputClassName={`p-1.5 text-sm ${commonInputStyles}`} />
        </div>
        {/* Campos de laboratorio ahora como inputs y en un grid para mejor distribución */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormGroupInput label="Hematología:" id="laboratorio_hematologia" name="laboratorio_hematologia" value={formData.laboratorio_hematologia || ''} onChange={handleChange} placeholder="Hb, Hcto, Leucocitos..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Bioquímica:" id="laboratorio_bioquimica" name="laboratorio_bioquimica" value={formData.laboratorio_bioquimica || ''} onChange={handleChange} placeholder="Glucosa, Urea, Creatinina..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Orina:" id="laboratorio_orina" name="laboratorio_orina" value={formData.laboratorio_orina || ''} onChange={handleChange} placeholder="Aspecto, Densidad, pH..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Heces:" id="laboratorio_heces" name="laboratorio_heces" value={formData.laboratorio_heces || ''} onChange={handleChange} placeholder="Aspecto, Parásitos..." inputClassName={commonInputStyles} />
        </div>
        <FormGroupTextarea label="Otros Laboratorios:" id="laboratorio_otros" name="laboratorio_otros" value={formData.laboratorio_otros || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} className="mt-4" />
      </FormSection>

      <FormSection title="Diagnóstico y Plan" icon={faNotesMedical}>
        <FormGroupTextarea label="Impresión Diagnóstica:" id="impresionDiagnostica" name="impresionDiagnostica" value={formData.impresionDiagnostica || ''} onChange={handleChange} rows={4} textareaClassName={commonTextareaStyles} placeholder="Resumen de hallazgos y diagnósticos probables..." />
        <FormGroupTextarea label="Tratamiento y Plan a Seguir:" id="tratamiento" name="tratamiento" value={formData.tratamiento || ''} onChange={handleChange} rows={5} textareaClassName={commonTextareaStyles} placeholder="Indicaciones, medicamentos, terapias, próximos controles..." />
        <FormGroupTextarea label="Observaciones Adicionales:" id="observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} rows={3} textareaClassName={commonTextareaStyles} />
      </FormSection>

      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-light-border dark:border-dark-border">
        <button type="button" onClick={() => alert('Cancelado')}
          className="px-6 py-2.5 rounded-lg border border-light-border dark:border-dark-border text-text-medium dark:text-dark-text-medium hover:bg-gray-100 dark:hover:bg-dark-bg font-medium transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-400">
          Cancelar
        </button>
        <button type="submit"
          className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md hover:shadow-lg">
          Guardar Historia Médica
        </button>
      </div>
    </form>
  );
}