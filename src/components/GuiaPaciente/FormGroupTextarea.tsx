// src/components/GuiaPaciente/FormGroupTextarea.tsx
import { ChangeEvent } from 'react';
import { cn } from '@/utils/helpers';
import TextareaAutosize from 'react-textarea-autosize'; // Usamos el que ya tenías

interface FormGroupTextareaProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  fullWidth?: boolean;
}

export default function FormGroupTextarea({
  label, id, name, value, onChange, placeholder, required, disabled, rows, minRows = 2, maxRows = 6, className, labelClassName, textareaClassName, fullWidth
}: FormGroupTextareaProps) {
  return (
    <div className={cn("mb-4", fullWidth && "sm:col-span-2", className)}>
      <label htmlFor={id} className={cn("block text-sm font-medium text-light-text-medium dark:text-dark-text-medium mb-1", labelClassName)}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <TextareaAutosize
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        minRows={minRows}
        maxRows={maxRows}
        className={cn(
          "w-full p-2.5 border border-light-border dark:border-dark-border rounded-md",
          "bg-light-bg-card dark:bg-dark-bg-card text-light-text dark:text-dark-text",
          "focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light",
          "disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed",
          "resize-none", // TextareaAutosize maneja el resize
          textareaClassName
        )}
      />
    </div>
  );
}