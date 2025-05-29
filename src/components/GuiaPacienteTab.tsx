// src/components/GuiaPacienteTab.tsx
/*'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react'; // Asegúrate que useState y useCallback estén aquí
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Importa TODOS los iconos que usarás directamente en este archivo
import {
  faEye, faPaperPlane, faPlus, faDumbbell, faBrain, faHeartPulse, faLeaf, faSyringe,
  faBolt, faCapsules, faUser, faCalendar // Añadidos faUser y faCalendar para PatientInfoBar
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/utils/helpers';

// Importa los subcomponentes desde la subcarpeta GuiaPaciente
import CollapsibleSection from './GuiaPaciente/CollapsibleSection';
import FormGroupInput from './GuiaPaciente/FormGroupInput';
import FormGroupTextarea from './GuiaPaciente/FormGroupTextarea';
import CheckboxItem from './GuiaPaciente/CheckboxItem';
import NutraceuticoItemForm, { NutraceuticoFormItem } from './GuiaPaciente/NutraceuticoItemForm';
import PatientInfoBar from './GuiaPaciente/PatientInfoBar';
// import SendGuideModal from './GuiaPaciente/SendGuideModal'; // A crear
// import PreviewSection from './GuiaPaciente/PreviewSection'; // A crear

// Tipos (pueden ir a src/types/index.ts)
interface TerapiaOption { id: string; label: string; }
interface FrequencyOption { value: string; label: string; }

// Opciones para selects (idealmente desde src/utils/constants.ts)
const terapiaOptions: TerapiaOption[] = [
  { id: 'nino', label: 'Niño' }, { id: 'antiage', label: 'Anti-envejecimiento' },
  { id: 'metabolica', label: 'Metabólica' }, { id: 'citostatica', label: 'Citostática' },
  { id: 'renal', label: 'Renal' },
];

const frequencyOptionsSimple: FrequencyOption[] = [
  { value: '', label: 'Frecuencia...' }, { value: 'manana', label: 'Mañana' }, { value: 'noche', label: 'Noche' },
  { value: 'antes_desayuno', label: '30 min antes de Desayuno' }, { value: 'antes_cena', label: '30 min antes de Cena' },
  { value: 'antes_desayuno_cena', label: '30 min antes Desayuno y Cena' }, { value: 'antes_ejercicio', label: 'Antes del Ejercicio' },
  { value: 'despues_ejercicio', label: 'Después del Ejercicio' }, { value: 'otros', label: 'Otros (especificar)' },
];

const frequencyOptionsDosis: FrequencyOption[] = [
    { value: '', label: 'Frecuencia...' }, { value: 'dia', label: 'Día' }, { value: 'semana', label: 'Semana' },
    { value: 'quincena', label: 'Quincena' }, { value: 'mes', label: 'Mes' },
    ...frequencyOptionsSimple.slice(5) // Reutiliza algunas opciones
];

const sistemasActivadorOptions: TerapiaOption[] = [ /* ... COMPLETA ESTO DESDE TU HTML ... */ {id: 'cardiovascular', label: 'Cardiovascular'} ];
const floresDeBachOptions: TerapiaOption[] = [ /* ... COMPLETA ESTO DESDE TU HTML ... */ {id: 'agrimonia', label: 'Agrimonia'} ];


interface GuiaFormData {
  patientName: string;
  date: string;
  remocion_aceite_ricino_selected: boolean;
  remocion_leche_magnesia_selected: boolean;
  remocion_sal_higuera_selected: boolean;
  remocion_cucharadas: string;
  remocion_detox_semanas: string;
  remocion_terapias: string[];
  nutraceuticosPrimarios: NutraceuticoFormItem[];
  activadorMetabolico_bioterapico_selected: boolean;
  activadorMetabolico_bioterapico_qty: string;
  activadorMetabolico_bioterapico_freq: string;
  activadorMetabolico_bioterapico_supplement: string;
  activadorMetabolico_sistemas: string[];
  activadorMetabolico_floresDeBach: string[];
  nutraceuticosSecundarios: NutraceuticoFormItem[];
  nutraceuticosComplementarios: NutraceuticoFormItem[];
  sueros: NutraceuticoFormItem[];
}

type NutraceuticoSectionKey = 'nutraceuticosPrimarios' | 'nutraceuticosSecundarios' | 'nutraceuticosComplementarios' | 'sueros';

