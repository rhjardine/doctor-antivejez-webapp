// src/components/Profesionales/ProfesionalCard.tsx
import { cn } from '@/utils/helpers';

interface ProfesionalCardProps {
  title: string;
  count: number;
  colorClass?: string; // Ej: 'text-primary', 'text-success'
}

export default function ProfesionalCard({ title, count, colorClass = 'text-primary' }: ProfesionalCardProps) {
  return (
    <div className="bg-light-bg-card dark:bg-dark-bg-card p-6 rounded-xl shadow-lg text-center">
      <h3 className="text-md font-medium text-text-medium dark:text-dark-text-medium mb-1">{title}</h3>
      <p className={cn("text-4xl font-bold", colorClass)}>{count}</p>
    </div>
  );
}