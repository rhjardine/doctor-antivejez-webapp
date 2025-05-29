// src/app/historias/components/EdadBiofisica/EdadBiofisicaForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faSave, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  BiofisicaField,
  BiofisicaFormData,
  BoardData,
  CalculationStatus,
  SaveStatus,
  PatientBiofisicaData
} from '@/app/historias/types/biofisica';
import {
  getFatName,
  getAbsoluteResult,
  getDimensionsResult,
  buildSavePayload
} from '@/utils/biofisicaBoardCalculations';
import BiofisicaCharts from './BiofisicaCharts';
import BiofisicaResult from './BiofisicaResult';

interface EdadBiofisicaFormProps {
  patientData: PatientBiofisicaData;
  onSave: () => void;
  onBack: () => void;
}

export default function EdadBiofisicaForm({ patientData, onSave, onBack }: EdadBiofisicaFormProps) {
  // Estados principales
  const [formData, setFormData] = useState<BiofisicaFormData>({
    formType: null,
    fields: [],
    chronological: patientData.age || null,
    biological: null,
    differential: null
  });
  
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [calculationStatus, setCalculationStatus] = useState<CalculationStatus>('idle');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Cargar boards al inicio
  useEffect(() => {
    async function loadBoards() {
      try {
        setCalculationStatus('loading');
        setErrorMessage(null);
        
        const response = await fetch('/api/boards?form=1');
        
        if (!response.ok) {
          throw new Error(`Error fetching boards: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verificar si estamos usando datos fallback
        if (data && data.length > 0 && data[0].id === 15 && data[0].range_id === 1) {
          console.log('Usando datos fallback');
          setUsingFallbackData(true);
        }
        
        setBoards(data);
        setCalculationStatus('idle');
      } catch (error) {
        console.error('Error loading boards:', error);
        setErrorMessage('No se pudieron cargar los datos de referencia. Se usarán valores predeterminados.');
        setCalculationStatus('error');
      }
    }
    
    loadBoards();
  }, []);
  
  // Establecer edad cronológica inicial y actualizarla si cambia patientData.age
  useEffect(() => {
    if (patientData.age && patientData.age !== formData.chronological) {
      setFormData(prev => ({ ...prev, chronological: patientData.age }));
    }
  }, [patientData.age, formData.chronological]);
  
  // Función para inicializar campos según el tipo de género
  const initializeFields = (formType: number) => {
    const fatName = getFatName(formType);
    if (!fatName) {
      setFormData(prev => ({ ...prev, fields: [] }));
      return;
    }
    
    // Definir campos según género
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
    
    setFormData(prev => ({
      ...prev,
      formType,
      fields: newFields,
      biological: null,
      differential: null
    }));
  };
  
  // Manejar cambio de género
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const formType = value ? parseInt(value) : null;
    setFormData(prev => ({ ...prev, formType }));
    
    if (formType) {
      initializeFields(formType);
    }
  };
  
  // Manejar cambio de edad cronológica
  const handleChronologicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const chronological = value ? parseInt(value) : null;
    setFormData(prev => ({ ...prev, chronological }));
  };
  
  // Manejar cambio en campos simples
  const handleFieldChange = (
    name: string,
    value: string,
    type: 'relative' | 'high' | 'long' | 'width'
  ) => {
    setFormData(prev => {
      const newFields = prev.fields.map(field => {
        if (field.name === name) {
          const newField = { ...field };
          
          if (type === 'relative') {
            newField.relative_value = value;
          } else if (type === 'high') {
            newField.high = value;
          } else if (type === 'long') {
            newField.long = value;
          } else if (type === 'width') {
            newField.width = value;
          }
          
          return newField;
        }
        return field;
      });
      
      return { ...prev, fields: newFields };
    });
  };
  
  // Calcular edad biofísica
  const calculateBiofisica = async () => {
    try {
      setCalculationStatus('loading');
      setErrorMessage(null);
      
      // Validar que tenemos datos necesarios
      if (!formData.chronological) {
        throw new Error('Debe ingresar la edad cronológica');
      }
      
      if (!formData.formType) {
        throw new Error('Debe seleccionar un género');
      }
      
      if (boards.length === 0) {
        throw new Error('No se han cargado los datos de referencia');
      }
      
      // Calcular edades absolutas para cada campo
      let validFieldCount = 0;
      let totalAbsoluteAge = 0;
      
      const calculatedFields = formData.fields.map(field => {
        const newField = { ...field };
        
        try {
          if (field.dimensions) {
            // Verificar que todos los valores de dimensiones están presentes
            if (!field.high || !field.long || !field.width) {
              newField.absolute_value = null;
              return newField;
            }
            
            newField.absolute_value = getDimensionsResult(field, boards);
          } else {
            // Verificar que el valor relativo está presente
            if (!field.relative_value) {
              newField.absolute_value = null;
              return newField;
            }
            
            newField.absolute_value = getAbsoluteResult(field.name, field.relative_value, boards);
          }
          
          // Si tenemos un valor absoluto válido, sumarlo
          if (newField.absolute_value !== null) {
            totalAbsoluteAge += newField.absolute_value;
            validFieldCount++;
          }
        } catch (error) {
          console.error(`Error calculating for field ${field.name}:`, error);
          newField.absolute_value = null;
        }
        
        return newField;
      });
      
      // Verificar que tenemos al menos un campo válido
      if (validFieldCount === 0) {
        throw new Error('No se pudo calcular ningún valor. Verifique los datos ingresados.');
      }
      
      // Calcular edad biológica (promedio) y diferencial
      const biologicalAge = Math.round(totalAbsoluteAge / validFieldCount);
      const differential = biologicalAge - formData.chronological;
      
      // Actualizar estado
      setFormData(prev => ({
        ...prev,
        fields: calculatedFields,
        biological: biologicalAge,
        differential: differential
      }));
      
      setCalculationStatus('calculated');
    } catch (error) {
      console.error('Error in calculation:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error en el cálculo');
      setCalculationStatus('error');
    }
  };
  
  // Guardar resultados
  const handleSave = async () => {
    try {
      if (calculationStatus !== 'calculated') {
        throw new Error('Debe calcular los resultados antes de guardar');
      }
      
      setSaveStatus('saving');
      setErrorMessage(null);
      
      // Construir payload para el backend
      const payload = buildSavePayload(formData, patientData.id);
      
      // Enviar al backend a través del proxy
      const response = await fetch('/api/biophysics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al guardar: ${response.statusText} - ${errorData}`);
      }
      
      const data = await response.json();
      
      setSaveStatus('success');
      
      // Notificar al componente padre
      onSave();
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al guardar los datos');
      setSaveStatus('error');
    }
  };
  
  // Renderizar botones según estado
  const renderActionButtons = () => {
    return (
      <div className="grid grid-cols-3 gap-3 mt-6">
        <button 
          type="button"
          onClick={calculateBiofisica}
          disabled={calculationStatus === 'loading' || !formData.formType || boards.length === 0}
          className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-[#23BCEF] hover:bg-[#23BCEF]/90 disabled:bg-gray-400"
        >
          {calculationStatus === 'loading' ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Calculando...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCalculator} />
              <span>Calcular</span>
            </>
          )}
        </button>
        
        <button 
          type="button"
          onClick={handleSave}
          disabled={calculationStatus !== 'calculated' || saveStatus === 'saving'}
          className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
        >
          {saveStatus === 'saving' ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              <span>Guardar</span>
            </>
          )}
        </button>
        
        <button 
          type="button"
          onClick={onBack}
          className="p-3 text-white font-semibold rounded-md transition-all flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver</span>
        </button>
      </div>
    );
  };
  
  // Renderizar mensaje de advertencia para datos fallback
  const renderFallbackWarning = () => {
    if (!usingFallbackData) return null;
    
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4" role="alert">
        <p className="font-bold">Modo sin conexión</p>
        <p>Trabajando con datos locales. Algunas funciones pueden estar limitadas.</p>
      </div>
    );
  };
  
  // Renderizar mensaje de error si existe
  const renderErrorMessage = () => {
    if (!errorMessage) return null;
    
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{errorMessage}</p>
        {calculationStatus === 'error' && (
          <button 
            onClick={() => setCalculationStatus('idle')} 
            className="mt-2 text-sm text-red-700 underline"
          >
            Continuar de todos modos
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
      {/* Panel izquierdo - Formulario */}
      <div className="bg-[#293B64] text-white p-6 rounded-lg shadow-md lg:w-1/2 w-full">
        <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-[#23BCEF]/40">
          <h2 className="text-xl font-semibold text-[#23BCEF]">Panel de Control</h2>
          <span className="text-sm">Paciente: {patientData.name}</span>
        </div>
        
        <h3 className="text-xl font-medium mb-5">Test Edad Biofísica</h3>
        
        {renderFallbackWarning()}
        {renderErrorMessage()}
        
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
              onChange={handleChronologicalChange}
              readOnly={!!patientData.age} // Hacer readonly si viene del paciente
            />
            {patientData.age && (
              <p className="text-xs text-[#23BCEF]/80 mt-1">
                Edad tomada del registro del paciente
              </p>
            )}
          </div>
          
          {/* Género */}
          <div className="form-group">
            <label htmlFor="gender" className="block font-semibold mb-2">Género</label>
            <select 
              id="gender" 
              name="formType"
              className="w-full p-3 border-2 border-[#23BCEF]/30 rounded-md bg-white text-gray-900 text-sm focus:border-[#23BCEF] focus:outline-none appearance-none bg-no-repeat bg-right-10-center"
              required
              value={formData.formType || ''}
              onChange={handleGenderChange}
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
                      placeholder="Valor" 
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
          {calculationStatus === 'calculated' && (
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
                    ? `${Math.abs(formData.differential).toFixed(0)}${formData.differential > 0 ? ' más' : formData.differential < 0 ? ' menos' : ''}` 
                    : ''}
                />
              </div>
            </div>
          )}
          
          {/* Botones de acción */}
          {renderActionButtons()}
        </div>
      </div>
      
      {/* Panel derecho - Resultados y Gráficos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4 lg:w-1/2 w-full">
        {calculationStatus === 'calculated' && formData.biological !== null ? (
          <>
            <BiofisicaResult 
              biologicalAge={formData.biological}
              chronologicalAge={formData.chronological || 0}
              differential={formData.differential || 0}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Resultados por Parámetro
              </h3>
              
              <div className="space-y-4">
                {formData.fields
                  .filter(field => field.absolute_value !== null)
                  .map(field => (
                    <BiofisicaCharts
                      key={field.name}
                      field={field}
                      chronologicalAge={formData.chronological || 0}
                    />
                  ))
                }
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-center mb-4">
              <div className="text-5xl text-gray-300 dark:text-gray-700 mb-2">
                <FontAwesomeIcon icon={faCalculator} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Resumen de Edad Biológica
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Complete los datos en el panel izquierdo y haga clic en "Calcular" para ver los resultados
              de la edad biofísica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}