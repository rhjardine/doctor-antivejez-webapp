// src/app/historias/types/biofisica.ts
export interface BiofisicaField {
  name: string;
  translate: string;
  dimensions: boolean;
  relative_value: string | number | null;
  absolute_value: number | null;
  high: string | number | null;
  long: string | number | null;
  width: string | number | null;
}

export interface BiofisicaFormData {
  formType: number | null;
  fields: BiofisicaField[];
  chronological: number | null;
  biological: number | null;
  differential: number | null;
  weight?: number;
  height?: number;
  age?: number;
  sex?: 'masculino' | 'masculino_deportivo' | 'femenino' | 'femenino_deportivo';
  waist?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  skinElasticity?: number;
  visualAccommodation?: number;
  digitalReflexes?: number;
}

export interface BiofisicaResults {
  edadBiofisica: number;
  diferencial: number;
  categoria: 'rejuvenecido' | 'normal' | 'envejecido';
  grado?: 'I' | 'II' | 'III';
  color: string;
  imc: number;
  tmb: number;
  porcentajeGrasa: number;
  recomendaciones: string[];
}

export interface CalculationBoard {
  name: string;
  min_age: number;
  max_age: number;
  range_min: number;
  range_max: number;
  inverse: boolean;
}

export type CalculationBoards = Record<string, CalculationBoard>;

// Opciones de género actualizadas
export const GENDER_OPTIONS = [
  { value: 1, label: 'Masculino' },
  { value: 2, label: 'Masculino Deportivo' },
  { value: 3, label: 'Femenino' },
  { value: 4, label: 'Femenino Deportivo' }
] as const;

export type FormTypeNumeric = 1 | 2 | 3 | 4;
export type GenderType = typeof GENDER_OPTIONS[number]['value'];

export const RESULT_COLORS = {
  rejuvenecido: '#10B981',
  normal: '#F59E0B',
  envejecido: '#EF4444'
} as const;

export const calculateBMI = (weight: number, height: number): number => {
  return weight / ((height / 100) ** 2);
};

export const calculateBMR = (weight: number, height: number, age: number, sex: GenderType): number => {
  const isMale = sex === 1 || sex === 2;
  if (isMale) {
    return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
  } else {
    return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
  }
};

export const calculateBodyFatPercentage = (waist: number, weight: number): number => {
  return (waist * 1.082 + 94.42) - (weight * 4.15);
};

export const calculateBiologicalAge = (data: {
  chronologicalAge: number;
  bodyFatPercentage: number;
  muscleMass: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  skinElasticity: number;
  visualAccommodation: number;
  digitalReflexes: number;
  sex: GenderType;
}): number => {
  let ageAdjustment = 0;
  const { chronologicalAge, bodyFatPercentage, muscleMass, bloodPressureSystolic, 
          bloodPressureDiastolic, skinElasticity, visualAccommodation, digitalReflexes, sex } = data;

  const idealBodyFat = getIdealBodyFatRange(sex);
  if (bodyFatPercentage > idealBodyFat.max) {
    ageAdjustment += (bodyFatPercentage - idealBodyFat.max) * 0.3;
  } else if (bodyFatPercentage < idealBodyFat.min) {
    ageAdjustment -= (idealBodyFat.min - bodyFatPercentage) * 0.2;
  }

  const idealMuscleMass = getIdealMuscleMassRange(sex);
  if (muscleMass < idealMuscleMass.min) {
    ageAdjustment += (idealMuscleMass.min - muscleMass) * 0.2;
  } else if (muscleMass > idealMuscleMass.max) {
    ageAdjustment -= (muscleMass - idealMuscleMass.max) * 0.1;
  }

  if (bloodPressureSystolic > 140 || bloodPressureDiastolic > 90) {
    ageAdjustment += 3;
  } else if (bloodPressureSystolic < 120 && bloodPressureDiastolic < 80) {
    ageAdjustment -= 1;
  }

  if (skinElasticity <= 3) {
    ageAdjustment += 4;
  } else if (skinElasticity >= 8) {
    ageAdjustment -= 2;
  }

  if (visualAccommodation <= 3) {
    ageAdjustment += 3;
  } else if (visualAccommodation >= 8) {
    ageAdjustment -= 1.5;
  }

  if (digitalReflexes <= 3) {
    ageAdjustment += 2;
  } else if (digitalReflexes >= 8) {
    ageAdjustment -= 1;
  }

  return Math.round(chronologicalAge + ageAdjustment);
};

export const getBiologicalAgeCategory = (chronologicalAge: number, biologicalAge: number): {
  categoria: 'rejuvenecido' | 'normal' | 'envejecido';
  grado?: 'I' | 'II' | 'III';
  color: string;
  diferencial: number;
} => {
  const diferencial = biologicalAge - chronologicalAge;

  if (diferencial <= -7) {
    let grado: 'I' | 'II' | 'III' = 'I';
    if (diferencial <= -15) grado = 'III';
    else if (diferencial <= -10) grado = 'II';
    return {
      categoria: 'rejuvenecido',
      grado,
      color: RESULT_COLORS.rejuvenecido,
      diferencial
    };
  }
  
  if (diferencial >= 7) {
    let grado: 'I' | 'II' | 'III' = 'I';
    if (diferencial >= 15) grado = 'III';
    else if (diferencial >= 10) grado = 'II';
    return {
      categoria: 'envejecido',
      grado,
      color: RESULT_COLORS.envejecido,
      diferencial
    };
  }
  
  return {
    categoria: 'normal',
    color: RESULT_COLORS.normal,
    diferencial
  };
};

