export interface BiofisicaField {
  name: string;
  translate: string;
  dimensions: boolean;
  relative_value: string | number;
  absolute_value: number | null;
  high: string | number;
  long: string | number;
  width: string | number;
}

export const GENDER_OPTIONS = [
  { value: 1, label: 'Femenino' },
  { value: 2, label: 'Masculino' },
  { value: 3, label: 'Femenino Deportista' },
  { value: 4, label: 'Masculino Deportista' },
];

export const getFatName = (formType: number): string => {
  switch (formType) {
    case 1: return 'female_fat';
    case 2: return 'male_fat';
    case 3: return 'sporty_female_fat';
    case 4: return 'sporty_male_fat';
    default: return '';
  }
};
