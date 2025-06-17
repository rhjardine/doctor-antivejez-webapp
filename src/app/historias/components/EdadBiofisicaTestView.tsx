'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faSave, faArrowLeft, faSpinner, faChartBar, faExclamationTriangle, faSync, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BoardWithRange, calculateBiofisicaResults } from '@/utils/biofisicaBoardCalculations';

interface FormValues {
  [key: string]: string | number;
  gender: 'Masculino' | 'Femenino';
  is_athlete: '0' | '1';
  // Añadir campos para las mediciones que se envían desde el formulario
  fat?: number;
  imc?: number;
  digital_reflex_1?: number;
  digital_reflex_2?: number;
  digital_reflex_3?: number;
  visual_accommodation?: number;
  static_balance_1?: number;
  static_balance_2?: number;
  static_balance_3?: number;
  skin_hydration?: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
}

interface PartialAges {
  [key: string]: number | null;
  fat?: number | null;
  imc?: number | null;
  digital_reflex?: number | null;
  visual_accommodation?: number | null;
  static_balance?: number | null;
  skin_hydration?: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  pulse?: number | null;
}

interface BiophysicalTestResult {
  id: number;
  patient_id: number;
  chronological_age: number;
  biological_age: number;
  differential_age: number;
  gender: string;
  is_athlete: boolean;
  measurements: string; // JSON string
  partial_ages: string; // JSON string
  test_date: string; // ISO date string
  created_at: string;
  updated_at: string;
}

interface EdadBiofisicaTestViewProps {
  patientId: string;
  patientName: string;
  initialCronoAge: number;
  onBack: () => void;
  onSaveTest: () => void; // Añadimos esta prop para notificar a la vista padre
}

// --- Componente para mostrar errores de forma integrada ---
const ErrorMessage = ({ message, suggestion, onRetry }: { message: string, suggestion?: string, onRetry?: () => void }) => (
  <div className="p-4 my-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg">
    <div className="flex">
      <div className="py-1"><FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" /></div>
      <div className="flex-1">
        <p className="font-bold">{message}</p>
        {suggestion && <p className="text-sm mt-1">{suggestion}</p>}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSync} /> Reintentar
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- Componente de carga ---
const LoadingMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
    <p className="mt-4">{message}</p>
  </div>
);

