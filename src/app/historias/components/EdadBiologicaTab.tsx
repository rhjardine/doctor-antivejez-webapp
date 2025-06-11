'use client';

import React from 'react';
import EdadBiofisicaForm from './EdadBiofisicaForm';
import { BiofisicaFormData } from '@/app/historias/types/biofisica';
import { transformBiofisicaFormToPayload } from '@/utils/transformBiofisicaData';
import { showToast } from '@/utils/toast';

interface EdadBiologicaTabProps {
    patientId: string;
}

const EdadBiologicaTab = ({ patientId }: EdadBiologicaTabProps) => {
    const handleSaveBiofisicaData = async (formData: BiofisicaFormData) => {
        // El payload debe coincidir con el modelo `BiophysicsTest` de Prisma
        const payload = {
            patientId: patientId,
            chronological_age: formData.chronological,
            biological_age: formData.biological,
            differential_age: formData.differential,
            form_data: formData.fields, // Guardamos el detalle como JSON
        };

        try {
            // APUNTAR A LA RUTA CORRECTA
            const response = await fetch('/api/biophysics-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar el test biofísico.');
            }

            // ... manejo de éxito
        } catch (error: any) {
            // ... manejo de error
        }
    };

    const handleBack = () => {
        // Implementar lógica de retorno
    };

    return (
        <div>
            <EdadBiofisicaForm
                patientId={patientId}
                initialCronoAge={60}
                onSave={handleSaveBiofisicaData}
                onBack={handleBack}
            />
        </div>
    );
};

export default EdadBiologicaTab; 