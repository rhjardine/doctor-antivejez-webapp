// src/types/history.ts
export interface HistoryFormData {
  document: string; // "V", "E", etc.
  identification_id: string;
  history: string; // YYYY-MM-DD
  surnames: string;
  names: string;
  birthday: string; // YYYY-MM-DD
  age: number;
  gender: string;
  birthplace: string;
  phone: string;
  marital_status: string;
  occupation: string;
  country: string;
  state: string;
  city: string;
  address: string;
  bloody_type: string;
  email: string;
  observations?: string;
}

export interface Person {
  id: number;
  user_id: number;
  document: string;
  identification_id: string;
  history: string;
  surnames: string;
  names: string;
  birthday: string;
  age: number;
  gender: string;
  birthplace: string;
  phone: string;
  marital_status: string;
  occupation: string;
  country: string;
  state: string;
  city: string;
  address: string;
  bloody_type: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  user_id: number;
  alphanumeric: string;
  role: string;
  email: string;
  person: Person;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationErrors {
  [key: string]: string[];
}

// Opciones para selectores
export const DOCUMENT_OPTIONS = [
  { value: 'V', label: 'V - Venezolano' },
  { value: 'E', label: 'E - Extranjero' },
  { value: 'J', label: 'J - Jurídico' },
  { value: 'P', label: 'P - Pasaporte' }
];

export const GENDER_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Masculino Deportivo', label: 'Masculino Deportivo' },
  { value: 'Femenino Deportivo', label: 'Femenino Deportivo' }
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Soltero/a', label: 'Soltero/a' },
  { value: 'Casado/a', label: 'Casado/a' },
  { value: 'Divorciado/a', label: 'Divorciado/a' },
  { value: 'Viudo/a', label: 'Viudo/a' },
  { value: 'Unión Estable', label: 'Unión Estable' }
];

export const BLOOD_TYPE_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];