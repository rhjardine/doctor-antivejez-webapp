'use client';

import React, { useState } from 'react';
import type { PatientWithBiophysicsTests, PatientDetailView, PatientDetailTab } from '@/types';

import PatientHeader from '@/components/PatientHeader';
import HistoryTabs from '@/app/historias/components/HistoryTabs';
import EdadBiologicaMain from '@/app/historias/components/EdadBiologicaMain';
import EdadBiofisicaTestView from '@/app/historias/components/EdadBiofisicaTestView';
// Importa aquí los componentes para las otras pestañas cuando los desarrolles

interface PatientDetailClientProps {
  initialPatient: PatientWithBiophysicsTests;
}

/**
 * Componente de Cliente que gestiona el estado y la interactividad de la vista de detalle del paciente.
 * @param {PatientDetailClientProps} props - Props que incluyen los datos iniciales del paciente.
 */
export default function PatientDetailClient({ initialPatient }: PatientDetailClientProps) {
  // Estado para el paciente actual. Usamos los datos iniciales del servidor.
  const [patient, setPatient] = useState(initialPatient);
  
  // Estado para controlar la vista actual: 'detail' (vista principal) o 'test_form' (formulario)
  const [view, setView] = useState<PatientDetailView>('detail');
  
  // Estado para la pestaña activa. Por defecto, 'edad_biologica' como en la imagen.
  const [activeTab, setActiveTab] = useState<PatientDetailTab>('edad_biologica');

  // Función para refrescar los datos del paciente (se llamaría después de guardar un test)
  const refreshPatientData = async () => {
    // Aquí podrías volver a llamar a la server action o a una API route para obtener los datos más recientes
    // Por simplicidad, por ahora solo volvemos a la vista de detalle.
    // En una implementación real:
    // const updatedPatient = await getPatientWithTests(patient.id);
    // if (updatedPatient) setPatient(updatedPatient);
    console.log("Refrescando datos del paciente...");
    setView('detail');
  };

  const renderContent = () => {
    // Si la vista es el formulario del test, lo mostramos
    if (view === 'test_form') {
      return (
        <EdadBiofisicaTestView
          patient={patient}
          onBack={() => setView('detail')}
          onSaveSuccess={refreshPatientData}
        />
      );
    }
    
    // Si no, mostramos el contenido de la pestaña activa
    switch (activeTab) {
      case 'edad_biologica':
        return (
          <EdadBiologicaMain
            patient={patient}
            onNavigateToTest={() => setView('test_form')}
          />
        );
      case 'historia_medica':
        return <div className="text-center p-10">Componente de Historia Médica (En construcción)</div>;
      case 'guia_paciente':
        return <div className="text-center p-10">Componente de Guía del Paciente (En construcción)</div>;
      case 'alimentacion_nutrigenomica':
        return <div className="text-center p-10">Componente de Alimentación Nutrigenómica (En construcción)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <PatientHeader patient={patient} />
      
      <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}
