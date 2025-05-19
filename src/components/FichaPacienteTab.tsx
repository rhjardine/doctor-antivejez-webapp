// src/components/FichaPacienteTab.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Patient } from '@/types';
// Asume que estos componentes están en ./GuiaPaciente/ o ajusta la ruta
import FormGroupInput from './GuiaPaciente/FormGroupInput';
import FormGroupTextarea from './GuiaPaciente/FormGroupTextarea';
import FormGroupSelect from './GuiaPaciente/FormGroupSelect';
import { cn } from '@/utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Importa TODOS los iconos que se usarán en este componente
import {
  faUserCircle, faFlask, faNotesMedical, faHeart, faStethoscope, faVials,
  faHeartPulse // Icono que estaba causando el error
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


// Extiende la interfaz Patient o crea una nueva para el estado del formulario
interface FichaFormData extends Patient {
  referidoPor?: string;
  noHistoria?: string;
  lugarNacimiento?: string;
  antecedentesFamiliares?: string;
  antecedentesPersonales?: string;
  ginecoObstetricos?: string;
  medicamentosActuales?: string;
  enfermedadActual?: string;
  examenFuncional_general?: string;
  examenFuncional_apetencias?: string;
  examenFuncional_adicciones?: string;
  examenFuncional_cardiovascular?: string;
  examenFuncional_evacuacion?: string;
  examenFuncional_sexual?: string;
  examenFuncional_mental?: string;
  examenFuncional_intolerancias?: string;
  examenFuncional_sudorTemp?: string;
  examenFuncional_respiratorio?: string;
  examenFuncional_miccion?: string;
  examenFuncional_sueno?: string;
  examenFuncional_emocional?: string;
  examenFuncional_aversiones?: string;
  examenFisico_ta?: string;
  examenFisico_pulso?: string;
  examenFisico_peso?: string;
  examenFisico_talla?: string;
  examenFisico_imc?: string;
  examenFisico_grasa?: string;
  examenFisico_cabeza?: string;
  examenFisico_cuello?: string;
  examenFisico_corazon?: string;
  examenFisico_abdomen?: string;
  examenFisico_genitales?: string;
  examenFisico_piel?: string;
  examenFisico_torax?: string;
  examenFisico_pulmon?: string;
  examenFisico_lumbar?: string;
  examenFisico_extremidades?: string;
  laboratorio_fecha?: string;
  laboratorio_hematologia?: string;
  laboratorio_bioquimica?: string;
  laboratorio_orina?: string;
  laboratorio_heces?: string;
  laboratorio_otros?: string;
  impresionDiagnostica?: string;
  tratamiento?: string;
  observaciones?: string;
  nacionalidad?: string;
  apellidos?: string;
  nombres?: string;
  estadoCivil?: string;
  telefono?: string;
  profesion?: string;
  direccion?: string;
  email?: string;
  pais?: string;
  ciudad?: string;
  grupoSanguineo?: string;
  fotoUrl?: string;
}

// --- Componente de Sección Estilizado ---
interface SectionProps {
  title: string;
  icon?: IconProp; // Usar IconProp para flexibilidad
  children: React.ReactNode;
  className?: string;
}
const FormSection: React.FC<SectionProps> = ({ title, icon, children, className }) => (
  <section className={cn("bg-light-bg-card dark:bg-dark-bg-card p-4 sm:p-6 rounded-xl shadow-lg", className)}>
    <h3 className="text-xl font-semibold mb-5 text-primary dark:text-primary-light border-b-2 border-primary/20 dark:border-primary-light/20 pb-2 flex items-center gap-2">
      {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
      {title}
    </h3>
    {children}
  </section>
);


export default function FichaPacienteTab({ patient }: { patient: Patient }) { // Especifica el tipo de patient
  const [formData, setFormData] = useState<FichaFormData>({
    ...patient,
    // Asegúrate de que todos los campos de FichaFormData tengan un valor inicial
    // ya sea de 'patient' o un string vacío/valor por defecto.
    referidoPor: patient.referidoPor || '',
    noHistoria: patient.noHistoria || '',
    lugarNacimiento: patient.lugarNacimiento || '',
    antecedentesFamiliares: patient.antecedentesFamiliares || '',
    antecedentesPersonales: patient.antecedentesPersonales || '',
    ginecoObstetricos: patient.ginecoObstetricos || '',
    medicamentosActuales: patient.medicamentosActuales || '',
    enfermedadActual: patient.enfermedadActual || '',
    examenFuncional_general: patient.examenFuncional_general || '',
    examenFuncional_apetencias: patient.examenFuncional_apetencias || '',
    examenFuncional_adicciones: patient.examenFuncional_adicciones || '',
    examenFuncional_cardiovascular: patient.examenFuncional_cardiovascular || '',
    examenFuncional_evacuacion: patient.examenFuncional_evacuacion || '',
    examenFuncional_sexual: patient.examenFuncional_sexual || '',
    examenFuncional_mental: patient.examenFuncional_mental || '',
    examenFuncional_intolerancias: patient.examenFuncional_intolerancias || '',
    examenFuncional_sudorTemp: patient.examenFuncional_sudorTemp || '',
    examenFuncional_respiratorio: patient.examenFuncional_respiratorio || '',
    examenFuncional_miccion: patient.examenFuncional_miccion || '',
    examenFuncional_sueno: patient.examenFuncional_sueno || '',
    examenFuncional_emocional: patient.examenFuncional_emocional || '',
    examenFuncional_aversiones: patient.examenFuncional_aversiones || '',
    examenFisico_ta: patient.examenFisico_ta || '',
    examenFisico_pulso: patient.examenFisico_pulso || '',
    examenFisico_peso: patient.examenFisico_peso || '',
    examenFisico_talla: patient.examenFisico_talla || '',
    examenFisico_imc: patient.examenFisico_imc || '',
    examenFisico_grasa: patient.examenFisico_grasa || '',
    examenFisico_cabeza: patient.examenFisico_cabeza || '',
    examenFisico_cuello: patient.examenFisico_cuello || '',
    examenFisico_corazon: patient.examenFisico_corazon || '',
    examenFisico_abdomen: patient.examenFisico_abdomen || '',
    examenFisico_genitales: patient.examenFisico_genitales || '',
    examenFisico_piel: patient.examenFisico_piel || '',
    examenFisico_torax: patient.examenFisico_torax || '',
    examenFisico_pulmon: patient.examenFisico_pulmon || '',
    examenFisico_lumbar: patient.examenFisico_lumbar || '',
    examenFisico_extremidades: patient.examenFisico_extremidades || '',
    laboratorio_fecha: patient.laboratorio_fecha || '',
    laboratorio_hematologia: patient.laboratorio_hematologia || '',
    laboratorio_bioquimica: patient.laboratorio_bioquimica || '',
    laboratorio_orina: patient.laboratorio_orina || '',
    laboratorio_heces: patient.laboratorio_heces || '',
    laboratorio_otros: patient.laboratorio_otros || '',
    impresionDiagnostica: patient.impresionDiagnostica || '',
    tratamiento: patient.tratamiento || '',
    observaciones: patient.observaciones || '',
    nacionalidad: patient.nacionalidad || '',
    apellidos: patient.apellidos || (patient.name ? patient.name.split(' ').slice(1).join(' ') : ''),
    nombres: patient.nombres || (patient.name ? patient.name.split(' ')[0] : ''),
    estadoCivil: patient.estadoCivil || '',
    telefono: patient.telefono || '',
    profesion: patient.profesion || '',
    direccion: patient.direccion || '',
    email: patient.email || '',
    pais: patient.pais || '',
    ciudad: patient.ciudad || '',
    grupoSanguineo: patient.grupoSanguineo || '',
    fotoUrl: patient.fotoUrl || '/assets/default-avatar.png', // Un placeholder si no hay foto
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Ficha Paciente Guardada:", formData);
    alert('Ficha del paciente guardada (simulación).');
  };

  const commonInputStyles = "w-full p-2.5 border border-light-border/70 dark:border-dark-border/70 rounded-lg text-sm bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary/50 focus:border-primary-light outline-none transition-all duration-150 ease-in-out shadow-sm focus:shadow-md hover:border-primary/50 dark:hover:border-primary-light/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Datos Personales" icon={faUserCircle}>
        <div className="mb-4">
            <img src={formData.fotoUrl} alt="Foto del Paciente" className="w-24 h-24 rounded-full object-cover border-2 border-light-border dark:border-dark-border shadow-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <FormGroupInput label="Nacionalidad" id="nacionalidad" name="nacionalidad" value={formData.nacionalidad || ''} onChange={handleChange} placeholder="e.g. Venezolano" inputClassName={commonInputStyles} />
          <FormGroupInput label="Identificación" id="identificacion" name="id" value={formData.id} onChange={handleChange} placeholder="e.g. V-12345678" readOnly inputClassName={commonInputStyles} />
          <FormGroupInput label="Apellidos" id="apellidos" name="apellidos" value={formData.apellidos || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Nombres" id="nombres" name="nombres" value={formData.nombres || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Fecha Nacimiento" id="fechaNacimiento" name="lastCheckup" type="date" value={formData.lastCheckup || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Edad Cronológica" id="edadCronologica" name="age" type="number" value={formData.age} onChange={handleChange} readOnly inputClassName={commonInputStyles} />
          <FormGroupSelect label="Género" id="genero" name="gender" value={formData.gender} onChange={handleChange} selectClassName={commonInputStyles}>
            <option value="Female">Femenino</option><option value="Male">Masculino</option><option value="Other">Otro</option>
          </FormGroupSelect>
          <FormGroupInput label="Estado Civil" id="estadoCivil" name="estadoCivil" value={formData.estadoCivil || ''} onChange={handleChange} placeholder="e.g. Soltero/a" inputClassName={commonInputStyles} />
          <FormGroupInput label="Teléfono" id="telefono" name="telefono" type="tel" value={formData.telefono || ''} onChange={handleChange} placeholder="e.g. +584123456789" inputClassName={commonInputStyles} />
          <FormGroupInput label="Profesión" id="profesion" name="profesion" value={formData.profesion || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Dirección" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} fullWidth={true} inputClassName={commonInputStyles} />
          <FormGroupInput label="E-mail" id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. usuario@correo.com" inputClassName={commonInputStyles} />
          <FormGroupInput label="País" id="pais" name="pais" value={formData.pais || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Ciudad" id="ciudad" name="ciudad" value={formData.ciudad || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupSelect label="Grupo Sanguíneo" id="grupoSanguineo" name="grupoSanguineo" value={formData.grupoSanguineo || ''} onChange={handleChange} selectClassName={commonInputStyles}>
            <option value="">Seleccione...</option>
            <option value="A+">A+</option> <option value="A-">A-</option> <option value="B+">B+</option> <option value="B-">B-</option>
            <option value="AB+">AB+</option> <option value="AB-">AB-</option> <option value="O+">O+</option> <option value="O-">O-</option>
          </FormGroupSelect>
          <FormGroupInput label="Referido por:" id="referidoPor" name="referidoPor" value={formData.referidoPor || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="No. Historia:" id="noHistoria" name="noHistoria" value={formData.noHistoria || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Lugar de Nacimiento:" id="lugarNacimiento" name="lugarNacimiento" value={formData.lugarNacimiento || ''} onChange={handleChange} inputClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Antecedentes" icon={faNotesMedical}>
        <div className="space-y-4">
          <FormGroupTextarea label="Familiares:" id="antecedentesFamiliares" name="antecedentesFamiliares" value={formData.antecedentesFamiliares || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} />
          <FormGroupTextarea label="Personales:" id="antecedentesPersonales" name="antecedentesPersonales" value={formData.antecedentesPersonales || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} />
          <FormGroupTextarea label="GinecoObstétricos:" id="ginecoObstetricos" name="ginecoObstetricos" value={formData.ginecoObstetricos || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Enfermedad Actual y Medicamentos" icon={faHeartPulse}>
        <FormGroupTextarea label="Medicamentos que está tomando:" id="medicamentosActuales" name="medicamentosActuales" value={formData.medicamentosActuales || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} />
        <FormGroupTextarea label="Enfermedad Actual:" id="enfermedadActual" name="enfermedadActual" value={formData.enfermedadActual || ''} onChange={handleChange} rows={4} textareaClassName={commonInputStyles} />
      </FormSection>

      <FormSection title="Examen Funcional" icon={faStethoscope}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormGroupInput label="General:" name="examenFuncional_general" value={formData.examenFuncional_general || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Intolerancias:" name="examenFuncional_intolerancias" value={formData.examenFuncional_intolerancias || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Apetencias:" name="examenFuncional_apetencias" value={formData.examenFuncional_apetencias || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Sudor/Temp:" name="examenFuncional_sudorTemp" value={formData.examenFuncional_sudorTemp || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Aversiones:" name="examenFuncional_aversiones" value={formData.examenFuncional_aversiones || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Adicciones:" name="examenFuncional_adicciones" value={formData.examenFuncional_adicciones || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Cardiovascular:" name="examenFuncional_cardiovascular" value={formData.examenFuncional_cardiovascular || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Respiratorio:" name="examenFuncional_respiratorio" value={formData.examenFuncional_respiratorio || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Evacuación:" name="examenFuncional_evacuacion" value={formData.examenFuncional_evacuacion || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Micción:" name="examenFuncional_miccion" value={formData.examenFuncional_miccion || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Sexual:" name="examenFuncional_sexual" value={formData.examenFuncional_sexual || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Mental:" name="examenFuncional_mental" value={formData.examenFuncional_mental || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Emocional:" name="examenFuncional_emocional" value={formData.examenFuncional_emocional || ''} onChange={handleChange} inputClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Examen Físico" icon={faStethoscope}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <FormGroupInput label="TA:" name="examenFisico_ta" value={formData.examenFisico_ta || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Pulso:" name="examenFisico_pulso" value={formData.examenFisico_pulso || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Peso:" name="examenFisico_peso" value={formData.examenFisico_peso || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Talla:" name="examenFisico_talla" value={formData.examenFisico_talla || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="IMC:" name="examenFisico_imc" value={formData.examenFisico_imc || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="% Grasa:" name="examenFisico_grasa" value={formData.examenFisico_grasa || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Cabeza:" name="examenFisico_cabeza" value={formData.examenFisico_cabeza || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Piel:" name="examenFisico_piel" value={formData.examenFisico_piel || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Cuello:" name="examenFisico_cuello" value={formData.examenFisico_cuello || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Tórax:" name="examenFisico_torax" value={formData.examenFisico_torax || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Corazón:" name="examenFisico_corazon" value={formData.examenFisico_corazon || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Pulmón:" name="examenFisico_pulmon" value={formData.examenFisico_pulmon || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Abdomen:" name="examenFisico_abdomen" value={formData.examenFisico_abdomen || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Lumbar:" name="examenFisico_lumbar" value={formData.examenFisico_lumbar || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Genitales:" name="examenFisico_genitales" value={formData.examenFisico_genitales || ''} onChange={handleChange} inputClassName={commonInputStyles} />
          <FormGroupInput label="Extremidades:" name="examenFisico_extremidades" value={formData.examenFisico_extremidades || ''} onChange={handleChange} inputClassName={commonInputStyles} />
        </div>
      </FormSection>

      <FormSection title="Laboratorio" icon={faVials}>
        <div className="flex items-center mb-4 gap-2">
            <span className="text-sm font-medium text-light-text-medium dark:text-dark-text-medium">Fecha:</span>
            <FormGroupInput label="" id="laboratorio_fecha" name="laboratorio_fecha" type="date" value={formData.laboratorio_fecha || ''} onChange={handleChange} className="!mb-0 w-auto" inputClassName={`p-1.5 text-sm ${commonInputStyles}`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormGroupInput label="Hematología:" id="laboratorio_hematologia" name="laboratorio_hematologia" value={formData.laboratorio_hematologia || ''} onChange={handleChange} placeholder="Valores principales..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Bioquímica:" id="laboratorio_bioquimica" name="laboratorio_bioquimica" value={formData.laboratorio_bioquimica || ''} onChange={handleChange} placeholder="Valores principales..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Orina:" id="laboratorio_orina" name="laboratorio_orina" value={formData.laboratorio_orina || ''} onChange={handleChange} placeholder="Resultados..." inputClassName={commonInputStyles} />
          <FormGroupInput label="Heces:" id="laboratorio_heces" name="laboratorio_heces" value={formData.laboratorio_heces || ''} onChange={handleChange} placeholder="Resultados..." inputClassName={commonInputStyles} />
          <FormGroupTextarea label="Otros:" id="laboratorio_otros" name="laboratorio_otros" value={formData.laboratorio_otros || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} fullWidth={true} />
        </div>
      </FormSection>

      <FormSection title="Diagnóstico y Plan" icon={faNotesMedical}>
        <FormGroupTextarea label="Impresión Diagnóstica:" id="impresionDiagnostica" name="impresionDiagnostica" value={formData.impresionDiagnostica || ''} onChange={handleChange} rows={4} textareaClassName={commonInputStyles} />
        <FormGroupTextarea label="Tratamiento:" id="tratamiento" name="tratamiento" value={formData.tratamiento || ''} onChange={handleChange} rows={4} textareaClassName={commonInputStyles} />
        <FormGroupTextarea label="Observaciones:" id="observaciones" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} rows={3} textareaClassName={commonInputStyles} />
      </FormSection>

      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-light-border dark:border-dark-border">
        <button type="button" onClick={() => alert('Cancelado')}
          className="px-6 py-2.5 rounded-lg border border-light-border dark:border-dark-border text-text-medium dark:text-dark-text-medium hover:bg-gray-100 dark:hover:bg-dark-bg font-medium transition-colors shadow-sm hover:shadow">
          Cancelar
        </button>
        <button type="submit"
          className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md hover:shadow-lg">
          Guardar Historia
        </button>
      </div>
    </form>
  );
}