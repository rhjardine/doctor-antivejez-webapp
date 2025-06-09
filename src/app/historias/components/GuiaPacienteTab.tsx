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
import { FormGroupTextarea, FormGroupInput } from '@/components/ui/form-components';
import { 
  GuiaPacienteFormData, NutraceuticoItemData, TerapiaItem, FlorDeBachItem,
  FREQUENCY_OPTIONS_PRIMARY, FREQUENCY_OPTIONS_SECONDARY
} from '@/types/guiaPaciente';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils'; // Utility para combinar clases

interface GuiaPacienteTabProps {
  patientId?: string;
  patientData?: any; // Para mantener compatibilidad con HistoryTabs
  initialGuideData?: GuiaPacienteFormData | null;
  onSaveGuide?: (data: GuiaPacienteFormData) => Promise<void>;
}

// Datos iniciales para los selects y checkboxes
const REMOCION_ITEMS_DATA: Omit<NutraceuticoItemData, 'checked' | 'qty' | 'freq' | 'supplement'>[] = [
  { id: 'remocion_aceite_ricino', label: 'Aceite de ricino', isRemocion: true, doseInfo: 'Dosis: 30 CC (adultos) / 15 CC (niños y ancianos) - Una vez en la noche' },
  { id: 'remocion_leche_magnesia', label: 'Leche de magnesia', isRemocion: true, doseInfo: 'Dosis: 30 CC (adultos) / 15 CC (niños y ancianos) - Una vez en la noche' },
  { id: 'remocion_sal_higuera', label: 'Sal de higuera o sal de Epson', isRemocion: true, doseInfo: 'Dosis: 30 Grs en 1 litro de agua (adultos) - Una vez en la noche; Evitar en niños y ancianos debilitados' },
];

const TERAPIAS_DATA: Omit<TerapiaItem, 'checked'>[] = [
  { id: 'terapia_nino', label: 'Niño' }, 
  { id: 'terapia_antiage', label: 'Anti-envejecimiento' },
  { id: 'terapia_metabolica', label: 'Metabólica' }, 
  { id: 'terapia_citostatica', label: 'Citostática' },
  { id: 'terapia_renal', label: 'Renal' },
];

const NUTRACEUTICOS_PRIMARIOS_DATA: Omit<NutraceuticoItemData, 'checked' | 'qty' | 'freq' | 'supplement'>[] = [
  { id: 'nutra_mega_gh4', label: 'MegaGH4 (Fórmula Antienvejecimiento)' },
  { id: 'nutra_stemcell', label: 'StemCell Enhancer (Revierte la oxidación)' },
  { id: 'nutra_transfer', label: 'Transfer Tri Factor (Modulador celular)' },
  { id: 'nutra_telomeres', label: 'Telomeros (Activador de la Telomerasa)' },
];

const initialFormState: GuiaPacienteFormData = {
  patientName: 'Isabel Romero',
  date: new Date().toISOString().split('T')[0],
  remocionItems: REMOCION_ITEMS_DATA.map(item => ({ ...item, checked: false, qty: '', freq: '', supplement: '' })),
  remocionCucharadas: '',
  remocionDetoxSemanas: '',
  terapiasSeleccionadas: TERAPIAS_DATA.map(item => ({ ...item, checked: false })),
  nutraceuticosPrimarios: NUTRACEUTICOS_PRIMARIOS_DATA.map(item => ({ ...item, checked: false, qty: '', freq: '', supplement: '' })),
  activadorMetabolico: [],
  floresDeBach: [],
  nutraceuticosSecundarios: [],
  nutraceuticosComplementarios: [],
  sueros: [],
};

export default function GuiaPacienteTab({ 
  patientId, 
  patientData, 
  initialGuideData, 
  onSaveGuide = async () => {} 
}: GuiaPacienteTabProps) {
  const [formData, setFormData] = useState<GuiaPacienteFormData>(initialGuideData || initialFormState);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  useEffect(() => {
    if (initialGuideData) {
      setFormData(initialGuideData);
    } else if (patientData?.nombre) {
      setFormData(prev => ({ ...prev, patientName: patientData.nombre }));
    }
  }, [initialGuideData, patientData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      // Lógica para checkboxes se maneja en funciones específicas
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const addDynamicItem = (
    sectionKey: keyof Pick<GuiaPacienteFormData, 'nutraceuticosPrimarios' | 'activadorMetabolico' | 'nutraceuticosSecundarios' | 'nutraceuticosComplementarios' | 'sueros'>,
    baseLabel: string
  ) => {
    const newItem: NutraceuticoItemData = {
      id: `${sectionKey}_${uuidv4()}`,
      label: `Nuevo ${baseLabel}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveGuide(formData);
      setIsSendModalOpen(true);
    } catch (error) {
      console.error('Error al guardar guía:', error);
      alert('Error al guardar la guía del paciente');
    }
  };

  const generatePreviewHTML = (): string => {
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

    // Agregar más secciones según sea necesario
    return html;
  };

  // Estilos
  const containerClasses = "w-full max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl";
  const patientInfoBarClasses = "bg-blue-600 text-white p-4 sm:p-5 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center gap-3";
  const actionButtonContainerClasses = "flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700";
  const btnClasses = "px-6 py-2.5 rounded-full font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-md hover:shadow-lg";
  const btnAddClasses = "bg-green-600 text-white hover:bg-green-700 text-xs sm:text-sm px-4 py-2 mt-2 mb-3 rounded";

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit}>
        {/* Patient Info Bar */}
        <div className={patientInfoBarClasses}>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            <label htmlFor="patient-name-guide" className="font-semibold">Nombre del Paciente</label>
            <input 
              type="text" 
              id="patient-name-guide" 
              name="patientName" 
              value={formData.patientName} 
              onChange={handleInputChange}
              placeholder="Ingrese nombre"
              className="p-2 rounded-md bg-white/90 text-gray-800 text-sm focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
            <label htmlFor="date-guide">Fecha</label>
            <input 
              type="date" 
              id="date-guide" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange}
              className="p-2 rounded-md bg-white/90 text-gray-800 text-sm focus:ring-2 focus:ring-white"
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
                showQuantity={false}
                showFrequency={false}
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
            className="mt-3"
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
            className="mt-3"
          />
          
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">Terapias Aplicadas:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {formData.terapiasSeleccionadas.map(terapia => (
                <label key={terapia.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    name={terapia.id} 
                    checked={terapia.checked} 
                    onChange={(e) => handleTerapiaChange({...terapia, checked: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
          <button 
            type="button" 
            className={btnAddClasses} 
            onClick={() => addDynamicItem('nutraceuticosPrimarios', 'Nutracéutico Primario')}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1.5"/> Añadir Nutracéutico Primario
          </button>
        </CollapsibleSection>

        {/* Vista Previa */}
        {isPreviewVisible && (
          <section className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">
              <FontAwesomeIcon icon={faEye} className="mr-2"/> Vista Previa de la Guía
            </h3>
            <div dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }} className="prose prose-sm dark:prose-invert max-w-none" />
          </section>
        )}

        {/* Botones de Acción */}
        <div className={actionButtonContainerClasses}>
          <button 
            type="button" 
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className={cn(btnClasses, "bg-gray-600 text-white hover:bg-gray-700")}
          >
            <FontAwesomeIcon icon={faEye} /> {isPreviewVisible ? 'Ocultar' : 'Vista Previa'}
          </button>
          <button 
            type="submit" 
            className={cn(btnClasses, "bg-blue-600 text-white hover:bg-blue-700")}
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Guardar y Enviar
          </button>
          <button 
            type="button" 
            onClick={() => window.print()}
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