export const getIdealBodyFatRange = (sex: GenderType): { min: number; max: number } => {
  switch (sex) {
    case 1: return { min: 8, max: 18 };
    case 2: return { min: 5, max: 15 };
    case 3: return { min: 16, max: 25 };
    case 4: return { min: 14, max: 22 };
    default: return { min: 10, max: 25 };
  }
};

export const getIdealMuscleMassRange = (sex: GenderType): { min: number; max: number } => {
  switch (sex) {
    case 1: return { min: 40, max: 60 };
    case 2: return { min: 45, max: 65 };
    case 3: return { min: 30, max: 45 };
    case 4: return { min: 35, max: 50 };
    default: return { min: 30, max: 50 };
  }
};

export const getFatName = (formType: number): string => {
  switch (formType) {
    case 1: return 'male_fat';
    case 2: return 'sporty_male_fat';
    case 3: return 'female_fat';
    case 4: return 'sporty_female_fat';
    default: return 'unknown_fat';
  }
};

export const generateRecommendations = (results: BiofisicaResults, data: BiofisicaFormData): string[] => {
  const recommendations: string[] = [];
  if (results.categoria === 'envejecido') {
    recommendations.push('Implementar rutina de ejercicio cardiovascular regular');
    recommendations.push('Mejorar la alimentación con más antioxidantes');
    recommendations.push('Considerar suplementación nutricional específica');
    recommendations.push('Realizar chequeos médicos más frecuentes');
  } else if (results.categoria === 'normal') {
    recommendations.push('Mantener hábitos saludables actuales');
    recommendations.push('Incorporar ejercicios de fuerza y flexibilidad');
    recommendations.push('Monitorear regularmente los indicadores de salud');
  } else {
    recommendations.push('¡Excelente! Mantener el estilo de vida actual');
    recommendations.push('Continuar con la rutina de ejercicios');
    recommendations.push('Servir como ejemplo para otros');
  }
  return recommendations;
};

export const IMC_CATEGORIES = {
  'bajo_peso': { min: 0, max: 18.5, label: 'Bajo peso', color: '#3B82F6' },
  'normal': { min: 18.5, max: 24.9, label: 'Peso normal', color: '#10B981' },
  'sobrepeso': { min: 25, max: 29.9, label: 'Sobrepeso', color: '#F59E0B' },
  'obesidad_1': { min: 30, max: 34.9, label: 'Obesidad grado I', color: '#EF4444' },
  'obesidad_2': { min: 35, max: 39.9, label: 'Obesidad grado II', color: '#DC2626' },
  'obesidad_3': { min: 40, max: 100, label: 'Obesidad grado III', color: '#991B1B' }
} as const;

export const getIMCCategory = (imc: number): keyof typeof IMC_CATEGORIES => {
  for (const [key, category] of Object.entries(IMC_CATEGORIES)) {
    if (imc >= category.min && imc < category.max) {
      return key as keyof typeof IMC_CATEGORIES;
    }
  }
  return 'obesidad_3';
};

export const ACTIVITY_LEVEL_OPTIONS = [
  { value: 'sedentario', label: 'Sedentario (poco o nada de ejercicio)' },
  { value: 'ligero', label: 'Ligero (ejercicio 1-3 días/semana)' },
  { value: 'moderado', label: 'Moderado (ejercicio 3-5 días/semana)' },
  { value: 'intenso', label: 'Intenso (ejercicio 6-7 días/semana)' },
  { value: 'muy_intenso', label: 'Muy intenso (ejercicio 2 veces/día)' }
] as const;

export type ActivityLevelType = typeof ACTIVITY_LEVEL_OPTIONS[number]['value'];
export type IMCCategoryType = keyof typeof IMC_CATEGORIES;

export const BIOFISICA_CONSTANTS = {
  AGE_CORRECTION_FACTORS: {
    18: 1.0,
    25: 1.0,
    30: 1.02,
    35: 1.04,
    40: 1.06,
    45: 1.08,
    50: 1.10,
    55: 1.12,
    60: 1.14,
    65: 1.16,
    70: 1.18
  }
} as const;

export interface RangeData {
  id: number;
  min: number;
  max: number;
  created_at: string;
  updated_at: string;
}

export interface BoardData {
  field: string;
  min: string;
  max: string;
  range: { min: number; max: number };
  inverse?: boolean;
}

export interface PatientBiofisicaData {
  primerNombre?: string;
  primerApellido?: string;
  fechaNacimiento?: string;
  formType?: number;
  genero?: string | number;
  gender?: string | number;
  sexo?: string | number;
  id: string;
}

export interface BiofisicaSavePayload {
  userId: string;
  chronological: number;
  biological: number;
  differential: number;
  gender: number;
  form: string;
}

export type CalculationStatus = 'idle' | 'loading' | 'calculated' | 'error';
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export const FORM_TYPES = {
  BASIC: 1,
  ADVANCED: 2,
  PROFESSIONAL: 3
} as const;

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES];