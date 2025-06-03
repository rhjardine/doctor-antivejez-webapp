// src/app/historias/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import PatientList from './components/PatientList';
import VisitHistory from './components/VisitHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical, faHeartPulse, faUserCog,
  faAppleAlt, faList, faHistory, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { usePatient } from '@/contexts/PatientProvider';

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

type HistoriasViewMode = 
  | 'detalle_historia'  // Ver/editar la historia de un paciente
  | 'nueva_historia'    // Crear nueva historia para un paciente
  | 'listar_pacientes'  // Ver lista de pacientes
  | 'historico_visitas'; // Ver historial de visitas de un paciente

export default function HistoriasPage() {
  // Estados
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('listar_pacientes');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('historia_medica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');
  
  // Usar el contexto del paciente
  const { 
    currentPatient, 
    patientHistory, 
    fetchPatient, 
    fetchPatientHistory,
    setCurrentPatient,
    setPatientHistory 
  } = usePatient();
  
  // Manejar selección de paciente
  const handleSelectPatient = async (patientId: string) => {
    try {
      // Cargar datos del paciente
      await fetchPatient(patientId);
      
      // Cargar historia clínica
      await fetchPatientHistory(patientId);
      
      // Cambiar a vista de detalle
      setCurrentView('detalle_historia');
      setActiveTab('historia_medica');
    } catch (error) {
      console.error('Error al seleccionar paciente:', error);
      // Manejar error (quizás mostrar una notificación)
    }
  };
  
  // Manejar creación de nuevo paciente
  const handleCreateNewPatient = () => {
    // Limpiar paciente actual
    setCurrentPatient(null);
    setPatientHistory(null);
    
    // Cambiar a vista de nueva historia
    setCurrentView('nueva_historia');
  };
  
  // Manejar click en pestaña
  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    if (tabName !== 'edad_biologica') {
      setEdadBiologicaView('overview');
    }
  };
  
  // Navegación a test de edad biofísica
  const navigateToEdadBiofisicaTest = () => setEdadBiologicaView('testForm');
  
  // Volver a vista general
  const navigateBackToOverview = () => setEdadBiologicaView('overview');
  
  // Guardar historia
  const handleSaveHistoria = async (data: HistoriaClinicaData) => {
    console.log("Historia guardada:", data);
    
    // Si es una nueva historia y tenemos id, hacemos fetch del paciente
    if (data.id && (!currentPatient || currentPatient.id !== data.patientId)) {
      await fetchPatient(data.patientId);
    }
    
    // Actualizar estado
    setPatientHistory(data);
    setSelectedHistoriaToEdit(null);
    
    // Cambiar vista
    setCurrentView('detalle_historia');
    setActiveTab('historia_medica');
  };
  
  // Cancelar formulario
  const handleCancelForm = () => {
    // Si estamos en nueva historia sin paciente, volver a lista
    if (currentView === 'nueva_historia' && !currentPatient) {
      setCurrentView('listar_pacientes');
    } else {
      // Si no, volver a detalle de historia
      setCurrentView('detalle_historia');
      setActiveTab('historia_medica');
    }
    
    setSelectedHistoriaToEdit(null);
  };
  
  // Ver historial de visitas
  const handleViewVisitHistory = () => {
    if (currentPatient) {
      setCurrentView('historico_visitas');
    }
  };
  
  // Ver detalle de una visita específica
  const handleViewVisitDetail = (visitId: string) => {
    // Aquí cargaríamos la visita específica
    console.log("Ver detalle de visita:", visitId);
    
    // Por ahora, simplemente volvemos a la vista de detalle
    setCurrentView('detalle_historia');
    setActiveTab('historia_medica');
  };
  
  // Renderizar vista actual
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
                {/* Header del paciente */}
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
                
                {/* Pestañas */}
                <div className="border-b-2 border-[#23BCEF]/20 bg-white dark:bg-gray-800 rounded-t-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center min-w-max">
                      {TABS.map((tab) => (
                        <li key={tab.id} className="mr-2 flex-shrink-0">
                          <button
                            onClick={() => handleTabClick(tab.id)}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            className={`inline-flex items-center justify-center p-4 border-b-3 rounded-t-lg group transition-all duration-300 whitespace-nowrap font-semibold ${
                              activeTab === tab.id
                                ? 'text-[#23BCEF] border-[#23BCEF] bg-gradient-to-t from-[#23BCEF]/10 to-transparent shadow-lg transform scale-105'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[#23BCEF] hover:border-[#23BCEF]/50 hover:bg-gradient-to-t hover:from-[#23BCEF]/5 hover:to-transparent hover:transform hover:scale-102'
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={tab.icon}
                              className={`mr-2 w-4 h-4 transition-transform duration-300 ${
                                activeTab === tab.id 
                                  ? 'transform rotate-12' 
                                  : 'group-hover:transform group-hover:rotate-6'
                              }`}
                            />
                            {tab.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Contenido de las Pestañas */}
                <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border-2 border-[#23BCEF]/10 overflow-hidden w-full">
                  {activeTab === 'historia_medica' && (
                    <div className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23BCEF] via-[#293B64] to-[#23BCEF]"></div>
                      <NuevaHistoriaForm
                        initialData={patientHistory || selectedHistoriaToEdit}
                        onSave={handleSaveHistoria}
                        onCancel={handleCancelForm}
                      />
                    </div>
                  )}
                  
                  {activeTab === 'edad_biologica' && currentPatient && (
                    <div className="overflow-hidden relative" style={{ padding: '1rem' }}>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23BCEF] via-[#293B64] to-[#23BCEF]"></div>
                      
                      {edadBiologicaView === 'overview' ? (
                        <EdadBiologicaMain
                          cronoAge={currentPatient.age}
                          patientId={currentPatient.id}
                          onNavigateToTestBiofisico={navigateToEdadBiofisicaTest}
                        />
                      ) : (
                        <EdadBiofisicaTestView
                          patientId={currentPatient.id}
                          patientName={`${currentPatient.surnames || ''} ${currentPatient.names || ''}`}
                          initialCronoAge={currentPatient.age}
                          fechaNacimiento={currentPatient.birthday}
                          onBack={navigateBackToOverview}
                        />
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'guia_paciente' && (
                    <div className="p-6 relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23BCEF] via-[#293B64] to-[#23BCEF]"></div>
                      <div className="bg-gradient-to-r from-[#23BCEF]/5 to-[#293B64]/5 p-6 rounded-lg border border-[#23BCEF]/20">
                        <h2 className="text-xl font-semibold mb-3 text-[#293B64] dark:text-[#23BCEF] flex items-center gap-2">
                          <FontAwesomeIcon icon={faUserCog} className="text-[#23BCEF]" />
                          Guía del Paciente Personalizada
                        </h2>
                        
                        {currentPatient ? (
                          <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">
                              Recomendaciones y guías específicas para {currentPatient.names} {currentPatient.surnames}.
                            </p>
                            
                            {/* Aquí iría el contenido real de la guía del paciente */}
                            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600">
                              <h3 className="font-semibold text-[#293B64] dark:text-[#23BCEF] mb-2">
                                Recomendaciones Personalizadas
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                Contenido personalizado basado en el perfil del paciente...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            Seleccione un paciente para ver recomendaciones personalizadas.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'alimentacion_nutrigenomica' && (
                    <div className="p-6 relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23BCEF] via-[#293B64] to-[#23BCEF]"></div>
                      <div className="bg-gradient-to-r from-[#23BCEF]/5 to-[#293B64]/5 p-6 rounded-lg border border-[#23BCEF]/20">
                        <h2 className="text-xl font-semibold mb-3 text-[#293B64] dark:text-[#23BCEF] flex items-center gap-2">
                          <FontAwesomeIcon icon={faAppleAlt} className="text-[#23BCEF]" />
                          Plan de Alimentación Nutrigenómica
                        </h2>
                        
                        {currentPatient ? (
                          <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">
                              Plan nutricional basado en el perfil genético y necesidades de {currentPatient.names} {currentPatient.surnames}.
                            </p>
                            
                            {/* Aquí iría el contenido real del plan nutricional */}
                            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600">
                              <h3 className="font-semibold text-[#293B64] dark:text-[#23BCEF] mb-2">
                                Plan Nutricional Personalizado
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                Contenido personalizado basado en análisis genéticos y metabólicos...
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            Seleccione un paciente para ver su plan nutricional personalizado.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return renderCurrentView();
}