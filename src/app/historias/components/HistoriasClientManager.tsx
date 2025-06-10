// src/app/historias/components/HistoriasClientManager.tsx (NUEVO ARCHIVO)
'use client';

import React, { useState } from 'react';
import { usePatient, PatientWithHistory } from '@/contexts/PatientProvider';
import NuevaHistoriaForm from './NuevaHistoriaForm';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './EdadBiologicaMain';
import EdadBiofisicaTestView from './EdadBiofisicaTestView';
// ... otros imports de UI ...

interface HistoriasClientManagerProps {
  // Recibe la lista de pacientes (renderizada en el servidor) como un prop `children`
  patientListSlot: React.ReactNode; 
}

export function HistoriasClientManager({ patientListSlot }: HistoriasClientManagerProps) {
  const [view, setView] = useState<'list' | 'detail' | 'new'>('list');
  const [activeTab, setActiveTab] = useState<'edad_biologica' | ...>('edad_biologica');
  // ... otros estados de UI ...

  const {
    currentPatient,
    isLoading,
    error,
    clearError,
    fetchAndSetCurrentPatient,
    setCurrentPatient,
  } = usePatient();

  const handleSelectPatient = async (patientId: string) => {
    const success = await fetchAndSetCurrentPatient(patientId);
    if (success) {
      setView('detail');
    }
  };

  const handleCreateNew = () => {
    setCurrentPatient(null);
    setView('new');
  };
  
  const handleFormSuccess = (patientId: string) => {
    handleSelectPatient(patientId);
  };

  // --- Renderizado Condicional ---
  if (error) {
    // ... tu UI de error ...
  }
  
  // Aquí pasamos las funciones a `patientListSlot` si es necesario,
  // pero el patrón es que `patientListSlot` ya viene con los handlers del padre.
  // Vamos a simplificar y manejar los eventos aquí.

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {view === 'list' && patientListSlot} {/* Renderiza el Server Component pasado como prop */}

      {view === 'new' && (
        <NuevaHistoriaForm
          onSuccess={handleFormSuccess}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'detail' && (
        <>
          {isLoading && <p>Cargando...</p>}
          {currentPatient && (
            <div className="space-y-6">
              <button onClick={() => setView('list')}>← Volver a la lista</button>
              <PatientHeader patient={currentPatient} />
              {/* ... tu UI de detalle con las pestañas ... */}
            </div>
          )}
        </>
      )}
    </div>
  );
}