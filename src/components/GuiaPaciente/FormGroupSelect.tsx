// src/components/GuiaPaciente/FormGroupSelect.tsx
import { ChangeEvent, SelectHTMLAttributes } from 'react'; // Cambiado ReactNode por SelectHTMLAttributes para mejor tipado
import { cn } from '@/utils/helpers';

// Definimos la interfaz para las opciones aquí o la importamos si es global
interface SelectOption {
  value: string;
  label: string;
}

// Actualizamos las props
interface FormGroupSelectProps extends SelectHTMLAttributes<HTMLSelectElement> { // Heredamos props nativas
  label: string;
  // id ahora es opcional, usaremos 'name' si 'id' no se provee
  id?: string; 
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[]; // <--- AÑADIMOS LA PROP 'options'
  // children ya no es necesario si usamos 'options'
  required?: boolean;
  disabled?: boolean;
  className?: string; // Para el contenedor div
  labelClassName?: string;
  selectClassName?: string;
  fullWidth?: boolean; // Esta prop parece específica de tu layout
  error?: string; // Opcional: para mensajes de error
}

export default function FormGroupSelect({
  label,
  id, // id ahora es opcional
  name,
  value,
  onChange,
  options, // <--- USAMOS 'options'
  required,
  disabled,
  className,
  labelClassName,
  selectClassName,
  fullWidth,
  error, // Para manejar errores visualmente
  ...rest // Recogemos el resto de props nativas del select
}: FormGroupSelectProps) {
  const selectId = id || name; // Usar name como fallback para id si no se provee

  return (
    <div className={cn("mb-4", fullWidth && "sm:col-span-2", className)}>
      <label 
        htmlFor={selectId} 
        className={cn(
            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", // Estilos base de etiqueta
            labelClassName
        )}
      >
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          "w-full p-2.5 border rounded-md text-sm",
          "bg-white dark:bg-gray-700", // Fondos base
          "text-gray-900 dark:text-gray-200", // Textos base
          "border-gray-300 dark:border-gray-600", // Bordes base
          "focus:ring-1 focus:ring-[#23BCEF] focus:border-[#23BCEF] outline-none", // Estilos de focus
          disabled 
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400" 
            : "hover:border-gray-400 dark:hover:border-gray-500", // Estilos de hover si no está deshabilitado
          error 
            ? "border-red-500 focus:ring-red-500 focus:border-red-500" // Estilos de error
            : "focus:ring-[#23BCEF] focus:border-[#23BCEF]",
          selectClassName
        )}
        {...rest} // Aplicar el resto de props nativas
      >
        {/* Aquí generamos las <option> a partir de la prop 'options' */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}