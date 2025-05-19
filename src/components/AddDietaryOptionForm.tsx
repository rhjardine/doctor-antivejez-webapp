// src/components/Historias/AddDietaryOptionForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MealCategory } from '@/types';

interface AddDietaryOptionFormProps {
  mealCategory: MealCategory; // 'breakfast', 'lunch', etc.
  onAddOption: (category: MealCategory, text: string) => void;
}

export default function AddDietaryOptionForm({ mealCategory, onAddOption }: AddDietaryOptionFormProps) {
  const [newOptionText, setNewOptionText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newOptionText.trim()) {
      onAddOption(mealCategory, newOptionText.trim());
      setNewOptionText('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex items-center gap-2 sm:gap-3 p-3 bg-light-bg dark:bg-dark-bg rounded-lg"
    >
      <input
        type="text"
        value={newOptionText}
        onChange={(e) => setNewOptionText(e.target.value)}
        placeholder={`Nueva opción de ${mealCategory === 'breakfast' ? 'desayuno' : mealCategory === 'lunch' ? 'almuerzo' : mealCategory === 'dinner' ? 'cena' : 'merienda/postre'}`}
        className="flex-grow p-2.5 border border-light-border dark:border-dark-border rounded-lg text-sm bg-light-bg-card dark:bg-dark-bg-card text-light-text dark:text-dark-text focus:ring-1 focus:ring-primary focus:border-primary outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg text-sm inline-flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
      >
        <FontAwesomeIcon icon={faPlus} />
        Agregar
      </button>
    </form>
  );
}