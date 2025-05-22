'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { 
  BiofisicaFormData, 
  BiofisicaField, 
  CalculationBoards 
} from '@/app/historias/types/biofisica';
import { 
  getFatName, 
  getAbsoluteResult, 
  getDimensionsResult, 
  calculationBoards 
} from '@/utils/biofisicaCalculations';

interface EdadBiofisicaFormProps {
  patientId: string;
  initialCronoAge?: number;
  onSave?: (formData: BiofisicaFormData) => Promise<void>;
  onBack: () => void;
}

export default function EdadBiofisicaForm({ 
  patientId, 
  initialCronoAge = 0, 
  onSave, 
  onBack 
}: EdadBiofisicaFormProps) {
  // Estado del formulario
  const [formData, setFormData] = useState<BiofisicaFormData>({
    formType: null,
    fields: [],
    chronological: initialCronoAge || null,
    biological: null,
    differential: null
  });
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Inicializar el formulario cuando se carga el componente o cambia la edad inicial
  useEffect(() => {
    if (initialCronoAge && formData.chronological === null) {
      setFormData(prev => ({ ...prev, chronological: initialCronoAge }));
    }
  }, [initialCronoAge, formData.chronological]);
  
  // Inicializar campos según género
  useEffect(() => {
    if (formData.formType) {
      initializeForm(formData.formType);
    }
  }, [formData.formType]);
  
  // Función para inicializar campos según género
  const initializeForm = (formType: number) => {
    const fatName = getFatName(formType);
    if (!fatName) {
      setFormData(prev => ({ ...prev, fields: [] }));
      return;
    }
    
    // Definir campos según el tipo (género)
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
    
    setFormData(prev => ({ ...prev, fields: newFields }));
    setIsCalculated(false);
  };
  
  // Manejar cambio en campos
  const handleFieldChange = (name: string, value: string, type: 'relative' | 'high' | 'long' | 'width') => {
    setFormData(prev => {
      const newFields = prev.fields.map(field => {
        if (field.name === name) {
          const newField = { ...field };
          if (type === 'relative') {
            newField.relative_value = value === '' ? '' : parseFloat(value);
          } else if (type === 'high') {
            newField.high = value === '' ? '' : parseFloat(value);
          } else if (type === 'long') {
            newField.long = value === '' ? '' : parseFloat(value);
          } else if (type === 'width') {
            newField.width = value === '' ? '' : parseFloat(value);
          }
          return newField;
        }
        return field;
      });
      
      return { ...prev, fields: newFields };
    });
    setIsCalculated(false);
  };
  
  // Manejar cambio de edad cronológica
  const handleChronologicalChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      chronological: value === '' ? null : parseInt(value)
    }));
    setIsCalculated(false);
  };
  
  // Manejar cambio de género
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      formType: value === '' ? null : parseInt(value),
      biological: null,
      differential: null
    }));
  };
  
  // Calcular edad biofísica
  const calculateBiophysical = () => {
    // Validaciones
    if (!formData.chronological && formData.chronological !== 0) {
      alert('La Edad Cronológica es requerida.');
      return;
    }
    
    if (!formData.formType) {
      alert('Por favor, seleccione el Género.');
      return;
    }
    
    // Verificar campos obligatorios
    let firstInvalidField = null;
    for (const field of formData.fields) {
      if (field.dimensions) {
        if ((!field.high && field.high !== 0) || (!field.long && field.long !== 0) || (!field.width && field.width !== 0)) {
          firstInvalidField = field;
          break;
        }
      } else {
        if (!field.relative_value && field.relative_value !== 0) {
          firstInvalidField = field;
          break;
        }
      }
    }
    
    if (firstInvalidField) {
      alert(`${firstInvalidField.translate} es requerido para el cálculo.`);
      return;
    }
    
    // Cálculos
    let absoluteSum = 0;
    let validFieldsCount = 0;
    
    const newFields = formData.fields.map(field => {
      const newField = { ...field };
      
      try {
        newField.absolute_value = field.dimensions
          ? getDimensionsResult(field)
          : getAbsoluteResult(field.name, field.relative_value);
        
        if (typeof newField.absolute_value === 'number' && !isNaN(newField.absolute_value)) {
          absoluteSum += newField.absolute_value;
          validFieldsCount++;
        }
      } catch (error) {
        console.error(`Error calculating absolute value for ${field.name}:`, error);
      }
      
      return newField;
    });
    
    // Calcular valores finales
    let biological = null;
    let differential = null;
    
    if (validFieldsCount > 0) {
      biological = absoluteSum / validFieldsCount;
      differential = biological - (formData.chronological || 0);
    } else {
      alert("No se pudieron calcular edades absolutas válidas.");
      return;
    }
    
    // Actualizar estado
    setFormData(prev => ({
      ...prev,
      fields: newFields,
      biological,
      differential
    }));
    
    setIsCalculated(true);
  };
  
  // Guardar resultados
  const handleSave = async () => {
    if (!isCalculated) {
      alert('Por favor, calcule primero los resultados antes de guardar.');
      return;
    }
    
    if (onSave) {
      try {
        setIsSaving(true);
        await onSave(formData);
        alert('Datos guardados exitosamente');
      } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar los datos.');
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('Datos para guardar:', formData);
      alert('Formulario calculado (simulación de guardado)');
    }
  };
  
  // Texto para edad diferencial
  const getDifferentialText = () => {
    if (formData.differential === null) return '';
    if (formData.differential > 0) return ` más`;
    if (formData.differential < 0) return ` menos`;
    return '';
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-[#293B64] text-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-[#23BCEF]/40">
          <h2 className="text-2xl font-semibold text-[#23BCEF]">Panel de Control</h2>
          <span className="text-sm">Bienvenido(a) Administrador</span>
        </div>
        
        <h3 className="text-xl font-medium mb-5">Test Edad Biofísica</h3>
        
        <div className="space-y-4">
          {/* Edad Cronológica */}
          <div className="form-group">
            <label htmlFor="chronological" className="block font-semibold mb-2">Edad Cronológica</label>
            <input 
              type="number" 
              id="chronological" 
              name="chronological" 
              placeholder="e.g. 50" 
              className="w-full p-3 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
              required
              value={formData.chronological || ''}
              onChange={(e) => handleChronologicalChange(e.target.value)}
            />
          </div>
          
          {/* Género */}
          <div className="form-group">
            <label htmlFor="gender" className="block font-semibold mb-2">Género</label>
            <select 
              id="gender" 
              name="formType"
              className="w-full p-3 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none appearance-none bg-no-repeat"
              required
              value={formData.formType || ''}
              onChange={(e) => handleGenderChange(e.target.value)}
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23212b36' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundPosition: 'right 10px center',
                backgroundSize: '15px',
                paddingRight: '30px'
              }}
            >
              <option value="">Seleccione...</option>
              <option value="1">Femenino</option>
              <option value="2">Masculino</option>
              <option value="3">Femenino Deportista</option>
              <option value="4">Masculino Deportista</option>
            </select>
          </div>
          
          {/* Campos dinámicos */}
          <div className="space-y-4">
            {formData.fields.map(field => (
              <div key={field.name} className="form-group" data-field-name={field.name}>
                <label className="block font-semibold mb-2">{field.translate}</label>
                
                {field.dimensions ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <input 
                        type="number" 
                        name={`${field.name}_high`} 
                        step="0.01" 
                        placeholder="Alto" 
                        required
                        className="p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
                        value={field.high || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value, 'high')}
                      />
                      <input 
                        type="number" 
                        name={`${field.name}_long`} 
                        step="0.01" 
                        placeholder="Largo" 
                        required
                        className="p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
                        value={field.long || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value, 'long')}
                      />
                      <input 
                        type="number" 
                        name={`${field.name}_width`} 
                        step="0.01" 
                        placeholder="Ancho" 
                        required
                        className="p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
                        value={field.width || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value, 'width')}
                      />
                    </div>
                    <input 
                      type="text" 
                      disabled 
                      className="w-full p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                      name={`${field.name}_absolute`} 
                      placeholder="Edad Calculada"
                      value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                    />
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      name={`${field.name}_relative`} 
                      step="0.01" 
                      placeholder={`e.g. ${calculationBoards[field.name]?.range_min || 25}`} 
                      required
                      className="p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none"
                      value={field.relative_value || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value, 'relative')}
                    />
                    <input 
                      type="text" 
                      disabled 
                      className="p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                      name={`${field.name}_absolute`} 
                      placeholder="Edad Calculada"
                      value={field.absolute_value !== null ? field.absolute_value.toFixed(0) : ''}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Resultados finales */}
          <div className="grid grid-cols-2 gap-4 mt-6 bg-[#23BCEF]/10 p-4 rounded-lg">
            <div className="form-group">
              <label className="block font-semibold mb-2">Edad Biofísica (Calculada)</label>
              <input 
                type="text" 
                disabled 
                name="biological" 
                placeholder="Resultado"
                className="w-full p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                value={formData.biological !== null ? formData.biological.toFixed(0) : ''}
              />
            </div>
            <div className="form-group">
              <label className="block font-semibold mb-2">Edad Diferencial (Calculada)</label>
              <input 
                type="text" 
                disabled 
                name="differential" 
                placeholder="Resultado"
                className="w-full p-2.5 border-2 border-[#23BCEF]/30 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                value={formData.differential !== null 
                  ? `${Math.abs(formData.differential).toFixed(0)}${getDifferentialText()}` 
                  : ''}
              />
            </div>
          </div>
          
          {/* Botones */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button 
              type="button" 
              className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-[#23BCEF] hover:bg-[#23BCEF]/90 disabled:bg-gray-400"
              onClick={calculateBiophysical}
              disabled={!formData.formType || formData.fields.length === 0}
            >
              <FontAwesomeIcon icon={faCalculator} />
              <span>Calcular</span>
            </button>
            <button 
              type="button" 
              className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
              onClick={handleSave}
              disabled={!isCalculated || isSaving}
            >
              <FontAwesomeIcon icon={faSave} />
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </button>
            <button 
              type="button"
              className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600"
              onClick={onBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Panel derecho - Gráficos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        {formData.fields.map(field => (
          <div key={field.name} className="chart-item flex items-center w-full border border-[#23BCEF]/30 p-3 rounded-md bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-all">
            <span className="chart-label text-sm text-gray-700 dark:text-gray-300 mr-4 min-w-[120px] text-right font-semibold">
              {field.translate
                .replace(' (cm)', '')
                .replace(' (seg)', '')
                .replace(' (mmHg)', '')}:
            </span>
            <div className="chart-canvas-container flex-grow min-h-[40px]">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#23BCEF] dark:bg-[#23BCEF]/80 rounded-full transition-all duration-500"
                  style={{ 
                    width: field.absolute_value ? 
                      `${Math.max(0, Math.min(100, ((field.absolute_value - 20) / 80) * 100))}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
              <div className="mt-1 text-center text-xs text-gray-600 dark:text-gray-400">
                {field.absolute_value ? `${field.absolute_value.toFixed(0)} años` : 'No calculado'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}