'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Patient } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartPulse, faUserCog, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { usePatient } from '@/contexts/PatientProvider';
import PatientListClient from './components/PatientListClient';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain'; // La vista de resumen con cards
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView'; // El formulario del test

type ViewMode = 'list' | 'detail' | 'form';
type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

const TABS: { id: TabName; label: string; icon: IconProp }[] = [
  { id: 'historia_medica', label: 'Historia Clínica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Nutrigenómica', icon: faChartLine },
];

export default function HistoriasPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<TabName>('edad_biologica');
  const [isTakingTest, setIsTakingTest] = useState(false); // Estado para controlar si se muestra el test
  
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const { 
    currentPatient, 
    setCurrentPatient, 
    isLoading: isLoadingPatient, 
    error: patientError,
    fetchAndSetCurrentPatient,
  } = usePatient();

  const fetchPatientList = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('No se pudo cargar la lista de pacientes.');
      const data = await res.json();
      setAllPatients(data);
    } catch (e: any) {
      setListError(e.message);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'list') {
      fetchPatientList();
    }
  }, [view, fetchPatientList]);

  // --- MANEJADORES DE NAVEGACIÓN CORREGIDOS ---

  // Se activa con el Lápiz o el nuevo botón de Tests.
  const handleGoToDetail = async (patientId: string, targetTab: TabName = 'edad_biologica') => {
    const success = await fetchAndSetCurrentPatient(patientId);
    if (success) {
      setView('detail');
      setActiveTab(targetTab);
      setIsTakingTest(false); // **CRUCIAL**: Siempre empezar en la vista de resumen (cards azules)
    }
  };

  const handleCreateNew = () => {
    setCurrentPatient(null); 
    setView('form'); 
  };
  
  const handleBackToList = () => {
    setView('list');
    setCurrentPatient(null); 
  };

  const handleSaveSuccess = async (savedPatient: Patient) => {
    await fetchPatientList();
    setView('list');
  };
  
  // --- Renderizado Condicional de la Vista ---
  const renderContent = () => {
    // 1. VISTA DE LISTA
    if (view === 'list') {
      if (isLoadingList) return <div className="text-center p-10">Cargando pacientes...</div>;
      if (listError) return <div className="text-center p-10 text-red-500">Error: {listError}</div>;
      return (
        <PatientListClient
          initialPatients={allPatients}
          onGoToDetail={handleGoToDetail}
          onCreateNew={handleCreateNew}
        />
      );
    }

    // 2. VISTA DE FORMULARIO (NUEVO/EDITAR)
    if (view === 'form') {
      return (
        <div className="w-full max-w-5xl mx-auto p-4">
          <button onClick={handleBackToList} className="mb-4 text-cyan-600 hover:underline">
            ← Volver a la lista
          </button>
          <NuevaHistoriaForm
            key={currentPatient?.id || 'new'}
            initialData={currentPatient}
            onSave={handleSaveSuccess}
            onCancel={handleBackToList}
          />
        </div>
      );
    }
    
    // 3. VISTA DE DETALLE (CON PESTAÑAS)
    if (view === 'detail') {
      if (isLoadingPatient) return <div className="text-center p-10">Cargando datos del paciente...</div>;
      if (patientError || !currentPatient) {
        return (
          <div className="text-center p-10 text-red-500">
            <p>{patientError || 'No se pudo cargar al paciente.'}</p>
            <button onClick={handleBackToList} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Volver a la lista
            </button>
          </div>
        );
      }
      
      // **LÓGICA CORREGIDA**: Primero renderiza el contenedor principal y luego decide qué mostrar dentro.
      return (
        <div className="w-full">
          <button onClick={handleBackToList} className="mb-4 text-cyan-600 hover:underline">
            ← Volver a la lista
          </button>
          <PatientHeader patient={currentPatient as any} />
          <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {TABS.map(tab => (
                <li key={tab.id} className="mr-2">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400 font-bold'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 mt-[-1px] bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
            {activeTab === 'historia_medica' && (
              <NuevaHistoriaForm
                key={currentPatient.id}
                initialData={currentPatient}
                onSave={handleSaveSuccess}
                onCancel={() => { setActiveTab('edad_biologica'); }} 
              />
            )}
            {activeTab === 'edad_biologica' && (
              isTakingTest ? (
                // Si isTakingTest es true, muestra el formulario del test
                <EdadBiofisicaTestView
                  patientId={currentPatient.id.toString()}
                  patientName={`${currentPatient.names} ${currentPatient.surnames}`}
                  initialCronoAge={currentPatient.chronological_age || 0}
                  onBack={() => setIsTakingTest(false)} // El botón "Volver" del test te regresa al resumen
                  onSaveTest={() => { 
                    setIsTakingTest(false);
                    handleGoToDetail(currentPatient.id.toString(), 'edad_biologica');
                  }}
                />
              ) : (
                // Si no, muestra el resumen con las cards azules
                <EdadBiologicaMain
                  cronoAge={currentPatient.chronological_age || 0}
                  patientId={currentPatient.id.toString()}
                  onNavigateToTestBiofisico={() => setIsTakingTest(true)} // El clic en la card te lleva al test
                />
              )
            )}
            {activeTab === 'guia_paciente' && <div className="text-center p-6">Guía del Paciente (En construcción)</div>}
            {activeTab === 'alimentacion_nutrigenomica' && <div className="text-center p-6">Alimentación Nutrigenómica (En construcción)</div>}
          </div>
        </div>
      );
    }
  };

  return <div className="p-4 sm:p-6 lg:p-8">{renderContent()}</div>;
}