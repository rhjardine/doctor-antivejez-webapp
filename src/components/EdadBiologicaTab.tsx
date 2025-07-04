// src/app/historias/components/EdadBiologicaTab.tsx (Modificado)
'use client';

import React from 'react';
import EdadBiofisicaForm from './BiofisicaForm';
import { BiofisicaFormData } from '@/app/historias/types/biofisica';
// Importa la función de transformación
import { transformBiofisicaFormToPayload } from '@/utils/transformBiofisicaData'; // Asegura la ruta correcta

// ... (resto de imports y función showToast simulada) ...

interface EdadBiologicaTabProps {
    patientId: string;
    // otras props si son necesarias
}

const EdadBiologicaTab = ({ patientId }: EdadBiologicaTabProps) => {

    const handleSaveBiofisicaData = async (formData: BiofisicaFormData) => {
        console.log("Intentando guardar datos biofísicos:", formData);

        // --- Usar la función de transformación ---
        const payload = transformBiofisicaFormToPayload(formData);
        // Añade el patient_id al payload (puede que la función de transformación no lo reciba si es genérica)
        payload.patient_id = patientId;
        // Asegura que el nombre de la columna de edad cronológica en la DB sea correcto
        // Si en tu DB se llama `Edad_cronologica_input`, asegúrate de que el payload lo tenga así
        // o ajusta la función transformBiofisicaFormToPayload para que lo mapee correctamente.
        // Basado en tu phpMyAdmin, la columna es 'Edad_cronologica_input'.
        // Si tu formData tiene un campo 'chronological', el mapeo DEBE ser:
        // payload.Edad_cronologica_input = formData.chronological;
        // (Ya estaba en la función de transformación, pero asegúrate del casing exacto)


        try {
            const response = await fetch('/api/tests/biofisica', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // Envía el payload transformado
            });

            // ... (resto del manejo de respuesta exitosa o con error) ...

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

    // ... (resto del componente EdadBiologicaTab) ...

    return (
        <div>
            {/* ... */}
            <EdadBiofisicaForm
                patientId={patientId}
                initialCronoAge={60} // Puedes obtener esto de los datos del paciente
                onSave={handleSaveBiofisicaData}
                onBack={handleBack} // Asegúrate de implementar handleBack
            />
            {/* ... */}
        </div>
    );
};

export default EdadBiologicaTab;