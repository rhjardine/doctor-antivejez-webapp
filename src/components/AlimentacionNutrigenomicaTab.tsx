// src/components/Historias/AlimentacionNutrigenomicaTab.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCoffee, faMoon, faAppleAlt, faPaperPlane, faPrint } from '@fortawesome/free-solid-svg-icons'; // Ajusta iconos
import { cn } from '@/utils/helpers';
import { DietaryOption, MealCategory, DietaryPlan, BloodTypeFilter } from '@/types';
import { INITIAL_DIETARY_OPTIONS, BLOOD_TYPE_OPTIONS } from '@/utils/constants'; // Asume que están en constants
import DietarySection from './DietarySection';
// import SendDietModal from './SendDietModal'; // A crear
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs

interface AlimentacionNutrigenomicaTabProps {
  patientId: string;
  // Podrías pasar un plan dietario inicial si se carga desde API
  // initialDietaryPlan?: DietaryPlan;
}

export default function AlimentacionNutrigenomicaTab({ patientId }: AlimentacionNutrigenomicaTabProps) {
  const [dietaryPlan, setDietaryPlan] = useState<DietaryPlan>(INITIAL_DIETARY_OPTIONS);
  const [selectedBloodType, setSelectedBloodType] = useState<BloodTypeFilter>('all');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const handleOptionToggle = useCallback((category: MealCategory, optionId: string) => {
    setDietaryPlan(prevPlan => ({
      ...prevPlan,
      [category]: prevPlan[category].map(opt =>
        opt.id === optionId ? { ...opt, isChecked: !opt.isChecked } : opt
      ),
    }));
  }, []);

  const handleOptionAdd = useCallback((category: MealCategory, text: string) => {
    const newOption: DietaryOption = {
      id: uuidv4(),
      text,
      bloodTypeTarget: selectedBloodType, // O un selector para el nuevo item
      isChecked: true, // Por defecto chequeado al añadir
    };
    setDietaryPlan(prevPlan => ({
      ...prevPlan,
      [category]: [...prevPlan[category], newOption],
    }));
  }, [selectedBloodType]);

  const handleOptionEdit = useCallback((category: MealCategory, updatedOption: DietaryOption) => {
    setDietaryPlan(prevPlan => ({
      ...prevPlan,
      [category]: prevPlan[category].map(opt =>
        opt.id === updatedOption.id ? updatedOption : opt
      ),
    }));
  }, []);

  const handleOptionDelete = useCallback((category: MealCategory, optionId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta opción?')) {
      setDietaryPlan(prevPlan => ({
        ...prevPlan,
        [category]: prevPlan[category].filter(opt => opt.id !== optionId),
      }));
      // Aquí podrías mostrar un toast de éxito
    }
  }, []);

  const handleSavePlan = () => {
    console.log("Plan Alimentario Guardado:", dietaryPlan);
    // Lógica para enviar a API
    alert('Plan alimentario guardado (simulación).');
  };

  const getDietaryGuideSummary = () => {
    // Implementa la lógica para generar un resumen del plan seleccionado
    let summary = "Resumen del Plan Alimentario:\n";
    Object.entries(dietaryPlan).forEach(([category, options]) => {
        const selected = options.filter(opt => opt.isChecked && (selectedBloodType === 'all' || opt.bloodTypeTarget === selectedBloodType));
        if (selected.length > 0) {
            summary += `\n${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
            selected.forEach(opt => summary += `- ${opt.text}\n`);
        }
    });
    return summary;
  };

  const mealSections: { category: MealCategory; title: string; icon: IconProp }[] = [
    { category: 'breakfast', title: 'Desayuno', icon: faCoffee },
    { category: 'lunch', title: 'Almuerzo', icon: faUtensils },
    { category: 'dinner', title: 'Cena', icon: faMoon },
    { category: 'snacks', title: 'Meriendas/Postres', icon: faAppleAlt },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-text-dark dark:text-dark-text">
        Alimentación Nutrigenómica
      </h3>

      {/* Selector de Tipo Sanguíneo */}
      <div className="mb-6">
        <label htmlFor="blood-type-select" className="block text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-1">
          Seleccionar Tipo Sanguíneo para Filtrar/Añadir:
        </label>
        <select
          id="blood-type-select"
          value={selectedBloodType}
          onChange={(e) => setSelectedBloodType(e.target.value as BloodTypeFilter)}
          className="w-full sm:w-auto p-2.5 border border-light-border dark:border-dark-border rounded-lg text-sm bg-light-bg-card dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-1 focus:ring-primary focus:border-primary outline-none"
        >
          {BLOOD_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Secciones de Comida */}
      {mealSections.map(({ category, title, icon }) => (
        <DietarySection
          key={category}
          title={title}
          icon={icon}
          options={dietaryPlan[category]}
          mealCategory={category}
          bloodTypeFilter={selectedBloodType}
          onOptionToggle={handleOptionToggle}
          onOptionAdd={handleOptionAdd}
          onOptionEdit={handleOptionEdit}
          onOptionDelete={handleOptionDelete}
        />
      ))}

      {/* Botones de Acción Globales */}
      <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleSavePlan}
          className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
        >
          Guardar Plan Alimentario
        </button>
        <button
          type="button"
          onClick={() => setIsSendModalOpen(true)}
          className="px-6 py-2.5 rounded-full bg-secondary text-white font-semibold hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card transition-colors shadow-md hover:shadow-lg w-full sm:w-auto inline-flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Enviar al Paciente
        </button>
        <button
          type="button"
          onClick={() => window.print()} // Simplificado, podrías generar un PDF más formateado
          className="px-6 py-2.5 rounded-full border border-secondary text-secondary hover:bg-secondary/10 font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors shadow-sm hover:shadow"
        >
          <FontAwesomeIcon icon={faPrint} /> Imprimir
        </button>
      </div>

      {/* Modal de Envío (Placeholder) */}
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-text-dark dark:text-dark-text">Enviar Guía Alimentaria</h3>
            <p className="text-sm text-text-medium dark:text-dark-text-medium mb-4">
              Resumen: {getDietaryGuideSummary().substring(0, 100)}...
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">WhatsApp</button>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Email</button>
              <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">App Paciente (Próximamente)</button>
            </div>
            <button
              onClick={() => setIsSendModalOpen(false)}
              className="mt-6 w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-text-medium dark:text-dark-text-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}