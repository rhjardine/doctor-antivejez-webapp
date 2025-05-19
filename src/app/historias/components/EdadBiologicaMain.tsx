// src/app/historias/components/EdadBiologicaMain.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react'; // useMemo añadido
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faProcedures, faVial, faAtom, faDna, faFilePdf, 
  faChartLine, faChartBar, faChartPie, faDotCircle 
} from '@fortawesome/free-solid-svg-icons';

import MetricCardLarge from '@/components/MetricCardLarge';
import AgingProfileCard from '@/components/AgingProfileCard';
import ChartDisplay from '@/components/UI/ChartDisplay';
import { cn } from '@/utils/helpers';

// Asumiendo que este tipo está definido en algún lugar, si no, definirlo aquí o importarlo
type TrendColor = 'success' | 'warning' | 'danger' | 'info';

interface EdadBiologicaMainProps {
  cronoAge: number;
  patientId: string;
  onNavigateToTestBiofisico: () => void;
}

const edadBiologicaData = {
  biofisica: 55,
  bioquimica: 53,
  ortomolecular: 50,
  genetica: 58,

  perfil: [ 
    { id: 'bio_general_perfil', title: 'Edad Biológica', tag: 'Celular', value: 45 },
    { id: 'biofisica_perfil', title: 'Edad Biofísica', tag: 'Cardio-Fitness', value: 43 },
    { id: 'ortomolecular_perfil', title: 'Edad Ortomolecular', tag: 'Nutrientes', value: 52 },
    { id: 'bioquimica_perfil', title: 'Edad Bioquímica', tag: 'Metabólica', value: 46 },
    { id: 'genetica_perfil', title: 'Edad Genética', tag: 'SNPs', value: 49 },
  ],
  trendData: { // Asegúrate de que estos colores estén definidos en tus variables CSS y Tailwind config
    '6m': { 
      labels: ['Hace 6m', 'Hace 5m', 'Hace 4m', 'Hace 3m', 'Hace 2m', 'Actual'], 
      datasets: [ 
        { 
          label: 'EB Biofísica', 
          data: [57, 56, 56, 57, 55, 55], 
          borderColor: 'rgb(var(--color-primary-rgb))', 
          backgroundColor: 'rgba(var(--color-primary-rgb), 0.2)', // Para relleno de área en líneas
          tension: 0.3, 
          fill: true,
          pointBackgroundColor: 'rgb(var(--color-primary-rgb))',
          pointBorderColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBorderColor: 'rgb(var(--color-primary-rgb))',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5, // Grosor de línea
        }, 
        { 
          label: 'EB Bioquímica', 
          data: [55, 54, 55, 53, 54, 53], 
          borderColor: 'rgb(var(--color-success-rgb))', 
          backgroundColor: 'rgba(var(--color-success-rgb), 0.2)',
          tension: 0.3, 
          fill: true,
          pointBackgroundColor: 'rgb(var(--color-success-rgb))',
          pointBorderColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBorderColor: 'rgb(var(--color-success-rgb))',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
        },
        { 
          label: 'EB Ortomolecular', 
          data: [52, 51, 52, 51, 50, 50], 
          borderColor: 'rgb(var(--color-warning-rgb))', 
          backgroundColor: 'rgba(var(--color-warning-rgb), 0.2)',
          tension: 0.3, 
          fill: true,
          pointBackgroundColor: 'rgb(var(--color-warning-rgb))',
          pointBorderColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))',
          pointHoverBorderColor: 'rgb(var(--color-warning-rgb))',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5,
        },
      ] 
    },
    '1y': { 
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], 
        datasets: [ 
          { label: 'EB Biofísica', data: [58,57,56,56,57,55,55,55,56,55,55,55], borderColor: 'rgb(var(--color-primary-rgb))', backgroundColor: 'rgba(var(--color-primary-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-primary-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-primary-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 }, 
          { label: 'EB Bioquímica', data: [56,55,54,55,53,54,53,53,54,52,53,53], borderColor: 'rgb(var(--color-success-rgb))', backgroundColor: 'rgba(var(--color-success-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-success-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-success-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 },
          { label: 'EB Ortomolecular', data: [53,52,52,51,51,50,50,50,51,50,50,50], borderColor: 'rgb(var(--color-warning-rgb))', backgroundColor: 'rgba(var(--color-warning-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-warning-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-warning-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 },
        ]
    },
    'all': { 
        labels: ['2022-T1', '2022-T2', '2022-T3', '2022-T4', '2023-T1', '2023-T2', '2023-T3', '2023-T4', '2024-T1'], 
        datasets: [ 
          { label: 'EB Biofísica', data: [60,59,58,58,57,56,55,55,55], borderColor: 'rgb(var(--color-primary-rgb))', backgroundColor: 'rgba(var(--color-primary-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-primary-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-primary-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 }, 
          { label: 'EB Bioquímica', data: [57,56,55,55,54,53,53,53,53], borderColor: 'rgb(var(--color-success-rgb))', backgroundColor: 'rgba(var(--color-success-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-success-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-success-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 },
          { label: 'EB Ortomolecular', data: [54,53,52,52,51,51,50,50,50], borderColor: 'rgb(var(--color-warning-rgb))', backgroundColor: 'rgba(var(--color-warning-rgb), 0.2)', tension: 0.3, fill: true, pointBackgroundColor: 'rgb(var(--color-warning-rgb))', pointBorderColor: 'rgb(var(--color-bg-card-light))', pointHoverBackgroundColor: 'rgb(var(--color-bg-card-light))', pointHoverBorderColor: 'rgb(var(--color-warning-rgb))', pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5 },
        ]
    },
  }
};

const CHART_TYPES = [
  { type: 'line', icon: faChartLine, label: 'Línea' },
  { type: 'bar', icon: faChartBar, label: 'Barra' },
  { type: 'radar', icon: faDotCircle, label: 'Radar' },
  { type: 'pie', icon: faChartPie, label: 'Torta' },
] as const;


export default function EdadBiologicaMain({ cronoAge, patientId, onNavigateToTestBiofisico }: EdadBiologicaMainProps) {
  const [selectedRange, setSelectedRange] = useState<keyof typeof edadBiologicaData.trendData>('1y');
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'bar' | 'radar' | 'pie' | 'polarArea'>(CHART_TYPES[0].type);

  const currentChartRawData = edadBiologicaData.trendData[selectedRange];
  const handleGenerateReport = () => { alert('Generando informe (simulación)...'); };

  const determineProfileTrendColor = (biologicalAgeValue: number, chronologicalAge: number): TrendColor => {
    const diff = biologicalAgeValue - chronologicalAge;
    if (diff < -2) return 'success';
    if (diff > 2) return 'danger';
    if (diff > 0) return 'warning';
    if (diff <= 0 && diff >=-2) return 'success';
    return 'info';
  };

  // Procesar datos del gráfico para ajustar backgroundColor para gráficos de barras
  const processedChartData = useMemo(() => {
    if (!currentChartRawData || !currentChartRawData.datasets) {
      return { labels: [], datasets: [] };
    }
    return {
      ...currentChartRawData,
      datasets: currentChartRawData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: selectedChartType === 'bar' 
          ? dataset.borderColor // Usa el borderColor como color sólido para las barras
          : dataset.backgroundColor, // Usa el backgroundColor original (con opacidad) para otros tipos
        // Para gráficos de barras, podrías querer un hover diferente:
        hoverBackgroundColor: selectedChartType === 'bar' 
          ? // Lógica para oscurecer o aclarar el dataset.borderColor
            // Ejemplo simple: si es una variable CSS, podrías tener una variante --color-primary-darker-rgb
            // O aplicar una opacidad diferente o un color fijo para hover en barras.
            // Por ahora, lo dejamos igual que backgroundColor para simplicidad.
            dataset.borderColor 
          : dataset.pointHoverBackgroundColor, // Para líneas, usa lo definido para puntos
      }))
    };
  }, [currentChartRawData, selectedChartType]);


  return (
    <div className="space-y-8">
      {/* Sección: Edad Cronológica Vs Edad Biológica */}
      <section aria-labelledby="bio-age-comparison-title">
        <h2 id="bio-age-comparison-title" className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">
          Edad Cronológica Vs Edad Biológica (Paciente Real: {cronoAge} años)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onNavigateToTestBiofisico}
            className="bg-primary text-white p-4 rounded-lg shadow-md hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-bg-card-dark transition-all duration-150 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center h-full"
            title="Realizar o ver Test Edad Biofísica"
          >
            <FontAwesomeIcon icon={faProcedures} className="text-3xl mb-2 opacity-80" />
            <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD BIOFÍSICA</h3>
            <p className="text-4xl font-bold">{edadBiologicaData.biofisica} <span className="text-lg font-normal">años</span></p>
          </button>

          <MetricCardLarge title="Edad Bioquímica" value={edadBiologicaData.bioquimica} icon={faVial} unit="años" cardColor="bg-primary text-white" />
          <MetricCardLarge title="Edad Ortomolecular" value={edadBiologicaData.ortomolecular} icon={faAtom} unit="años" cardColor="bg-primary text-white" />
          <MetricCardLarge title="Edad Genética" value={edadBiologicaData.genetica} icon={faDna} unit="años" cardColor="bg-primary text-white" />
        </div>
      </section>

      {/* Sección: Perfil Multidimensional de Envejecimiento */}
      <section aria-labelledby="aging-profile-title" className="pt-6">
        <h2 id="aging-profile-title" className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">
          Perfil Multidimensional de Envejecimiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {edadBiologicaData.perfil.map(item => {
            const actualDiff = item.value - cronoAge; 
            return (
              <AgingProfileCard
                key={item.id}
                title={item.title}
                biologicalAge={item.value}
                chronoAgeDiff={actualDiff}
                tag={item.tag}
                vsCronoText={`vs. Edad Cronológica (${cronoAge})`}
                trendColorIndicator={determineProfileTrendColor(item.value, cronoAge)}
              />
            );
          })}
        </div>
      </section>

      {/* Sección: Controles y Gráfico de Tendencias */}
      <section aria-labelledby="trend-chart-title" className="pt-8">
        {/* CONTENEDOR DE CONTROLES DE GRÁFICO MEJORADO */}
        <div className="mb-6 p-4 bg-bg-card-light dark:bg-bg-card-dark rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 border border-border-light dark:border-border-dark">
          <div className="w-full sm:w-auto">
            <label htmlFor="range-select" className="block text-sm font-medium text-text-light-muted dark:text-text-dark-muted mb-1 sm:mb-0 sm:mr-2 sm:inline">Rango:</label>
            <select
              id="range-select"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as keyof typeof edadBiologicaData.trendData)}
              className="w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-text-light-base dark:text-text-dark-base text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 shadow-sm appearance-none"
            >
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último año</option>
              <option value="all">Todos</option>
            </select>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-end space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg shadow-inner">
            {CHART_TYPES.map((chart) => (
              <button
                key={chart.type}
                onClick={() => setSelectedChartType(chart.type as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-700 focus:ring-primary transition-colors duration-150 ease-in-out",
                  selectedChartType === chart.type
                    ? "bg-primary text-white shadow-md"
                    : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500"
                )}
                title={`Gráfico de ${chart.label}`}
              >
                <FontAwesomeIcon icon={chart.icon} className="w-4 h-4 mr-0 sm:mr-1.5" />
                <span className="hidden sm:inline">{chart.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-bg-card-light dark:bg-bg-card-dark p-4 rounded-xl shadow-xl relative border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold mb-1 text-text-light-base dark:text-text-dark-base">
            Evolución Edades Biológicas
          </h3>
          <p className="text-xs text-text-light-muted dark:text-text-dark-muted mb-4">Comparativa de tendencias.</p>
          
          <div className="h-[350px] sm:h-[380px] md:h-[400px]">
            <ChartDisplay 
              type={selectedChartType} 
              data={processedChartData} // Usar los datos procesados
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(var(--color-border-light), 0.3)' },
                    ticks: { color: 'rgb(var(--color-text-muted-light))', padding: 10 }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: 'rgb(var(--color-text-muted-light))', padding: 10 }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                    align: 'end' as const,
                    labels: { 
                      color: 'rgb(var(--color-text-base-light))',
                      padding: 20,
                      font: { size: 13, weight: '500' },
                      usePointStyle: true,
                      boxWidth: 10, // Tamaño del punto de estilo
                      pointStyle: 'circle', // Asegura que sea un círculo
                    }
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(var(--color-secondary-rgb), 0.95)',
                    titleColor: 'rgb(var(--color-text-on-secondary))',
                    bodyColor: 'rgb(var(--color-text-on-secondary))',
                    padding: 12,
                    cornerRadius: 6,
                    boxPadding: 4,
                    titleFont: { weight: 'bold', size: 14 },
                    bodyFont: { size: 12 },
                    displayColors: true,
                    borderColor: 'rgba(var(--color-primary-rgb), 0.5)',
                    borderWidth: 1,
                    usePointStyle: true, // Usa el estilo de punto en el tooltip también
                  }
                },
                interaction: {
                  mode: 'index' as const,
                  intersect: false,
                },
                elements: {
                    line: {
                        borderWidth: 2.5,
                    },
                    point: {
                        radius: 0, 
                        hoverRadius: 7, // Radio del punto en hover
                        hitRadius: 15,  // Área de "hit" más grande
                    },
                    bar: { // Estilos para gráficos de barras
                        borderRadius: 4, // Bordes redondeados para las barras
                        borderSkipped: false, // Para que borderRadius aplique a todas las esquinas
                    }
                }
              }} 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2.5 text-sm bg-primary text-white font-semibold rounded-lg hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-bg-card-dark transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
            Generar Informe PDF
          </button>
        </div>
      </section>
    </div>
  );
}