// src/app/historias/HistoryTabs.tsx
/*'use client';

import { useState } from 'react';
import { HistoriaClinicaData } from '@/types/historia';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import GuiaPacienteTab from '@/components/UI/GuiaPacienteTab';
import AlimentacionNutrigenomicaTab from '@/components/UI/AlimentacionNutrigenomicaTab';

const TABS = [
  { id: 'historias', label: 'Historias Médicas' },
  { id: 'edad-biologica', label: 'Edad Biológica' },
  { id: 'guia-paciente', label: 'Guía del Paciente' },
  { id: 'alimentacion', label: 'Alimentación Nutrigenómica' },
];

export default function HistoryTabs() {
  const [activeTab, setActiveTab] = useState('historias');
  const [selectedPatient, setSelectedPatient] = useState<HistoriaClinicaData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSaveHistoria = async (data: HistoriaClinicaData) => {
    console.log('Guardando historia:', data);
    // Aquí iría la lógica para guardar en la base de datos
    try {
      // Simulación de guardado exitoso
      alert('Historia guardada exitosamente');
      setShowForm(false);
      setSelectedPatient(data); // Actualizar el paciente seleccionado con los datos guardados
    } catch (error) {
      console.error('Error al guardar la historia:', error);
      alert('Error al guardar la historia');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'historias':
        return (
          <div className="mt-6">
            {showForm ? (
              <NuevaHistoriaForm 
                initialData={selectedPatient} 
                onSave={handleSaveHistoria} 
                onCancel={() => setShowForm(false)} 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Historias Médicas
                </h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-darker text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Crear Nueva Historia
                </button>
              </div>
            )}
          </div>
        );
      case 'edad-biologica':
        return <EdadBiologicaMain patientData={selectedPatient} />;
      case 'guia-paciente':
        return <GuiaPacienteTab patientData={selectedPatient} />;
      case 'alimentacion':
        return <AlimentacionNutrigenomicaTab patientData={selectedPatient} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {TABS.map((tab) => (
            <li key={tab.id} className="mr-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-block py-4 px-6 text-sm font-medium rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-white bg-primary border-primary'
                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {renderTabContent()}
      </div>
    </div>
  );
}