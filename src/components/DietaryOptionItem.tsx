// src/components/Historias/DietaryOptionItem.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/utils/helpers';
import { DietaryOption } from '@/types';

interface DietaryOptionItemProps {
  option: DietaryOption;
  onToggleChecked: (id: string) => void;
  onEdit: (option: DietaryOption) => void;
  onDelete: (id: string) => void;
}

export default function DietaryOptionItem({
  option,
  onToggleChecked,
  onEdit,
  onDelete,
}: DietaryOptionItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200 ease-in-out",
        "bg-light-bg-card dark:bg-dark-bg-card border-light-border dark:border-dark-border",
        "hover:shadow-md hover:border-primary/50 dark:hover:border-primary-light/50"
      )}
    >
      <input
        type="checkbox"
        id={`diet-opt-${option.id}`}
        checked={option.isChecked}
        onChange={() => onToggleChecked(option.id)}
        className="h-5 w-5 accent-primary text-primary focus:ring-primary rounded flex-shrink-0"
      />
      <label
        htmlFor={`diet-opt-${option.id}`}
        className="flex-grow text-sm text-light-text dark:text-dark-text cursor-pointer"
      >
        {option.text}
      </label>
      <div className="flex-shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(option)}
          className="p-1.5 text-primary/80 hover:text-primary dark:text-primary-light/80 dark:hover:text-primary-light focus:outline-none"
          title="Editar opción"
        >
          <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(option.id)}
          className="p-1.5 text-danger/80 hover:text-danger focus:outline-none"
          title="Eliminar opción"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}