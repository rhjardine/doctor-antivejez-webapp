'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalculator } from '@fortawesome/free-solid-icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  BiofisicaField,
  GENDER_OPTIONS,
  PatientBiofisicaData,
  FormTypeNumeric,
  BoardData, // Asegúrate de importar este tipo desde donde esté definido
} from '@/app/historias/types/biofisica';
import {
  getFatName,
  getAbsoluteResult,
  getDimensionsResult,
} from '@/utils/biofisicaBoardCalculations';
import { getQualitativeColor, QUALITATIVE_COLORS } from '@/utils/biofisicaQualitativeRanges';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BiofisicaFormData {
  formType: FormTypeNumeric | null;
  fields: BiofisicaField[];
  chronological: number | null;
  biological: number | null;
  differential: number | null;
}

interface EdadBiofisicaFormProps {
  patientData: PatientBiofisicaData;
  initialFormData?: BiofisicaFormData | null;
  onSave?: (formData: BiofisicaFormData) => Promise<void>;
  onBack: () => void;
}

const allowedValues: ReadonlyArray<FormTypeNumeric> = [1, 2, 3, 4];

const isValidFormType = (value: number): value is FormTypeNumeric => {
  return (allowedValues as readonly number[]).includes(value);
};

const calculateChronologicalAge = (birthDateString?: string | null): number | null => {
  if (!birthDateString) return null;
  try {
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
};

const getPatientFormTypeFromData = (patient: PatientBiofisicaData | null | undefined): FormTypeNumeric => {
  const DEFAULT_FORM_TYPE: FormTypeNumeric = GENDER_OPTIONS.find(opt => opt.label.toLowerCase().includes('femenino'))?.value ?? 1;
  if (!patient) {
    console.warn('PatientData no proporcionado, usando formType por defecto:', DEFAULT_FORM_TYPE);
    return DEFAULT_FORM_TYPE;
  }
  if (typeof patient.formType === 'number' && isValidFormType(patient.formType)) {
    return patient.formType;
  }
  const possibleGenderSources: (string | number | null | undefined)[] = [patient.gender, patient.sexo];
  for (const source of possibleGenderSources) {
    if (source != null && String(source).trim() !== '') {
      const numericSource = typeof source === 'number' ? source : parseInt(source, 10);
      if (!isNaN(numericSource) && isValidFormType(numericSource)) {
        return numericSource;
      }
    }
  }
  console.warn('No se pudo determinar un formType válido del paciente. Usando por defecto:', DEFAULT_FORM_TYPE);
  return DEFAULT_FORM_TYPE;
};

export default function BiofisicaForm({ patientData, initialFormData = null, onSave, onBack }: EdadBiofisicaFormProps) {
  const derivedChronologicalAge = useMemo(
    () => calculateChronologicalAge(patientData?.fechaNacimiento),
    [patientData?.fechaNacimiento]
  );

  const [formData, setFormData] = useState<BiofisicaFormData>(() => {
    const resolvedInitialFormType = getPatientFormTypeFromData(patientData);
    if (initialFormData) {
      return {
        ...initialFormData,
        chronological: initialFormData.chronological ?? derivedChronologicalAge,
        formType: isValidFormType(initialFormData.formType ?? -1)
          ? (initialFormData.formType as FormTypeNumeric)
          : resolvedInitialFormType,
        fields: initialFormData.fields?.length > 0 ? initialFormData.fields : [],
      };
    }
    return {
      formType: resolvedInitialFormType,
      fields: [],
      chronological: derivedChronologicalAge,
      biological: null,
      differential: null,
    };
  });

  // Añadimos el estado para boards
  const [boards, setBoards] = useState<BoardData[] | null>(null);

  const [isCalculated, setIsCalculated] = useState(!!initialFormData?.biological);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar boards (ejemplo con una API ficticia, ajusta según tu caso)
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('/api/patients', { ... }); // Reemplaza con tu endpoint real
        const data: BoardData[] = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
        setBoards(null);
        setErrors(prev => ({ ...prev, general: 'No se pudieron cargar los datos necesarios para el cálculo.' }));
      }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    const newCronoAge = calculateChronologicalAge(patientData?.fechaNacimiento);
    if (newCronoAge != null && newCronoAge !== formData.chronological) {
      setFormData(prev => ({
        ...prev,
        chronological: newCronoAge,
        biological: null,
        differential: null,
      }));
      setIsCalculated(false);
    }
  }, [patientData?.fechaNacimiento]);

  const initializeOrResetFields = useCallback((formTypeToInit: FormTypeNumeric | null) => {
    if (formTypeToInit === null || !isValidFormType(formTypeToInit)) {
      setFormData(prev => ({ ...prev, fields: [], biological: null, differential: null, formType: null }));
      setIsCalculated(false);
      setErrors({});
      return;
    }

    const fatName = getFatName(formTypeToInit);
    const newFields: BiofisicaField[] = [
      { name: fatName, translate: '%Grasa', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'body_mass', translate: 'Índice de masa corporal (IMC)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'digital_reflections', translate: 'Reflejos Digitales - Promedio (cm)', dimensions: true, relative_value: null, absolute_value: null, high: '', long: '', width: '' },
      { name: 'visual_accommodation', translate: 'Acomodación Visual (cm)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'static_balance', translate: 'Balance Estático - Promedio (seg)', dimensions: true, relative_value: null, absolute_value: null, high: '', long: '', width: '' },
      { name: 'quaten_hydration', translate: 'Hidratación Cutánea (seg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'systolic_blood_pressure', translate: 'Sistólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'diastolic_blood_pressure', translate: 'Diastólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
    ];

    setFormData(prev => ({ ...prev, formType: formTypeToInit, fields: newFields, biological: null, differential: null }));
    setIsCalculated(false);
    setErrors({});
  }, []);

  useEffect(() => {
    if (initialFormData && initialFormData.formType === formData.formType && initialFormData.fields?.length > 0) {
      if (JSON.stringify(formData.fields) !== JSON.stringify(initialFormData.fields)) {
        setFormData(prev => ({
          ...prev,
          fields: initialFormData.fields,
          biological: initialFormData.biological,
          differential: initialFormData.differential,
        }));
        if (initialFormData.biological !== null) setIsCalculated(true);
      }
    } else if (formData.formType !== null && isValidFormType(formData.formType)) {
      if (formData.fields.length === 0 || !formData.fields.some(f => f.name === getFatName(formData.formType!))) {
        initializeOrResetFields(formData.formType);
      }
    } else if (formData.formType === null && formData.fields.length > 0) {
      initializeOrResetFields(null);
    }
  }, [formData.formType, initialFormData, initializeOrResetFields]);

  const handleFieldChange = useCallback((fieldName: string, property: keyof BiofisicaField, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.name === fieldName ? { ...field, [property]: value } : field
      ),
    }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
    setIsCalculated(false);
  }, []);

  const handleGenderChange = useCallback((value: string) => {
    const numericValue = value === '' ? null : parseInt(value, 10);
    if (numericValue === null || !isValidFormType(numericValue)) {
      console.warn('Intento de seleccionar un formType inválido:', numericValue);
      setFormData(prev => ({ ...prev, formType: null }));
    } else {
      setFormData(prev => ({ ...prev, formType: numericValue }));
    }
    setErrors(prev => ({ ...prev, gender: '' }));
    setIsCalculated(false);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (formData.formType === null) newErrors.gender = 'Debe seleccionar un género';
    if (formData.chronological === null || formData.chronological <= 0)
      newErrors.chronological = 'Edad cronológica inválida. Verifique la fecha de nacimiento del paciente';

    const checkValue = (val: any, fieldName: string, dimensionName?: string): boolean => {
      const dName = dimensionName ? ` (${dimensionName})` : '';
      if (val == null || String(val).trim() === '') {
        newErrors[fieldName + (dimensionName || '')] = `El valor para ${formData.fields.find(f => f.name === fieldName)?.translate}${dName} no puede estar vacío.`;
        return false;
      }
      if (isNaN(parseFloat(String(val)))) {
        newErrors[fieldName + (dimensionName || '')] = `El valor para ${formData.fields.find(f => f.name === fieldName)?.translate}${dName} debe ser numérico.`;
        return false;
      }
      if (parseFloat(String(val)) < 0) {
        newErrors[fieldName + (dimensionName || '')] = `El valor para ${formData.fields.find(f => f.name === fieldName)?.translate}${dName} no puede ser negativo.`;
        return false;
      }
      return true;
    };

    for (const field of formData.fields) {
      if (field.dimensions) {
        if (!checkValue(field.high, field.name, 'Alto')) return false;
        if (!checkValue(field.long, field.name, 'Largo')) return false;
        if (!checkValue(field.width, field.name, 'Ancho')) return false;
      } else {
        if (!checkValue(field.relative_value, field.name)) return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const calculateBiophysical = useCallback(() => {
    if (!validateForm()) {
      console.warn('Validación fallida, no se puede calcular.', errors);
      return;
    }

    if (formData.formType === null || formData.chronological === null || boards === null) {
      console.error('Error crítico: falta información esencial para calcular.');
      setErrors(prev => ({
        ...prev,
        general: 'Falta información esencial (género, edad o datos de referencia) para calcular.',
      }));
      return;
    }

    const updatedFields = formData.fields.map(field => {
      let absoluteValue: number | null = null;
      try {
        const relativeStr = String(field.relative_value ?? '0');
        if (field.dimensions) {
          // Corrección: Pasamos 'field' y 'boards' a getDimensionsResult
          absoluteValue = getDimensionsResult(field, boards);
        } else {
          absoluteValue = getAbsoluteResult(
            field.name,
            parseFloat(relativeStr),
            formData.formType, // FormTypeNumeric
            formData.chronological // number
          );
        }
      } catch (calcError: any) {
        console.error(`Error calculando valor absoluto para ${field.name}:`, calcError?.message || calcError);
        absoluteValue = null;
        setErrors(prev => ({
          ...prev,
          [field.name]: `Error en cálculo: ${calcError?.message || 'Error desconocido'}`,
        }));
      }
      return {
        ...field,
        absolute_value: absoluteValue != null && !isNaN(absoluteValue) ? absoluteValue : null,
      };
    });

    const validResults = updatedFields
      .map(field => field.absolute_value)
      .filter((value): value is number => typeof value === 'number' && !isNaN(value));

    const biological = validResults.length > 0
      ? Math.round(validResults.reduce((sum, value) => sum + value, 0) / validResults.length)
      : null;

    const differential = biological != null && formData.chronological != null
      ? Math.round(biological - formData.chronological)
      : null;

    setFormData(prev => ({ ...prev, fields: updatedFields, biological, differential }));
    setIsCalculated(true);
  }, [formData, validateForm, errors, boards]);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    if (!isCalculated) {
      setErrors(prev => ({ ...prev, save: 'Debe calcular los resultados antes de guardar.' }));
      return;
    }
    if (!validateForm()) {
      setErrors(prev => ({ ...prev, save: 'Revise los campos del formulario, hay errores.' }));
      return;
    }
    setErrors(prev => {
      const { save, ...rest } = prev;
      return rest;
    });
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error: any) {
      console.error('Error saving biofisica data:', error);
      setErrors(prev => ({ ...prev, save: `Error al guardar: ${error?.message || 'Intente nuevamente.'}` }));
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, validateForm, isCalculated]);

  const commonChartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: false,
          title: { display: true, text: 'Edad Biofísica (años)', font: { size: 10 } },
          ticks: { font: { size: 8 }, stepSize: 10, color: '#9ca3af' },
        },
        y: { display: false },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgb(41, 59, 100)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: context => {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.x != null) label += `${context.parsed.x.toFixed(0)} años`;
              return label;
            },
          },
        },
        animation: { duration: 300 },
      },
    }),
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-[#293B64] text-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edad Biofísica</h2>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver
          </button>
        </div>
        <div className="mb-6 p-4 bg-[#1e2a4a] rounded-md">
          <h3 className="font-semibold mb-2">Información del Paciente</h3>
          <p className="text-sm">
            <span className="font-medium">Nombre:</span> {patientData?.primerNombre || 'N/A'} {patientData?.primerApellido || ''}
          </p>
          <p className="text-sm">
            <span className="font-medium">Edad Cronológica:</span> {formData.chronological ?? 'No disponible'}{' '}
            {formData.chronological !== null ? 'años' : ''}
            {errors.chronological && <span className="text-red-400 text-xs ml-2">{errors.chronological}</span>}
          </p>
        </div>
        <div className="form-group mb-4">
          <label htmlFor="gender" className="block font-semibold mb-2">
            Género
          </label>
          <select
            id="gender"
            name="formType"
            className="w-full p-3 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
            required
            value={formData.formType === null ? '' : formData.formType.toString()}
            onChange={e => handleGenderChange(e.target.value)}
            aria-invalid={!!errors.gender}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
          >
            <option value="">Seleccione...</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value.toString()}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p id="gender-error" className="text-red-400 text-xs mt-1">
              {errors.gender}
            </p>
          )}
        </div>
        {formData.formType !== null && formData.fields.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg">Mediciones</h3>
            {formData.fields.map(field => (
              <div key={field.name} className="p-4 bg-[#1e2a4a] rounded-md">
                <h4 className="font-medium mb-3">{field.translate}</h4>
                {field.dimensions ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Alto"
                      value={field.high}
                      onChange={e => handleFieldChange(field.name, 'high', e.target.value)}
                      className="p-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-[#23BCEF]"
                      aria-label={`Alto para ${field.translate}`}
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Largo"
                      value={field.long}
                      onChange={e => handleFieldChange(field.name, 'long', e.target.value)}
                      className="p-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-[#23BCEF]"
                      aria-label={`Largo para ${field.translate}`}
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Ancho"
                      value={field.width}
                      onChange={e => handleFieldChange(field.name, 'width', e.target.value)}
                      className="p-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-[#23BCEF]"
                      aria-label={`Ancho para ${field.translate}`}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Valor"
                    value={field.relative_value ?? ''}
                    onChange={e => handleFieldChange(field.name, 'relative_value', e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 text-black focus:ring-2 focus:ring-[#23BCEF]"
                    aria-label={`Valor para ${field.translate}`}
                  />
                )}
                {(errors[field.name] ||
                  errors[field.name + 'Alto'] ||
                  errors[field.name + 'Largo'] ||
                  errors[field.name + 'Ancho']) && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[field.name] ||
                      errors[field.name + 'Alto'] ||
                      errors[field.name + 'Largo'] ||
                      errors[field.name + 'Ancho']}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          <button
            onClick={calculateBiophysical}
            disabled={formData.formType === null || formData.fields.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faCalculator} />
            Calcular
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isCalculated || formData.formType === null}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faSave} />
            Guardar
          </button>
        </div>
        {errors.save && (
          <div className="mt-4 p-3 bg-red-600/20 border border-red-600/50 rounded-md">
            <p className="text-red-400 text-sm">{errors.save}</p>
          </div>
        )}
        {errors.general && (
          <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/50 rounded-md">
            <p className="text-yellow-400 text-sm">{errors.general}</p>
          </div>
        )}
      </div>
      {/* Panel derecho - Gráficos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Resultados Gráficos por Métrica
          </h3>
          {isCalculated && formData.biological !== null && formData.chronological !== null && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                formData.biological < formData.chronological
                  ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
                  : formData.biological > formData.chronological + 5
                  ? 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'
              }`}
            >
              {formData.biological < formData.chronological
                ? 'Óptimo'
                : formData.biological > formData.chronological + 5
                ? 'Riesgo Elevado'
                : 'Envejecimiento Esperado'}
            </span>
          )}
        </div>
        {formData.formType === null ? (
          <p className="text-center py-4 text-gray-500 dark:text-gray-400">
            Seleccione género para ver gráficos y mediciones.
          </p>
        ) : formData.fields.length === 0 ? (
          <p className="text-center py-4 text-gray-500 dark:text-gray-400">
            Campos no inicializados. Seleccione un género para cargar las mediciones.
          </p>
        ) : (
          formData.fields.map(field => {
            const barColor = getQualitativeColor(field.absolute_value, QUALITATIVE_COLORS);
            const chartData: ChartData<'bar'> = {
              labels: [''], // Un solo label para una sola barra
              datasets: [
                {
                  label: field.translate,
                  data: [field.absolute_value ?? 0],
                  backgroundColor: barColor,
                  borderColor: barColor,
                  borderWidth: 1,
                  barThickness: 20,
                  borderRadius: 4,
                },
              ],
            };
            return (
              <div
                key={field.name}
                className="chart-item flex items-center w-full border border-gray-200 dark:border-gray-700 p-2.5 rounded-md bg-gray-50 dark:bg-gray-700/50 hover:shadow-sm transition-shadow"
              >
                <span
                  className="chart-label text-xs font-medium text-gray-600 dark:text-gray-300 mr-3 w-32 text-right shrink-0 truncate"
                  title={field.translate.replace(/ \(.+?\)/g, '')}
                >
                  {field.translate.replace(/ \(.+?\)/g, '')}:
                </span>
                <div className="chart-canvas-container flex-grow h-10 relative">
                  {typeof field.absolute_value === 'number' && !isNaN(field.absolute_value) ? (
                    <Bar options={commonChartOptions} data={chartData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 italic">
                      {isCalculated ? 'No calculado' : 'Valor no ingresado'}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}