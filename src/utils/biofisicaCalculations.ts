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

// Calcular edad absoluta para un campo simple
export function getAbsoluteResult(
  name: string,
  value: string | number | null,
  boards: BoardData[]
): number {
  if (value === null || value === undefined || value === '') {
    return 80;
  }
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const fieldBoards = boards.filter(b => b.name === name);
  
  if (fieldBoards.length === 0) {
    return 80;
  }
  
  const targetBoard = fieldBoards.find(board => {
    const boardMin = parseFloat(board.min);
    const boardMax = parseFloat(board.max);
    return numericValue >= boardMin && numericValue <= boardMax;
  });
  
  if (!targetBoard) {
    return 80;
  }
  
  const range = targetBoard.range;
  const boardMin = parseFloat(targetBoard.min);
  const boardMax = parseFloat(targetBoard.max);
  
  if (range.min === range.max) {
    return range.min;
  }
  
  const metricRange = Math.abs(boardMax - boardMin);
  const ageRange = Math.abs(range.max - range.min);
  let proportion = (numericValue - boardMin) / metricRange;
  
  if (targetBoard.inverse === 1) {
    proportion = 1 - proportion;
  }
  
  const age = Math.round(range.min + (proportion * ageRange));
  return Math.max(range.min, Math.min(age, range.max));
}

// Calcular edad absoluta para campos con dimensiones
export function getDimensionsResult(field: BiofisicaField, boards: BoardData[]): number {
  const highVal = typeof field.high === 'string' ? parseFloat(field.high) : field.high;
  const longVal = typeof field.long === 'string' ? parseFloat(field.long) : field.long;
  const widthVal = typeof field.width === 'string' ? parseFloat(field.width) : field.width;
  
  if (typeof highVal === 'number' && !isNaN(highVal) &&
      typeof longVal === 'number' && !isNaN(longVal) &&
      typeof widthVal === 'number' && !isNaN(widthVal)) {
    const average = (highVal + longVal + widthVal) / 3;
    return getAbsoluteResult(field.name, average, boards);
  }
  
  return 80;
}

// Obtener texto para el diferencial
export function getTextForDifferential(differential: number): string {
  if (differential > 0) {
    return `${Math.abs(differential)} años más`;
  } else if (differential < 0) {
    return `${Math.abs(differential)} años menos`;
  }
  return 'igual';
}

// Boards de cálculo (datos de referencia)
export const calculationBoards: BoardData[] = [
  // Aquí irían tus boards de referencia
  // Por ahora dejamos un array vacío
]; 