// src/components/UI/GaugeChart.tsx (Placeholder Básico - Necesita Chart.js)
'use client';
import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, DoughnutController } from 'chart.js';

// Registrar los elementos necesarios para Doughnut/Gauge
Chart.register(ArcElement, Tooltip, DoughnutController);

interface GaugeChartProps {
    value: number; // Valor porcentual (0-100)
    statusColor: 'success' | 'warning' | 'danger' | 'info' | 'primary';
    ageValue: number; // El valor numérico de la edad a mostrar
}

// Mapeo de colores de estado a colores HEX/RGB para Chart.js
const colorMap = {
  success: '#2DC653', // var(--success)
  warning: '#F9A826', // var(--warning)
  danger: '#E63946',  // var(--danger)
  info: '#5BC0EB',    // var(--info)
  primary: '#23BCEF', // var(--primary-color) - Asegúrate que coincida
};
const grayColor = '#E5E7EB'; // Gris claro para la parte no rellenada

export default function GaugeChart({ value, statusColor, ageValue }: GaugeChartProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'doughnut'>>();

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                // Destruir gráfico anterior si existe
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                const percentageValue = Math.max(0, Math.min(100, value || 0)); // Asegurar 0-100
                const chartColor = colorMap[statusColor] || colorMap.primary;

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [percentageValue, 100 - percentageValue],
                            backgroundColor: [chartColor, grayColor],
                            borderColor: [chartColor, grayColor], // O transparente
                            borderWidth: 1,
                            circumference: 180, // Medio círculo
                            rotation: 270,      // Empezar desde abajo
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 2, // Ajusta para que encaje bien
                        cutout: '75%', // Ancho del anillo
                        plugins: {
                            tooltip: { enabled: false }, // Deshabilitar tooltips
                            legend: { display: false } // Deshabilitar leyenda
                        },
                        events: [] // Deshabilitar eventos hover
                    }
                });
            }
        }
        // Cleanup al desmontar
        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [value, statusColor]); // Re-renderizar si cambian estos valores

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas ref={chartRef}></canvas>
            {/* Texto central */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-text-dark dark:text-dark-text -mt-2">
                    {ageValue}
                </span>
                <span className="text-xs text-text-light dark:text-dark-text-light -mt-1">
                    años
                </span>
            </div>
        </div>
    );
}