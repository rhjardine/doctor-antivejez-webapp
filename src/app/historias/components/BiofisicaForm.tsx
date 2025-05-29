// src/app/historias/components/BiofisicaForm.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Añadido useCallback
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { 
  BiofisicaFormData, 
  BiofisicaField,
  GENDER_OPTIONS // Asegúrate que GENDER_OPTIONS esté definido y exportado
} from '@/app/historias/types/biofisica'; // Ajusta la ruta
import { PatientBiofisicaData } from '@/app/historias/types/biofisica';

import { 
  getFatName, 
  getAbsoluteResult, 
  getDimensionsResult, 
  getTextForDifferential, // Importado de tu código
  calculationBoards 
} from '@/utils/biofisicaCalculations';

// Importar la nueva lógica de colores cualitativos
import { getQualitativeColor, QUALITATIVE_COLORS } from '@/utils/biofisicaQualitativeRanges'; // Ajusta la ruta

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface EdadBiofisicaFormProps {
  patientData: PatientBiofisicaData;
  initialFormData?: BiofisicaFormData | null;
  onSave?: (formData: BiofisicaFormData) => Promise<void>;
  onBack: () => void;
}

const calculateChronologicalAge = (birthDateString: string | null): number | null => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

export default function EdadBiofisicaForm({ 
  patientData, 
  initialFormData = null, 
  onSave, 
  onBack 
}: EdadBiofisicaFormProps) {
  
  const calculatedChronologicalAge = useMemo(() => 
    calculateChronologicalAge(patientData.fechaNacimiento), 
    [patientData.fechaNacimiento]
  );

  const [formData, setFormData] = useState<BiofisicaFormData>(() => {
    // ... (lógica de inicialización de formData sin cambios) ...
    if (initialFormData) {
      return {
        ...initialFormData,
        chronological: initialFormData.chronological ?? calculatedChronologicalAge,
        formType: initialFormData.formType ?? patientData.generoBiofisica,
      };
    }
    return {
      formType: patientData.generoBiofisica,
      fields: [],
      chronological: calculatedChronologicalAge,
      biological: null,
      differential: null
    };
  });
  
  const [isCalculated, setIsCalculated] = useState(!!initialFormData?.biological);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Para validación

  useEffect(() => {
    const newCronoAge = calculateChronologicalAge(patientData.fechaNacimiento);
    if (newCronoAge !== formData.chronological) {
        setFormData(prev => ({ ...prev, chronological: newCronoAge }));
    }
  }, [patientData.fechaNacimiento, formData.chronological]);

  const initializeForm = useCallback((formType: number) => {
    const fatName = getFatName(formType);
    if (!fatName) {
      setFormData(prev => ({ ...prev, fields: [] }));
      return;
    }
    const newFields: BiofisicaField[] = [
      { name: fatName, translate: '% Grasa', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
      { name: 'body_mass', translate: 'Índice de masa corporal (IMC)', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
      { name: 'digital_reflections', translate: 'Reflejos Digitales - Promedio (cm)', dimensions: true, relative_value: null, absolute_value: null, high: '', long: '', width: '' },
      { name: 'visual_accommodation', translate: 'Acomodación Visual (cm)', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
      { name: 'static_balance', translate: 'Balance Estático - Promedio (seg)', dimensions: true, relative_value: null, absolute_value: null, high: '', long: '', width: '' },
      { name: 'quaten_hydration', translate: 'Hidratación Cutánea (seg)', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
      { name: 'systolic_blood_pressure', translate: 'Sistólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
      { name: 'diastolic_blood_pressure', translate: 'Diastólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: null, long: null, width: null },
    ];
    setFormData(prev => ({ ...prev, fields: newFields, biological: null, differential: null }));
    setIsCalculated(false);
    setErrors({});
  }, []); // No dependencies that would cause re-creation unless intended

  useEffect(() => {
    if (formData.formType !== null) {
      // Si hay initialFormData y los campos no se han llenado y el formType coincide
      if (initialFormData && initialFormData.fields.length > 0 && formData.fields.length === 0 && formData.formType === initialFormData.formType) {
        setFormData(prev => ({ ...prev, fields: initialFormData.fields }));
        // Si ya venían datos calculados, marcar como calculado
        if (initialFormData.biological !== null) {
            setIsCalculated(true);
        }
      } else if (!initialFormData || formData.formType !== initialFormData.formType) {
        // Si no hay initialFormData, o el formType cambió, inicializar
        initializeForm(formData.formType);
      }
    } else {
      setFormData(prev => ({ ...prev, fields: [] })); // Limpiar campos si no hay formType
    }
  }, [formData.formType, initialFormData, initializeForm]);
  
  // ... (handleFieldChange, handleGenderChange, validateForm, calculateBiophysical, handleSave sin cambios mayores) ...
  // Asegúrate que GENDER_OPTIONS esté definido en tu archivo de tipos o constantes
  // y que los values coincidan (1, 2, 3, 4).
  const validateForm = (): boolean => { /* ... tu lógica de validación ... */ return true; };


  // --- Opciones y Datos para Gráficos (Adaptado de BiofisicaCharts.tsx) ---
  const commonChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false, // Importante para controlar la altura con CSS
    scales: {
      x: {
        beginAtZero: false,
        min: 20, // Edad mínima en el gráfico
        max: 100, // Edad máxima en el gráfico
        title: { display: true, text: 'Edad Biofísica (años)', font: { size: 10 } },
        ticks: { font: { size: 8 }, stepSize: 10 }
      },
      y: { display: false } // Ocultar etiquetas del eje Y para un look más limpio
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgb(41, 59, 100)', // Azul oscuro secundario
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.x !== null) {
              label += `${context.parsed.x.toFixed(0)} años`;
            }
            return label;
          }
        }
      }
    },
    animation: { duration: 500 }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-[#293B64] text-white p-6 rounded-lg shadow-md">
        {/* ... (contenido del formulario sin cambios significativos en estructura) ... */}
        {/* Solo asegúrate que el select de Género use GENDER_OPTIONS si lo tienes definido */}
        {/* Ejemplo para el select de Género: */}
        <div className="form-group">
            <label htmlFor="gender" className="block font-semibold mb-2">Género</label>
            <select 
              id="gender" 
              name="formType"
              className="w-full p-3 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none appearance-none bg-no-repeat"
              required
              value={formData.formType === null ? '' : formData.formType.toString()}
              onChange={(e) => handleGenderChange(e.target.value)}
              style={{ /* ... estilos de flecha ... */ }}
            >
              <option value="">Seleccione...</option>
              {GENDER_OPTIONS.map(option => ( // Asumiendo que GENDER_OPTIONS es [{value: number, label: string}, ...]
                  <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
          </div>
           {/* ... resto del formulario ... */}
      </div>
      
      {/* Panel derecho - Gráficos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-3"> {/* Ajustado space-y-3 */}
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Resultados Gráficos por Métrica</h3>
            {isCalculated && formData.biological !== null && formData.chronological !== null && (
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    formData.biological < formData.chronological ? 'bg-green-100 text-green-700' :
                    formData.biological > formData.chronological + 5 ? 'bg-red-100 text-red-700' : // Ejemplo de umbral para "enfermedad"
                    'bg-yellow-100 text-yellow-700' // "Envejecimiento"
                }`}>
                    Resultado Cualitativo General: {/* Texto más descriptivo */}
                    {
                     formData.biological < formData.chronological ? "Óptimo" :
                     formData.biological > formData.chronological + 5 ? "Riesgo Elevado" :
                     "Envejecimiento Esperado"
                    }
                </span>
            )}
        </div>

        {formData.formType === null ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">Seleccione género para ver gráficos.</p>
        ) : formData.fields.length === 0 && formData.formType !== null ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">Cargando campos y gráficos...</p>
        ) : formData.fields.length > 0 ? (
            formData.fields.map((field) => {
              // Determinar el color de la barra para esta métrica específica
              const barColor = getQualitativeColor(
                field.name, // O field.translate si prefieres usar ese como key en METRIC_QUALITATIVE_RANGES
                field.absolute_value,
                formData.chronological
              );

              const chartData: ChartData<'bar'> = {
                labels: [''], // No necesitamos label en el eje Y para cada barra
                datasets: [
                  {
                    label: field.translate, // Usado en el tooltip
                    data: [field.absolute_value ?? 0], // Usar 0 si es null para que la barra no desaparezca
                    backgroundColor: barColor, // Color dinámico
                    borderColor: barColor, // Borde del mismo color
                    borderWidth: 1,
                    barThickness: 20, // Grosor de la barra
                    borderRadius: 4, // Bordes redondeados para la barra
                  },
                ],
              };

              return (
                <div key={field.name} className="chart-item flex items-center w-full border border-gray-200 dark:border-gray-700 p-2.5 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:shadow-sm transition-shadow">
                  <span className="chart-label text-xs font-medium text-gray-600 dark:text-gray-300 mr-3 w-32 text-right shrink-0"> {/* Aumentado ancho de etiqueta */}
                    {field.translate.replace(/ \(.+?\)/g, '')}:
                  </span>
                  <div className="chart-canvas-container flex-grow h-10 relative"> {/* Altura del contenedor del gráfico */}
                    <Bar options={commonChartOptions} data={chartData} />
                    {/* Mostrar el valor numérico sobre o al lado de la barra si se desea */}
                    {field.absolute_value !== null && (
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold pr-2"
                              style={{ color: barColor === QUALITATIVE_COLORS.default ? 'text-gray-500' : 'white' /* O un color que contraste bien con la barra */ }}>
                             {field.absolute_value.toFixed(0)} años
                         </div>
                    )}
                  </div>
                </div>
              );
            })
        ) : null}
      </div>
    </div>
  );
}