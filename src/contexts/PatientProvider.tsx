'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Patient, BiophysicalTest } from '@prisma/client';

// Importamos la Server Action con el nombre correcto
import { getPatientById } from '@/lib/actions/patients';

// Definimos un tipo completo para el paciente que incluye sus relaciones
type PatientWithDetails = Patient & {
  biophysical_tests?: BiophysicalTest[];
};

// Define la forma del contexto que consumirán los componentes
interface PatientContextType {
  currentPatient: PatientWithDetails | null;
  isLoading: boolean;
  error: string | null;
  setCurrentPatient: (patient: PatientWithDetails | null) => void;
  // Esta es la función principal para cargar un paciente desde el backend
  fetchAndSetCurrentPatient: (patientId: string) => Promise<boolean>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Hook personalizado para facilitar el uso del contexto
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient debe ser usado dentro de un PatientProvider');
  }
  return context;
}

// El componente Provider que envuelve tu aplicación o layout
export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<PatientWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar un paciente usando la Server Action
  const fetchAndSetCurrentPatient = useCallback(async (patientId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // **CORRECCIÓN CLAVE:** Llamamos a la Server Action 'getPatientById'
      const patientData = await getPatientById(patientId);
      
      if (!patientData) {
        throw new Error('Paciente no encontrado.');
      }

      setCurrentPatient(patientData as PatientWithDetails);
      return true; // Éxito
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      setCurrentPatient(null);
      return false; // Fracaso
    } finally {
      setIsLoading(false);
    }
  }, []);

  // El valor que se comparte a través del contexto
  const value = {
    currentPatient,
    isLoading,
    error,
    setCurrentPatient,
    fetchAndSetCurrentPatient,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
}