import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función para combinar clases de tailwind y resolver conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para formatear fechas
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Función para formatear números
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para generar ID único
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Función para calcular edad a partir de fecha de nacimiento
export function calculateAge(birthDate: Date | string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Función para formatear valores de salud
export function formatHealthValue(value: number, unit: string): string {
  return `${formatNumber(value)} ${unit}`;
}

// Función para determinar el estado de salud basado en rangos
export function getHealthStatus(value: number, normal: { min: number, max: number }): 'low' | 'normal' | 'high' {
  if (value < normal.min) return 'low';
  if (value > normal.max) return 'high';
  return 'normal';
}