// src/app/historias/page.tsx 
'use client'; 
 
import React, { useState, useCallback } from 'react';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  
  faNotesMedical, faHeartPulse, faUserCog,  
  faAppleAlt, faPlusCircle  
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Patient, HistoriaClinicaData } from '@/types';  
 
type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';
interface TabItem { id: TabName; label: string; icon: IconProp; }
 
const TABS: TabItem[] = [ 
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical }, 
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse }, 
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog }, 
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt }, 
];
 
type HistoriasViewMode = 'detalle_historia' | 'nueva_historia' | 'editar_historia';
 
export default function HistoriasPage() {
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('detalle_historia');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('historia_medica');
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
    alert(`Historia ${selectedHistoriaToEdit?.id ? 'actualizada' : 'guardada'} (simulación)`);
    setCurrentView('detalle_historia');  
    setSelectedHistoriaToEdit(null);
  };
 
  const handleCancelForm = () => {
    setCurrentView('detalle_historia');  
    setSelectedHistoriaToEdit(null);
  };
 
  const handleEditHistoria = (historiaData?: HistoriaClinicaData) => {
    setSelectedHistoriaToEdit(historiaData || null);
    setCurrentView(historiaData ? 'editar_historia' : 'nueva_historia');
  };
 
  const renderCurrentView = () => {
    switch (currentView) {
      case 'nueva_historia':
        return (
          <div className="p-4 md:p-6 lg:p-8 max-w-5xl">  
            <NuevaHistoriaForm  
              onSave={handleSaveHistoria}  
              onCancel={handleCancelForm}  
            />
          </div>
        );
      case 'editar_historia':
        return (
          <div className="p-4 md:p-6 lg:p-8 max-w-5xl">
            <NuevaHistoriaForm  
              initialData={selectedHistoriaToEdit}
              onSave={handleSaveHistoria}  
              onCancel={handleCancelForm}
            />
          </div>
        );
      case 'detalle_historia':  
      default:
        return (
          <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl">  
            <PatientHeader patient={currentPatient} />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-text-light-base dark:text-text-dark-base">
                Detalle de Historia del Paciente
              </h2>
              <button  
                onClick={() => handleEditHistoria()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-darker flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow self-start sm:self-auto"
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Crear Nueva Historia
              </button>
            </div>

            <div className="border-b border-border-light dark:border-border-dark w-full">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                {TABS.map((tab) => (
                  <li key={tab.id} className="mr-2">
                    <button
                      className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg group
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
 
            <div className="bg-bg-card-light dark:bg-bg-card-dark p-3 sm:p-4 rounded-lg shadow-md w-full">
              {activeTab === 'historia_medica' && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">Historia Médica Detallada</h2>
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
                  <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">Guía del Paciente Personalizada</h2>
                  <p className="text-text-light-muted dark:text-text-dark-muted">
                    Recomendaciones y guías específicas para el paciente.
                  </p>
                </div>
              )}
              {activeTab === 'alimentacion_nutrigenomica' && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">Plan de Alimentación Nutrigenómica</h2>
                  <p className="text-text-light-muted dark:text-text-dark-muted">
                    Plan nutricional basado en el perfil genético y necesidades del paciente.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };
 
  return renderCurrentView();
}