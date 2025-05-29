// src/app/historias/components/GuiaPacienteTab.tsx
'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCalendarAlt, faUtensils, faCapsules, faSyringe, 
  faLeaf, faBrain, faEye, faPaperPlane, faPrint, faPlus, faSeedling
} from '@fortawesome/free-solid-svg-icons';
import CollapsibleSection from '@/components/GuiaPaciente/CollapsibleSection';
import CheckboxItem from '@/components/GuiaPaciente/CheckboxItem';
import SendGuideModal from '@/components/GuiaPaciente/SendGuideModal';
import { 
  GuiaPacienteFormData, NutraceuticoItemData, TerapiaItem, FlorDeBachItem,
  FREQUENCY_OPTIONS_PRIMARY, FREQUENCY_OPTIONS_SECONDARY
} from '@/types/guiaPaciente';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos para nuevos ítems

interface GuiaPacienteTabProps {
  patientId: string; // O el objeto Patient completo
  initialGuideData?: GuiaPacienteFormData | null; // Para cargar una guía existente
  onSaveGuide: (data: GuiaPacienteFormData) => Promise<void>;
}

// Datos iniciales para los selects y checkboxes (ejemplos)
const REMOCION_ITEMS_DATA: Omit<NutraceuticoItemData, 'checked' | 'qty' | 'freq' | 'supplement'>[] = [
  { id: 'remocion_aceite_ricino', label: 'Aceite de ricino', isRemocion: true, doseInfo: 'Dosis: 30 CC (adultos) / 15 CC (niños y ancianos) - Una vez en la noche' },
  { id: 'remocion_leche_magnesia', label: 'Leche de magnesia', isRemocion: true, doseInfo: 'Dosis: 30 CC (adultos) / 15 CC (niños y ancianos) - Una vez en la noche' },
  { id: 'remocion_sal_higuera', label: 'Sal de higuera o sal de Epson', isRemocion: true, doseInfo: 'Dosis: 30 Grs en 1 litro de agua (adultos) - Una vez en la noche; Evitar en niños y ancianos debilitados' },
];

const TERAPIAS_DATA: Omit<TerapiaItem, 'checked'>[] = [
  { id: 'terapia_nino', label: 'Niño' }, { id: 'terapia_antiage', label: 'Anti-envejecimiento' },
  { id: 'terapia_metabolica', label: 'Metabólica' }, { id: 'terapia_citostatica', label: 'Citostática' },
  { id: 'terapia_renal', label: 'Renal' },
];

// ... (Define arrays similares para NUTRACEUTICOS_PRIMARIOS_DATA, FLORES_DE_BACH_DATA, etc.
//      basados en los <label> de tu HTML original. Cada uno con 'id' y 'label')

// Ejemplo para Nutraceuticos Primarios
const NUTRACEUTICOS_PRIMARIOS_DATA: Omit<NutraceuticoItemData, 'checked' | 'qty' | 'freq' | 'supplement'>[] = [
    { id: 'nutra_mega_gh4', label: 'MegaGH4 (Fórmula Antienvejecimiento)' },
    { id: 'nutra_stemcell', label: 'StemCell Enhancer (Revierte la oxidación)' },
    { id: 'nutra_transfer', label: 'Transfer Tri Factor (Modulador celular)' },
    { id: 'nutra_telomeres', label: 'Telomeros (Activador de la Telomerasa)' },
];


const initialFormState: GuiaPacienteFormData = {
  patientName: 'Isabel Romero', // Debería venir de props o contexto
  date: new Date().toISOString().split('T')[0],
  remocionItems: REMOCION_ITEMS_DATA.map(item => ({ ...item, checked: false, qty: '', freq: '', supplement: '' })),
  remocionCucharadas: '',
  remocionDetoxSemanas: '',
  terapiasSeleccionadas: TERAPIAS_DATA.map(item => ({ ...item, checked: false })),
  nutraceuticosPrimarios: NUTRACEUTICOS_PRIMARIOS_DATA.map(item => ({ ...item, checked: false, qty: '', freq: '', supplement: '' })),
  activadorMetabolico: [/* ... define el item para Bioterápico + Bach ... */],
  floresDeBach: [/* ... mapea FLORES_DE_BACH_DATA ... */],
  nutraceuticosSecundarios: [/* ... mapea NUTRACEUTICOS_SECUNDARIOS_DATA ... */],
  nutraceuticosComplementarios: [/* ... mapea NUTRACEUTICOS_COMPLEMENTARIOS_DATA ... */],
  sueros: [/* ... mapea SUEROS_DATA ... */],
};


