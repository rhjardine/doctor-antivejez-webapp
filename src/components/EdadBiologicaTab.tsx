'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProcedures, faVial, faAtom, faDna, faChartLine, faChartBar, faBullseye, faDotCircle, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import MetricCardLarge from './MetricCardLarge';
import AgingProfileCard from './AgingProfileCard';
import ChartDisplay from '@/components/UI/ChartDisplay';
import { cn } from '@/utils/helpers';

interface EdadBiologicaTabProps {
  patientId: string;
  cronoAge: number;
}

const edadBiologicaData = {
  biofisica: 56,
  bioquimica: 54,
  ortomolecular: 50,
  genetica: 58,
  perfil: [
    { id: 'bio', title: 'Edad Biológica', tag: 'Celular', value: 45, color: 'success' as const },
    { id: 'biophys', title: 'Edad Biofísica', tag: 'Cardio-Fitness', value: 43, color: 'success' as const },
    { id: 'orto', title: 'Edad Ortomolecular', tag: 'Nutrientes', value: 52, color: 'warning' as const },
    { id: 'biochem', title: 'Edad Bioquímica', tag: 'Metabólica', value: 46, color: 'success' as const },
    { id: 'genetic', title: 'Edad Genética', tag: 'SNPs', value: 49, color: 'primary' as const },
  ],
  trendData: {
    '6m': { labels: ['Hace 6m', 'Hace 5m', 'Hace 4m', 'Hace 3m', 'Hace 2m', 'Actual'], datasets: [ { label: 'EB Biofísica', data: [57, 56, 56, 57, 55, 56] }, { label: 'EB Bioquímica', data: [55, 54, 55, 53, 54, 54] } ] },
    '1y': { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], datasets: [ { label: 'EB Biofísica', data: [58, 57, 56, 56, 57, 55, 56, 55, 56, 55, 56, 56] }, { label: 'EB Bioquímica', data: [56, 55, 54, 55, 53, 54, 54, 53, 54, 52, 53, 54] } ] },
    '2y': { labels: ['T1 A1', 'T2 A1', 'T3 A1', 'T4 A1', 'T1 A2', 'T2 A2', 'T3 A2', 'T4 A2'], datasets: [ { label: 'EB Biofísica', data: [59, 58, 57, 56, 56, 57, 55, 56] }, { label: 'EB Bioquímica', data: [57, 56, 55, 54, 55, 53, 54, 54] } ] },
  }
};

export default function EdadBiologicaTab({ patientId, cronoAge }: EdadBiologicaTabProps) {
  const [selectedRange, setSelectedRange] = useState<keyof typeof edadBiologicaData.trendData>('1y');
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'bar' | 'radar' | 'polarArea' | 'pie'>('line');

  const currentChartData = edadBiologicaData.trendData[selectedRange];

  const handleGenerateReport = () => {
    alert('Generando informe...');
  };

  const handleChartTypeChange = (type: typeof selectedChartType) => {
    setSelectedChartType(type);
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="bio-age-comparison-title">
        <h2 id="bio-age-comparison-title" className="text-base font-semibold mb-3 text-text-dark dark:text-dark-text">
          Edad Cronológica Vs Edad Biológica:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCardLarge title="Edad Biofísica" value={edadBiologicaData.biofisica} icon={faProcedures} color="bg-sky-500" />
          <MetricCardLarge title="Edad Bioquímica" value={edadBiologicaData.bioquimica} icon={faVial} color="bg-green-500" />
          <MetricCardLarge title="Edad Ortomolecular" value={edadBiologicaData.ortomolecular} icon={faAtom} color="bg-yellow-500" />
          <MetricCardLarge title="Edad Genética" value={edadBiologicaData.genetica} icon={faDna} color="bg-purple-500" />
        </div>
      </section>

      <section aria-labelledby="aging-profile-title">
        <h3 id="aging-profile-title" className="text-xl font-semibold mb-4 text-text-dark dark:text-dark-text pt-4 border-t border-light-border dark:border-dark-border">
          Perfil Multidimensional de Envejecimiento
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {edadBiologicaData.perfil.map(item => {
            const difference = item.value - cronoAge;
            return (
              <AgingProfileCard
                key={item.id}
                title={item.title}
                tag={item.tag}
                value={item.value}
                comparisonText={`vs. Edad Cronológica (${cronoAge} años)`}
                difference={difference}
                differenceUnit="años"
                statusColor={difference === 0 ? 'info' : difference < 0 ? 'success' : item.color}
                chartValue={(item.value / (cronoAge + 20)) * 100}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="trend-chart-title" className="pt-6 border-t border-light-border dark:border-dark-border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 p-4 bg-light-bg dark:bg-dark-bg-card rounded-lg">
          <div className="flex items-center gap-2">
            <label htmlFor="date-range-select" className="text-sm font-medium text-text-medium dark:text-dark-text-medium">Rango de Fechas:</label>
            <select
              id="date-range-select"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value as keyof typeof edadBiologicaData.trendData)}
              className="block w-full sm:w-auto pl-3 pr-8 py-1.5 text-base border border-light-border dark:border-dark-border bg-light-bg-card dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-md text-text-dark dark:text-dark-text"
            >
              <option value="6m">Últimos 6 meses</option>
              <option value="1y">Último año</option>
              <option value="2y">Últimos 2 años</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-bg p-1 rounded-lg">
            {(['line', 'bar', 'radar', 'polarArea', 'pie'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleChartTypeChange(type)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  selectedChartType === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-medium hover:bg-gray-200 dark:text-dark-text-medium dark:hover:bg-gray-700'
                )}
                aria-pressed={selectedChartType === type}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('Area', ' Area')}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-light-bg-card dark:bg-dark-bg-card p-4 rounded-lg shadow-md min-h-[350px] relative">
          <h4 id="trend-chart-title" className="text-lg font-semibold mb-4 text-center text-text-dark dark:text-dark-text">
            Evolución de Edades Biológicas ({selectedRange === '6m' ? '6 Meses' : selectedRange === '1y' ? '1 Año' : '2 Años'})
          </h4>
          <ChartDisplay
            type={selectedChartType}
            data={currentChartData}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleGenerateReport}
            className="px-6 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg-card inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Generar Informe
          </button>
        </div>
      </section>
    </div>
  );
}
