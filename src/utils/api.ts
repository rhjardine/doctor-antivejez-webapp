// src/utils/api.ts

import { 
  DocumentFile, 
  DocumentAnalysis, 
  ChatMessage, 
  Profesional, // Asegúrate de que este tipo exista en '@/types'
  CreateProfesionalData, // Necesitarás crear este tipo en '@/types'
  UpdateProfesionalData  // Necesitarás crear este tipo en '@/types'
} from '@/types'; 
import { ITEMS_PER_PAGE_PROFESIONALES } from './constants'; // Importa la constante para la paginación

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; // O tu URL de API real

// Helper para manejar errores en las peticiones
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'Ocurrió un error en la petición';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Si el cuerpo del error no es JSON o está vacío
      errorMessage = `${response.status} - ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }
  // Si la respuesta es 204 No Content, no intentes parsear JSON
  if (response.status === 204) {
    return null; 
  }
  return response.json();
};

// API de Chat
export const chatAPI = {
  sendMessage: async (message: string, patientId: string): Promise<ChatMessage> => {
    const response = await fetch(`${API_URL}/chat/${patientId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  },
  
  getHistory: async (patientId: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_URL}/chat/${patientId}/history`);
    return handleResponse(response);
  }
};

// API de Documentos
export const documentsAPI = {
  upload: async (file: File, patientId: string): Promise<DocumentFile> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/documents/${patientId}/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
  
  getDocuments: async (patientId: string): Promise<DocumentFile[]> => {
    const response = await fetch(`${API_URL}/documents/${patientId}`);
    return handleResponse(response);
  },
  
  analyzeDocument: async (documentId: string): Promise<DocumentAnalysis> => {
    const response = await fetch(`${API_URL}/documents/analyze/${documentId}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
  
  getAnalysis: async (analysisId: string): Promise<DocumentAnalysis> => {
    const response = await fetch(`${API_URL}/analysis/${analysisId}`);
    return handleResponse(response);
  }
};

// API de Pacientes (Mock para desarrollo)
export const patientsAPI = {
  getPatient: async (patientId: string) => {
    console.log(`API MOCK: getPatient con ID: ${patientId}`);
    // En desarrollo, usamos datos mock
    return {
      id: patientId || '458912',
      name: "Isabel Romero",
      age: 58,
      gender: "Female",
      biologicalAge: 52.3,
      trend: -5.7,
      healthScore: 84,
      lastCheckup: "2023-04-12T00:00:00.000Z" // Usa formato ISO si es fecha
    };
  }
};

