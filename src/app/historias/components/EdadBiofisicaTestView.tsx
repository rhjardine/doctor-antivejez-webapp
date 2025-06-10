'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import EdadBiofisicaForm from '@/app/historias/components/EdadBiofisicaForm';
import { PatientBiofisicaData, BiofisicaFormData } from '@/app/historias/types/biofisica';

interface EdadBiofisicaTestViewProps {
  patientId: string;
  patientName: string;
  initialCronoAge?: number;
  onBack: () => void;
  onTestSaved?: (response?: any) => void;
  fechaNacimiento?: string;
}

export default function EdadBiofisicaTestView({ 
  patientId, 
  patientName,
  initialCronoAge = 0,
  fechaNacimiento,
  onBack,
  onTestSaved
}: EdadBiofisicaTestViewProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  
  const nameParts = patientName.split(' ');
  const primerNombre = nameParts[0] || '';
  const primerApellido = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const patientData: PatientBiofisicaData = {
    id: patientId,
    primerNombre: primerNombre,
    primerApellido: primerApellido,
    fechaNacimiento: fechaNacimiento,
  };
  
  const handleSave = async (formData: BiofisicaFormData) => {
    console.log("Guardando datos desde EdadBiofisicaTestView:", formData);
    // Lógica para llamar a la API
    const simulatedResponse = { success: true, offlineMode: false };

    if (onTestSaved) {
      onTestSaved(simulatedResponse);
    }
    
    setSaveSuccess(true);
    if (simulatedResponse.offlineMode) {
      setOfflineMode(true);
    }
    
    setTimeout(() => {
      onBack();
    }, 3000);
  };
  
  return (
    <div className="w-full">
      {saveSuccess ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="text-5xl mb-4">
            {offlineMode ? (
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {offlineMode ? "Test Guardado en Modo Sin Conexión" : "Test Guardado Exitosamente"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {offlineMode 
              ? "Los datos se han guardado localmente y se sincronizarán cuando haya conexión."
              : "Los resultados del test de edad biofísica se han guardado correctamente."}
          </p>
          <button
            onClick={onBack}
            className="bg-[#23BCEF] text-white px-6 py-2 rounded-md hover:bg-[#23BCEF]/90 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
        </div>
      ) : (
        <EdadBiofisicaForm 
          patientData={patientData}
          onSave={handleSave}
          onBack={onBack}
        />
      )}
    </div>
  );
}
