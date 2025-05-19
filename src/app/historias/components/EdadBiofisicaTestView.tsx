'use client';

import React, { useState } from 'react';
import BiofisicaForm from './BiofisicaForm';
import BiofisicaCharts from './BiofisicaCharts';
import { BiofisicaFormData } from '@/app/historias/types/biofisica';

interface EdadBiofisicaTestViewProps {
  patientId: string;
  onBack: () => void;
  initialCronoAge: number;
}

export default function EdadBiofisicaTestView({ patientId, onBack, initialCronoAge }: EdadBiofisicaTestViewProps) {
  const [currentFormData, setCurrentFormData] = useState<BiofisicaFormData>({
    formType: null,
    fields: [],
    chronological: initialCronoAge,
    biological: null,
    differential: null,
  });

  const handleDataCalculated = (data: BiofisicaFormData) => {
    setCurrentFormData(data);
  };

  const handleSaveData = async (data: BiofisicaFormData) => {
    console.log('EdadBiofisicaTestView - handleSaveData:', data, 'para paciente ID:', patientId);
    alert('Datos guardados (simulación)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <BiofisicaForm
        onDataCalculated={handleDataCalculated}
        onSave={handleSaveData}
        onBack={onBack}
        initialCronoAge={initialCronoAge}
      />
      <BiofisicaCharts fields={currentFormData.fields} />
    </div>
  );
}
