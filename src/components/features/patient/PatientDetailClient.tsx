'use client';

import React, { useState } from 'react';
import type { PatientWithBiophysicsTests } from '@/types';
import PatientHeader from '@/components/features/patient/PatientHeader';
import HistoryTabs from '@/components/features/patient/HistoryTabs';
import EdadBiologicaMain from '@/components/features/biophysics-test/EdadBiologicaMain';
import BiophysicsTestView from '@/components/features/biophysics-test/BiophysicsTestView';
import PatientForm from '@/components/features/patient/PatientForm';

interface PatientDetailClientProps {
  initialPatient: PatientWithBiophysicsTests;
}

type View = 'detail' | 'test_form';

export default function PatientDetailClient({ initialPatient }: PatientDetailClientProps) {
  const [patient, setPatient] = useState(initialPatient);
  const [view, setView] = useState<View>('detail');
  const [activeTab, setActiveTab] = useState('edad_biologica');

  const refreshData = async () => {
    // Aquí podrías implementar una lógica para volver a obtener los datos del paciente sin recargar la página
    setView('detail');
    // Para recargar completamente: window.location.reload();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'historia_medica':
        // La pestaña de historia médica ahora muestra el formulario en modo edición
        return <PatientForm patient={patient} />;
      case 'edad_biologica':
        if (view === 'test_form') {
          return (
            <BiophysicsTestView
              patientId={patient.id}
              patientName={`${patient.names} ${patient.surnames}`}
              initialCronoAge={patient.chronological_age || 0}
              onBack={() => setView('detail')}
              onSaveSuccess={refreshData}
            />
          );
        }
        return <EdadBiologicaMain patient={patient} onNavigateToTest={() => setView('test_form')} />;
      case 'guia_paciente':
        return <div className="p-6 text-center text-gray-500">Contenido de Guía del Paciente (En construcción)</div>;
      case 'alimentacion_nutrigenomica':
        return <div className="p-6 text-center text-gray-500">Contenido de Alimentación Nutrigenómica (En construcción)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      <PatientHeader patient={patient} />
      <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4 bg-white dark:bg-gray-800/50 p-4 rounded-lg shadow-md">
        {renderTabContent()}
      </div>
    </div>
  );
}
