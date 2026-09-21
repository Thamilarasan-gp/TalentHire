import React from 'react';
import { cn } from '../utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive,
  icon,
  subtext,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200/80 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-150',
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-500 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <div className="text-slate-400 p-2 bg-slate-50 rounded-lg">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center',
              isPositive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                : 'text-rose-700 bg-rose-50 border border-rose-200/60'
            )}
          >
            {change}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs text-slate-400 mt-2 font-normal">{subtext}</p>}
    </div>
  );
};
