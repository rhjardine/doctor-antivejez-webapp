'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BiofisicaField, GENDER_OPTIONS, getFatName } from '../types/biofisica';
import { getAbsoluteResult, getDimensionsResult, getTextForDifferential } from '@/utils/biofisicaCalculations';

interface BiofisicaFormProps {
  onDataCalculated: (data: any) => void;
  onSave: (data: any) => void;
  onBack: () => void;
  initialCronoAge: number;
}

const BiofisicaForm: React.FC<BiofisicaFormProps> = ({ onDataCalculated, onSave, onBack, initialCronoAge }) => {
  const [chronologicalAge, setChronologicalAge] = useState<number | ''>(initialCronoAge);
  const [gender, setGender] = useState<number | ''>('');
  const [fields, setFields] = useState<BiofisicaField[]>([]);
  const [biologicalAge, setBiologicalAge] = useState<number | null>(null);
  const [differentialAge, setDifferentialAge] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initializeFields = useCallback((selectedGender: number | '') => {
    if (!selectedGender) {
      setFields([]);
      return;
    }
    const fatName = getFatName(selectedGender);
    if (!fatName) {
      setFields([]);
      return;
    }

    const initialFields: BiofisicaField[] = [
      { name: fatName, translate: '% Grasa', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'body_mass', translate: 'Índice de masa corporal (IMC)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'digital_reflections', translate: 'Reflejos Digitales - Promedio (cm)', dimensions: true, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'visual_accommodation', translate: 'Acomodación Visual (cm)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'static_balance', translate: 'Balance Estático - Promedio (seg)', dimensions: true, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'quaten_hydration', translate: 'Hidratación Cutánea (seg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'systolic_blood_pressure', translate: 'Sistólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
      { name: 'diastolic_blood_pressure', translate: 'Diastólica (mmHg)', dimensions: false, relative_value: '', absolute_value: null, high: '', long: '', width: '' },
    ];
    setFields(initialFields);
    setBiologicalAge(null);
    setDifferentialAge(null);
    setIsCalculated(false);
    setErrors({});
  }, []);

  useEffect(() => {
    initializeFields(gender);
  }, [gender, initializeFields]);

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value ? parseInt(e.target.value, 10) : '');
  };

  const handleChronologicalAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChronologicalAge(e.target.value ? parseInt(e.target.value, 10) : '');
    setIsCalculated(false);
  };

  const handleFieldChange = (
    fieldName: string,
    valueType: 'relative_value' | 'high' | 'long' | 'width',
    value: string
  ) => {
    const numericValue = value === '' ? '' : parseFloat(value);

    setFields(prevFields =>
      prevFields.map(field =>
        field.name === fieldName
          ? { ...field, [valueType]: numericValue }
          : field
      )
    );
    setIsCalculated(false);
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (errors.chronologicalAge && valueType === 'relative_value') {
      setErrors(prev => ({ ...prev, chronologicalAge: '' }));
    }
    if (errors.gender && valueType === 'relative_value') {
      setErrors(prev => ({ ...prev, gender: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!chronologicalAge && chronologicalAge !== 0) {
      newErrors.chronologicalAge = 'Edad Cronológica requerida.';
      isValid = false;
    }
    if (!gender) {
      newErrors.gender = 'Género requerido.';
      isValid = false;
    }

    fields.forEach(field => {
      if (field.dimensions) {
        if ((!field.high && field.high !== 0) || (!field.long && field.long !== 0) || (!field.width && field.width !== 0)) {
          newErrors[field.name] = `${field.translate} requiere Alto, Largo y Ancho.`;
          isValid = false;
        }
      } else {
        if (!field.relative_value && field.relative_value !== 0) {
          newErrors[field.name] = `${field.translate} requerido.`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleCalculate = () => {
    if (!validateForm()) {
      console.log("Errores de validación:", errors);
      return;
    }

    let absoluteSum = 0;
    let validFieldsCount = 0;
    const updatedFields = fields.map(field => {
      try {
        const absolute_value = field.dimensions
          ? getDimensionsResult(field)
          : getAbsoluteResult(field.name, field.relative_value);

        if (typeof absolute_value === 'number' && !isNaN(absolute_value)) {
          absoluteSum += absolute_value;
          validFieldsCount++;
        } else {
          console.warn(`Invalid absolute value calculated for ${field.name}: ${absolute_value}`);
        }
        return { ...field, absolute_value };
      } catch (error) {
        console.error(`Error calculating absolute value for ${field.name}:`, error);
        return { ...field, absolute_value: null };
      }
    });

    setFields(updatedFields);

    if (validFieldsCount > 0 && chronologicalAge !== '') {
      const bioAge = absoluteSum / validFieldsCount;
      setBiologicalAge(bioAge);
      setDifferentialAge(bioAge - chronologicalAge);
      setIsCalculated(true);
    } else {
      setBiologicalAge(null);
      setDifferentialAge(null);
      setIsCalculated(false);
      setErrors(prev => ({ ...prev, calculation: "No se pudieron calcular edades válidas." }));
    }
  };

  const handleSave = () => {
    const dataToSave = {
      chronologicalAge,
      gender,
      biologicalAge,
      differentialAge,
      fields: fields.map(({ name, translate, dimensions, relative_value, high, long, width, absolute_value }) => ({
        name,
        translate,
        dimensions,
        relative_value: relative_value !== '' ? relative_value : null,
        high: high !== '' ? high : null,
        long: long !== '' ? long : null,
        width: width !== '' ? width : null,
        absolute_value
      }))
    };
    console.log('Datos para guardar:', JSON.stringify(dataToSave, null, 2));
    alert('Formulario calculado listo para ser guardado (ver consola para detalles).');
  };

  const handleBack = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear el formulario? Se perderán los datos no guardados.')) {
      setChronologicalAge('');
      setGender('');
      setFields([]);
      setBiologicalAge(null);
      setDifferentialAge(null);
      setIsCalculated(false);
      setErrors({});
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-4 bg-gray-50 dark:bg-gray-800">
      <div className="w-full lg:w-1/2 bg-secondary-dark text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 border-b border-primary pb-2 text-primary">Test Edad Biofísica</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="form-group">
            <label htmlFor="chronological" className="block font-medium mb-1 text-sm">Edad Cronológica</label>
            <input
              type="number"
              id="chronological"
              name="chronological"
              value={chronologicalAge}
              onChange={handleChronologicalAgeChange}
              placeholder="e.g. 50"
              required
              className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary ${errors.chronologicalAge ? 'border-red-500' : 'border-primary/30'}`}
            />
            {errors.chronologicalAge && <p className="text-red-400 text-xs mt-1">{errors.chronologicalAge}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="gender" className="block font-medium mb-1 text-sm">Género</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              required
              className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary appearance-none bg-no-repeat bg-right ${errors.gender ? 'border-red-500' : 'border-primary/30'}`}
              style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23212b36' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
            >
              <option value="">Seleccione...</option>
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div id="dynamic-fields-container" className="space-y-4 pt-4 border-t border-primary/30">
            {fields.map((field) => (
              <div key={field.name} className="form-group" data-field-name={field.name}>
                <label className="block font-medium mb-1 text-sm">{field.translate}</label>
                {field.dimensions ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        name={`${field.name}_high`}
                        value={field.high}
                        onChange={(e) => handleFieldChange(field.name, 'high', e.target.value)}
                        placeholder="Alto" required step="0.01"
                        className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                      />
                      <input
                        type="number"
                        name={`${field.name}_long`}
                        value={field.long}
                        onChange={(e) => handleFieldChange(field.name, 'long', e.target.value)}
                        placeholder="Largo" required step="0.01"
                        className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                      />
                      <input
                        type="number"
                        name={`${field.name}_width`}
                        value={field.width}
                        onChange={(e) => handleFieldChange(field.name, 'width', e.target.value)}
                        placeholder="Ancho" required step="0.01"
                        className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                      />
                    </div>
                    <input
                      type="text"
                      disabled
                      name={`${field.name}_absolute`}
                      value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                      placeholder="Edad Calculada"
                      className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed text-sm"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name={`${field.name}_relative`}
                      value={field.relative_value}
                      onChange={(e) => handleFieldChange(field.name, 'relative_value', e.target.value)}
                      placeholder="Valor" required step="0.01"
                      className={`w-full p-2 border rounded bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary text-sm ${errors[field.name] ? 'border-red-500' : 'border-primary/30'}`}
                    />
                    <input
                      type="text"
                      disabled
                      name={`${field.name}_absolute`}
                      value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                      placeholder="Edad Calculada"
                      className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed text-sm"
                    />
                  </div>
                )}
                {errors[field.name] && <p className="text-red-400 text-xs mt-1">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
          {fields.length > 0 && (
            <div className="final-results grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-primary/10 p-4 rounded">
              <div className="form-group">
                <label className="block font-medium mb-1 text-sm">Edad Biofísica (Calculada)</label>
                <input type="text" disabled value={biologicalAge !== null ? biologicalAge.toFixed(0) : '---'}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed font-semibold" />
              </div>
              <div className="form-group">
                <label className="block font-medium mb-1 text-sm">Edad Diferencial (Calculada)</label>
                <input type="text" disabled
                  value={differentialAge !== null ? `${Math.abs(differentialAge).toFixed(0)}${getTextForDifferential(differentialAge)}` : '---'}
                  className="w-full p-2 border rounded bg-gray-100 text-gray-600 border-primary/30 cursor-not-allowed font-semibold" />
              </div>
            </div>
          )}
          <div className="buttons flex flex-wrap gap-3 mt-6">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!gender || !chronologicalAge}
              className="flex-1 min-w-[100px] px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              Calcular
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isCalculated}
              className="flex-1 min-w-[100px] px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 min-w-[100px] px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-secondary-dark transition duration-150 ease-in-out"
            >
              Resetear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiofisicaForm;
