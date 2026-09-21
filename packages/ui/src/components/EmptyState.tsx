import React from 'react';
import { Button } from './Button';
import { cn } from '../utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex flex-col items-center justify-center text-center p-14 bg-gradient-to-b from-white to-slate-50/50 border border-dashed border-slate-200/90 rounded-3xl my-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {/* Subtle radial glow in background */}
      <div className="absolute w-48 h-48 rounded-full bg-blue-50/60 blur-2xl pointer-events-none -top-10" />

      {icon && (
        <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-4 ring-slate-50">
          {icon}
        </div>
      )}
      <h3 className="relative z-10 text-base font-bold text-slate-900 tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="relative z-10 text-xs text-slate-500 max-w-sm mb-6 leading-relaxed font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="relative z-10">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