// --- API DE PROFESIONALES (NUEVA SECCIÓN) ---
export const profesionalesAPI = {
  // Obtener todos los profesionales (con posible paginación y filtros)
  getAll: async (params?: { 
    page?: number; // Página actual (0-indexed o 1-indexed, ajusta según tu backend)
    limit?: number; 
    search?: string; 
    rol?: string; 
    estatus?: string;
  }): Promise<{ data: Profesional[]; total: number; currentPage: number; lastPage: number; }> => {
    try {
      // const queryString = new URLSearchParams(params as any).toString();
      // const response = await fetch(`${API_URL}/profesionales?${queryString}`);
      // return handleResponse(response);

      // --- SIMULACIÓN HASTA QUE TENGAS EL BACKEND ---
      console.log('API MOCK: profesionalesAPI.getAll con params:', params);
      const mockProfesionales: Profesional[] = [
        { id: 'prof1', nombre: 'Elena', apellido: 'Herrera', cedula: 'V23456789', correo: 'elena@example.com', rol: 'Doctor', estatus: '1', formularios: 25, telefono: '555-0101', especialidad: 'Endocrinología', fechaRegistro: '2023-01-15T10:00:00Z' },
        { id: 'prof2', nombre: 'Mario', apellido: 'Luna', cedula: 'V98765432', correo: 'mario@example.com', rol: 'Nutricionista', estatus: '1', formularios: 10, telefono: '555-0102', especialidad: 'Clínica', fechaRegistro: '2023-03-20T11:30:00Z' },
        { id: 'prof3', nombre: 'Sofia', apellido: 'Castro', cedula: 'E10293847', correo: 'sofia@example.com', rol: 'Terapeuta de Longevidad', estatus: '0', formularios: 5, telefono: '555-0103', especialidad: 'Holística', fechaRegistro: '2022-11-05T15:45:00Z' },
        { id: 'prof4', nombre: 'David', apellido: 'Rojas', cedula: 'V55555555', correo: 'david@example.com', rol: 'Asistente Médico', estatus: '1', formularios: 48, telefono: '555-0104', especialidad: 'General', fechaRegistro: '2024-01-10T09:15:00Z' },
        { id: 'prof5', nombre: 'Laura', apellido: 'Mendez', cedula: 'V66666666', correo: 'laura@example.com', rol: 'Doctor', estatus: '1', formularios: 30, telefono: '555-0105', especialidad: 'Geriatría', fechaRegistro: '2023-06-01T14:00:00Z' },
      ];

      let filtered = [...mockProfesionales];
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTerm) ||
          p.cedula.toLowerCase().includes(searchTerm) ||
          p.correo.toLowerCase().includes(searchTerm)
        );
      }
      if (params?.rol) {
        filtered = filtered.filter(p => p.rol === params.rol);
      }
      if (params?.estatus) {
        filtered = filtered.filter(p => p.estatus === params.estatus);
      }

      const limit = params?.limit || ITEMS_PER_PAGE_PROFESIONALES;
      // Asumimos que la página que llega de react-paginate es 0-indexed
      const page = params?.page !== undefined ? params.page : 0; 
      const paginatedData = filtered.slice(page * limit, (page + 1) * limit);

      return { 
        data: paginatedData, 
        total: filtered.length, 
        currentPage: page, // Devuelve 0-indexed si react-paginate lo espera así
        lastPage: Math.ceil(filtered.length / limit),
      };
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      console.error('Error en profesionalesAPI.getAll:', error);
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Profesional> => {
    try {
      // const response = await fetch(`${API_URL}/profesionales/${id}`);
      // return handleResponse(response);
      // --- SIMULACIÓN ---
      console.log('API MOCK: profesionalesAPI.getById:', id);
      const mockProfesionales: Profesional[] = [
        { id: 'prof1', nombre: 'Elena', apellido: 'Herrera', cedula: 'V23456789', correo: 'elena@example.com', rol: 'Doctor', estatus: '1', formularios: 25, telefono: '555-0101', especialidad: 'Endocrinología', fechaRegistro: '2023-01-15T10:00:00Z' },
      ];
      const profesional = mockProfesionales.find(p => p.id === String(id)); // Asegura que la comparación sea string con string
      if (!profesional) throw new Error('Profesional no encontrado');
      return profesional;
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      console.error(`Error en profesionalesAPI.getById con id ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateProfesionalData): Promise<Profesional> => {
    try {
      // const response = await fetch(`${API_URL}/profesionales`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return handleResponse(response);
      // --- SIMULACIÓN ---
      console.log('API MOCK: profesionalesAPI.create:', data);
      const newProfesional: Profesional = { 
        ...data, 
        id: `prof${Date.now()}`, // Simula un nuevo ID
        estatus: data.estatus || '1', // Valor por defecto si no se provee
        formularios: data.formularios || 0, // Valor por defecto
        fechaRegistro: new Date().toISOString(),
      };
      return newProfesional;
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      console.error('Error en profesionalesAPI.create:', error);
      throw error;
    }
  },

  update: async (id: string | number, data: UpdateProfesionalData): Promise<Profesional> => {
    try {
      // const response = await fetch(`${API_URL}/profesionales/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return handleResponse(response);
      // --- SIMULACIÓN ---
      console.log('API MOCK: profesionalesAPI.update:', id, data);
      // En una simulación real, encontrarías el profesional y lo actualizarías.
      // Por simplicidad, solo devolvemos los datos enviados con el ID.
      const updatedProfesional: Profesional = { 
        id: String(id), 
        ...(data as Partial<Profesional>) // Asume que UpdateProfesionalData puede ser parcial
      } as Profesional; 
      return updatedProfesional;
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      console.error(`Error en profesionalesAPI.update con id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      // const response = await fetch(`${API_URL}/profesionales/${id}`, {
      //   method: 'DELETE',
      // });
      // return handleResponse(response); // handleResponse manejará el 204
      // --- SIMULACIÓN ---
      console.log('API MOCK: profesionalesAPI.delete:', id);
      // No devuelve nada en caso de éxito
      // --- FIN SIMULACIÓN ---
    } catch (error) {
      console.error(`Error en profesionalesAPI.delete con id ${id}:`, error);
      throw error;
    }
  },
};
// --- FIN API DE PROFESIONALES ---