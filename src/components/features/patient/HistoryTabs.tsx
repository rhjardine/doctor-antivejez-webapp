'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faHeartPulse, faUserCog, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Tab {
  id: string;
  label: string;
  icon: IconProp;
}

const TABS: Tab[] = [
  { id: 'historia_medica', label: 'Historia Clínica', icon: faNotesMedical },
  { id: 'edad_biologica', label: 'Edad Biológica', icon: faHeartPulse },
  { id: 'guia_paciente', label: 'Guía del Paciente', icon: faUserCog },
  { id: 'alimentacion_nutrigenomica', label: 'Nutrigenómica', icon: faChartLine },
];

interface HistoryTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export default function HistoryTabs({ activeTab, setActiveTab }: HistoryTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
        {TABS.map((tab) => (
          <li key={tab.id} className="mr-2">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
