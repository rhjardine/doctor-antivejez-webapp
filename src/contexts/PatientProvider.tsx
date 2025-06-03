// src/contexts/PatientProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, HistoriaClinicaData } from '@/types';

interface PatientContextType {
  currentPatient: Patient | null;
  patientHistory: HistoriaClinicaData | null;
  historicalVisits: HistoriaClinicaData[];
  loadingPatient: boolean;
  errorMessage: string | null;
  setCurrentPatient: (patient: Patient | null) => void;
  setPatientHistory: (history: HistoriaClinicaData | null) => void;
  fetchPatient: (id: string) => Promise<void>;
  fetchPatientHistory: (id: string) => Promise<void>;
  fetchHistoricalVisits: (id: string) => Promise<void>;
  savePatient: (patient: Patient) => Promise<Patient>;
  savePatientHistory: (history: HistoriaClinicaData) => Promise<HistoriaClinicaData>;
  deletePatient: (id: string) => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [patientHistory, setPatientHistory] = useState<HistoriaClinicaData | null>(null);
  const [historicalVisits, setHistoricalVisits] = useState<HistoriaClinicaData[]>([]);
  const [loadingPatient, setLoadingPatient] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcular edad a partir de fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  // Obtener paciente por ID
  const fetchPatient = async (id: string) => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const response = await fetch(`/api/patients/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar el paciente: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Calcular edad si hay fecha de nacimiento
      if (data.birthday) {
        data.age = calculateAge(data.birthday);
      }
      
      setCurrentPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoadingPatient(false);
    }
  };

  // Obtener historia clínica del paciente
  const fetchPatientHistory = async (id: string) => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const response = await fetch(`/api/patients/${id}/history`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar la historia clínica: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPatientHistory(data);
    } catch (error) {
      console.error('Error fetching patient history:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoadingPatient(false);
    }
  };

  // Obtener histórico de visitas
  const fetchHistoricalVisits = async (id: string) => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const response = await fetch(`/api/patients/${id}/visits`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar el histórico de visitas: ${response.statusText}`);
      }
      
      const data = await response.json();
      setHistoricalVisits(data);
    } catch (error) {
      console.error('Error fetching historical visits:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoadingPatient(false);
    }
  };

  // Guardar/actualizar paciente
  const savePatient = async (patient: Patient): Promise<Patient> => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const isNewPatient = !patient.id;
      const method = isNewPatient ? 'POST' : 'PUT';
      const url = isNewPatient ? '/api/patients' : `/api/patients/${patient.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });
      
      if (!response.ok) {
        throw new Error(`Error al guardar el paciente: ${response.statusText}`);
      }
      
      const savedPatient = await response.json();
      
      // Actualizar estado local si es el paciente actual
      if (currentPatient && currentPatient.id === savedPatient.id) {
        setCurrentPatient(savedPatient);
      }
      
      return savedPatient;
    } catch (error) {
      console.error('Error saving patient:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setLoadingPatient(false);
    }
  };

  // Guardar/actualizar historia clínica
  const savePatientHistory = async (history: HistoriaClinicaData): Promise<HistoriaClinicaData> => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const isNewHistory = !history.id;
      const method = isNewHistory ? 'POST' : 'PUT';
      const url = isNewHistory ? '/api/histories' : `/api/histories/${history.id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(history),
      });
      
      if (!response.ok) {
        throw new Error(`Error al guardar la historia clínica: ${response.statusText}`);
      }
      
      const savedHistory = await response.json();
      
      // Actualizar estado local si es la historia del paciente actual
      if (patientHistory && patientHistory.id === savedHistory.id) {
        setPatientHistory(savedHistory);
      }
      
      return savedHistory;
    } catch (error) {
      console.error('Error saving patient history:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setLoadingPatient(false);
    }
  };

  // Eliminar paciente
  const deletePatient = async (id: string) => {
    try {
      setLoadingPatient(true);
      setErrorMessage(null);
      
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar el paciente: ${response.statusText}`);
      }
      
      // Si el paciente eliminado es el actual, limpiamos el estado
      if (currentPatient && currentPatient.id === id) {
        setCurrentPatient(null);
        setPatientHistory(null);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      throw error;
    } finally {
      setLoadingPatient(false);
    }
  };

  // Proveer valores de contexto
  const contextValue = {
    currentPatient,
    patientHistory,
    historicalVisits,
    loadingPatient,
    errorMessage,
    setCurrentPatient,
    setPatientHistory,
    fetchPatient,
    fetchPatientHistory,
    fetchHistoricalVisits,
    savePatient,
    savePatientHistory,
    deletePatient
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function usePatient() {
  const context = useContext(PatientContext);
  
  if (context === undefined) {
    throw new Error('usePatient debe usarse dentro de un PatientProvider');
  }
  
  return context;
}