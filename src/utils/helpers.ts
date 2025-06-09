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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para obtener el ícono del archivo
export function getFileIcon(fileType: string): string {
  switch (fileType) {
    case 'application/pdf':
      return '📄';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return '📝';
    case 'text/plain':
      return '📋';
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return '🖼️';
    default:
      return '📎';
  }
}