// src/types/historia.ts
export type NacionalidadType = 'V' | 'E' | 'J' | '';
export type GeneroType = 'Masculino' | 'Masculino Deportivo' | 'Femenino' | 'Femenino Deportivo' | '';
export type GrupoSanguineoType = 'A+' | 'B+' | 'O+' | 'A-' | 'B-' | 'O-' | 'AB+' | 'AB-' | '';
// ACTUALIZADO EdoCivilType para incluir las nuevas opciones
export type EdoCivilType = 'Soltero(a)' | 'Comprometido(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viudo(a)' | 'Relación' | '';

export interface HistoriaClinicaData {
  // Sección 1: Identificación y Datos Generales
  id?: string;
  fotoUrl?: string;
  nacionalidad: NacionalidadType;
  identificacion: string;
  fechaHistoria: string;
  apellidos: string;
  nombres: string;
  fechaNacimiento: string;
  edadCronologica?: number;
  genero: GeneroType;
  lugarNacimiento: string;
  telefono: string;
  edoCivil: EdoCivilType;
  profesion: string;
  paisResidencia: string;
  estadoProvinciaResidencia: string;
  ciudad?: string; // Añadido el campo ciudad que estaba en el formulario
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

  // Sección 3: Examen Funcional (Campos omitidos por brevedad en la pregunta, pero deben estar aquí)
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

  // Sección 4: Examen Físico (Campos omitidos por brevedad en la pregunta, pero deben estar aquí)
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
  
  // Sección 5: Laboratorio (Campos omitidos por brevedad en la pregunta, pero deben estar aquí)
  fechaLaboratorio?: string;
  laboratorioHematologia?: string;
  laboratorioBioquimica?: string;
  laboratorioOrina?: string;
  laboratorioOtros?: string;
  laboratorioHeces?: string;

  // Sección 6: Diagnóstico y Tratamiento (Campos omitidos por brevedad en la pregunta, pero deben estar aquí)
  impresionDiagnostica?: string;
  tratamiento?: string;
  observacionesAdicionales?: string;
}