// --- Componente de notificación ---
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
    type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
  }`}>
    <FontAwesomeIcon icon={type === 'success' ? faCheckCircle : faExclamationTriangle} />
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <FontAwesomeIcon icon={faTimes} />
    </button>
  </div>
);

// --- Función para determinar el color según la diferencia de edad ---
const getAgeStatusColor = (partialAge: number | null, cronoAge: number): { color: string, status: string, bgColor: string } => {
  if (partialAge === null) return { color: 'text-gray-400', status: 'Sin calcular', bgColor: 'bg-gray-100' };
  
  const difference = partialAge - cronoAge;
  
  if (difference <= -7) {
    return { color: 'text-green-600', status: 'Óptimo', bgColor: 'bg-green-100' };
  } else if (difference >= -3 && difference <= 3) {
    return { color: 'text-yellow-600', status: 'Normal', bgColor: 'bg-yellow-100' };
  } else if (difference >= 7) {
    return { color: 'text-red-600', status: 'Envejecido', bgColor: 'bg-red-100' };
  } else if (difference > 3 && difference < 7) {
    return { color: 'text-orange-600', status: 'Atención', bgColor: 'bg-orange-100' };
  } else {
    return { color: 'text-blue-600', status: 'Bueno', bgColor: 'bg-blue-100' };
  }
};

// --- Componente de gráfico individual ---
const ItemChart = ({ name, partialAge, cronoAge, label }: { name: string, partialAge: number | null, cronoAge: number, label: string }) => {
  const { color, status, bgColor } = getAgeStatusColor(partialAge, cronoAge);
  const difference = partialAge ? (partialAge - cronoAge).toFixed(1) : '--';
  
  return (
    <div className={`p-3 rounded-lg border-2 ${bgColor} ${color.replace('text-', 'border-')}`}>
      <h4 className="font-semibold text-sm mb-2">{label}</h4>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Edad Calculada:</span>
          <span className="font-bold">{partialAge ? partialAge.toFixed(1) : '--'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Diferencia:</span>
          <span className={`font-bold ${color}`}>
            {difference !== '--' ? `${difference > 0 ? '+' : ''}${difference} años` : '--'}
          </span>
        </div>
        <div className={`text-center text-xs font-bold py-1 rounded ${color}`}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default function EdadBiofisicaTestView({
  patientId,
  patientName,
  initialCronoAge,
  onBack,
  onSaveTest, // Recibimos la nueva prop
}: EdadBiofisicaTestViewProps) {
  
  const [boards, setBoards] = useState<BoardWithRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formValues, setFormValues] = useState<FormValues>({ gender: 'Masculino', is_athlete: '0' });
  const [partialAges, setPartialAges] = useState<PartialAges>({});
  const [finalResults, setFinalResults] = useState({ biologicalAge: 0, differentialAge: 0 });
  const [cronoAge, setCronoAge] = useState(initialCronoAge); // Inicializa cronoAge con initialCronoAge

  // --- NUEVA FUNCIÓN: Cargar el último test biofísico del paciente ---
  const fetchLastBiophysicalTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Cargando último test biofísico para patientId: ${patientId}...`);
      // CAMBIO CLAVE: Usa el query parameter patientId
      const res = await fetch(`/api/biophysics-tests?patientId=${patientId}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: No se pudieron cargar los tests biofísicos.`);
      }
      
      const data: BiophysicalTestResult[] = await res.json();
      console.log(`Tests biofísicos cargados: ${data.length} registros`);

      if (data.length > 0) {
        const latestTest = data[0]; // Tomamos el más reciente (ordenado por created_at desc)
        
        // Parsear measurements y partial_ages (son JSON strings)
        const parsedMeasurements: FormValues = JSON.parse(latestTest.measurements);
        const parsedPartialAges: PartialAges = JSON.parse(latestTest.partial_ages);

        setFormValues(parsedMeasurements);
        setPartialAges(parsedPartialAges);
        setFinalResults({
          biologicalAge: latestTest.biological_age,
          differentialAge: latestTest.differential_age,
        });
        setCronoAge(latestTest.chronological_age); // Asegurarse de que la edad cronológica sea la del test guardado
        setNotification({ message: "Último test biofísico cargado.", type: 'success' });
      } else {
        setNotification({ message: "No hay tests biofísicos previos para este paciente.", type: 'info' } as any); // Usar type: 'info' si tienes
      }

    } catch (err) {
      console.error('Error al cargar último test biofísico:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido al cargar el último test biofísico.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [patientId]); // Dependencia: patientId para recargar si cambia de paciente

  const fetchBoards = useCallback(async () => { // Hacemos useCallback para fetchBoards
    setIsLoading(true); // Se establecerá a false en fetchLastBiophysicalTest
    setError(null); // Se establecerá a null en fetchLastBiophysicalTest
    try {
      console.log('Cargando baremos desde la API...');
      const res = await fetch('/api/boards');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: No se pudieron cargar los baremos de cálculo.`);
      }
      
      const data = await res.json();
      console.log(`Baremos cargados: ${data.length} registros`);
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('La base de datos de baremos está vacía. Ejecute el comando de seed para poblar los datos.');
      }
      
      setBoards(data);
    } catch (err) {
      console.error('Error al cargar baremos:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido al cargar los baremos.');
      }
    } // Nota: finally block se maneja en fetchLastBiophysicalTest para setIsLoading
  }, []);

  useEffect(() => {
    fetchBoards();
    fetchLastBiophysicalTest(); // Llamamos a la nueva función de carga de tests
  }, [fetchBoards, fetchLastBiophysicalTest]); // Dependencias: Asegurarse de que se ejecuten cuando las funciones cambien

  // Auto-cerrar notificación después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Asegurarse de convertir a número si es un campo numérico
    const parsedValue = (name.includes('fat') || name.includes('imc') || name.includes('digital_reflex') || 
                         name.includes('visual_accommodation') || name.includes('static_balance') || 
                         name.includes('skin_hydration') || name.includes('systolic') || 
                         name.includes('diastolic') || name.includes('pulse')) 
                         ? parseFloat(value) : value;

    setFormValues(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleCalculate = () => {
    if (isLoading) {
      setNotification({ message: "Los baremos aún se están cargando. Por favor, espere un momento.", type: 'error' });
      return;
    }
    
    if (error) {
      setNotification({ message: "No se puede calcular porque hay un error con los baremos.", type: 'error' });
      return;
    }

    if (boards.length === 0) {
      setNotification({ message: "No hay baremos disponibles para realizar el cálculo.", type: 'error' });
      return;
    }

    try {
      // Asegúrate de que los formValues tengan el tipo correcto para calculateBiofisicaResults
      const currentFormValues: FormValues = { ...formValues }; // Copia para asegurar mutabilidad

      // Forzar la conversión a número para los campos relevantes antes de pasarlos a calculateBiofisicaResults
      // La función calculateBiofisicaResults espera números.
      const transformedFormValues: { [key: string]: number } = {};
      for (const key in currentFormValues) {
        const val = currentFormValues[key];
        if (typeof val === 'string' && !isNaN(parseFloat(val))) {
          transformedFormValues[key] = parseFloat(val);
        } else if (typeof val === 'number') {
          transformedFormValues[key] = val;
        }
        // else, dejar como está o manejar como undefined si no es numérico y no relevante para el cálculo
      }
      
      const results = calculateBiofisicaResults(
        boards, 
        transformedFormValues, // Usamos los valores transformados
        cronoAge, 
        formValues.gender
      );
      
      setFinalResults({
        biologicalAge: results.biologicalAge,
        differentialAge: results.differentialAge,
      });
      setPartialAges(results.partialAges);
      
      setNotification({ message: "Cálculo completado exitosamente", type: 'success' });
      console.log('Cálculo completado:', results);
    } catch (calcError) {
      console.error('Error en el cálculo:', calcError);
      let errorMessage = "Verifique los datos ingresados.";
      if (calcError instanceof Error) {
        errorMessage = calcError.message;
      }
      setNotification({ message: `Error al realizar el cálculo. ${errorMessage}`, type: 'error' });
    }
  };
  
  const handleSave = async () => {
    if (finalResults.biologicalAge === 0) {
      setNotification({ message: "Debe calcular los resultados antes de guardar.", type: 'error' });
      return;
    }
  
    setIsSaving(true);
    try {
      const testData = {
        patientId, // Ya es string
        chronologicalAge: cronoAge,
        biologicalAge: finalResults.biologicalAge,
        differentialAge: finalResults.differentialAge,
        gender: formValues.gender,
        isAthlete: formValues.is_athlete === '1',
        measurements: formValues, // Objeto completo con los inputs
        partialAges: partialAges, // Objeto completo con los resultados parciales
        testDate: new Date().toISOString(), // Fecha actual del test
      };
  
      const response = await fetch('/api/biophysics-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error desconocido al guardar el test.');
      }
  
      setNotification({ message: "Test biofísico guardado exitosamente", type: 'success' });
      console.log("Test guardado exitosamente");
      
      // Notificar al componente padre que se ha guardado un test para que pueda refrescar
      onSaveTest(); 
  
    } catch (error) {
      console.error('Error al guardar:', error);
      const errorMessage = error instanceof Error ? error.message : "Un error desconocido ocurrió.";
      setNotification({ message: `Error al guardar el test. ${errorMessage}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (name: string, placeholder = "Valor") => (
    <input 
      type="number" 
      step="any" 
      name={name} 
      value={formValues[name] !== undefined && formValues[name] !== null ? formValues[name] : ''} // Manejar undefined/null
      onChange={handleChange} 
      placeholder={placeholder}  
      className="mt-1 block w-full rounded-md border-gray-300 bg-white p-2 text-sm text-black shadow-sm focus:border-[#23BCEF] focus:ring-[#23BCEF] disabled:bg-gray-200" 
      disabled={isLoading || !!error}
    />
  );

  const renderTripleInput = (baseName: string) => (
    <div className="grid grid-cols-3 gap-2 mt-1">
      {renderInput(`${baseName}_1`, 'Medición 1')}
      {renderInput(`${baseName}_2`, 'Medición 2')}
      {renderInput(`${baseName}_3`, 'Medición 3')}
    </div>
  );
  
  const renderPartialAge = (name: string) => {
    const { color, status } = getAgeStatusColor(partialAges[name], cronoAge);
    return (
      <div className="mt-1 p-2 bg-[#1E2A47]/80 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Edad Calculada: {partialAges[name] ? partialAges[name]?.toFixed(2) : '--'}
          </span>
          <span className={`text-xs font-bold ${color}`}>
            {status}
          </span>
        </div>
      </div>
    );
  };

  // Datos para los gráficos
  const chartItems = [
    { name: 'fat', label: '% Grasa' },
    { name: 'imc', label: 'IMC' },
    { name: 'digital_reflex', label: 'Reflejos Digitales' },
    { name: 'visual_accommodation', label: 'Acomodación Visual' },
    { name: 'static_balance', label: 'Balance Estático' },
    { name: 'skin_hydration', label: 'Hidratación Cutánea' },
    { name: 'systolic', label: 'Presión Sistólica' },
    { name: 'diastolic', label: 'Presión Diastólica' },
    { name: 'pulse', label: 'Pulso en Reposo' },
  ];

  // Color para resultados finales
  const finalResultColor = getAgeStatusColor(finalResults.biologicalAge || null, cronoAge);

  return (
    <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      {/* Notificación */}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Columna de Panel de Control (Inputs) */}
        <div className="lg:col-span-3 p-6 bg-[#293B64] rounded-lg shadow-2xl text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Panel de Control</h3>
            <p className="text-sm text-gray-400">Paciente: {patientName}</p>
          </div>
          
          {isLoading ? (
            <LoadingMessage message="Cargando Baremos de Cálculo y Datos Anteriores..." />
          ) : error ? (
            <ErrorMessage  
              message={error} 
              suggestion="Asegúrese de que la base de datos ha sido poblada. Ejecute: npm run seed"
              onRetry={() => { fetchBoards(); fetchLastBiophysicalTest(); }} // Reintentar ambos fetch
            />
          ) : (
            <fieldset>
              <div className="p-4 bg-[#1E2A47]/60 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Edad Cronológica</label>
                    <input 
                      type="number" 
                      value={cronoAge} 
                      onChange={(e) => setCronoAge(Number(e.target.value))} 
                      className="mt-1 block w-full p-2 rounded-md border-gray-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Género</label>
                    <select 
                      name="gender" 
                      value={formValues.gender} 
                      onChange={handleChange} 
                      className="mt-1 block w-full p-2 rounded-md border-gray-500 bg-white text-black"
                    >
                      <option>Masculino</option>
                      <option>Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">¿Es Atleta?</label>
                    <select 
                      name="is_athlete" 
                      value={formValues.is_athlete} 
                      onChange={handleChange} 
                      className="mt-1 block w-full p-2 rounded-md border-gray-500 bg-white text-black"
                    >
                      <option value="0">No</option>
                      <option value="1">Sí</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div>
                  <label className="font-medium text-sm text-gray-300">% Grasa</label>
                  {renderInput('fat')}
                  {renderPartialAge('fat')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Índice de Masa Corporal (IMC)</label>
                  {renderInput('imc')}
                  {renderPartialAge('imc')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Reflejos Digitales (ms)</label>
                  {renderTripleInput('digital_reflex')}
                  {renderPartialAge('digital_reflex')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Acomodación Visual (dioptrías)</label>
                  {renderInput('visual_accommodation')}
                  {renderPartialAge('visual_accommodation')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Balance Estático (seg)</label>
                  {renderTripleInput('static_balance')}
                  {renderPartialAge('static_balance')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Hidratación Cutánea (%)</label>
                  {renderInput('skin_hydration')}
                  {renderPartialAge('skin_hydration')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Tensión Arterial Sistólica (mmHg)</label>
                  {renderInput('systolic')}
                  {renderPartialAge('systolic')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Tensión Arterial Diastólica (mmHg)</label>
                  {renderInput('diastolic')}
                  {renderPartialAge('diastolic')}
                </div>
                <div>
                  <label className="font-medium text-sm text-gray-300">Pulso en Reposo (lpm)</label>
                  {renderInput('pulse')}
                  {renderPartialAge('pulse')}
                </div>
              </div>
            </fieldset>
          )}
        </div>

        {/* Columna de Resultados y Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resultados Finales */}
          <div className={`p-6 rounded-lg shadow-lg ${finalResultColor.bgColor} border-2 ${finalResultColor.color.replace('text-', 'border-')}`}>
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Resultados Finales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edad Biofísica</label>
                <input 
                  type="text" 
                  readOnly 
                  value={finalResults.biologicalAge > 0 ? finalResults.biologicalAge.toFixed(2) : ''} 
                  className="mt-1 block w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edad Diferencial</label>
                <input 
                  type="text" 
                  readOnly 
                  value={finalResults.differentialAge !== 0 ? `${finalResults.differentialAge > 0 ? '+' : ''}${finalResults.differentialAge.toFixed(2)} años` : ''} 
                  className="mt-1 block w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            {finalResults.biologicalAge > 0 && (
              <div className={`mt-4 text-center py-2 rounded font-bold ${finalResultColor.color}`}>
                Estado General: {finalResultColor.status}
              </div>
            )}
          </div>
          
          {/* Gráficos por Items */}
          <div className="p-6 bg-white dark:bg-[#293B64] rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} />
              Gráficos por Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chartItems.map((item) => (
                <ItemChart
                  key={item.name}
                  name={item.name}
                  partialAge={partialAges[item.name]}
                  cronoAge={cronoAge}
                  label={item.label}
                />
              ))}
            </div>
          </div>
          
          {/* Botones de Acción */}
          <div className="pt-6 flex justify-end gap-3">
            <button 
              onClick={handleCalculate} 
              disabled={isLoading || !!error} 
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faCalculator} /> Calcular
            </button>
            <button 
              onClick={handleSave} 
              disabled={isLoading || !!error || finalResults.biologicalAge === 0 || isSaving} 
              className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              onClick={onBack} 
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#23BCEF] text-white rounded-lg hover:bg-[#1fa9d6]"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
