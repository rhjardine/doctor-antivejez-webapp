'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: IconProp;
}

export const PageHeader = ({ title, description, icon }: PageHeaderProps) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#23BCEF] to-[#293B64] rounded-lg flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  </div>
);
