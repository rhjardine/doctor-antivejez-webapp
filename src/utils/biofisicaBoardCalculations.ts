// src/utils/biofisicaBoardCalculations.ts
import { BoardData, BiofisicaField } from '@/app/historias/types/biofisica';

// Obtener el nombre del campo de grasa según género
export function getFatName(formType: number): string {
  switch (formType) {
    case 1: return 'female_fat';            // Femenino
    case 2: return 'male_fat';              // Masculino
    case 3: return 'sporty_female_fat';     // Femenino Deportista
    case 4: return 'sporty_male_fat';       // Masculino Deportista
    default: return '';
  }
}

// Función auxiliar: obtener rango de edades
function getRange(start: number, end: number, inverse: boolean = false): number[] {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return inverse ? arr.reverse() : arr;
}

// Función auxiliar: verificar si un valor está en el rango del board
function isValueInBoardRange(board: BoardData, value: number): boolean {
  const boardMin = parseFloat(board.min);
  const boardMax = parseFloat(board.max);
  
  // Si el board tiene min > max (rango invertido)
  if (boardMin > boardMax) {
    return value <= boardMin && value >= boardMax;
  }
  
  // Rango normal
  return value >= boardMin && value <= boardMax;
}

// Calcular edad absoluta para un campo simple
export function getAbsoluteResult(
  name: string,                   // Nombre del campo (ej. "male_fat")
  value: string | number | null,  // Valor ingresado por el usuario
  boards: BoardData[]             // Array de boards del backend
): number {
  // Si no hay valor, devolver null
  if (value === null || value === undefined || value === '') {
    return 80; // Valor por defecto (edad máxima)
  }
  
  // Convertir a número si es string
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Filtrar boards por nombre
  const fieldBoards = boards.filter(b => b.name === name);
  if (fieldBoards.length === 0) {
    console.warn(`No boards found for field: ${name}`);
    return 80; // Valor por defecto
  }
  
  // Encontrar el board específico que contiene el valor
  const targetBoard = fieldBoards.find(board => isValueInBoardRange(board, numericValue));
  if (!targetBoard) {
    // Si no se encuentra un board exacto, buscar el límite más cercano
    if (numericValue < parseFloat(fieldBoards[0].min)) {
      return fieldBoards[0].range.min; // Valor está por debajo del mínimo
    }
    
    if (numericValue > parseFloat(fieldBoards[fieldBoards.length - 1].max)) {
      return fieldBoards[fieldBoards.length - 1].range.max; // Valor está por encima del máximo
    }
    
    console.warn(`No matching board found for ${name} with value ${numericValue}`);
    return 80; // Valor por defecto
  }
  
  // Obtener rango de edad y valores del board
  const range = targetBoard.range;
  const boardMin = parseFloat(targetBoard.min);
  const boardMax = parseFloat(targetBoard.max);
  
  // Si el rango de edad es un punto, devolver ese valor
  if (range.min === range.max) {
    return range.min;
  }
  
  // Calcular la proporción del valor dentro del rango de la métrica
  const metricRange = Math.abs(boardMax - boardMin);
  const ageRange = Math.abs(range.max - range.min);
  
  // Interpolación lineal
  let proportion = (numericValue - boardMin) / metricRange;
  
  // Si el board es inverso, invertir la proporción
  if (targetBoard.inverse === 1) {
    proportion = 1 - proportion;
  }
  
  // Calcular la edad interpolada
  const age = Math.round(range.min + (proportion * ageRange));
  
  // Asegurar que la edad esté dentro del rango
  return Math.max(range.min, Math.min(age, range.max));
}

// Calcular edad absoluta para campos con dimensiones (alto/largo/ancho)
export function getDimensionsResult(field: BiofisicaField, boards: BoardData[]): number {
  // Convertir high, long, width a números
  const highVal = typeof field.high === 'string' ? parseFloat(field.high) : field.high;
  const longVal = typeof field.long === 'string' ? parseFloat(field.long) : field.long;
  const widthVal = typeof field.width === 'string' ? parseFloat(field.width) : field.width;
  
  // Verificar que todos los valores sean números válidos
  if (typeof highVal === 'number' && !isNaN(highVal) &&
      typeof longVal === 'number' && !isNaN(longVal) &&
      typeof widthVal === 'number' && !isNaN(widthVal)) {
    
    // Calcular promedio
    const average = (highVal + longVal + widthVal) / 3;
    
    // Usar getAbsoluteResult con el promedio
    return getAbsoluteResult(field.name, average, boards);
  }
  
  // Si algún valor no es válido, devolver valor por defecto
  return 80;
}

// Construir el payload para guardar en el backend
export function buildSavePayload(
  formData: BiofisicaFormData,
  patientId: string
): {
  userId: string;
  chronological: number;
  biological: number;
  differential: number;
  gender: number;
  form: string;
} {
  // Filtrar campos que tienen valores relativos y absolutos
  const formFields = formData.fields
    .filter(field => {
      if (field.dimensions) {
        return field.high !== null && field.long !== null && field.width !== null && field.absolute_value !== null;
      }
      return field.relative_value !== null && field.absolute_value !== null;
    })
    .map(field => {
      if (field.dimensions) {
        return {
          name: field.name,
          high: field.high,
          long: field.long,
          width: field.width,
          absolute_value: field.absolute_value
        };
      }
      return {
        name: field.name,
        relative_value: field.relative_value,
        absolute_value: field.absolute_value
      };
    });
  
  return {
    userId: patientId,
    chronological: formData.chronological || 0,
    biological: formData.biological || 0,
    differential: formData.differential || 0,
    gender: formData.formType || 1,
    form: JSON.stringify(formFields)
  };
}