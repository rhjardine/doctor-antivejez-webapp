// src/types/historia.ts
export type NacionalidadType = 'V' | 'E' | 'J' | ''; // 'J' es un caracter especial, asegurar que sea intencional
export type GeneroType = 'Masculino' | 'Masculino Deportivo' | 'Femenino' | 'Femenino Deportivo' | '';
export type GrupoSanguineoType = 'A+' | 'B+' | 'O+' | 'A-' | 'B-' | 'O-' | 'AB+' | 'AB-' | ''; // Corregido '0+' a 'O+' y '0-' a 'O-'
export type EdoCivilType = 'Soltero(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | '';

export interface HistoriaClinicaData {
  // Sección 1: Identificación y Datos Generales
  id?: string; // Opcional, para cuando se edita
  fotoUrl?: string; // URL de la foto del paciente
  fotoFile?: File & { type: string } | null; // Asegura que sea un archivo con tipo definido
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

  // Sección 2: Referido por y Antecedentes
  referidoPor?: string;
  noHistoria?: string;
  antecedentesFamiliares?: string;
  antecedentesPersonales?: string;
  antecedentesGinecoObstetricos?: string;
  medicamentosActuales?: string;
  enfermedadActual?: string;

  // Sección 3: Examen Funcional
  examenFuncionalGeneral?: string;
  examenFuncionalApetencias?: string;
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
  peso?: number;
  talla?: number;
  imc?: number;
  porcentajeGrasa?: number;
  examenFisicoCabeza?: string;
  examenFisicoCuello?: string;
  examenFisicoCorazon?: string;
  examenFisicoAbdomen?: string;
  examenFisicoGenitales?: string;
  examenFisicoPiel?: string;
  examenFisicoTorax?: string;
  examenFisicoPulmon?: string;
  examenFisicoLumbar?: string;
  examenFisicoExtremidades?: string;

  // Sección 5: Laboratorio
  fechaLaboratorio?: string; // formato YYYY-MM-DD
  laboratorioHematologia?: string;
  laboratorioBioquimica?: string;
  laboratorioOrina?: string;
  laboratorioOtros?: string;
  laboratorioHeces?: string;

  // Sección 6: Diagnóstico y Tratamiento
  impresionDiagnostica?: string;
  tratamiento?: string;
  observacionesAdicionales?: string;
}