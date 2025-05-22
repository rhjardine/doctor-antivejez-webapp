'use client';

import React from 'react';
import EdadBiofisicaForm from './EdadBiofisica/EdadBiofisicaForm';
import { BiofisicaFormData } from '../types/biofisica';

interface EdadBiofisicaTestViewProps {
  patientId: string;
  initialCronoAge?: number;
  onBack: () => void;
}

export default function EdadBiofisicaTestView({ 
  patientId, 
  initialCronoAge,
  onBack 
}: EdadBiofisicaTestViewProps) {
  
  const handleSaveTest = async (data: BiofisicaFormData) => {
    // Aquí se implementaría la lógica para guardar en el backend
    console.log('Guardando test de edad biofísica:', data);
    
    // Simulación de guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Promise.resolve();
  };
  
  return (
    <div className="w-full">
      <EdadBiofisicaForm 
        patientId={patientId}
        initialCronoAge={initialCronoAge}
        onSave={handleSaveTest}
        onBack={onBack}
      />
    </div>
  );
}