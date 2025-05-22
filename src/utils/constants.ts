// src/utils/constants.ts

// Importa IconProp y los objetos de icono
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine, faBookMedical, faUserMd, faRobot,
  faFileMedicalAlt, faCog, /* faSignOutAlt, */ faComments, // faSignOutAlt no se usa aquí directamente
  faFileMedical, faDatabase, faChartBar, faClipboardCheck,
  faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

// --- Interfaz para opciones de Select (DEBE ESTAR DEFINIDA AQUÍ O IMPORTADA) ---
export interface SelectOption {
  value: string;
  label: string;
}
// ---------------------------------------------------------------------------------

// --- Constantes existentes ---
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
// export const ACCEPTED_FILE_TYPES = { /* ... */ }; // Comentado si no se usa o está incompleto
// ---------------------------

// --- Interfaz para NAV_ITEMS (con IconProp) ---
interface NavItemConstant {
  name: string;
  icon: IconProp;
  href: string;
}

// --- NAV_ITEMS Modificado ---
export const NAV_ITEMS: NavItemConstant[] = [
  { name: 'Dashboard', icon: faChartLine, href: '/dashboard' },
  { name: 'Historias', icon: faBookMedical, href: '/historias' },
  { name: 'Profesionales', icon: faUserMd, href: '/profesionales' },
  { name: 'Agente IA', icon: faRobot, href: '/agente-ia' },
  { name: 'Reportes', icon: faFileMedicalAlt, href: '/reportes' },
  { name: 'Ajustes', icon: faCog, href: '/ajustes' },
];
// ---------------------------

// --- Interfaz para ASSISTANT_TABS (con IconProp) ---
interface AssistantTabConstant {
  id: string;
  name: string;
  icon: IconProp;
}

// --- ASSISTANT_TABS Modificado ---
export const ASSISTANT_TABS: AssistantTabConstant[] = [
  { id: 'chat', name: 'Coach Conversacional', icon: faComments },
  { id: 'documents', name: 'Document Analysis', icon: faFileMedical },
  { id: 'knowledge', name: 'Knowledge Base', icon: faDatabase },
  { id: 'analysis', name: 'Analysis & Interpretation', icon: faChartBar },
  { id: 'recommendations', name: 'Recommendations', icon: faClipboardCheck },
  { id: 'pathways', name: 'Pathway Analysis', icon: faProjectDiagram }
];

// Asumiendo que DietaryOption y MealCategory están definidos en '@/types'
// import { DietaryOption, MealCategory } from '@/types'; 

// Opciones iniciales de dieta (ejemplo) - Comentado si no es relevante para el problema actual de los selects
/*
export const INITIAL_DIETARY_OPTIONS: Record<MealCategory, DietaryOption[]> = {
  breakfast: [
    { id: 'b1', text: 'Cereales de trigo sarraceno, avena sin gluten', bloodTypeTarget: 'O_B', isChecked: false },
    // ...
  ],
  lunch: [
    // ...
  ],
  dinner: [
    // ...
  ],
  snacks: [
    // ...
  ],
};
*/

// --- CONSTANTES PARA FORMULARIO DE HISTORIA (CORREGIDAS Y TIPADAS) ---
export const OPCIONES_NACIONALIDAD: SelectOption[] = [ // Tipado explícito
  { value: '', label: 'Seleccione...' }, // Opción por defecto
  { value: 'V', label: 'Venezolano(a)' },
  { value: 'E', label: 'Extranjero(a)' },
  { value: 'J', label: 'Jurídico' }, // O el significado que tenga 'J'
];

export const OPCIONES_GENERO_HISTORIA: SelectOption[] = [ // Tipado explícito
  { value: '', label: 'Seleccione...' }, // Opción por defecto
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Masculino Deportivo', label: 'Masculino Deportivo' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Femenino Deportivo', label: 'Femenino Deportivo' },
];

export const OPCIONES_GRUPO_SANGUINEO: SelectOption[] = [ // Tipado explícito
  { value: '', label: 'Seleccione...' }, // Opción por defecto
  { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
];

export const OPCIONES_EDO_CIVIL: SelectOption[] = [ // Tipado explícito
  { value: '', label: 'Seleccione...' }, // Opción por defecto
  { value: 'Soltero(a)', label: 'Soltero(a)' },
  { value: 'Comprometido(a)', label: 'Comprometido(a)' }, // De tu imagen anterior
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Concubinato', label: 'Concubinato' }, // De tu código actual
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viudo(a)', label: 'Viudo(a)' },
  { value: 'Relación', label: 'Relación' }, // De tu imagen anterior
];
// ---------------------------------------------------------------------

// --- CONSTANTES PARA LA SECCIÓN DE PROFESIONALES ---
export const ITEMS_PER_PAGE_PROFESIONALES: number = 10;

export interface ProfesionalRolConstant {
  id: string;
  nombre: string;
}
export const PROFESIONAL_ROLES: ProfesionalRolConstant[] = [
  { id: 'medico', nombre: 'Médico' },
  { id: 'coach', nombre: 'Coach' },
];

export const LIMITED_ROLES_PROFESIONALES: string[] = ['coach']; 
export const FORM_LIMIT: number = 50;
export const FORM_LIMIT_WARNING_THRESHOLD: number = 40;
// --- FIN DE CONSTANTES PARA PROFESIONALES ---