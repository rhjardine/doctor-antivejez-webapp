export interface NutraceuticoItemData {
  id: string;
  label: string;
  checked: boolean;
  qty: string;
  freq: string;
  supplement: string;
  isRemocion?: boolean;
  doseInfo?: string;
}

export interface TerapiaItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface FlorDeBachItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface GuiaPacienteFormData {
  patientName: string;
  date: string;
  remocionItems: NutraceuticoItemData[];
  remocionCucharadas: string;
  remocionDetoxSemanas: string;
  terapiasSeleccionadas: TerapiaItem[];
  nutraceuticosPrimarios: NutraceuticoItemData[];
  activadorMetabolico: NutraceuticoItemData[];
  floresDeBach: FlorDeBachItem[];
  nutraceuticosSecundarios: NutraceuticoItemData[];
  nutraceuticosComplementarios: NutraceuticoItemData[];
  sueros: NutraceuticoItemData[];
}

export const FREQUENCY_OPTIONS_PRIMARY = [
  { value: '1x1', label: '1x1' },
  { value: '1x2', label: '1x2' },
  { value: '1x3', label: '1x3' }
];

export const FREQUENCY_OPTIONS_SECONDARY = [
  { value: '1x1', label: '1x1' },
  { value: '1x2', label: '1x2' },
  { value: '1x3', label: '1x3' },
  { value: '2x1', label: '2x1' },
  { value: '2x2', label: '2x2' }
]; 