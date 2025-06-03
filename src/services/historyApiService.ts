// src/services/historyApiService.ts
import axios, { AxiosResponse } from 'axios';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.doctorantivejez.com';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token de autorización automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipos TypeScript para la API
export interface HistoryFormData {
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
}

export interface ApiUser {
  id: number;
  user_id: number;
  alphanumeric: string;
  role: string;
  email: string;
  person: Person;
}

export interface ApiResponse {
  success: boolean;
  data?: ApiUser;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// Función para convertir datos del formulario frontend al formato del backend
export const transformFormDataToApi = (formData: any): HistoryFormData => {
  return {
    document: formData.nacionalidad || '',
    identification_id: formData.identificacion || '',
    history: formData.fechaHistoria || new Date().toISOString().split('T')[0],
    surnames: formData.apellidos || '',
    names: formData.nombres || '',
    birthday: formData.fechaNacimiento || '',
    age: formData.edadCronologica || 0,
    gender: formData.genero || '',
    birthplace: formData.lugarNacimiento || '',
    phone: formData.telefono || '',
    marital_status: formData.edoCivil || '',
    occupation: formData.profesion || '',
    country: formData.paisResidencia || '',
    state: formData.estadoProvinciaResidencia || '',
    city: formData.ciudad || '',
    address: formData.direccion || '',
    bloody_type: formData.grupoSanguineo || '',
    email: formData.email || '',
    observations: formData.observacionesGenerales || '',
  };
};

// Función para convertir respuesta de la API al formato del frontend
export const transformApiDataToForm = (apiData: ApiUser): any => {
  const person = apiData.person;
  return {
    id: apiData.id,
    nacionalidad: person.document,
    identificacion: person.identification_id,
    fechaHistoria: person.history,
    apellidos: person.surnames,
    nombres: person.names,
    fechaNacimiento: person.birthday,
    edadCronologica: person.age,
    genero: person.gender,
    lugarNacimiento: person.birthplace,
    telefono: person.phone,
    edoCivil: person.marital_status,
    profesion: person.occupation,
    paisResidencia: person.country,
    estadoProvinciaResidencia: person.state,
    ciudad: person.city,
    direccion: person.address,
    grupoSanguineo: person.bloody_type,
    email: apiData.email,
    observacionesGenerales: person.observations || '',
    // Campos adicionales que pueden estar vacíos inicialmente
    referidoPor: '',
    noHistoria: '',
    antecedentesFamiliares: '',
    antecedentesPersonales: '',
    antecedentesGinecoObstetricos: '',
    medicamentosActuales: '',
    enfermedadActual: '',
    examenFuncionalGeneral: '',
    fotoUrl: '',
  };
};

// Servicio principal para crear historia clínica
export const createHistory = async (historyData: any): Promise<ApiUser> => {
  try {
    // Transformar datos del frontend al formato esperado por el backend
    const apiPayload = transformFormDataToApi(historyData);
    
    console.log('Enviando datos a la API:', apiPayload);
    
    const response: AxiosResponse<ApiUser> = await apiClient.post('/stories', apiPayload);
    
    console.log('Respuesta de la API:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Error al crear historia:', error);
    
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 422) {
        // Error de validación
        const validationError: ValidationError = {
          message: data.message || 'Error de validación',
          errors: data.errors || {},
        };
        throw validationError;
      } else if (status === 401) {
        // Token expirado o inválido
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else if (status >= 500) {
        // Error del servidor
        throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
      } else {
        // Otros errores
        throw new Error(data.message || `Error ${status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      // Error de red
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      // Error desconocido
      throw new Error(error.message || 'Error desconocido al crear la historia.');
    }
  }
};

// Función para obtener historias (opcional, para futuras funcionalidades)
export const getHistories = async (): Promise<ApiUser[]> => {
  try {
    const response: AxiosResponse<ApiUser[]> = await apiClient.get('/stories');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener historias:', error);
    throw new Error('Error al obtener las historias clínicas.');
  }
};

// Función para obtener una historia específica
export const getHistory = async (id: number): Promise<ApiUser> => {
  try {
    const response: AxiosResponse<ApiUser> = await apiClient.get(`/stories/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener historia:', error);
    throw new Error('Error al obtener la historia clínica.');
  }
};

// Función para actualizar una historia
export const updateHistory = async (id: number, historyData: any): Promise<ApiUser> => {
  try {
    const apiPayload = transformFormDataToApi(historyData);
    const response: AxiosResponse<ApiUser> = await apiClient.put(`/stories/${id}`, apiPayload);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar historia:', error);
    
    if (error.response?.status === 422) {
      const validationError: ValidationError = {
        message: error.response.data.message || 'Error de validación',
        errors: error.response.data.errors || {},
      };
      throw validationError;
    }
    
    throw new Error('Error al actualizar la historia clínica.');
  }
};

// Función para subir foto (placeholder - implementar según tu servicio de almacenamiento)
export const uploadPhoto = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    
    // Esta ruta debe ser implementada en tu backend Laravel
    const response: AxiosResponse<{url: string}> = await apiClient.post('/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  } catch (error: any) {
    console.error('Error al subir foto:', error);
    throw new Error('Error al subir la foto del paciente.');
  }
};

// Función para verificar la conexión con el backend
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health-check');
    return response.status === 200;
  } catch (error) {
    console.error('Error de conexión con el backend:', error);
    return false;
  }
};

export default {
  createHistory,
  getHistories,
  getHistory,
  updateHistory,
  uploadPhoto,
  testConnection,
  transformFormDataToApi,
  transformApiDataToForm,
};