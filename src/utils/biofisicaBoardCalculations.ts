// src/utils/biofisicaBoardCalculations.ts

import type { Board, Range } from '@prisma/client';

// Tipo extendido para facilitar el manejo de datos, asegurando que cada Board tenga sus Ranges
export type BoardWithRanges = Board & {
  ranges: Range[];
};

// Tipo para los valores del formulario que recibimos para el cálculo
interface CalculationFormValues {
  [key: string]: number;
}

// Tipo para los resultados de las edades parciales
interface PartialAges {
  [key: string]: number | null;
}

/**
 * Encuentra el baremo (Range) específico que corresponde a los datos del paciente.
 * @param board El tipo de test (ej. % Grasa) con todos sus baremas.
 * @param cronoAge La edad cronológica del paciente.
 * @param gender El género del paciente.
 * @param isAthlete Si el paciente es atleta.
 * @param inputValue El valor medido para este test.
 * @returns El objeto Range correspondiente o null si no se encuentra.
 */
function findMatchingRange(
  board: BoardWithRanges,
  cronoAge: number,
  gender: 'Masculino' | 'Femenino',
  isAthlete: boolean,
  inputValue: number
): Range | null {
  // 1. Filtra los rangos que aplican a la edad, género y condición de atleta del paciente.
  const relevantRanges = board.ranges.filter(r => 
    cronoAge >= r.min_age && 
    cronoAge <= r.max_age &&
    r.gender === gender &&
    r.is_athlete === isAthlete
  );
  
  // 2. Dentro de esos rangos aplicables, encuentra aquel cuyo rango de valores (min_value, max_value) contiene el valor ingresado.
  return relevantRanges.find(r => inputValue >= r.min_value && inputValue <= r.max_value) || null;
}

/**
 * Calcula la edad biológica parcial usando interpolación lineal.
 * @param range El baremo específico encontrado.
 * @param inputValue El valor medido.
 * @param isInverse Si la lógica del test es inversa (menos es mejor).
 * @returns La edad biológica parcial calculada.
 */
function calculatePartialAge(
  range: Range,
  inputValue: number,
  isInverse: boolean
): number {
  const valueRange = range.max_value - range.min_value;
  const ageRange = range.bio_age_max - range.bio_age_min;

  // Evitar división por cero si el rango de valores es un punto único.
  if (valueRange === 0) {
    return range.bio_age_min;
  }

  // Calcula la proporción del valor de entrada dentro de su rango (0 a 1).
  let proportion = (inputValue - range.min_value) / valueRange;
  
  // Si la prueba es inversa, un valor más alto significa una proporción "peor", así que invertimos.
  if (isInverse) {
    proportion = 1 - proportion;
  }

  // Aplica la proporción al rango de edad biológica para obtener el resultado final.
  return range.bio_age_min + (proportion * ageRange);
}

/**
 * Función principal que orquesta todos los cálculos del test biofísico.
 */
export function calculateBiofisicaResults(
  boards: BoardWithRanges[],
  formValues: CalculationFormValues,
  cronoAge: number,
  gender: 'Masculino' | 'Femenino',
  isAthlete: boolean
): { biologicalAge: number; differentialAge: number; partialAges: PartialAges } {
  
  const partialAges: PartialAges = {};
  const validPartialAges: number[] = [];

  // Mapeo de los campos del formulario a los nombres de los 'Board' en la BD.
  // Excluimos 'pulse' como se solicitó.
  const testMappings = {
    fat: 'fat',
    imc: 'imc',
    digital_reflex: 'digital_reflex',
    visual_accommodation: 'visual_accommodation',
    static_balance: 'static_balance',
    skin_hydration: 'skin_hydration',
    systolic: 'systolic',
    diastolic: 'diastolic',
  };

  for (const [formKey, boardName] of Object.entries(testMappings)) {
    const board = boards.find(b => b.name === boardName);
    const value = formValues[formKey];

    if (board && value !== undefined && !isNaN(value)) {
      const matchingRange = findMatchingRange(board, cronoAge, gender, isAthlete, value);
      
      if (matchingRange) {
        const partialAge = calculatePartialAge(matchingRange, value, board.inverse);
        partialAges[formKey] = partialAge;
        validPartialAges.push(partialAge);
      } else {
        partialAges[formKey] = null; // No se encontró un baremo aplicable
      }
    } else {
      partialAges[formKey] = null; // El valor no fue ingresado o no es un número
    }
  }

  // Calcular la Edad Biofísica Final promediando las edades parciales válidas.
  const biologicalAge = validPartialAges.length > 0
    ? validPartialAges.reduce((sum, age) => sum + age, 0) / validPartialAges.length
    : 0;

  // Calcular la Edad Diferencial.
  const differentialAge = biologicalAge > 0 ? biologicalAge - cronoAge : 0;

  return { 
    biologicalAge, 
    differentialAge, 
    partialAges 
  };
}