// src/types/historia.ts (o donde corresponda)

export type NacionalidadType = 'V' | 'E' | 'J' | '';
export type GeneroType = 'Masculino' | 'Masculino Deportivo' | 'Femenino' | 'Femenino Deportivo' | '';
export type GrupoSanguineoType = 'A+' | 'B+' | 'O+' | 'A-' | 'B-' | 'O-' | 'AB+' | 'AB-' | '';
export type EdoCivilType = 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | ''; // Añade más si es necesario

export interface HistoriaClinicaData {
  // Sección 1: Identificación y Datos Generales
  id?: string; // Opcional, para cuando se edita
  fotoUrl?: string; // URL de la foto del paciente
  nacionalidad: NacionalidadType;
  identificacion: string;
  fechaHistoria: string; // formato YYYY-MM-DD
  apellidos: string;
  nombres: string;
  fechaNacimiento: string; // formato YYYY-MM-DD
  edadCronologica?: number; // Calculada o ingresada
  genero: GeneroType;
  lugarNacimiento: string;
  telefono: string;
  edoCivil: EdoCivilType;
  profesion: string;
  paisResidencia: string; // Diferente de nacionalidad
  estadoProvinciaResidencia: string;
  direccion: string;
  grupoSanguineo: GrupoSanguineoType;
  email: string;
  observacionesGenerales: string;

  // Sección 2: Referido por y Antecedentes (del formulario de papel)
  referidoPor?: string;
  noHistoria?: string; // Podría ser el mismo que 'identificacion' o un ID interno
  // Antecedentes
  antecedentesFamiliares?: string;
  antecedentesPersonales?: string;
  antecedentesGinecoObstetricos?: string; // Si aplica
  medicamentosActuales?: string;
  enfermedadActual?: string;

  // Sección 3: Examen Funcional (campos extensos, podrías agruparlos en un objeto)
  examenFuncionalGeneral?: string;
  examenFuncionalApetencias?: string; // (Apetito/Sed)
  examenFuncionalAdicciones?: string;
  examenFuncionalCardiovascular?: string;
  examenFuncionalEvacuacion?: string;
  examenFuncionalSexual?: string;
  examenFuncionalMental?: string;
  examenFuncionalIntolerancias?: string;
  examenFuncionalSudorTemp?: string;
  examenFuncionalRespiratorio?: string;
  examenFuncionalMiccion?: string;
  examenFuncionalSueno?: string;
  examenFuncionalEmocional?: string;
  
  // Sección 4: Examen Físico
  taSistolica?: number;
  taDiastolica?: number;
  pulso?: number;
  peso?: number; // kg
  talla?: number; // cm
  imc?: number; // Calculado
  porcentajeGrasa?: number;
  examenFisicoCabeza?: string;
  examenFisicoCuello?: string;
  examenFisicoCorazon?: string; // Podría ser más detallado
  examenFisicoAbdomen?: string;
  examenFisicoGenitales?: string;
  examenFisicoPiel?: string; // Del formulario de papel
  examenFisicoTorax?: string;
  examenFisicoPulmon?: string; // Podría ser más detallado
  examenFisicoLumbar?: string;
  examenFisicoExtremidades?: string;

  // Sección 5: Laboratorio
  fechaLaboratorio?: string;
  laboratorioHematologia?: string;
  laboratorioBioquimica?: string;
  laboratorioOrina?: string;
  laboratorioOtros?: string;
  laboratorioHeces?: string;

  // Sección 6: Diagnóstico y Tratamiento
  impresionDiagnostica?: string;
  tratamiento?: string;
  observacionesAdicionales?: string; // Diferente de observacionesGenerales
}