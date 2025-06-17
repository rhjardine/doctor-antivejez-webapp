'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, Dispatch, SetStateAction } from 'react';
import { getPatientWithHistory } from '@/lib/actions/patients'; // Importa la Server Action

// Tipo para el paciente con su historial
export type PatientWithHistory = Awaited<ReturnType<typeof getPatientWithHistory>>;

interface PatientContextType {
  currentPatient: PatientWithHistory | null;
  setCurrentPatient: (patient: PatientWithHistory | null) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>; // Expone la función de actualización de isLoading
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>; // Expone la función de actualización de error
  clearError: () => void;
  fetchAndSetCurrentPatient: (patientId: string) => Promise<boolean>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<PatientWithHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchAndSetCurrentPatient = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const patientData = await getPatientWithHistory(patientId);
      if (patientData) {
        setCurrentPatient(patientData);
        return true;
      }
      setError('No se encontró el paciente.');
      return false;
    } catch (err: any) {
      setError(err.message || 'Error desconocido al cargar el paciente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <PatientContext.Provider value={{ 
      currentPatient, 
      setCurrentPatient, 
      isLoading, 
      setIsLoading, // Se expone
      error, 
      setError,     // Se expone
      clearError, 
      fetchAndSetCurrentPatient 
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient debe ser usado dentro de un PatientProvider');
  }
  return context;
};
