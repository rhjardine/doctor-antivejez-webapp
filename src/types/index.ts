export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  biologicalAge: number;
  trend: number;
  healthScore: number;
  lastCheckup: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: DocumentFile[];
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  content?: string;
  uploadedAt: Date;
  category?: 'genomic' | 'lab' | 'report' | 'other';
  isAnalyzed: boolean;
  analysisId?: string;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  createdAt: Date;
  completedAt?: Date;
  results?: AnalysisResult;
  error?: string;
}

export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations?: string[];
  metadata: Record<string, any>;
}

export type AssistantTab = 'chat' | 'documents' | 'knowledge' | 'analysis' | 'recommendations' | 'pathways';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

// src/types/index.ts
// ... (otros tipos)

export interface DietaryOption {
  id: string; // uuid o un ID generado
  text: string;
  bloodTypeTarget: 'all' | 'O_B' | 'A_AB'; // Para el filtrado
  isChecked: boolean; // Si está seleccionada por el profesional para el paciente
  // Podrías añadir más campos si es necesario, como categoría, notas, etc.
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DietaryPlan {
  breakfast: DietaryOption[];
  lunch: DietaryOption[];
  dinner: DietaryOption[];
  snacks: DietaryOption[];
}

export type BloodTypeFilter = 'all' | 'O_B' | 'A_AB';