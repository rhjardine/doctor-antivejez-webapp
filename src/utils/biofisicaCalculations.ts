import { BiofisicaField, CalculationBoards } from '@/app/historias/types/biofisica';

// Definición de las reglas de cálculo
export const calculationBoards: CalculationBoards = {
  'female_fat': { name: 'female_fat', min_age: 20, max_age: 80, range_min: 18, range_max: 35, inverse: false },
  'male_fat': { name: 'male_fat', min_age: 20, max_age: 80, range_min: 10, range_max: 25, inverse: false },
  'sporty_female_fat': { name: 'sporty_female_fat', min_age: 20, max_age: 80, range_min: 14, range_max: 20, inverse: false },
  'sporty_male_fat': { name: 'sporty_male_fat', min_age: 20, max_age: 80, range_min: 6, range_max: 15, inverse: false },
  'body_mass': { name: 'body_mass', min_age: 20, max_age: 80, range_min: 18.5, range_max: 30, inverse: false },
  'digital_reflections': { name: 'digital_reflections', min_age: 20, max_age: 80, range_min: 5, range_max: 20, inverse: true },
  'visual_accommodation': { name: 'visual_accommodation', min_age: 20, max_age: 80, range_min: 5, range_max: 15, inverse: true },
  'static_balance': { name: 'static_balance', min_age: 20, max_age: 80, range_min: 10, range_max: 60, inverse: true },
  'quaten_hydration': { name: 'quaten_hydration', min_age: 20, max_age: 80, range_min: 2, range_max: 10, inverse: true },
  'systolic_blood_pressure': { name: 'systolic_blood_pressure', min_age: 20, max_age: 80, range_min: 90, range_max: 140, inverse: false },
  'diastolic_blood_pressure': { name: 'diastolic_blood_pressure', min_age: 20, max_age: 80, range_min: 60, range_max: 90, inverse: false }
};

// Obtener el nombre del campo de grasa según el género
export function getFatName(formType: number): string {
  switch (formType) {
    case 1: return 'female_fat'; // GENDER_FEMALE
    case 2: return 'male_fat'; // GENDER_MALE
    case 3: return 'sporty_female_fat'; // GENDER_SPORTY_FEMALE
    case 4: return 'sporty_male_fat'; // GENDER_SPORTY_MALE
    default: return '';
  }
}

// Calcular edad absoluta basada en valor relativo
export function getAbsoluteResult(name: string, value: string | number | null): number {
  const board = calculationBoards[name];
  if (!board) {
    console.error(`Calculation board not found for: ${name}`);
    return 80; // Valor predeterminado
  }
  
  if (value === null || value === undefined || value === '') {
    return board.min_age;
  }
  
  const { range_min, range_max, min_age, max_age, inverse } = board;
  const valueNum = typeof value === 'string' ? parseFloat(value) : value;
  
  // Limitar valor al rango definido
  const clampedValue = Math.min(Math.max(valueNum, Math.min(range_min, range_max)), Math.max(range_min, range_max));
  
  const rangeLength = Math.abs(range_max - range_min);
  const ageLength = Math.abs(max_age - min_age);
  
  if (rangeLength === 0) return min_age;
  
  // Calcular posición normalizada
  let normalized = (clampedValue - range_min) / rangeLength;
  
  // Calcular edad basada en normalización
  let age: number;
  if (inverse) {
    // Si es inverso, mayor valor = menor edad
    age = max_age - (normalized * ageLength);
  } else {
    // Si no es inverso, mayor valor = mayor edad
    age = min_age + (normalized * ageLength);
  }
  
  // Limitar resultado al rango de edad
  return Math.max(min_age, Math.min(age, max_age));
}

// Calcular edad absoluta para campos con dimensiones
export function getDimensionsResult(field: BiofisicaField): number {
  const { high, long, width, name } = field;
  
  // Convertir a números
  const highVal = typeof high === 'string' ? parseFloat(high) : high;
  const longVal = typeof long === 'string' ? parseFloat(long) : long;
  const widthVal = typeof width === 'string' ? parseFloat(width) : width;
  
  if (typeof highVal === 'number' && !isNaN(highVal) && 
      typeof longVal === 'number' && !isNaN(longVal) && 
      typeof widthVal === 'number' && !isNaN(widthVal)) {
    // Calcular promedio de las dimensiones
    const average = (highVal + longVal + widthVal) / 3;
    return getAbsoluteResult(name, average);
  }
  
  const board = calculationBoards[name];
  return board ? board.max_age : 80;
}