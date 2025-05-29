'use client';

import React from 'react';
import EdadBiofisicaForm from './BiofisicaForm';
import { BiofisicaFormData } from '@/app/historias/types/biofisica';
import { transformBiofisicaFormToPayload } from '@/utils/transformBiofisicaData';
import { showToast } from '@/utils/toast';

interface EdadBiologicaTabProps {
    patientId: string;
}

const EdadBiologicaTab = ({ patientId }: EdadBiologicaTabProps) => {
    const handleSaveBiofisicaData = async (formData: BiofisicaFormData) => {
        console.log("Intentando guardar datos biofísicos:", formData);
        const payload = transformBiofisicaFormToPayload(formData);
        payload.patient_id = patientId;

        try {
            const response = await fetch('/api/tests/biofisica', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocurrió un error en el servidor al guardar.');
            }

            const successData = await response.json();
            showToast('Guardado Exitoso', successData.message || 'Datos del test guardados.', 'success');
            console.log('Save success:', successData);

        } catch (error: any) {
            showToast('Error al Guardar', error.message || 'Error de conexión o servidor.', 'error');
            console.error('Error saving biofisica data:', error);
            throw error;
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