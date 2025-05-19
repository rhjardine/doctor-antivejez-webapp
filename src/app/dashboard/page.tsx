// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // <--- CORREGIDO
import {
  faChartLine, faSearch, faBell, faUserCircle, faUsers, faUserPlus, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'; // Importa todos los iconos necesarios
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { cn } from '@/utils/helpers';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler );

// --- Componente Interno MetricCard (puedes moverlo a su propio archivo si lo prefieres) ---
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: any; // O IconProp de FontAwesome
  children?: React.ReactNode;
  className?: string;
  iconBgColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, children, className, iconBgColor = "bg-primary/10 dark:bg-dark-primary/10" }) => {
  return (
    <div className={cn(
      "bg-light-bg-card dark:bg-dark-bg-card p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-text-medium dark:text-dark-text-medium">{title}</h3>
        {icon && (
          <div className={cn("p-2 rounded-lg", iconBgColor)}>
            <FontAwesomeIcon icon={icon} className="h-5 w-5 text-primary dark:text-dark-primary" />
          </div>
        )}
      </div>
      {children ? (
        children
      ) : (
        <p className="text-3xl font-bold text-text-dark dark:text-dark-text">{value}</p>
      )}
    </div>
  );
};
// --- Fin de MetricCard ---


export default function DashboardPage() {
  const doughnutData = {
    labels: ['Edad Biológica', 'Restante'],
    datasets: [{
        label: 'Edad Biológica Promedio',
        data: [52, 100 - 52],
        backgroundColor: ['rgb(35, 188, 239)', 'rgba(200, 200, 200, 0.2)'],
        borderColor: ['rgb(35, 188, 239)', 'rgba(200, 200, 200, 0.1)'],
        borderWidth: 1,
        circumference: 270,
        rotation: 225,
        cutout: '70%',
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  const lineChartData = {
    labels: ['Q1 \'23', 'Q2 \'23', 'Q3 \'23', 'Q4 \'23', 'Q1 \'24'],
    datasets: [
      {
        label: 'Pacientes Activos', data: [70, 80, 90, 110, 125],
        borderColor: 'rgb(35, 188, 239)', backgroundColor: 'rgba(35, 188, 239, 0.3)',
        fill: true, tension: 0.4, pointBackgroundColor: 'rgb(35, 188, 239)',
        pointBorderColor: '#fff', pointHoverRadius: 7, pointHoverBackgroundColor: 'rgb(35, 188, 239)',
      },
      {
        label: 'Onboarded', data: [50, 60, 70, 85, 100],
        borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.3)',
        fill: true, tension: 0.4, pointBackgroundColor: 'rgb(255, 159, 64)',
        pointBorderColor: '#fff', pointHoverRadius: 7, pointHoverBackgroundColor: 'rgb(255, 159, 64)',
      },
    ],
  };
  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6b7280'} },
      x: { grid: { display: false }, ticks: { color: '#6b7280'} },
    },
    plugins: { legend: { position: 'top' as const, labels: { color: '#374151'} }, title: { display: false } },
    interaction: { mode: 'index' as const, intersect: false },
  };

  const [chartRange, setChartRange] = useState('ultimo-ano');

  return (
    // Contenedor principal de la página del dashboard
    // El <Header> general de la aplicación ya está en layout.tsx
    // Aquí solo va el contenido específico de ESTA PÁGINA.
    <div className="p-2 sm:p-4 space-y-6">
      {/* Título de la página del Dashboard */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-dark dark:text-dark-text flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="text-primary dark:text-dark-primary" />
          Dashboard
        </h1>
        {/* Aquí podría ir algún filtro global para el dashboard si es necesario */}
      </div>


      {/* Sección de Métricas Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Edad Biológica Promedio">
          <div className="relative h-28 w-28 mx-auto">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-primary dark:text-dark-primary">52</span>
                <span className="text-xs text-text-medium dark:text-dark-text-medium">años</span>
            </div>
          </div>
        </MetricCard>
        <MetricCard title="Pacientes Registrados" value="132" icon={faUsers} />
        <MetricCard title="Nuevos Registros (Mes)" value="13" icon={faUserPlus} />
      </div>

      {/* Sección de Gráfico Principal */}
      <div className="bg-light-bg-card dark:bg-dark-bg-card p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-dark dark:text-dark-text">Pacientes Activos</h3>
          <select
            value={chartRange}
            onChange={(e) => setChartRange(e.target.value)}
            className="mt-2 sm:mt-0 block w-full sm:w-auto pl-3 pr-8 py-1.5 text-sm border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-md text-text-dark dark:text-dark-text"
          >
            <option value="ultimo-ano">Último Año</option>
            <option value="ultimos-6-meses">Últimos 6 Meses</option>
            <option value="ultimo-trimestre">Último Trimestre</option>
          </select>
        </div>
        <div className="h-72 md:h-80">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Otras secciones/widgets del dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <MetricCard title="Próximas Citas" value="3" icon={faCalendarAlt} iconBgColor="bg-info/10 dark:bg-info/20">
            <p className="text-sm text-text-medium dark:text-dark-text-medium mt-1">3 citas hoy</p>
        </MetricCard>
        <MetricCard title="Estadísticas Clave" value="..." icon={faChartLine} iconBgColor="bg-success/10 dark:bg-success/20">
             <p className="text-sm text-text-medium dark:text-dark-text-medium mt-1">Métrica importante...</p>
        </MetricCard>
        <MetricCard title="Pacientes Recientes" value="Ver Lista" icon={faUsers} iconBgColor="bg-warning/10 dark:bg-warning/20">
             <p className="text-sm text-text-medium dark:text-dark-text-medium mt-1">Nuevos pacientes esta semana...</p>
        </MetricCard>
      </div>
    </div> // Cierre del div principal de la página
  );
}