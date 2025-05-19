// src/components/Historias/DietarySection.tsx
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DietaryOption, MealCategory } from '@/types';
import DietaryOptionItem from './DietaryOptionItem';
import AddDietaryOptionForm from './AddDietaryOptionForm';
import { cn } from '@/utils/helpers';
// Importa v4 as uuidv4 si lo usas para generar IDs al añadir
import { v4 as uuidv4 } from 'uuid';


interface DietarySectionProps {
  title: string;
  icon: IconProp;
  options: DietaryOption[];
  mealCategory: MealCategory;
  bloodTypeFilter: BloodTypeFilter;
  onOptionToggle: (category: MealCategory, id: string) => void;
  onOptionAdd: (category: MealCategory, text: string) => void;
  onOptionEdit: (category: MealCategory, updatedOption: DietaryOption) => void;
  onOptionDelete: (category: MealCategory, id: string) => void;
}

export default function DietarySection({
  title, icon, options, mealCategory, bloodTypeFilter,
  onOptionToggle, onOptionAdd, onOptionEdit, onOptionDelete
}: DietarySectionProps) {
  const [editingOption, setEditingOption] = useState<DietaryOption | null>(null);
  const [editText, setEditText] = useState('');

  const filteredOptions = options.filter(opt =>
    bloodTypeFilter === 'all' || opt.bloodTypeTarget === bloodTypeFilter
  );

  const handleEdit = (option: DietaryOption) => {
    setEditingOption(option);
    setEditText(option.text);
  };

  const handleSaveEdit = () => {
    if (editingOption && editText.trim()) {
      onOptionEdit(mealCategory, { ...editingOption, text: editText.trim() });
      setEditingOption(null);
      setEditText('');
    }
  };

  return (
    <section className="mb-8 p-4 sm:p-5 bg-primary rounded-xl shadow-md"> {/* Fondo azul primario */}
      <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 pb-2 border-b-2 border-white/20">
        <FontAwesomeIcon icon={icon} className="w-5 h-5" />
        {title}
      </h4>
      {filteredOptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredOptions.map((option) =>
            editingOption?.id === option.id ? (
              // Formulario de Edición
              <div key={option.id} className="p-3 bg-light-bg-card dark:bg-dark-bg-card rounded-lg shadow space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border border-light-border dark:border-dark-border rounded-md text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="px-3 py-1 bg-success text-white text-xs rounded hover:bg-success/80">Guardar</button>
                  <button onClick={() => setEditingOption(null)} className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400">Cancelar</button>
                </div>
              </div>
            ) : (
              <DietaryOptionItem
                key={option.id}
                option={option}
                onToggleChecked={(id) => onOptionToggle(mealCategory, id)}
                onEdit={handleEdit}
                onDelete={(id) => onOptionDelete(mealCategory, id)}
              />
            )
          )}
        </div>
      ) : (
        <p className="text-center text-white/80 py-4">No hay opciones disponibles para este tipo sanguíneo.</p>
      )}
      <AddDietaryOptionForm mealCategory={mealCategory} onAddOption={onOptionAdd} />
    </section>
  );
}