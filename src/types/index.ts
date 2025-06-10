export interface Patient {
  id: string;
  names: string;
  surnames: string;
  chronological_age?: number;
  birth_date?: string;
  birthday?: string;
  age?: number;
  [key: string]: any;
}

export interface HistoriaClinicaData {
  id?: string;
  patientId: string;
  [key: string]: any;
}