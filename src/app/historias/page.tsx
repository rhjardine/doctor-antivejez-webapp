// src/app/historias/page.tsx
'use client';

import { useState, useCallback } from 'react';
// import Sidebar from '@/components/Layout/Sidebar'; // Sidebar ya está en RootLayout
import MainContent from '@/components/Layout/MainContent';
// import ThemeToggle from '@/components/Layout/ThemeToggle'; // ThemeToggle ya está en RootLayout
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView'; // Importa también este

// Importa FontAwesomeIcon y los iconos que realmente uses en esta página
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartPulse, faUserCog, faAppleAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';


interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | string;
  biologicalAge?: number;
  trend?: number;
  healthScore?: number;
  lastCheckup?: string;
}

// Define los tipos para las pestañas para mejor mantenibilidad
type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

interface TabItem {
  id: TabName;
  label: string;
  icon: IconProp; // Usamos IconProp de FontAwesome
}

const TABS: TabItem[] = [
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt },
];


export default function HistoriasPage() {
  const [activeTab, setActiveTab] = useState<TabName>('edad_biologica'); // Inicia en Edad Biológica
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');

  const patient: Patient = {
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
      setEdadBiologicaView('overview'); // Resetea la vista de Edad Biológica si se cambia de pestaña
    }
  };
  
  // La prop onNavigateToTestBiofisico ahora se pasa a EdadBiologicaMain
  // y es EdadBiologicaMain quien cambia su propia vista interna.
  const navigateToEdadBiofisicaTest = () => {
    setEdadBiologicaView('testForm');
  };

  const navigateBackToOverview = () => {
    setEdadBiologicaView('overview');
  };


  return (
    // El div "flex min-h-screen" y Sidebar están en RootLayout
    // MainContent ya aplica el padding/margin necesario
    // No necesitas <Sidebar /> ni <ThemeToggle /> aquí si están en RootLayout
    <> {/* Fragmento para evitar div extra innecesario si MainContent es el único hijo directo */}
      <div className="mb-6"> {/* Espacio para PatientHeader */}
        <PatientHeader patient={patient} />
      </div>

      {/* Contenedor principal del contenido de la página de historias */}
      <div className="flex flex-col">
        {/* Título de la página (opcional, ya que PatientHeader muestra el nombre) */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-light-base dark:text-text-dark-base flex items-center gap-2">
            <FontAwesomeIcon icon={faPlusCircle} className="text-primary" />
            Historia Médica: {patient.name}
          </h1>
        </div> */}

        {/* Navegación de pestañas - Estilo similar a la imagen de referencia */}
        <div className="mb-6 border-b border-border-light dark:border-border-dark">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            {TABS.map((tab) => (
              <li key={tab.id} className="mr-2">
                <button
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group
                    ${
                      activeTab === tab.id
                        ? 'text-primary border-primary dark:text-primary dark:border-primary font-semibold' // Estilo activo
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

        {/* Contenido de las pestañas */}
        {/* Usamos un fondo de tarjeta para el contenido de la pestaña, como en la referencia */}
        <div className="bg-bg-card-light dark:bg-bg-card-dark p-4 sm:p-6 rounded-lg shadow-md">
          {activeTab === 'historia_medica' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">Historia Médica Detallada</h2>
              <p className="text-text-light-muted dark:text-text-dark-muted">
                Aquí se mostraría el contenido detallado de la historia médica del paciente.
              </p>
              {/* <HistoriaMedicaContenido patient={patient} /> */}
            </div>
          )}

          {activeTab === 'edad_biologica' && (
            <>
              {edadBiologicaView === 'overview' ? (
                <EdadBiologicaMain
                  cronoAge={patient.age}
                  patientId={patient.id}
                  // Pasamos la función para que EdadBiologicaMain pueda navegar
                  onNavigateToTestBiofisico={navigateToEdadBiofisicaTest} 
                />
              ) : ( 
                <EdadBiofisicaTestView
                  patientId={patient.id}
                  initialCronoAge={patient.age}
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
              {/* <GuiaPacienteContenido patientId={patient.id} /> */}
            </div>
          )}

          {activeTab === 'alimentacion_nutrigenomica' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">Plan de Alimentación Nutrigenómica</h2>
              <p className="text-text-light-muted dark:text-text-dark-muted">
                Plan nutricional basado en el perfil genético y necesidades del paciente.
              </p>
              {/* <AlimentacionContenido patientId={patient.id} /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}