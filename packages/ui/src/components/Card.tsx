import React from 'react';
import { cn } from '../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive' | 'elevated' | 'glass';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.015)] rounded-2xl transition-all',
    flat:
      'bg-slate-50/70 border border-slate-200/60 rounded-2xl',
    interactive:
      'bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-300 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.995]',
    elevated:
      'bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl',
    glass:
      'bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-2xl',
  };

  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('px-6 py-5 border-b border-slate-100 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('px-6 py-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
