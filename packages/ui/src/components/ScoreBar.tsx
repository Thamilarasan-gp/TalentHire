import React from 'react';
import { cn } from '../utils';

export interface ScoreBarProps {
  label?: string;
  score: number; // 0 - 100
  maxScore?: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  maxScore = 100,
  showPercentage = true,
  size = 'md',
  className,
}) => {
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : (parseFloat(String(score)) || 0);
  const safeMax = typeof maxScore === 'number' && !isNaN(maxScore) && maxScore > 0 ? maxScore : 100;
  const percentage = Math.min(100, Math.max(0, Math.round((safeScore / safeMax) * 100)));

  let barColor = 'bg-blue-600';
  let badgeColor = 'text-blue-700 bg-blue-50';

  if (percentage >= 85) {
    barColor = 'bg-emerald-600';
    badgeColor = 'text-emerald-700 bg-emerald-50';
  } else if (percentage >= 70) {
    barColor = 'bg-blue-600';
    badgeColor = 'text-blue-700 bg-blue-50';
  } else if (percentage >= 50) {
    barColor = 'bg-amber-500';
    badgeColor = 'text-amber-700 bg-amber-50';
  } else {
    barColor = 'bg-rose-500';
    badgeColor = 'text-rose-700 bg-rose-50';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          {label && <span className="font-medium text-slate-600">{label}</span>}
          {showPercentage && (
            <span className={cn('font-semibold px-1.5 py-0.5 rounded text-[11px]', badgeColor)}>
              {score}
              {maxScore === 100 ? '%' : `/${maxScore}`}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
