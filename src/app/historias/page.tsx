// src/app/historias/page.tsx
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
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
// Importa los otros componentes de pestañas que necesites
// import GuiaPacienteTab from './components/GuiaPacienteTab'; 
// import AlimentacionNutrigenomicaTab from './components/AlimentacionNutrigenomicaTab';

// Tipos para las vistas y pestañas
type ViewMode = 'list' | 'detail' | 'new' | 'edit';
type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

// Configuración de las pestañas
const TABS: { id: TabName; label: string; icon: IconProp }[] = [
  { id: 'historia_medica', label: 'Historia Clínica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Nutrigenómica', icon: faChartLine },
];


export default function HistoriasPage() {
  const [view, setView] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<TabName>('edad_biologica');
  const [edadBiologicaSubView, setEdadBiologicaSubView] = useState<'overview' | 'testForm'>('overview');
  
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const {
    currentPatient,
    isLoading: isLoadingPatient,
    error: patientError,
    fetchAndSetCurrentPatient,
    setCurrentPatient, // <-- CORRECCIÓN: Usar la función correcta del contexto
    clearError,
  } = usePatient();

  // --- Funciones de Carga de Datos ---
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


  // --- MANEJADORES DE NAVEGACIÓN ---

  const handleSelectPatient = async (patientId: string) => {
    const success = await fetchAndSetCurrentPatient(patientId);
    if (success) {
      setView('detail');
      setActiveTab('edad_biologica');
      setEdadBiologicaSubView('overview'); // Asegurarse de empezar en la vista general
    }
  };

  const handleEditPatient = (patientId: string) => {
    fetchAndSetCurrentPatient(patientId).then(success => {
        if (success) {
            setView('edit');
        }
    });
  };
  
  const handleCreateNew = () => {
    setCurrentPatient(null); // <-- CORRECCIÓN: Llamada correcta para limpiar el paciente
    setView('new');
  };
  
  const handleBackToList = () => {
      setView('list');
      setCurrentPatient(null); // <-- CORRECCIÓN: Llamada correcta para limpiar el paciente
  };
  
  const handleSaveSuccess = async (savedPatient: Patient) => {
    await fetchAndSetCurrentPatient(savedPatient.id);
    setView('detail');
    setActiveTab('edad_biologica');
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
          onSelectPatient={handleSelectPatient}
          onCreateNewPatient={handleCreateNew}
          onEditPatient={handleEditPatient}
        />
      );
    }

    // 2. VISTA DE FORMULARIO
    if (view === 'new' || view === 'edit') {
      return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <button onClick={handleBackToList} className="mb-4 text-[#23BCEF] hover:underline">
                &larr; Volver a la lista
            </button>
            <NuevaHistoriaForm
                key={currentPatient?.id || 'new'}
                initialData={currentPatient}
                onSave={handleSaveSuccess}
                onCancel={handleBackToList}
                patientId={currentPatient?.id}
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
            <p>No se pudo cargar al paciente.</p>
            <button onClick={handleBackToList} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Volver a la lista
            </button>
          </div>
        );
      }
      
      return (
        <div className="w-full">
            <button onClick={handleBackToList} className="mb-4 text-[#23BCEF] hover:underline">
                &larr; Volver a la lista
            </button>
            <PatientHeader patient={currentPatient as any} />
            
            {/* Sistema de Pestañas */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {TABS.map(tab => (
                        <li key={tab.id} className="mr-2">
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                // --- CORRECCIÓN DE ESTILO ---
                                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                                    activeTab === tab.id
                                    ? 'border-[#23BCEF] text-[#23BCEF] font-bold'
                                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="p-4 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                 {activeTab === 'historia_medica' && (
                    <NuevaHistoriaForm
                        key={currentPatient.id} initialData={currentPatient}
                        onSave={handleSaveSuccess} onCancel={() => setView('detail')}
                        patientId={currentPatient.id}
                    />
                )}
                {/* --- CORRECCIÓN DE LÓGICA DE SUB-VISTA --- */}
                {activeTab === 'edad_biologica' && (
                    edadBiologicaSubView === 'overview' ? (
                      <EdadBiologicaMain
                          cronoAge={currentPatient.chronological_age || 0}
                          patientId={currentPatient.id}
                          onNavigateToTestBiofisico={() => setEdadBiologicaSubView('testForm')}
                      />
                    ) : (
                      <EdadBiofisicaTestView
                        patientId={currentPatient.id}
                        patientName={`${currentPatient.names || ''} ${currentPatient.surnames || ''}`}
                        initialCronoAge={currentPatient.chronological_age || 0}
                        fechaNacimiento={currentPatient.birth_date ? new Date(currentPatient.birth_date).toISOString().split('T')[0] : ''}
                        onBack={() => setEdadBiologicaSubView('overview')}
                        onSaveTest={() => { // Asumiendo que onSaveTest existe para refrescar
                          setEdadBiologicaSubView('overview');
                          fetchAndSetCurrentPatient(currentPatient.id);
                        }}
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
