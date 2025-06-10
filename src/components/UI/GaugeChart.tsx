'use client';

import React from 'react';

interface GaugeChartProps {
  value: number;
  label: string;
  unit: string;
  differential: number;
  color: string;
  tag: string;
  tagColor: string;
}

// Componente para las gráficas de medidor circulares
export const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, unit, differential, color, tag, tagColor }) => {
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Usamos 100 como la edad máxima para el cálculo del porcentaje del medidor
  const maxAge = 100;
  const progress = Math.min(value, maxAge) / maxAge;
  const strokeDashoffset = circumference * (1 - progress);

  const differentialSign = differential > 0 ? '+' : '';
  const differentialColor = differential > 0 ? 'text-red-500' : 'text-green-500';

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">{label}</h3>
        <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full`} style={{ backgroundColor: tagColor }}>
          {tag}
        </span>
      </div>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>{value}</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{unit}</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">vs. Edad Cronológica</p>
        <p className={`text-lg font-bold ${differentialColor}`}>
          {differentialSign}{differential} años
        </p>
      </div>
    </div>
  );
};
