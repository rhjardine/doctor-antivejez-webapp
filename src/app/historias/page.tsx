// src/app/historias/page.tsx
'use client';

import React, { useState, useCallback } from 'react'; // React importado
import MainContent from '@/components/Layout/MainContent';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartPulse, faUserCog, faAppleAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Patient, HistoriaClinicaData } from '@/types'; // Asegúrate que HistoriaClinicaData esté en tus tipos

type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';
interface TabItem { id: TabName; label: string; icon: IconProp; }

const TABS: TabItem[] = [
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt },
];

type HistoriasViewMode = 'lista_paciente' | 'detalle_historia' | 'nueva_historia' | 'editar_historia';

export default function HistoriasPage() {
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('detalle_historia');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('edad_biologica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');

  const currentPatient: Patient = {
    id: "458912", name: "Isabel Romero", age: 58, gender: "Female",
    biologicalAge: 52.3, trend: -5.7, healthScore: 84, lastCheckup: "2023-04-12"
  };

  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    if (tabName !== 'edad_biologica') {
      setEdadBiologicaView('overview');
    }
  };
  
  const navigateToEdadBiofisicaTest = () => setEdadBiologicaView('testForm');
  const navigateBackToOverview = () => setEdadBiologicaView('overview');

  const handleSaveHistoria = async (data: HistoriaClinicaData) => {
    console.log("Guardando historia:", data);
    alert(`Historia ${data.id ? 'actualizada' : 'guardada'} (simulación)`);
    setCurrentView('detalle_historia'); 
    setSelectedHistoriaToEdit(null);
  };

  const handleCancelForm = () => {
    setCurrentView('detalle_historia'); 
    setSelectedHistoriaToEdit(null);
  };

  const handleEditHistoria = (historiaData: HistoriaClinicaData) => { // Asume que recibes el objeto completo
    setSelectedHistoriaToEdit(historiaData);
    setCurrentView('editar_historia');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'nueva_historia':
        return (
          <NuevaHistoriaForm 
            onSave={handleSaveHistoria} 
            onCancel={handleCancelForm} 
          />
        );
      case 'editar_historia':
        return (
          <NuevaHistoriaForm 
            initialData={selectedHistoriaToEdit}
            onSave={handleSaveHistoria} 
            onCancel={handleCancelForm}
          />
        );
      case 'detalle_historia': 
      default:
        // CORRECCIÓN: Asegurar que el Fragmento <> envuelva todos los elementos hermanos correctamente.
        return (
          <> {/* Este Fragmento es el único elemento raíz devuelto */}
            <div className="mb-6"> {/* Primer elemento hermano */}
              <PatientHeader patient={currentPatient} />
            </div>

            {/* Segundo elemento hermano principal */}
            <div className="flex flex-col"> 
              <div className="mb-4 flex justify-end">
                <button 
                    onClick={() => setCurrentView('nueva_historia')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-darker flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                    <FontAwesomeIcon icon={faPlusCircle} /> Crear Nueva Historia
                </button>
                {/* Ejemplo de botón de edición (necesitarías datos para 'handleEditHistoria') */}
                {/* <button 
                    onClick={() => {
                        // Aquí necesitarías los datos de la historia actual para editar
                        // const historiaActualParaEditar = { ... }; // Obtén o define estos datos
                        // handleEditHistoria(historiaActualParaEditar);
                        alert("Funcionalidad Editar Historia no implementada completamente.")
                    }}
                    className="ml-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                    Editar Historia Actual (Ejemplo)
                </button> */}
              </div>

              <div className="mb-6 border-b border-border-light dark:border-border-dark">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                  {TABS.map((tab) => (
                    <li key={tab.id} className="mr-2">
                      <button
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group
                          ${
                            activeTab === tab.id
                              ? 'text-primary border-primary dark:text-primary dark:border-primary font-semibold'
                              : 'border-transparent text-text-light-muted dark:text-text-dark-muted hover:text-text-light-base hover:border-gray-300 dark:hover:text-text-dark-base dark:hover:border-gray-600'
                          }`}
                        onClick={() => handleTabClick(tab.id)}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                      >
                        <FontAwesomeIcon icon={tab.icon} className="mr-2 w-4 h-4" />
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-bg-card-light dark:bg-bg-card-dark p-4 sm:p-6 rounded-lg shadow-md">
                {activeTab === 'historia_medica' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">Historia Médica Detallada</h2>
                    <p className="text-text-light-muted dark:text-text-dark-muted">
                      Aquí se mostraría el contenido detallado de la historia médica del paciente.
                    </p>
                  </div>
                )}
                {activeTab === 'edad_biologica' && (
                  <>
                    {edadBiologicaView === 'overview' ? (
                      <EdadBiologicaMain
                        cronoAge={currentPatient.age}
                        patientId={currentPatient.id}
                        onNavigateToTestBiofisico={navigateToEdadBiofisicaTest} 
                      />
                    ) : ( 
                      <EdadBiofisicaTestView
                        patientId={currentPatient.id}
                        initialCronoAge={currentPatient.age}
                        onBack={navigateBackToOverview}
                      />
                    )}
                  </>
                )}
                {activeTab === 'guia_paciente' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">Guía del Paciente Personalizada</h2>
                    <p className="text-text-light-muted dark:text-text-dark-muted">
                      Recomendaciones y guías específicas para el paciente.
                    </p>
                  </div>
                )}
                {activeTab === 'alimentacion_nutrigenomica' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">Plan de Alimentación Nutrigenómica</h2>
                    <p className="text-text-light-muted dark:text-text-dark-muted">
                      Plan nutricional basado en el perfil genético y necesidades del paciente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <MainContent>
      {renderCurrentView()}
    </MainContent>
  );
}