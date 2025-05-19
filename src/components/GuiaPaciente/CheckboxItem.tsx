// src/components/GuiaPaciente/CheckboxItem.tsx
import { ChangeEvent } from 'react';
import { cn } from '@/utils/helpers';

interface CheckboxItemProps {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  value?: string; // Opcional, si el checkbox tiene un valor específico
}

export default function CheckboxItem({
  label, id, name, checked, onChange, disabled, className, labelClassName, checkboxClassName, value
}: CheckboxItemProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        value={value}
        className={cn(
          "h-4 w-4 accent-primary text-primary focus:ring-primary border-light-border dark:border-dark-border rounded",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          checkboxClassName
        )}
      />
      <label htmlFor={id} className={cn("text-sm text-light-text dark:text-dark-text", labelClassName, disabled && "opacity-50")}>
        {label}
      </label>
    </div>
  );
}