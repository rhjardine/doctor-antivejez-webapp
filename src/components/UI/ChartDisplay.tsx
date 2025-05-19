// src/components/UI/ChartDisplay.tsx
'use client';

import React from 'react';
import { Line, Bar, Radar, Pie, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrar todos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDisplayProps {
  type: 'line' | 'bar' | 'radar' | 'pie' | 'polarArea';
  data: any; 
  options?: any; 
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ type, data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const chartOptions = { ...defaultOptions, ...options };

  const processedData = { ...data };
  if ((type === 'pie' || type === 'polarArea') && processedData.datasets && Array.isArray(processedData.datasets)) {
    processedData.datasets = processedData.datasets.map((dataset: any) => { // La función map abre aquí
      if (!dataset.backgroundColor) {
        return {
          ...dataset,
          backgroundColor: [
            'rgb(35, 188, 239)',   // Primary
            'rgb(45, 198, 83)',    // Success
            'rgb(249, 168, 38)',   // Warning
            'rgb(91, 192, 235)',   // Info
            'rgb(220, 38, 38)',    // Danger
            'rgb(153, 102, 255)',  // Purple
            'rgb(255, 159, 64)',   // Orange
          ],
        };
      }
      return dataset;
    }); // La función map cierra aquí, antes del cierre del if
  }

  switch (type) {
    case 'line':
      return <Line data={processedData} options={chartOptions} />;
    case 'bar':
      return <Bar data={processedData} options={chartOptions} />;
    case 'radar':
      return <Radar data={processedData} options={chartOptions} />;
    case 'pie':
      return <Pie data={processedData} options={chartOptions} />;
    case 'polarArea':
      return <PolarArea data={processedData} options={chartOptions} />;
    default:
      console.warn(`Tipo de gráfico no soportado: ${type}`);
      return <p>Tipo de gráfico no soportado: {type}</p>;
  }
};

export default ChartDisplay;