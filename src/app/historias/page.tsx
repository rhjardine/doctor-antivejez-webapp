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
  faAppleAlt,
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'nueva_historia':
        return (
          <div className="w-full max-w-full p-4 md:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
            <div className="max-w-5xl mx-auto">
              <NuevaHistoriaForm
                onSave={handleSaveHistoria}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        );
      case 'editar_historia':
        return (
          <div className="w-full max-w-full p-4 md:p-6 bg-bg-light dark:bg-bg-dark min-h-screen">
            <div className="max-w-5xl mx-auto">
              <NuevaHistoriaForm
                initialData={selectedHistoriaToEdit}
                onSave={handleSaveHistoria}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        );
      case 'detalle_historia':
      default:
        return (
          <div className="bg-bg-light dark:bg-bg-dark min-h-screen w-full">
            {/* Contenedor principal con padding y max-width corregidos */}
            <div className="w-full max-w-full p-4 sm:p-6 space-y-6">
              <div className="max-w-7xl mx-auto">
                <PatientHeader patient={currentPatient} />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-text-light-base dark:text-text-dark-base flex items-center gap-2">
                    <FontAwesomeIcon icon={faNotesMedical} className="text-primary w-5 h-5" />
                    Detalle de Historia del Paciente
                  </h2>
                </div>

                {/* Pestañas con scroll horizontal en móviles */}
                <div className="border-b border-border-light dark:border-border-dark">
                  <div className="overflow-x-auto">
                    <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center min-w-max">
                      {TABS.map((tab) => (
                        <li key={tab.id} className="mr-2 flex-shrink-0">
                          <button
                            onClick={() => handleTabClick(tab.id)}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            className={`inline-flex items-center justify-center p-3 border-b-2 rounded-t-lg group transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                              ? 'text-primary border-primary bg-primary/5 font-semibold'
                              : 'border-transparent text-text-light-medium dark:text-text-dark-medium hover:text-primary hover:border-primary/50 hover:bg-primary/5'
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
                    <NuevaHistoriaForm
                      initialData={selectedHistoriaToEdit}
                      onSave={handleSaveHistoria}
                      onCancel={handleCancelForm}
                    />
                  )}
                  {activeTab === 'edad_biologica' && (
                    <div
                      className="overflow-hidden"
                      style={{
                        maxWidth: '100%',
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '1rem'
                      }}
                    >
                      <div
                        className="overflow-hidden"
                        style={{
                          maxWidth: '100%',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
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
                      </div>
                    </div>
                  )}
                  {activeTab === 'guia_paciente' && (
                    <div className="p-4 sm:p-6">
                      <h2 className="text-xl font-semibold mb-3 text-text-light-base dark:text-text-dark-base">
                        Guía del Paciente Personalizada
                      </h2>
                      <p className="text-text-light-muted dark:text-text-dark-muted">
                        Recomendaciones y guías específicas para el paciente.
                      </p>
                    </div>
                  )}
                  {activeTab === 'alimentacion_nutrigenomica' && (
                    <div className="p-4 sm:p-6">
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
          </div>
        );
    }
  };

  return renderCurrentView();
}