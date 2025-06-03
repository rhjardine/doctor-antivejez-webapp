// src/utils/dateUtils.ts
import { differenceInYears, format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Calcular edad a partir de fecha de nacimiento
 */
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  try {
    const birth = parseISO(birthDate);
    if (!isValid(birth)) return 0;
    
    const age = differenceInYears(new Date(), birth);
    return age >= 0 ? age : 0;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};

/**
 * Formatear fecha para mostrar
 */
export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    
    return format(date, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Obtener fecha actual en formato YYYY-MM-DD
 */
export const getCurrentDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Validar formato de fecha
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
};