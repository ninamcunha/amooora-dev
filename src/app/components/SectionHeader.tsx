import { ReactNode } from 'react';

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  onViewAll?: () => void;
}

export function SectionHeader({ icon, title, onViewAll }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-secondary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
        >
          Ver todos
        </button>
      )}
    </div>
  );
}