'use client';

import { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import ThemeToggle from '@/components/ThemeToggle';
import PatientHeader from '@/components/PatientHeader';
import EdadBiologicaMain from './components/EdadBiologicaMain';
import EdadBiofisicaTestView from './components/EdadBiofisicaTestView';
import NuevaHistoriaForm from './components/NuevaHistoriaForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNotesMedical, faHeartPulse, faUserCog, faAppleAlt 
} from '@fortawesome/free-solid-svg-icons';
import { HistoriaClinicaData } from '@/types/historia';

// Definir tipos para las pestañas
type TabName = 'historia_medica' | 'edad_biologica' | 'guia_paciente' | 'alimentacion_nutrigenomica';

// Definir las pestañas disponibles
const TABS = [
  { id: 'historia_medica', label: 'Historia Médica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Alimentación Nutrigenómica', icon: faAppleAlt },
];

export default function HistoriasPage() {
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<TabName>('historia_medica');
  const [edadBiologicaView, setEdadBiologicaView] = useState<'overview' | 'testForm'>('overview');
  const [selectedHistoriaToEdit, setSelectedHistoriaToEdit] = useState<HistoriaClinicaData | null>(null);
  
  // Datos simulados del paciente (en una app real, vendrían de una API)
  const patient = {
    id: "",
    name: "",
    age: 58,
    gender: "" as const,
    biologicalAge: 52.3,
    trend: -5.7,
    healthScore: 84,
    lastCheckup: "2023-04-12"
  };
  
  // Cambiar de pestaña
  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    if (tabName !== 'edad_biologica') {
      setEdadBiologicaView('overview');
    }
  };
  
  // Navegar al test de edad biofísica
  const navigateToEdadBiofisicaTest = () => setEdadBiologicaView('testForm');
  
  // Volver a la vista general de edad biológica
  const navigateBackToOverview = () => setEdadBiologicaView('overview');
  
  // Guardar historia clínica
  const handleSaveHistoria = async (data: HistoriaClinicaData) => {
    console.log("Guardando historia:", data);
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Historia ${selectedHistoriaToEdit?.id ? 'actualizada' : 'guardada'} correctamente`);
    setSelectedHistoriaToEdit(null);
  };
  
  // Cancelar formulario de historia
  const handleCancelForm = () => {
    setSelectedHistoriaToEdit(null);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        user={{
          name: "Dr. María García",
          role: "Longevity Specialist"
        }}
      />
      
      <MainContent>
        <div className="p-6">
          {/* Cabecera del paciente */}
          <div className="mb-6">
            <PatientHeader patient={patient} />
          </div>
          
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <FontAwesomeIcon icon={faNotesMedical} className="text-[#23BCEF]" />
                Detalle de Historia del Paciente
              </h1>
            </div>
            
            {/* Pestañas de navegación */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                {TABS.map((tab) => (
                  <li key={tab.id} className="mr-2">
                    <button
                      onClick={() => handleTabClick(tab.id as TabName)}
                      className={`inline-flex items-center p-4 border-b-2 rounded-t-lg group
                        ${activeTab === tab.id 
                          ? 'text-[#23BCEF] border-[#23BCEF] font-semibold' 
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}
                      `}
                    >
                      <FontAwesomeIcon icon={tab.icon} className="mr-2 w-4 h-4" />
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contenido de las pestañas */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
              {/* Historia Médica */}
              {activeTab === 'historia_medica' && (
                <NuevaHistoriaForm
                  initialData={selectedHistoriaToEdit}
                  onSave={handleSaveHistoria}
                  onCancel={handleCancelForm}
                />
              )}
              
              {/* Edad Biológica */}
              {activeTab === 'edad_biologica' && (
                <div>
                  {edadBiologicaView === 'overview' ? (
                    <EdadBiologicaMain
                      cronoAge={patient.age}
                      patientId={patient.id}
                      onNavigateToTestBiofisico={navigateToEdadBiofisicaTest}
                    />
                  ) : (
                    <EdadBiofisicaTestView
                      patientId={patient.id}
                      initialCronoAge={patient.age}
                      onBack={navigateBackToOverview}
                    />
                  )}
                </div>
              )}
              
              {/* Guía del Paciente */}
              {activeTab === 'guia_paciente' && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Guía del Paciente Personalizada
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Recomendaciones y guías específicas para el paciente.
                  </p>
                </div>
              )}
              
              {/* Alimentación Nutrigenómica */}
              {activeTab === 'alimentacion_nutrigenomica' && (
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Plan de Alimentación Nutrigenómica
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Plan nutricional basado en el perfil genético y necesidades del paciente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainContent>
      
      <ThemeToggle />
    </div>
  );
}
