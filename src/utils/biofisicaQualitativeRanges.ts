export const QUALITATIVE_COLORS = {
  excellent: '#22c55e', // verde
  good: '#84cc16',     // verde claro
  normal: '#eab308',   // amarillo
  poor: '#f97316',     // naranja
  critical: '#ef4444'  // rojo
};

export function getQualitativeColor(value: number, ranges: { min: number; max: number }): string {
  const range = ranges.max - ranges.min;
  const percentage = (value - ranges.min) / range;

  if (percentage >= 0.8) return QUALITATIVE_COLORS.excellent;
  if (percentage >= 0.6) return QUALITATIVE_COLORS.good;
  if (percentage >= 0.4) return QUALITATIVE_COLORS.normal;
  if (percentage >= 0.2) return QUALITATIVE_COLORS.poor;
  return QUALITATIVE_COLORS.critical;
} 