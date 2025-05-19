// src/components/GuiaPaciente/NutraceuticoItemForm.tsx
'use client';
import { ChangeEvent } from 'react';
import { cn } from '@/utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Para botón de eliminar

// Asume una interfaz para el ítem, que podría estar en types/index.ts
export interface NutraceuticoFormItem {
  id: string; // ID único para el key de React y manejo
  selected: boolean;
  label: string; // Nombre a mostrar (ej. "MegaGH4")
  keyName: string; // Nombre base para los campos del formulario (ej. "nutra_mega_gh4")
  qty: string;
  freq: string;
  customSupplement: string;
}

interface NutraceuticoItemFormProps {
  item: NutraceuticoFormItem;
  onItemChange: (updatedItem: NutraceuticoFormItem) => void;
  onRemove?: (itemId: string) => void; // Opcional, si se permite eliminar
  frequencyOptions: { value: string; label: string }[]; // Opciones para el select de frecuencia
  canBeCustom?: boolean; // Si se muestra el campo de "Suplemento personalizado"
  showRemoveButton?: boolean;
}

export default function NutraceuticoItemForm({
  item,
  onItemChange,
  onRemove,
  frequencyOptions,
  canBeCustom = true, // Por defecto, permite suplemento personalizado
  showRemoveButton = false,
}: NutraceuticoItemFormProps) {
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name.replace(`${item.keyName}_`, ''); // Obtiene 'qty', 'freq', etc.

    if (type === 'checkbox' && fieldName === 'selected') {
      onItemChange({ ...item, selected: (e.target as HTMLInputElement).checked });
    } else {
      onItemChange({ ...item, [fieldName]: value });
    }
  };

  return (
    <div className="p-3 mb-3 border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {/* Checkbox y Label */}
        <div className="flex items-center flex-grow min-w-[200px]">
          <input
            type="checkbox"
            id={`${item.keyName}_selected`}
            name={`${item.keyName}_selected`}
            checked={item.selected}
            onChange={handleChange}
            className="h-4 w-4 accent-primary text-primary focus:ring-primary border-light-border dark:border-dark-border rounded mr-2"
          />
          <label htmlFor={`${item.keyName}_selected`} className="text-sm font-medium text-light-text dark:text-dark-text">
            {item.label}
          </label>
        </div>

        {/* Cantidad */}
        <div className="flex items-center gap-1 min-w-[100px]">
          <label htmlFor={`${item.keyName}_qty`} className="sr-only">Cantidad</label>
          <input
            type="number"
            id={`${item.keyName}_qty`}
            name={`${item.keyName}_qty`}
            value={item.qty}
            onChange={handleChange}
            min="0"
            placeholder="Cant."
            disabled={!item.selected}
            className={cn(
                "w-20 p-1.5 border border-light-border dark:border-dark-border rounded-md text-sm",
                "bg-white dark:bg-dark-bg text-light-text dark:text-dark-text",
                "focus:ring-1 focus:ring-primary focus:border-primary",
                !item.selected && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        {/* Frecuencia */}
        <div className="flex items-center gap-1 min-w-[180px]">
          <label htmlFor={`${item.keyName}_freq`} className="sr-only">Frecuencia</label>
          <select
            id={`${item.keyName}_freq`}
            name={`${item.keyName}_freq`}
            value={item.freq}
            onChange={handleChange}
            disabled={!item.selected}
            className={cn(
                "w-full p-1.5 border border-light-border dark:border-dark-border rounded-md text-sm",
                "bg-white dark:bg-dark-bg text-light-text dark:text-dark-text",
                "focus:ring-1 focus:ring-primary focus:border-primary",
                !item.selected && "opacity-50 cursor-not-allowed"
            )}
          >
            <option value="">Frecuencia...</option>
            {frequencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Suplemento Personalizado (si aplica) */}
        {canBeCustom && (
          <div className="flex items-center gap-1 flex-grow min-w-[200px]">
            <label htmlFor={`${item.keyName}_customSupplement`} className="sr-only">Suplemento Personalizado</label>
            <input
              type="text"
              id={`${item.keyName}_customSupplement`}
              name={`${item.keyName}_customSupplement`}
              value={item.customSupplement}
              onChange={handleChange}
              placeholder="Suplemento personalizado"
              disabled={!item.selected}
              className={cn(
                "w-full p-1.5 border border-light-border dark:border-dark-border rounded-md text-sm",
                "bg-white dark:bg-dark-bg text-light-text dark:text-dark-text",
                "focus:ring-1 focus:ring-primary focus:border-primary",
                !item.selected && "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
        )}

        {/* Botón Eliminar (si aplica) */}
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-danger hover:bg-danger/10 rounded-md disabled:opacity-50"
            title="Eliminar ítem"
            disabled={!item.selected}
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}