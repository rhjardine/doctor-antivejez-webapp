'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faProcedures, faVial, faAtom, faDna, faFilePdf,
  faChartLine, faChartBar, faChartPie, faDotCircle
} from '@fortawesome/free-solid-svg-icons';
import MetricCardLarge from '@/components/MetricCardLarge';
import AgingProfileCard from '@/components/AgingProfileCard';
import ChartDisplay from '@/components/UI/ChartDisplay';
import { cn } from '@/utils/helpers';

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
  
  // Datos para gráficos de tendencia omitidos por brevedad...
};

const CHART_TYPES = [
  { type: 'line', icon: faChartLine, label: 'Línea' },
  { type: 'bar', icon: faChartBar, label: 'Barra' },
  { type: 'radar', icon: faDotCircle, label: 'Radar' },
  { type: 'pie', icon: faChartPie, label: 'Torta' },
] as const;

export default function EdadBiologicaMain({ 
  cronoAge, 
  patientId, 
  onNavigateToTestBiofisico 
}: EdadBiologicaMainProps) {
  const [selectedRange, setSelectedRange] = React.useState<string>('1y');
  const [selectedChartType, setSelectedChartType] = React.useState<'line' | 'bar' | 'radar' | 'pie'>('line');
  
  const handleGenerateReport = () => { 
    alert('Generando informe (simulación)...'); 
  };
  
  const determineProfileTrendColor = (biologicalAgeValue: number, chronologicalAge: number): TrendColor => {
    const diff = biologicalAgeValue - chronologicalAge;
    if (diff < -2) return 'success';
    if (diff > 2) return 'danger';
    if (diff > 0) return 'warning';
    if (diff <= 0 && diff >= -2) return 'success';
    return 'info';
  };
  
  return (
    <div className="space-y-8">
      {/* Sección: Edad Cronológica Vs Edad Biológica */}
      <section aria-labelledby="bio-age-comparison-title">
        <h2 id="bio-age-comparison-title" className="text-xl font-semibold mb-4 text-text-light-base dark:text-text-dark-base">
          Edad Cronológica Vs Edad Biológica (Paciente Real: {cronoAge} años)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Botón de Test de Edad Biofísica */}
          <button
            onClick={onNavigateToTestBiofisico}
            className="bg-[#23BCEF] text-white p-4 rounded-lg shadow-md hover:bg-[#23BCEF]/90 focus:outline-none focus:ring-2 focus:ring-[#23BCEF] focus:ring-offset-2 dark:focus:ring-offset-bg-card-dark transition-all duration-150 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center h-full"
            title="Realizar o ver Test Edad Biofísica"
          >
            <FontAwesomeIcon icon={faProcedures} className="text-3xl mb-2 opacity-80" />
            <h3 className="text-sm font-medium uppercase tracking-wider mb-1">EDAD BIOFÍSICA</h3>
            <p className="text-4xl font-bold">{edadBiologicaData.biofisica} <span className="text-lg font-normal">años</span></p>
          </button>
          
          {/* Otras métricas */}
          <MetricCardLarge 
            title="Edad Bioquímica" 
            value={edadBiologicaData.bioquimica} 
            icon={faVial} 
            unit="años" 
            cardColor="bg-[#23BCEF] text-white" 
          />
          <MetricCardLarge 
            title="Edad Ortomolecular" 
            value={edadBiologicaData.ortomolecular} 
            icon={faAtom} 
            unit="años" 
            cardColor="bg-[#23BCEF] text-white" 
          />
          <MetricCardLarge 
            title="Edad Genética" 
            value={edadBiologicaData.genetica} 
            icon={faDna} 
            unit="años" 
            cardColor="bg-[#23BCEF] text-white" 
          />
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
      
      {/* Controles y gráfico de tendencias omitidos por brevedad */}
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGenerateReport}
          className="px-6 py-2.5 text-sm bg-[#23BCEF] text-white font-semibold rounded-lg hover:bg-[#23BCEF]/90 focus:outline-none transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Generar Informe PDF
        </button>
      </div>
    </div>
  );
}