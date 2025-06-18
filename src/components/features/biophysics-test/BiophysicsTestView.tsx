'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faSave, faArrowLeft, faSpinner, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { getBiophysicsBoardsAndRanges, saveBiophysicsTest } from '@/lib/actions/biophysicsTestActions';
import { calculateBiofisicaResults } from '@/utils/biofisicaCalculations';
import type { Board, Range } from '@prisma/client';

type BoardWithRanges = Board & { ranges: Range[] };

interface TestViewProps {
  patientId: string;
  patientName: string;
  initialCronoAge: number;
  onBack: () => void;
  onSaveSuccess: () => void;
}

// Pequeño componente para mostrar los resultados de cada item
const ResultItem = ({ label, value, cronoAge }: { label: string, value: number | null, cronoAge: number }) => {
    // Lógica de colores (simplificada)
    const color = value ? (value > cronoAge ? 'text-red-500' : 'text-green-500') : 'text-gray-400';
    return (
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{label}</span>
            <span className={`font-bold text-lg ${color}`}>{value !== null ? value.toFixed(0) : '-'}</span>
        </div>
    );
};

export default function BiophysicsTestView({ patientId, patientName, initialCronoAge, onBack, onSaveSuccess }: TestViewProps) {
  const [boards, setBoards] = useState<BoardWithRanges[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [partialAges, setPartialAges] = useState<{ [key: string]: number | null }>({});
  const [finalResult, setFinalResult] = useState<{ bio: number, diff: number } | null>(null);
  const [gender, setGender] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [isAthlete, setIsAthlete] = useState(false);
  
  const loadBoards = useCallback(async () => {
    try {
      const boardsData = await getBiophysicsBoardsAndRanges();
      setBoards(boardsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadBoards(); }, [loadBoards]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    const numericFormValues: { [key: string]: number } = {};
    Object.keys(formValues).forEach(key => {
        numericFormValues[key] = parseFloat(formValues[key]);
    });

    const results = calculateBiofisicaResults(boards, numericFormValues, initialCronoAge, gender, isAthlete);
    setPartialAges(results.partialAges);
    setFinalResult({ bio: results.biologicalAge, diff: results.differentialAge });
    setIsCalculating(false);
  };
  
  const handleSave = async () => {
    if (!finalResult) return;
    setIsSaving(true);
    const result = await saveBiophysicsTest({
        patientId,
        chronological_age: initialCronoAge,
        biological_age: finalResult.bio,
        differential_age: finalResult.diff,
        form_data: { ...formValues, gender, is_athlete: isAthlete },
    });
    if (result.success) {
      onSaveSuccess();
    } else {
      setError(result.message || 'Error al guardar el test.');
    }
    setIsSaving(false);
  };
  
  const renderField = (name: string, placeholder: string, type: 'single' | 'triple' = 'single') => (
    <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">{placeholder}</label>
        {type === 'single' ? (
             <input type="number" name={name} value={formValues[name] || ''} onChange={handleChange} placeholder="Valor" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"/>
        ) : (
            <div className="grid grid-cols-3 gap-2">
                <input type="number" name={`${name}_1`} placeholder="Medición 1" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
                <input type="number" name={`${name}_2`} placeholder="Medición 2" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
                <input type="number" name={`${name}_3`} placeholder="Medición 3" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"/>
            </div>
        )}
        <div className="mt-1 text-right text-cyan-400 font-mono text-sm h-5">
            {partialAges[name] ? `Edad Parcial: ${partialAges[name]?.toFixed(0)}` : ''}
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel Izquierdo: Formulario */}
      <div className="lg:col-span-2 bg-[#293B64] text-white p-6 rounded-xl shadow-2xl space-y-4">
        <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-400/30 pb-3">Formulario Test Biofísico - {patientName}</h2>
        {/* ... (resto del formulario) ... */}
         {renderField('fat', '% Grasa')}
         {renderField('imc', 'Índice de Masa Corporal (IMC)')}
         {renderField('digital_reflex', 'Reflejos Digitales (ms)', 'triple')}
         {renderField('visual_accommodation', 'Acomodación Visual (cm)')}
         {renderField('static_balance', 'Balance Estático (seg)', 'triple')}
         {renderField('skin_hydration', 'Hidratación Cutánea (%)')}
         {renderField('systolic', 'Tensión Arterial Sistólica (mmHg)')}
         {renderField('diastolic', 'Tensión Arterial Diastólica (mmHg)')}
      </div>
      {/* Panel Derecho: Resultados */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Resultados por Ítem</h3>
          <div className="space-y-2 mb-6">
             {boards.map(b => <ResultItem key={b.id} label={b.description} value={partialAges[b.name] ?? null} cronoAge={initialCronoAge} />)}
          </div>
          <div className="pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
             {finalResult && (
                 <div className="text-center">
                     <p className="text-sm text-gray-500 dark:text-gray-400">Edad Biológica Final</p>
                     <p className="text-5xl font-bold text-cyan-500">{finalResult.bio}</p>
                     <p className={`text-lg font-semibold ${finalResult.diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                         Diferencial: {finalResult.diff > 0 ? '+' : ''}{finalResult.diff.toFixed(1)} años
                     </p>
                 </div>
             )}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
              <button onClick={handleCalculate} disabled={isCalculating} className="p-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition">
                  {isCalculating ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Calcular'}
              </button>
              <button onClick={handleSave} disabled={isSaving || !finalResult} className="p-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:bg-gray-400">
                  {isSaving ? <FontAwesomeIcon icon={faSpinner} spin/> : 'Guardar'}
              </button>
              <button onClick={onBack} className="p-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition">Volver</button>
          </div>
      </div>
    </div>
  );
}
