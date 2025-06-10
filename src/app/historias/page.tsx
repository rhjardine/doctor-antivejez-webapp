'use client';

import React, { useState, useEffect } from 'react';
import type { Patient } from '@prisma/client'; // Necesitamos el tipo Patient de Prisma
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import PatientListClient from './components/PatientListClient'; // Cambiado el nombre de importación para claridad
import VisitHistory from './components/VisitHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical, faHeartPulse, faUserCog,
  faAppleAlt, faList, faHistory, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { usePatient } from '@/contexts/PatientProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Componente para mostrar errores de forma consistente
function ErrorDisplay({ error, onClear }: { error: string; onClear: () => void }) {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
      <button onClick={onClear} className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Cerrar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </button>
    </div>
  );
}

// Interfaz para los datos del paciente que se usan en la UI
interface PatientData {
  id: string;
  names: string;
  surnames: string;
  chronological_age?: number;
  birth_date?: string;
  birthday?: string;
  age?: number;
}

type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

interface TabItem {
  id: TabName;
  label: string;
  icon: IconProp;
}

const TABS: TabItem[] = [
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt },
];

type HistoriasViewMode = 'detalle_historia' | 'nueva_historia' | 'listar_pacientes' | 'historico_visitas';

export default function HistoriasPage() {
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('listar_pacientes');
  const [activeTab, setActiveTab] = useState<TabName>('edad_biologica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');

  // **INICIO DE LA CORRECCIÓN: Manejo de estado para la lista de pacientes**
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  // **FIN DE LA CORRECCIÓN**

  const {
    currentPatient,
    patientHistory,
    fetchPatient,
    setCurrentPatient,
    setPatientHistory,
    errorMessage: patientContextError, // Renombramos para evitar conflictos
    clearError: clearContextError,
    loadingPatient
  } = usePatient();

  // **INICIO DE LA CORRECCIÓN: Cargar datos cuando el componente se monta o la vista cambia a 'listar_pacientes'**
  useEffect(() => {
    if (currentView === 'listar_pacientes') {
      const fetchAllPatients = async () => {
        setListLoading(true);
        setListError(null);
        try {
          const response = await fetch('/api/pacientes'); // Asegúrate que este endpoint exista
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo obtener la lista de pacientes.');
          }
          const data = await response.json();
          setAllPatients(data);
        } catch (error) {
          setListError(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        } finally {
          setListLoading(false);
        }
      };
      fetchAllPatients();
    }
  }, [currentView]);
  // **FIN DE LA CORRECCIÓN**

  const handleSelectPatient = async (patientId: string) => {
    try {
      const success = await fetchPatient(patientId);
      if (success) {
        setCurrentView('detalle_historia');
        setActiveTab('edad_biologica');
      }
    } catch (error) {
      console.error('Error al procesar la selección del paciente:', error);
    }
  };

  const handleCreateNewPatient = () => {
    setCurrentPatient(null);
    setPatientHistory(null);
    setCurrentView('nueva_historia');
  };

  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    if (tabName !== 'edad_biologica') {
      setEdadBiologicaView('overview');
    }
  };

  const navigateToEdadBiofisicaTest = () => {
    setEdadBiologicaView('testForm');
  };

  const navigateBackToOverview = () => setEdadBiologicaView('overview');

  const handleSaveHistoria = async (savedData: PatientData) => {
    if (savedData && savedData.id) {
      const success = await fetchPatient(savedData.id);
      if (success) {
        setCurrentView('detalle_historia');
        setActiveTab('historia_medica');
      }
    } else {
      setCurrentView('listar_pacientes');
    }
  };

  const handleCancelForm = () => {
    if (currentView === 'nueva_historia' && !currentPatient) {
      setCurrentView('listar_pacientes');
    } else {
      setCurrentView('detalle_historia');
    }
  };

  const getPatientAge = (patient: PatientData): number => {
    if (patient.chronological_age) return patient.chronological_age;
    if (patient.age) return patient.age;
    
    const birthDate = patient.birth_date || patient.birthday;
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    }
    return 0;
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'listar_pacientes':
        // **INICIO DE LA CORRECCIÓN: Manejo de estados de carga y error para la lista**
        if (listLoading) {
          return (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (listError) {
          return (
            <div className="p-4 max-w-lg mx-auto mt-10">
              <ErrorDisplay error={listError} onClear={() => setListError(null)} />
            </div>
          );
        }
        // **FIN DE LA CORRECCIÓN**
        
        return (
          // **INICIO DE LA CORRECCIÓN: Pasar `initialPatients` al componente hijo**
          <PatientListClient
            initialPatients={allPatients} 
            onSelectPatient={handleSelectPatient}
            onCreateNewPatient={handleCreateNewPatient}
          />
          // **FIN DE LA CORRECCIÓN**
        );

      case 'nueva_historia':
        return (
          <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <NuevaHistoriaForm
              onSave={handleSaveHistoria}
              onCancel={handleCancelForm}
              patientId={currentPatient?.id}
            />
          </div>
        );

      case 'detalle_historia':
        if (loadingPatient) {
          return (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
            </div>
          );
        }
        if (patientContextError) {
          return (
            <div className="p-4 max-w-lg mx-auto mt-10">
              <ErrorDisplay error={patientContextError} onClear={clearContextError} />
            </div>
          );
        }
        if (!currentPatient) {
          return (
            <div className="text-center p-10">
              <p>No se ha seleccionado ningún paciente. Volviendo a la lista...</p>
              {useEffect(() => { setCurrentView('listar_pacientes') }, [])}
            </div>
          );
        }

        const patientAge = getPatientAge(currentPatient as PatientData);

        return (
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
            <div className="w-full max-w-full p-4 sm:p-6 space-y-6">
              <div className="max-w-7xl mx-auto">
                <PatientHeader patient={currentPatient} />
                
                <div className="border-b border-gray-200 dark:border-gray-700 mt-6">
                  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {TABS.map((tab) => (
                      <li key={tab.id} className="mr-2">
                        <button
                          onClick={() => handleTabClick(tab.id)}
                          className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                            activeTab === tab.id
                              ? 'text-cyan-600 border-cyan-600 dark:text-cyan-500 dark:border-cyan-500 font-bold'
                              : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                          }`}
                        >
                          <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  {activeTab === 'historia_medica' && (
                    <div className="p-6">
                      <NuevaHistoriaForm
                        initialData={patientHistory}
                        onSave={handleSaveHistoria}
                        onCancel={handleCancelForm}
                        patientId={currentPatient.id}
                      />
                    </div>
                  )}
                  {activeTab === 'edad_biologica' && (
                    <div className="p-2 sm:p-4">
                      {edadBiologicaView === 'overview' ? (
                        <EdadBiologicaMain
                          cronoAge={patientAge}
                          patientId={currentPatient.id}
                          onNavigateToTestBiofisico={navigateToEdadBiofisicaTest}
                        />
                      ) : (
                        <EdadBiofisicaTestView
                          patientId={currentPatient.id}
                          patientName={`${currentPatient.names || ''} ${currentPatient.surnames || ''}`}
                          initialCronoAge={patientAge}
                          fechaNacimiento={(currentPatient as PatientData).birth_date || (currentPatient as PatientData).birthday || ''}
                          onBack={navigateBackToOverview}
                        />
                      )}
                    </div>
                  )}
                  {activeTab === 'guia_paciente' && (
                    <div className="p-6">Contenido de la Guía del Paciente (en construcción)...</div>
                  )}
                  {activeTab === 'alimentacion_nutrigenomica' && (
                    <div className="p-6">Contenido de Alimentación Nutrigenómica (en construcción)...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center p-10">
            <p>Vista no reconocida. Volviendo a la lista de pacientes...</p>
            <button 
              onClick={() => setCurrentView('listar_pacientes')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Volver a la lista
            </button>
          </div>
        );
    }
  };

  return renderCurrentView();
}