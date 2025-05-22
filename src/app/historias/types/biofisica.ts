// Tipos para el cálculo de edad biofísica

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