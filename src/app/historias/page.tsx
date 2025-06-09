// src/app/historias/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import { PatientList } from './components/PatientList';
import VisitHistory from './components/VisitHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical, faHeartPulse, faUserCog,
  faAppleAlt, faList, faHistory, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { usePatient } from '@/contexts/PatientProvider';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// --- Placeholder para tipos de datos (ajustar según tu definición real) ---
interface HistoriaClinicaData {
    id?: string;
    patientId: string; // Este campo puede causar conflicto, la API devuelve 'id'
    // ... otros campos de la historia
}

type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

interface TabItem {
  id: TabName;
  label: string;
  icon: IconProp;
}
// --- Fin de Placeholders ---

const TABS: TabItem[] = [
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt },
];

type HistoriasViewMode =
  'detalle_historia'
  | 'nueva_historia'
  | 'listar_pacientes'
  | 'historico_visitas';

export default function HistoriasPage() {
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('listar_pacientes');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('historia_medica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');

  const {
    currentPatient,
    patientHistory,
    fetchPatient,
    fetchPatientHistory,
    setCurrentPatient,
    setPatientHistory
  } = usePatient();

  const handleSelectPatient = async (patientId: string) => {
    try {
      await fetchPatient(patientId);
      await fetchPatientHistory(patientId);
      setCurrentView('detalle_historia');
      setActiveTab('historia_medica');
    } catch (error) {
      console.error('Error al seleccionar paciente:', error);
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
  }

  const navigateBackToOverview = () => setEdadBiologicaView('overview');

  // *** INICIO DE LA MODIFICACIÓN CLAVE ***
  const handleSaveHistoria = async (savedData: any) => {
    console.log("Historia guardada, datos recibidos:", savedData);

    // `savedData` es el objeto del paciente que devuelve la API. Tiene un campo `id`.
    if (savedData && savedData.id) {
        // Usamos el ID del paciente recién guardado para hacer fetch de sus datos completos
        await fetchPatient(savedData.id); 
        // También podríamos querer cargar su historial si existe una función para ello
        await fetchPatientHistory(savedData.id);
    } else {
        console.error("El paciente se guardó, pero no se recibió un ID válido para recargar los datos.");
    }
    
    // Cambiamos a la vista de detalle para mostrar la información del paciente recién guardado/actualizado
    setCurrentView('detalle_historia');
    setActiveTab('historia_medica');
    setSelectedHistoriaToEdit(null);
  };
  // *** FIN DE LA MODIFICACIÓN CLAVE ***

  const handleCancelForm = () => {
    if (currentView === 'nueva_historia' && !currentPatient) {
      setCurrentView('listar_pacientes');
    } else {
      setCurrentView('detalle_historia');
      setActiveTab('historia_medica');
    }
    setSelectedHistoriaToEdit(null);
  };

  const handleViewVisitHistory = () => {
    if (currentPatient) {
      setCurrentView('historico_visitas');
    }
  };

  const handleViewVisitDetail = (visitId: string) => {
    console.log("Ver detalle de visita:", visitId);
    setCurrentView('detalle_historia');
    setActiveTab('historia_medica');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'listar_pacientes':
        return (
          <PatientList
            onSelectPatient={handleSelectPatient}
            onCreateNewPatient={handleCreateNewPatient}
          />
        );

      case 'nueva_historia':
        return (
          <div className="w-full max-w-full p-4 md:p-6 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-[#23BCEF]/20">
                <h2 className="text-xl font-bold text-[#293B64] dark:text-[#23BCEF] flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} className="text-[#23BCEF]" />
                  {currentPatient ? 'Nueva Historia para Paciente' : 'Registrar Nuevo Paciente'}
                </h2>
                <button
                  onClick={() => setCurrentView('listar_pacientes')}
                  className="px-4 py-2 rounded-lg border-2 border-[#23BCEF]/30 text-[#23BCEF] hover:bg-[#23BCEF]/10 transition-colors"
                >
                  Volver a la Lista
                </button>
              </div>
              <NuevaHistoriaForm
                onSave={handleSaveHistoria}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        );

      case 'historico_visitas':
        return (
          <VisitHistory
            patientId={currentPatient?.id || ''}
            onViewVisitDetail={handleViewVisitDetail}
            onBack={() => setCurrentView('detalle_historia')}
          />
        );

      case 'detalle_historia':
      default:
        return (
          <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-700 min-h-screen w-full">
            <div className="w-full max-w-full p-4 sm:p-6 space-y-6">
              <div className="max-w-7xl mx-auto">
                {currentPatient && (
                  <div className="mb-6">
                    <PatientHeader patient={currentPatient} />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setCurrentView('listar_pacientes')}
                        className="px-3 py-1.5 text-sm rounded-md bg-[#293B64]/10 text-[#293B64] dark:text-[#23BCEF] hover:bg-[#293B64]/20 transition-colors flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faList} className="text-xs" />
                        <span>Lista de Pacientes</span>
                      </button>
                      <button
                        onClick={handleViewVisitHistory}
                        className="px-3 py-1.5 text-sm rounded-md bg-[#23BCEF]/10 text-[#23BCEF] hover:bg-[#23BCEF]/20 transition-colors flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faHistory} className="text-xs" />
                        <span>Historial de Visitas</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedHistoriaToEdit(null);
                          setCurrentView('nueva_historia');
                        }}
                        className="px-3 py-1.5 text-sm rounded-md bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Nueva Historia</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-[#293B64] dark:text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faNotesMedical} className="text-[#23BCEF] w-5 h-5" />
                    Detalle de Historia del Paciente
                  </h2>
                </div>
                <div className="border-b-2 border-[#23BCEF]/20 bg-white dark:bg-gray-800 rounded-t-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center min-w-max">
                      {TABS.map((tab) => (
                        <li key={tab.id} className="mr-2 flex-shrink-0">
                          <button
                            onClick={() => handleTabClick(tab.id)}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-all duration-300 whitespace-nowrap font-semibold ${
                              activeTab === tab.id
                                ? 'text-[#23BCEF] border-[#23BCEF] bg-gradient-to-t from-[#23BCEF]/10 to-transparent'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[#23BCEF] hover:border-[#23BCEF]/50 hover:bg-gradient-to-t hover:from-[#23BCEF]/5 hover:to-transparent'
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={tab.icon}
                              className={`mr-2 w-4 h-4 transition-transform duration-300 ${
                                activeTab === tab.id ? 'transform rotate-12' : 'group-hover:transform group-hover:rotate-6'
                              }`}
                            />
                            {tab.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border-2 border-[#23BCEF]/10 overflow-hidden w-full">
                   {/* Aquí iría el contenido de cada Tab */}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderCurrentView();
}
