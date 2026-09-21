import React from 'react';
import { cn } from '../utils';

export interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  const safeStatus = (status || 'PENDING').toString();
  const normalized = safeStatus.toUpperCase().replace(/\s+/g, '_');

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (
    ['VERIFIED', 'APPROVED', 'PASS', 'ACTIVE', 'COMPLETED', 'FILLED', 'PLACED', 'PAID'].includes(
      normalized
    )
  ) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotColor = 'bg-emerald-500';
  } else if (
    [
      'SOURCING',
      'EVALUATING',
      'SHORTLISTED',
      'MATCHED',
      'COMPANY_INTERVIEW',
      'IN_PROGRESS',
      'SUBMITTED',
      'QA_REVIEW',
      'ASSIGNED',
      'ACCEPTED',
    ].includes(normalized)
  ) {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-200/80';
    dotColor = 'bg-blue-500';
  } else if (
    [
      'UNDER_REVIEW',
      'INTERVIEW_PENDING',
      'REVIEW_REQUIRED',
      'ON_HOLD',
      'PENDING',
      'SCREENING',
      'ASSIGNMENT_AVAILABLE',
    ].includes(normalized)
  ) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (
    ['REJECTED', 'FAIL', 'FRAUD_FLAGGED', 'HIGH_RISK', 'CANCELLED', 'NO_SHOW', 'EXPIRED'].includes(
      normalized
    )
  ) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
    dotColor = 'bg-rose-500';
  }

  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full tracking-tight capitalize',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        colorClasses,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />
      {label}
    </span>
  );
};
