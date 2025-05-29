// src/app/historias/page.tsx
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical, faHeartPulse, faUserCog, faAppleAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Patient, HistoriaClinicaData } from '@/types';

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

type HistoriasViewMode = 'detalle_historia' | 'nueva_historia' | 'editar_historia';

export default function HistoriasPage() {
  const [currentView, setCurrentView] = useState<HistoriasViewMode>('detalle_historia');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>('historia_medica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(''); // Estado para almacenar la fecha de nacimiento

  const currentPatient: Patient = {
    id: "458912",
    name: "Isabel Romero",
    age: 58,
    gender: "Female",
    biologicalAge: 52.3,
    trend: -5.7,
    healthScore: 84,
    lastCheckup: "2023-04-12"
  };

  // Actualizar la fecha de nacimiento cuando se guarda la historia médica
  useEffect(() => {
    if (selectedHistoriaToEdit?.fechaNacimiento) {
      setFechaNacimiento(selectedHistoriaToEdit.fechaNacimiento);
    }
  }, [selectedHistoriaToEdit]);

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
    
    // Actualizar la fecha de nacimiento para compartirla con otros componentes
    if (data.fechaNacimiento) {
      setFechaNacimiento(data.fechaNacimiento);
    }
    
    alert(`Historia ${selectedHistoriaToEdit?.id ? 'actualizada' : 'guardada'} (simulación)`);
    setCurrentView('detalle_historia');
    setSelectedHistoriaToEdit(data); // Guardar los datos para tenerlos disponibles
    setActiveTab('historia_medica');
  };

  const handleCancelForm = () => {
    setCurrentView('detalle_historia');
    setSelectedHistoriaToEdit(null);
    setActiveTab('historia_medica');
  };

  const handleEditHistoria = (historiaData?: HistoriaClinicaData) => {
    setSelectedHistoriaToEdit(historiaData || null);
    setActiveTab('historia_medica');
    setCurrentView('detalle_historia');
  };
  
  // Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calcular la edad cronológica basada en la fecha de nacimiento, o usar la edad del paciente si no hay fecha
  const calculatedAge = fechaNacimiento ? calculateAge(fechaNacimiento) : currentPatient.age;

  return (
    <div className="w-full max-w-full bg-bg-light dark:bg-bg-dark min-h-screen">
      <div className="max-w-full p-4 space-y-6">
        <PatientHeader patient={currentPatient} />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-text-light-base dark:text-text-dark-base flex items-center gap-2">
            <FontAwesomeIcon icon={faNotesMedical} className="text-[#23BCEF] w-5 h-5" />
            Detalle de Historia del Paciente
          </h2>
        </div>
        
        {/* Pestañas con colores corporativos */}
        <div className="border-b border-border-light dark:border-border-dark w-full overflow-hidden">
          <div className="overflow-x-auto">
            <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center min-w-max">
              {TABS.map((tab) => (
                <li key={tab.id} className="mr-2 flex-shrink-0">
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg group transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-[#23BCEF] border-[#23BCEF] bg-[#23BCEF]/5 font-semibold'
                        : 'border-transparent text-text-light-medium dark:text-text-dark-medium hover:text-[#23BCEF] hover:border-[#23BCEF]/50 hover:bg-[#23BCEF]/5'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="mr-2 w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Contenido de las Pestañas */}
        <div className="bg-bg-card-light dark:bg-bg-card-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark overflow-hidden w-full">
          {activeTab === 'historia_medica' && (
            <div className="p-4 overflow-hidden">
              <NuevaHistoriaForm
                initialData={selectedHistoriaToEdit}
                onSave={handleSaveHistoria}
                onCancel={handleCancelForm}
              />
            </div>
          )}
          
          {activeTab === 'edad_biologica' && (
            <div className="p-4 overflow-hidden">
              {edadBiologicaView === 'overview' ? (
                <EdadBiologicaMain
                  cronoAge={calculatedAge}
                  patientId={currentPatient.id}
                  onNavigateToTestBiofisico={navigateToEdadBiofisicaTest}
                />
              ) : (
                <EdadBiofisicaTestView
                  patientId={currentPatient.id}
                  patientName={currentPatient.name}
                  initialCronoAge={calculatedAge}
                  fechaNacimiento={fechaNacimiento}
                  onBack={navigateBackToOverview}
                  onTestSaved={() => {
                    alert('Test guardado exitosamente');
                    navigateBackToOverview();
                  }}
                />
              )}
            </div>
          )}
          
          {activeTab === 'guia_paciente' && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">
                Guía del Paciente Personalizada
              </h2>
              <p className="text-text-light-muted dark:text-text-dark-muted">
                Recomendaciones y guías específicas para el paciente.
              </p>
            </div>
          )}
          
          {activeTab === 'alimentacion_nutrigenomica' && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">
                Plan de Alimentación Nutrigenómica
              </h2>
              <p className="text-text-light-muted dark:text-text-dark-muted">
                Plan nutricional basado en el perfil genético y necesidades del paciente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}