export default function GuiaPacienteTab({ patientId }: { patientId: string }) {
  const [formData, setFormData] = useState<GuiaFormData>({
    patientName: 'Isabel Romero',
    date: new Date().toISOString().split('T')[0],
    remocion_aceite_ricino_selected: false,
    remocion_leche_magnesia_selected: false,
    remocion_sal_higuera_selected: false,
    remocion_cucharadas: '',
    remocion_detox_semanas: '',
    remocion_terapias: [],
    nutraceuticosPrimarios: [
      { id: 'np1', selected: false, label: 'MegaGH4 (Fórmula Antienvejecimiento)', keyName: 'nutra_mega_gh4', qty: '', freq: '', customSupplement: '' },
      { id: 'np2', selected: false, label: 'StemCell Enhancer (Revierte la oxidación)', keyName: 'nutra_stemcell', qty: '', freq: '', customSupplement: '' },
      { id: 'np3', selected: false, label: 'Transfer Tri Factor (Modulador celular)', keyName: 'nutra_transfer', qty: '', freq: '', customSupplement: '' },
      { id: 'np4', selected: false, label: 'Telomeros (Activador de la Telomerasa)', keyName: 'nutra_telomeres', qty: '', freq: '', customSupplement: '' },
    ],
    activadorMetabolico_bioterapico_selected: false,
    activadorMetabolico_bioterapico_qty: '',
    activadorMetabolico_bioterapico_freq: '',
    activadorMetabolico_bioterapico_supplement: '',
    activadorMetabolico_sistemas: [],
    activadorMetabolico_floresDeBach: [],
    nutraceuticosSecundarios: [ /* ... COMPLETA CON DATOS INICIALES DEL HTML ... */ { id: 'ns_init_1', selected: false, label: 'Digestivo...', keyName: 'nutra_digestivo', qty: '', freq: '', customSupplement: '' } ],
    nutraceuticosComplementarios: [ /* ... COMPLETA CON DATOS INICIALES DEL HTML ... */ { id: 'nc_init_1', selected: false, label: 'Aloe Vera...', keyName: 'nutra_aloe_vera', qty: '', freq: '', customSupplement: '' } ],
    sueros: [ /* ... COMPLETA CON DATOS INICIALES DEL HTML ... */ { id: 's_init_1', selected: false, label: 'Antianémico...', keyName: 'suero_antianemico', qty: '', freq: '', customSupplement: '' } ],
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isChecked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => {
      const fieldName = name;
      if (fieldName.startsWith('remocion_terapia_')) {
        const terapiaValue = (e.target as HTMLInputElement).value;
        const currentTerapias = prev.remocion_terapias || [];
        return { ...prev, remocion_terapias: isChecked ? [...currentTerapias, terapiaValue] : currentTerapias.filter(t => t !== terapiaValue) };
      }
      if (fieldName.startsWith('activador_sistema_')) {
        const sistemaValue = (e.target as HTMLInputElement).value;
        const currentSistemas = prev.activadorMetabolico_sistemas || [];
        return { ...prev, activadorMetabolico_sistemas: isChecked ? [...currentSistemas, sistemaValue] : currentSistemas.filter(s => s !== sistemaValue) };
      }
      if (fieldName.startsWith('activador_flor_')) {
        const florValue = (e.target as HTMLInputElement).value;
        const currentFlores = prev.activadorMetabolico_floresDeBach || [];
        return { ...prev, activadorMetabolico_floresDeBach: isChecked ? [...currentFlores, florValue] : currentFlores.filter(f => f !== florValue) };
      }
      return { ...prev, [fieldName]: type === 'checkbox' ? isChecked : value };
    });
  }, []);

  const handleNutraceuticoChange = useCallback((index: number, updatedItem: NutraceuticoFormItem, section: NutraceuticoSectionKey) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as NutraceuticoFormItem[]).map((item, i) => i === index ? updatedItem : item),
    }));
  }, []);

  const addNutraceutico = useCallback((section: NutraceuticoSectionKey, defaultLabelPrefix: string) => {
    const newItem: NutraceuticoFormItem = {
      id: `new_${section}_${Date.now()}`, selected: true, label: `Nuevo ${defaultLabelPrefix} (Editar)`,
      keyName: `custom_${section}_${Date.now()}`, qty: '', freq: '', customSupplement: ''
    };
    setFormData(prev => ({ ...prev, [section]: [...(prev[section] as NutraceuticoFormItem[]), newItem] }));
  }, []);

  const removeNutraceutico = useCallback((id: string, section: NutraceuticoSectionKey) => {
     setFormData(prev => ({ ...prev, [section]: (prev[section] as NutraceuticoFormItem[]).filter(item => item.id !== id) }));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Formulario Guardado (simulado):", formData);
    alert("Guía guardada y enviada (simulación)!");
  };

  const generatePreviewContent = () => {
    // Implementar lógica completa de previsualización
    return `<p><strong>Paciente:</strong> ${formData.patientName || 'N/A'}</p><p><strong>Fecha:</strong> ${formData.date || 'N/A'}</p><hr><p>Contenido de la guía (detalles de previsualización a implementar)...</p>`;
  };

  return (
    <div className="container mx-auto p-0 sm:p-4"> {/* Ajusta padding según necesidad */}
      <form id="patient-guide-form" onSubmit={handleSubmit}>
        <PatientInfoBar
          patientName={formData.patientName}
          onPatientNameChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>)}
          date={formData.date}
          onDateChange={(e) => handleInputChange(e as ChangeEvent<HTMLInputElement>)}
        />

        <CollapsibleSection title="Fase de Remoción" initialCollapsed={false} icon={faLeaf}>
          <div className="space-y-3">
            <CheckboxItem label="Aceite de ricino" id="remocion_aceite_ricino_selected" name="remocion_aceite_ricino_selected" checked={formData.remocion_aceite_ricino_selected} onChange={handleInputChange} />
            <CheckboxItem label="Leche de magnesia" id="remocion_leche_magnesia_selected" name="remocion_leche_magnesia_selected" checked={formData.remocion_leche_magnesia_selected} onChange={handleInputChange} />
            <CheckboxItem label="Sal de higuera o sal de Epson" id="remocion_sal_higuera_selected" name="remocion_sal_higuera_selected" checked={formData.remocion_sal_higuera_selected} onChange={handleInputChange} />
          </div>
          <FormGroupTextarea label="Cucharadas al acostarse (1 sola vez)" id="remocion_cucharadas" name="remocion_cucharadas" value={formData.remocion_cucharadas} onChange={handleInputChange} placeholder="Indicar producto y dosis..." />
          <FormGroupInput label="Detoxificación Alcalina Vegetariana (Semanas)" id="remocion_detox_semanas" name="remocion_detox_semanas" type="number" value={formData.remocion_detox_semanas} onChange={handleInputChange} placeholder="Ej: 1" />
          <div className="mt-4">
            <h4 className="text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-2">Terapias Aplicables:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {terapiaOptions.map(terapia => (
                <CheckboxItem
                  key={terapia.id} label={terapia.label} id={`remocion_terapia_${terapia.id}`} name={`remocion_terapia_${terapia.id}`}
                  value={terapia.id} checked={formData.remocion_terapias.includes(terapia.id)} onChange={handleInputChange}
                />
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Nutracéuticos Primarios" icon={faDumbbell}>
          <div className="space-y-2">
            {formData.nutraceuticosPrimarios.map((item, index) => (
              <NutraceuticoItemForm
                key={item.id} item={item} onItemChange={(updated) => handleNutraceuticoChange(index, updated, 'nutraceuticosPrimarios')}
                frequencyOptions={frequencyOptionsSimple}
                showRemoveButton={formData.nutraceuticosPrimarios.length > 1}
                onRemove={(id) => removeNutraceutico(id, 'nutraceuticosPrimarios')}
              />
            ))}
          </div>
          <button type="button" onClick={() => addNutraceutico('nutraceuticosPrimarios', 'Nutracéutico Primario')}
            className="mt-3 px-4 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md font-medium inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Añadir Nutracéutico Primario
          </button>
        </CollapsibleSection>

        <CollapsibleSection title="Activador Metabólico" icon={faBolt}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <NutraceuticoItemForm
                item={{
                  id: 'activador_bioterapico', selected: formData.activadorMetabolico_bioterapico_selected,
                  label: 'Bioterápico + Bach (gotas, veces al día debajo de la lengua)', keyName: 'activadorMetabolico_bioterapico',
                  qty: formData.activadorMetabolico_bioterapico_qty, freq: formData.activadorMetabolico_bioterapico_freq,
                  customSupplement: formData.activadorMetabolico_bioterapico_supplement,
                }}
                onItemChange={(updated) => {
                  setFormData(prev => ({ ...prev,
                    activadorMetabolico_bioterapico_selected: updated.selected, activadorMetabolico_bioterapico_qty: updated.qty,
                    activadorMetabolico_bioterapico_freq: updated.freq, activadorMetabolico_bioterapico_supplement: updated.customSupplement,
                  }));
                }}
                frequencyOptions={frequencyOptionsSimple} canBeCustom={true} showRemoveButton={false}
              />
              <div className="mt-3 pl-7 space-y-2">
                <h5 className="text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-1">Sistemas:</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {sistemasActivadorOptions.map(opt => (
                    <CheckboxItem key={opt.id} label={opt.label} id={`activador_sistema_${opt.id}`} name={`activador_sistema_${opt.id}`}
                      value={opt.id} checked={formData.activadorMetabolico_sistemas.includes(opt.id)} onChange={handleInputChange}
                      disabled={!formData.activadorMetabolico_bioterapico_selected} />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-light-text dark:text-dark-text mb-2">Flores de Bach</h4>
              <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin pr-2">
                {floresDeBachOptions.map(flor => (
                  <CheckboxItem key={flor.id} label={flor.label} id={`activador_flor_${flor.id}`} name={`activador_flor_${flor.id}`}
                    value={flor.id} checked={formData.activadorMetabolico_floresDeBach.includes(flor.id)} onChange={handleInputChange}
                    disabled={!formData.activadorMetabolico_bioterapico_selected} />
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Nutracéuticos Secundarios" icon={faCapsules}>
          <div className="space-y-2">
            {formData.nutraceuticosSecundarios.map((item, index) => (
              <NutraceuticoItemForm key={item.id} item={item} onItemChange={(updated) => handleNutraceuticoChange(index, updated, 'nutraceuticosSecundarios')}
                frequencyOptions={frequencyOptionsDosis} canBeCustom={false} showRemoveButton={formData.nutraceuticosSecundarios.length > 1}
                onRemove={(id) => removeNutraceutico(id, 'nutraceuticosSecundarios')} />
            ))}
          </div>
          <button type="button" onClick={() => addNutraceutico('nutraceuticosSecundarios', 'Nutracéutico Secundario')}
            className="mt-3 px-4 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md font-medium inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Añadir Nutracéutico Secundario
          </button>
        </CollapsibleSection>

        <CollapsibleSection title="Nutracéuticos Complementarios" icon={faCapsules}>
          <div className="space-y-2">
            {formData.nutraceuticosComplementarios.map((item, index) => (
              <NutraceuticoItemForm key={item.id} item={item} onItemChange={(updated) => handleNutraceuticoChange(index, updated, 'nutraceuticosComplementarios')}
                frequencyOptions={frequencyOptionsDosis} canBeCustom={false} showRemoveButton={formData.nutraceuticosComplementarios.length > 1}
                onRemove={(id) => removeNutraceutico(id, 'nutraceuticosComplementarios')} />
            ))}
          </div>
          <button type="button" onClick={() => addNutraceutico('nutraceuticosComplementarios', 'Nutracéutico Complementario')}
            className="mt-3 px-4 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md font-medium inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Añadir Nutracéutico Complementario
          </button>
        </CollapsibleSection>

        <CollapsibleSection title="Sueros - Shot Antivejez" icon={faSyringe}>
          <div className="space-y-2">
            {formData.sueros.map((item, index) => (
              <NutraceuticoItemForm key={item.id} item={item} onItemChange={(updated) => handleNutraceuticoChange(index, updated, 'sueros')}
                frequencyOptions={frequencyOptionsDosis} canBeCustom={false} showRemoveButton={formData.sueros.length > 1}
                onRemove={(id) => removeNutraceutico(id, 'sueros')} />
            ))}
          </div>
          <button type="button" onClick={() => addNutraceutico('sueros', 'Suero')}
            className="mt-3 px-4 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md font-medium inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Añadir Suero
          </button>
        </CollapsibleSection>

        {isPreviewVisible && (
          <section id="patient-preview" className="mt-6 p-4 bg-light-bg dark:bg-dark-bg rounded-md border border-light-border dark:border-dark-border">
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-light flex items-center gap-2"><FontAwesomeIcon icon={faEye} /> Vista Previa de la Guía</h3>
            <div id="preview-content-react" dangerouslySetInnerHTML={{ __html: generatePreviewContent() }}></div>
          </section>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-light-border dark:border-dark-border">
          <button type="button" onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className="px-6 py-2.5 rounded-full border border-primary text-primary hover:bg-primary/10 dark:border-primary-light dark:text-primary-light dark:hover:bg-primary-light/10 font-medium inline-flex items-center gap-2 transition">
            <FontAwesomeIcon icon={faEye} /> {isPreviewVisible ? 'Ocultar Vista Previa' : 'Vista Previa'}
          </button>
          <button type="submit"
            className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark dark:hover:bg-primary-light dark:text-secondary inline-flex items-center gap-2 transition shadow-sm hover:shadow-md">
            <FontAwesomeIcon icon={faPaperPlane} /> Guardar y Enviar
          </button>
        </div>
      </form>
    </div>
  );
}