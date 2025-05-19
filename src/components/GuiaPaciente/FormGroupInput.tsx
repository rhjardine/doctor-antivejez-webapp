// src/components/GuiaPaciente/FormGroupInput.tsx
import { ChangeEvent } from 'react';
import { cn } from '@/utils/helpers';

interface FormGroupInputProps {
  label: string;
  id: string;
  name: string;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel';
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number | string;
  step?: number | string;
  readOnly?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean; // Para control de grid
}

export default function FormGroupInput({
  label, id, name, type = 'text', value, onChange, placeholder, required, disabled, min, step, readOnly, className, labelClassName, inputClassName, fullWidth
}: FormGroupInputProps) {
  return (
    <div className={cn("mb-4", fullWidth && "sm:col-span-2", className)}>
      <label htmlFor={id} className={cn("block text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-1", labelClassName)}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        step={step}
        readOnly={readOnly}
        className={cn(
          "w-full p-2.5 border border-light-border dark:border-dark-border rounded-md",
          "bg-light-bg-card dark:bg-dark-bg-card text-light-text dark:text-dark-text",
          "focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light",
          "disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed",
          inputClassName
        )}
      />
    </div>
  );
}