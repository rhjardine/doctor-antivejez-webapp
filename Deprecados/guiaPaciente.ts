// src/types/guiaPaciente.ts (o añadir a src/types/index.ts y exportar desde allí)

export interface NutraceuticoItemData {
    id: string; // Ej: 'nutra_mega_gh4'
    label: string;
    checked: boolean;
    qty: string; // O number si prefieres validación más estricta
    freq: string;
    supplement?: string; // Para el campo de suplemento personalizado
    doseInfo?: string; // Para la información de dosis estática
    isRemocion?: boolean; // Para distinguir los de la fase de remoción
  }
  
  export interface TerapiaItem {
    id: string; // Ej: 'terapia_nino'
    label: string;
    checked: boolean;
  }
  
  export interface FlorDeBachItem {
    id: string; // Ej: 'bach_agrimonia'
    label: string;
    checked: boolean;
  }
  
  export interface GuiaPacienteFormData {
    patientName: string;
    date: string;
    
    // Fase de Remoción
    remocionItems: NutraceuticoItemData[]; // Reutilizamos NutraceuticoItemData para la estructura
    remocionCucharadas: string;
    remocionDetoxSemanas: string; // O number
    terapiasSeleccionadas: TerapiaItem[];
  
    // Nutraceuticos
    nutraceuticosPrimarios: NutraceuticoItemData[];
    activadorMetabolico: NutraceuticoItemData[]; // Para Bioterápico + Bach
    floresDeBach: FlorDeBachItem[];
    nutraceuticosSecundarios: NutraceuticoItemData[];
    nutraceuticosComplementarios: NutraceuticoItemData[];
    sueros: NutraceuticoItemData[];
  }
  
  // Opciones para los selects de frecuencia (puedes mover esto a constants.ts)
  export const FREQUENCY_OPTIONS_PRIMARY = [
    { value: "", label: "Seleccione frecuencia..." },
    { value: "mañana", label: "Mañana" },
    { value: "noche", label: "Noche" },
    { value: "antes_desayuno", label: "30 min antes de Desayuno" },
    { value: "antes_cena", label: "30 min antes de Cena" },
    { value: "antes_desayuno_cena", label: "30 min antes Desayuno y Cena" },
    { value: "antes_ejercicio", label: "Antes del Ejercicio" },
    { value: "despues_ejercicio", label: "Después del Ejercicio" },
    { value: "otros", label: "Otros (especificar)" },
  ];
  
  export const FREQUENCY_OPTIONS_SECONDARY = [
    { value: "", label: "Seleccione frecuencia..." },
    { value: "día", label: "Día" },
    { value: "semana", label: "Semana" },
    { value: "quincena", label: "Quincena" },
    { value: "mes", label: "Mes" },
    // ... puedes añadir más opciones comunes si es necesario
    { value: "otros", label: "Otros (especificar)" },
  ];