'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BiofisicaField } from '../types/biofisica';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BiofisicaChartsProps {
  fields: BiofisicaField[];
}

const BiofisicaCharts: React.FC<BiofisicaChartsProps> = ({ fields }) => {
  const commonChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: false,
        min: 20,
        max: 100,
        title: { display: true, text: 'Edad (años)', font: { size: 10 } },
        ticks: { font: { size: 8 }, stepSize: 10 }
      },
      y: { ticks: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgb(41, 59, 100)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.x !== null) {
              label += `${context.parsed.x.toFixed(0)} años`;
            }
            return label;
          }
        }
      }
    },
    animation: {
      duration: 500
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-3">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Resultados Gráficos por Métrica</h3>
      {fields.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Seleccione un género para ver los campos y gráficos.</p>
      ) : (
        fields.map((field) => {
          const chartData: ChartData<'bar'> = {
            labels: ['Edad Abs.'],
            datasets: [
              {
                label: field.translate,
                data: [field.absolute_value ?? 0],
                backgroundColor: field.absolute_value !== null ? 'rgb(35, 188, 239)' : 'rgb(200, 200, 200)',
                borderColor: field.absolute_value !== null ? 'rgb(41, 59, 100)' : 'rgb(150, 150, 150)',
                borderWidth: 1,
                barThickness: 20,
              },
            ],
          };

          return (
            <div key={field.name} className="chart-item flex items-center border border-gray-200 dark:border-gray-600 p-2 rounded bg-gray-50 dark:bg-gray-600">
              <span className="chart-label text-xs font-medium text-gray-600 dark:text-gray-300 mr-3 w-28 text-right shrink-0">
                {field.translate.replace(/ \(.+?\)/g, '')}:
              </span>
              <div className="chart-canvas-container flex-grow h-10">
                <Bar options={commonChartOptions} data={chartData} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BiofisicaCharts;