export default function GuiaPacienteTab({ patientId, initialGuideData, onSaveGuide }: GuiaPacienteTabProps) {
  const [formData, setFormData] = useState<GuiaPacienteFormData>(initialGuideData || initialFormState);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  useEffect(() => {
    if (initialGuideData) {
      setFormData(initialGuideData);
    } else {
      // Si necesitas cargar el nombre del paciente dinámicamente:
      // setFormData(prev => ({ ...prev, patientName: loadedPatientNameFromApi }));
    }
  }, [initialGuideData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Si es un checkbox dentro de un grupo, necesitarás una lógica más específica para actualizar el array correcto
    if (type === 'checkbox') {
        // Lógica para actualizar arrays de checkboxes (terapias, floresDeBach)
        // Esta parte se vuelve compleja y depende de cómo estructures el estado para ellos
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNutraceuticoChange = (
    section: keyof Pick<GuiaPacienteFormData, 'remocionItems' | 'nutraceuticosPrimarios' | 'activadorMetabolico' | 'nutraceuticosSecundarios' | 'nutraceuticosComplementarios' | 'sueros'>,
    updatedItem: NutraceuticoItemData
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === updatedItem.id ? updatedItem : item)
    }));
  };
  
  const handleTerapiaChange = (updatedTerapia: TerapiaItem) => {
    setFormData(prev => ({
        ...prev,
        terapiasSeleccionadas: prev.terapiasSeleccionadas.map(t => t.id === updatedTerapia.id ? updatedTerapia : t)
    }));
  };

  // ... (Funciones para añadir dinámicamente ítems a cada sección de nutracéuticos/sueros)
  // Ejemplo:
  const addDynamicItem = (
    sectionKey: keyof Pick<GuiaPacienteFormData, 'nutraceuticosPrimarios' | 'activadorMetabolico' | 'nutraceuticosSecundarios' | 'nutraceuticosComplementarios' | 'sueros'>,
    baseLabel: string
  ) => {
    const newItem: NutraceuticoItemData = {
      id: `${sectionKey}_${uuidv4()}`,
      label: `Nuevo ${baseLabel}`, // El usuario debería poder editar esto
      checked: true,
      qty: '',
      freq: '',
      supplement: '',
    };
    setFormData(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], newItem]
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones si es necesario
    onSaveGuide(formData);
    setIsSendModalOpen(true); // Abrir modal después de guardar (o después de confirmación de API)
  };

  const generatePreviewHTML = (): string => {
    // Lógica similar a tu función JS original para generar el HTML de la vista previa
    // Usando los datos de `formData`
    let html = `<p><strong>Paciente:</strong> ${formData.patientName}</p>`;
    html += `<p><strong>Fecha:</strong> ${new Date(formData.date).toLocaleDateString('es-ES')}</p><hr/>`;
    
    html += '<h4>Fase de Remoción:</h4><ul>';
    formData.remocionItems.filter(i => i.checked).forEach(item => {
        html += `<li>${item.label}: ${item.doseInfo || ''}</li>`;
    });
    if (formData.remocionCucharadas) html += `<li>Cucharadas al acostarse: ${formData.remocionCucharadas}</li>`;
    if (formData.remocionDetoxSemanas) html += `<li>Detoxificación Alcalina: ${formData.remocionDetoxSemanas} semana(s)</li>`;
    const terapiasActivas = formData.terapiasSeleccionadas.filter(t => t.checked).map(t => t.label);
    if (terapiasActivas.length) html += `<li>Terapias: ${terapiasActivas.join(', ')}</li>`;
    html += '</ul>';

    // ... (Repetir para las otras secciones: Primarios, Activador, Secundarios, Complementarios, Sueros)
    // Adaptando la lógica para obtener los datos de los arrays correspondientes en formData
    // y formateando el string HTML.
    
    return html;
  };

  // Estilos de Tailwind para replicar los de tu CSS
  const containerClasses = "w-full max-w-5xl mx-auto p-6 bg-white dark:bg-bg-card-dark rounded-lg shadow-xl";
  const patientInfoBarClasses = "bg-primary text-white p-4 sm:p-5 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-3";
  const actionButtonContainerClasses = "flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-8 pt-6 border-t border-border-light dark:border-border-dark";
  const btnClasses = "px-6 py-2.5 rounded-full font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-md hover:shadow-lg";
  const btnAddClasses = "bg-success text-white hover:bg-success/90 text-xs sm:text-sm px-4 py-2 mt-2 mb-3";
  const mealSectionClasses = "bg-primary rounded-lg p-4 sm:p-5 mb-6 shadow-lg";
  const mealSectionTitleClasses = "text-white text-lg sm:text-xl font-semibold flex items-center gap-2 mb-4";
  const mealOptionsContainerClasses = "bg-gray-50 dark:bg-gray-800 rounded-md p-3 sm:p-4 mb-3";


  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit}>
        {/* Patient Info Bar */}
        <div className={patientInfoBarClasses}>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            <label htmlFor="patient-name-guide" className="font-semibold">Nombre del Paciente</label>
            <input 
              type="text" id="patient-name-guide" name="patientName" 
              value={formData.patientName} onChange={handleInputChange}
              placeholder="Ingrese nombre"
              className="p-2 rounded-md bg-white/90 text-secondary text-sm focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
            <label htmlFor="date-guide">Fecha</label>
            <input type="date" id="date-guide" name="date" 
              value={formData.date} onChange={handleInputChange}
              className="p-2 rounded-md bg-white/90 text-secondary text-sm focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        {/* Fase de Remoción */}
        <CollapsibleSection title="Fase de Remoción" icon={<FontAwesomeIcon icon={faSeedling} />} defaultOpen>
          <div className="space-y-3">
            {formData.remocionItems.map(item => (
              <CheckboxItem 
                key={item.id} 
                item={item} 
                onChange={(updatedItem) => handleNutraceuticoChange('remocionItems', updatedItem)}
                isRemocionItem={true}
                showQuantity={false} // No tienen cantidad editable
                showFrequency={false} // No tienen frecuencia editable
              />
            ))}
          </div>
          <FormGroupTextarea
            label="Cucharadas al acostarse (1 sola vez):"
            name="remocionCucharadas"
            value={formData.remocionCucharadas}
            onChange={handleInputChange}
            rows={2}
            placeholder="Indicar producto y dosis..."
            labelClassName="text-sm font-medium text-text-light-base dark:text-text-dark-base mt-3"
            textareaClassName="mt-1"
          />
          <FormGroupInput
            label="Detoxificación Alcalina Vegetariana (Semanas):"
            name="remocionDetoxSemanas"
            type="number"
            value={formData.remocionDetoxSemanas}
            onChange={handleInputChange}
            min="0"
            step="1"
            placeholder="Ej: 1"
            labelClassName="text-sm font-medium text-text-light-base dark:text-text-dark-base mt-3"
            inputClassName="mt-1"
          />
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-text-light-base dark:text-text-dark-base">Terapias Aplicadas:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {formData.terapiasSeleccionadas.map(terapia => (
                <label key={terapia.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={terapia.id} 
                    checked={terapia.checked} 
                    onChange={(e) => handleTerapiaChange({...terapia, checked: e.target.checked })}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span>{terapia.label}</span>
                </label>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Nutraceuticos Primarios */}
        <CollapsibleSection title="Nutracéuticos Primarios" icon={<FontAwesomeIcon icon={faCapsules} />}>
          <div className="space-y-3">
            {formData.nutraceuticosPrimarios.map(item => (
              <CheckboxItem 
                key={item.id} 
                item={item} 
                onChange={(updatedItem) => handleNutraceuticoChange('nutraceuticosPrimarios', updatedItem)}
                frequencyOptions={FREQUENCY_OPTIONS_PRIMARY}
                showCustomSupplement={true}
              />
            ))}
          </div>
           <button type="button" className={cn(btnAddClasses, "mt-3")} onClick={() => addDynamicItem('nutraceuticosPrimarios', 'Nutracéutico Primario')}>
            <FontAwesomeIcon icon={faPlus} className="mr-1.5"/> Añadir Nutracéutico Primario
          </button>
        </CollapsibleSection>

        {/* TODO: Implementar secciones para Activador Metabólico (con Flores de Bach), Secundarios, Complementarios y Sueros */}
        {/* Sigue el mismo patrón que Nutraceuticos Primarios, usando CollapsibleSection y CheckboxItem */}
        {/* Para Flores de Bach, podrías tener un CheckboxItem sin cantidad/frecuencia o un componente más simple */}


        {/* Vista Previa (Opcional, si quieres mantenerla) */}
        {isPreviewVisible && (
          <section className="mt-6 p-4 border border-border-light dark:border-border-dark rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-3 text-primary"><FontAwesomeIcon icon={faEye} className="mr-2"/> Vista Previa de la Guía</h3>
            <div dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }} className="prose prose-sm dark:prose-invert max-w-none" />
          </section>
        )}

        {/* Botones de Acción */}
        <div className={actionButtonContainerClasses}>
          <button 
            type="button" 
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className={cn(btnClasses, "bg-secondary text-white hover:bg-secondary-light")}
          >
            <FontAwesomeIcon icon={faEye} /> {isPreviewVisible ? 'Ocultar' : 'Vista Previa'}
          </button>
          <button 
            type="submit" 
            className={cn(btnClasses, "bg-primary text-white hover:bg-primary-darker")}
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Guardar y Enviar
          </button>
          <button 
            type="button" 
            onClick={() => { /* Lógica de impresión */ window.print(); }}
            className={cn(btnClasses, "bg-gray-600 text-white hover:bg-gray-700")}
          >
            <FontAwesomeIcon icon={faPrint} /> Imprimir
          </button>
        </div>
      </form>

      <SendGuideModal 
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSendWhatsapp={() => console.log("Enviar por WhatsApp")}
        onSendEmail={() => console.log("Enviar por Email")}
        onSendToApp={() => console.log("Enviar a App Paciente")}
      />
    </div>
  );
}