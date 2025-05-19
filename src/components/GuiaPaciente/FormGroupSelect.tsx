// src/components/GuiaPaciente/FormGroupSelect.tsx
import { ChangeEvent, ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface FormGroupSelectProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode; // Para las <option>
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  fullWidth?: boolean;
}

export default function FormGroupSelect({
  label, id, name, value, onChange, children, required, disabled, className, labelClassName, selectClassName, fullWidth
}: FormGroupSelectProps) {
  return (
    <div className={cn("mb-4", fullWidth && "sm:col-span-2", className)}>
      <label htmlFor={id} className={cn("block text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-1", labelClassName)}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          "w-full p-2.5 border border-light-border dark:border-dark-border rounded-md",
          "bg-light-bg-card dark:bg-dark-bg-card text-light-text dark:text-dark-text",
          "focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light",
          "disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed",
          selectClassName
        )}
      >
        {children}
      </select>
    </div>
  );
}