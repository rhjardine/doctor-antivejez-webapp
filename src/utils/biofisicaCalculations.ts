import { BiofisicaField } from '../types/biofisica';

export const getAbsoluteResult = (name: string, value: number): number => {
  // Implementación de la lógica para calcular el valor absoluto
  return 0;
};

export const getDimensionsResult = (field: BiofisicaField): number => {
  // Implementación de la lógica para calcular el valor absoluto para campos con dimensiones
  return 0;
};

export const getTextForDifferential = (differential: number): string => {
  if (differential === null || differential === undefined) return '';
  if (differential > 0) return ' más';
  if (differential < 0) return ' menos';
  return '';
};
