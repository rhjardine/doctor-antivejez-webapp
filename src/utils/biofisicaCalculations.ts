import type { Board, Range } from '@prisma/client';

type BoardWithRanges = Board & { ranges: Range[] };

interface FormValues {
  [key: string]: string | number;
}

interface CalculationResult {
  biologicalAge: number;
  differentialAge: number;
  partialAges: { [key: string]: number | null };
}

/**
 * Realiza una interpolación lineal para encontrar un valor dentro de un rango.
 * @param x - El punto en el que se desea interpolar (edad biológica).
 * @param x0 - El punto de inicio del rango conocido (min_value).
 * @param y0 - El valor en el punto de inicio (min_age).
 * @param x1 - El punto final del rango conocido (max_value).
 * @param y1 - El valor en el punto final (max_age).
 * @returns El valor interpolado.
 */
function linearInterpolate(x: number, x0: number, y0: number, x1: number, y1: number): number {
  if (x1 - x0 === 0) return y0; // Evitar división por cero
  return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

/**
 * Calcula la edad biológica y las edades parciales basadas en los valores del formulario y los baremos.
 * @param boards - Array de baremos (boards con sus ranges) desde la base de datos.
 * @param formValues - Objeto con los valores ingresados por el usuario en el formulario.
 * @param cronoAge - La edad cronológica del paciente.
 * @param gender - El género del paciente ('Masculino' o 'Femenino').
 * @param isAthlete - Si el paciente es deportista.
 * @returns Un objeto con la edad biológica, diferencial y las edades parciales.
 */
export function calculateBiofisicaResults(
  boards: BoardWithRanges[],
  formValues: FormValues,
  cronoAge: number,
  gender: 'Masculino' | 'Femenino',
  isAthlete: boolean
): CalculationResult {
  const partialAges: { [key: string]: number | null } = {};
  const validPartialAges: number[] = [];

  for (const board of boards) {
    const inputValue = formValues[board.name];
    if (inputValue === undefined || inputValue === null || inputValue === '') {
      partialAges[board.name] = null;
      continue;
    }

    const numericValue = Number(inputValue);
    if (isNaN(numericValue)) {
      partialAges[board.name] = null;
      continue;
    }

    // Filtrar los rangos que aplican al paciente (por edad, género y si es deportista)
    const applicableRanges = board.ranges.filter(r => 
        cronoAge >= r.min_age && 
        cronoAge <= r.max_age &&
        r.gender === gender &&
        r.is_athlete === isAthlete
    );
    
    // Encontrar el rango específico que contiene el valor del usuario
    const targetRange = applicableRanges.find(r => 
        (numericValue >= r.min_value && numericValue <= r.max_value) ||
        (numericValue <= r.min_value && numericValue >= r.max_value) // Para rangos inversos
    );

    if (targetRange) {
      const { min_value, max_value, min_age, max_age } = targetRange;
      
      // La interpolación funciona igual para rangos normales e inversos
      const partialAge = linearInterpolate(numericValue, min_value, min_age, max_value, max_age);
      
      partialAges[board.name] = partialAge;
      // Excluimos 'pulso' del cálculo final de la edad biológica, si existe
      if (board.name !== 'pulse') {
        validPartialAges.push(partialAge);
      }
    } else {
      partialAges[board.name] = null; // No se encontró un rango aplicable
    }
  }

  const biologicalAge = validPartialAges.length > 0 
    ? validPartialAges.reduce((a, b) => a + b, 0) / validPartialAges.length 
    : 0;

  const differentialAge = biologicalAge > 0 ? biologicalAge - cronoAge : 0;

  return {
    biologicalAge: Math.round(biologicalAge),
    differentialAge,
    partialAges,
  };
}
