// src/utils/constants.ts

// Importa IconProp y los objetos de icono
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faChartLine, faBookMedical, faUserMd, faRobot,
  faFileMedicalAlt, faCog, faSignOutAlt, faComments,
  faFileMedical, faDatabase, faChartBar, faClipboardCheck,
  faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';

// --- Constantes existentes ---
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ACCEPTED_FILE_TYPES = { /* ... */ };
// ---------------------------

// --- Interfaz para NAV_ITEMS (con IconProp) ---
interface NavItemConstant {
  name: string;
  icon: IconProp; // <--- Usa IconProp
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
  // El item 'Salir' se maneja por separado en Sidebar.tsx
];
// ---------------------------

// --- Interfaz para ASSISTANT_TABS (con IconProp) ---
interface AssistantTabConstant {
  id: string;
  name: string;
  icon: IconProp; // <--- Usa IconProp
}

// --- ASSISTANT_TABS Modificado ---
export const ASSISTANT_TABS: AssistantTabConstant[] = [
  { id: 'chat', name: 'Conversational Assistant', icon: faComments },
  { id: 'documents', name: 'Document Analysis', icon: faFileMedical },
  { id: 'knowledge', name: 'Knowledge Base', icon: faDatabase },
  { id: 'analysis', name: 'Analysis & Interpretation', icon: faChartBar },
  { id: 'recommendations', name: 'Recommendations', icon: faClipboardCheck },
  { id: 'pathways', name: 'Pathway Analysis', icon: faProjectDiagram }
];

// src/utils/constants.ts
// ... (otros imports y constantes)
import { DietaryOption, BloodTypeFilter } from '@/types'; // Asume que DietaryOption está en types

// Opciones iniciales de dieta (ejemplo)
export const INITIAL_DIETARY_OPTIONS: Record<MealCategory, DietaryOption[]> = {
  breakfast: [
    { id: 'b1', text: 'Cereales de trigo sarraceno, avena sin gluten', bloodTypeTarget: 'O_B', isChecked: false },
    { id: 'b2', text: 'Tortilla de huevo con avena s/g', bloodTypeTarget: 'O_B', isChecked: false },
    { id: 'b3', text: 'Pan sin gluten', bloodTypeTarget: 'A_AB', isChecked: false },
    { id: 'b4', text: 'Creps de yuca', bloodTypeTarget: 'A_AB', isChecked: false },
    // ... Añade todas las opciones de desayuno del HTML original
  ],
  lunch: [
    { id: 'l1', text: 'Carnes rojas o blancas', bloodTypeTarget: 'O_B', isChecked: false },
    { id: 'l2', text: 'Pastillo de berenjena con pollo', bloodTypeTarget: 'A_AB', isChecked: false },
    // ... Añade todas las opciones de almuerzo
  ],
  dinner: [
    { id: 'd1', text: 'Sushi', bloodTypeTarget: 'O_B', isChecked: false },
    { id: 'd2', text: 'Salmón a la marinara', bloodTypeTarget: 'A_AB', isChecked: false },
    // ... Añade todas las opciones de cena
  ],
  snacks: [
    { id: 's1', text: 'Gelatina de lámina o 1 cda de polvo sin sabor en infusión', bloodTypeTarget: 'O_B', isChecked: false },
    { id: 's2', text: 'Helado Vegano (leche de almendras o coco)', bloodTypeTarget: 'A_AB', isChecked: false },
    // ... Añade todas las opciones de meriendas/postres
  ],
};

export const BLOOD_TYPE_OPTIONS: { value: BloodTypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'O_B', label: 'O o B' },
  { value: 'A_AB', label: 'A o AB' },
];

// --- CONSTANTES PARA LA SECCIÓN DE PROFESIONALES ---

// Para ./src/app/profesionales/page.tsx
export const ITEMS_PER_PAGE_PROFESIONALES: number = 10;

// Para ./src/components/Profesionales/ProfesionalModal.tsx
export interface ProfesionalRolConstant {
  id: string; // Usaremos 'medico' y 'coach' como IDs
  nombre: string; // El nombre visible
}
export const PROFESIONAL_ROLES: ProfesionalRolConstant[] = [
  { id: 'medico', nombre: 'Médico' },
  { id: 'coach', nombre: 'Coach' },
];

// Para ./src/components/Profesionales/ProfesionalesTable.tsx
// Decide si alguno de estos roles (o ambos, o ninguno) tiene límites de formularios.
// Si, por ejemplo, solo los 'Coach' tienen límite:
export const LIMITED_ROLES_PROFESIONALES: string[] = ['coach']; 
// Si ambos tienen límite:
// export const LIMITED_ROLES_PROFESIONALES: string[] = ['medico', 'coach'];
// Si ninguno tiene límite, puedes dejarlo como un array vacío:
// export const LIMITED_ROLES_PROFESIONALES: string[] = [];


// Límite de formularios para roles limitados (si aplica)
export const FORM_LIMIT: number = 50; // Ajusta si es necesario

// Umbral para advertencia de límite de formularios (si aplica)
export const FORM_LIMIT_WARNING_THRESHOLD: number = 40; // Ajusta si es necesario

// --- FIN DE CONSTANTES PARA PROFESIONALES ---
