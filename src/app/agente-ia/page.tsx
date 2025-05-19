'use client';

import { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainContent from '@/components/Layout/MainContent';
import PatientHeader from '@/components/PatientHeader';
import TabNavigation from '@/components/TopTabNavigation';
import ChatAssistant from '@/components/ChatAssistant';
import DocumentTab from '@/components/DocumentTab';
import ThemeToggle from '@/components/ThemeToggle';
import ToastNotification from '@/components/ToastNotification';
import { AssistantTab, Toast } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function AIAgentPage() {
  const [activeTab, setActiveTab] = useState<AssistantTab>('chat');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Datos del paciente (en una app real, esto vendría de una API)
  const patient = {
    id: "458912",
    name: "Isabel Romero",
    age: 58,
    gender: "Female" as const,
    biologicalAge: 52.3,
    trend: -5.7,
    healthScore: 84,
    lastCheckup: "2023-04-12"
  };

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const newToast: Toast = {
      id: uuidv4(),
      title,
      message,
      type
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        user={{
          name: "Dr. María García",
          role: "Longevity Specialist"
        }}
      />
      
      <MainContent>
        <PatientHeader patient={patient} />
        
        <div className="mb-5 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-brain text-primary"></i>
            AI Longevity Assistant
          </h2>
        </div>
        
        <div className="bg-bg-white dark:bg-[#242F3F] rounded-lg shadow-md overflow-hidden transition-all duration-300 border border-border dark:border-[#3A4858] hover:shadow-lg">
          <TabNavigation 
            onTabChange={setActiveTab}
            initialTab="chat"
          />
          
          <div className="p-6 min-h-[500px]">
            {activeTab === 'chat' && (
              <ChatAssistant 
                patientId={patient.id} 
                initialMessages={[
                  {
                    id: '1',
                    content: 'Hola, Dr. García. Estoy listo para ayudarle con el análisis de datos médicos de Isabel. Puede subir documentos o hacer preguntas específicas.',
                    sender: 'ai',
                    timestamp: new Date()
                  }
                ]}
              />
            )}
            
            {activeTab === 'documents' && (
              <DocumentTab patientId={patient.id} />
            )}
            
            {activeTab === 'knowledge' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Base de Conocimiento</h3>
                <p className="text-text-medium dark:text-[#B8C4CF]">Aquí se mostraría contenido relevante de la base de conocimiento, estudios, etc. (Funcionalidad pendiente)</p>
              </div>
            )}
            
            {activeTab === 'analysis' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Análisis e Interpretación</h3>
                <p className="text-text-medium dark:text-[#B8C4CF]">Visualizaciones avanzadas, comparativas y análisis de datos integrados. (Funcionalidad pendiente)</p>
                <div className="max-h-[300px] mt-4 border border-border dark:border-[#3A4858] rounded-lg p-4 bg-bg-light dark:bg-[#1A2634] flex items-center justify-center">
                  <p className="text-text-light dark:text-[#8D99A4]">Gráficos de análisis (en desarrollo)</p>
                </div>
              </div>
            )}
            
            {activeTab === 'recommendations' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Recomendaciones Personalizadas</h3>
                <p className="text-text-medium dark:text-[#B8C4CF]">Recomendaciones generadas por la IA basadas en los datos del paciente. (Funcionalidad pendiente)</p>
                <ul className="mt-4 list-disc pl-5">
                  <li className="text-text-medium dark:text-[#B8C4CF] mb-2">Recomendación simulada 1...</li>
                  <li className="text-text-medium dark:text-[#B8C4CF] mb-2">Recomendación simulada 2...</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'pathways' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Análisis de Vías Metabólicas/Genéticas</h3>
                <p className="text-text-medium dark:text-[#B8C4CF]">Visualización interactiva de vías relevantes. (Funcionalidad pendiente)</p>
                <div className="min-h-[300px] mt-4 bg-bg-light dark:bg-[#1A2634] border border-dashed border-border dark:border-[#3A4858] flex items-center justify-center text-text-light dark:text-[#8D99A4]">
                  Visualización de Vía (en desarrollo)
                </div>
              </div>
            )}
          </div>
        </div>
      </MainContent>
      
      <ThemeToggle />
      
      {/* Contenedor de Toasts */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map(toast => (
          <ToastNotification 
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}