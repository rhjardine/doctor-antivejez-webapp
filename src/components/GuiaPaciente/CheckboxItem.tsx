// src/components/GuiaPaciente/CheckboxItem.tsx
'use client';
import React, { ChangeEvent } from 'react';
import { NutraceuticoItemData, FREQUENCY_OPTIONS_PRIMARY, FREQUENCY_OPTIONS_SECONDARY } from '@/types/guiaPaciente'; // O desde constants si moviste las opciones
import { cn } from '@/utils/helpers';

interface CheckboxItemProps {
  item: NutraceuticoItemData;
  onChange: (updatedItem: NutraceuticoItemData) => void;
  frequencyOptions?: { value: string; label: string }[]; // Para permitir diferentes listas de frecuencia
  showQuantity?: boolean;
  showFrequency?: boolean;
  showCustomSupplement?: boolean;
  isRemocionItem?: boolean; // Para manejar el span de dosis estático
}

export default function CheckboxItem({
  item,
  onChange,
  frequencyOptions, // Usa esto si se pasa, sino usa uno por defecto
  showQuantity = true,
  showFrequency = true,
  showCustomSupplement = false, // Por defecto no se muestra
  isRemocionItem = false,
}: CheckboxItemProps) {
  
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...item, checked: e.target.checked });
  };

  const handleInputChange = (field: keyof NutraceuticoItemData, value: string) => {
    onChange({ ...item, [field]: value });
  };

  const defaultFrequencyOptions = item.id.includes('nutra_primario') || item.id.includes('activador_metabolico')
    ? FREQUENCY_OPTIONS_PRIMARY
    : FREQUENCY_OPTIONS_SECONDARY;
  
  const currentFrequencyOptions = frequencyOptions || defaultFrequencyOptions;

  const inputClasses = "p-2 border border-border-light dark:border-border-dark rounded-md text-sm bg-white dark:bg-gray-700 text-text-light-base dark:text-text-dark-base focus:ring-1 focus:ring-primary focus:border-primary shadow-sm";

  return (
    <div className="py-2.5 px-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border-b border-border-light/50 dark:border-border-dark/50 last:border-b-0">
      <div className="flex items-center flex-grow min-w-0"> {/* min-w-0 para que el label no empuje otros elementos */}
        <input
          type="checkbox"
          id={item.id}
          name={item.id}
          checked={item.checked}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 accent-primary mr-2 sm:mr-3 flex-shrink-0"
        />
        <label htmlFor={item.id} className="text-sm font-medium text-text-light-base dark:text-text-dark-base cursor-pointer truncate" title={item.label}>
          {item.label}
        </label>
      </div>

      {isRemocionItem && item.doseInfo && (
        <span className="ml-0 sm:ml-auto text-xs bg-primary/10 text-primary py-1 px-2 rounded-md flex-shrink-0 whitespace-nowrap">
          {item.doseInfo}
        </span>
      )}

      {!isRemocionItem && (
        <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0 flex-wrap sm:flex-nowrap sm:ml-auto flex-shrink-0">
          {showQuantity && (
            <input
              type="number"
              value={item.qty}
              onChange={(e) => handleInputChange('qty', e.target.value)}
              min="0"
              placeholder="Cant."
              className={cn(inputClasses, "w-20 sm:w-[70px]")}
              disabled={!item.checked}
            />
          )}
          {showFrequency && (
            <select
              value={item.freq}
              onChange={(e) => handleInputChange('freq', e.target.value)}
              className={cn(inputClasses, "w-full sm:w-40 lg:w-48")} // Ancho ajustado
              disabled={!item.checked}
            >
              {currentFrequencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          {showCustomSupplement && (
            <input
              type="text"
              value={item.supplement || ''}
              onChange={(e) => handleInputChange('supplement', e.target.value)}
              placeholder="Suplemento personalizado"
              className={cn(inputClasses, "w-full sm:w-40 lg:w-48")} // Ancho ajustado
              disabled={!item.checked}
            />
          )}
        </div>
      )}
    </div>
  );
}