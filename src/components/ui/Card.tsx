import React from 'react';
import { cn } from '../../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200/90 rounded-xl shadow-card transition-all duration-200',
        hoverEffect && 'hover:shadow-card-hover hover:border-slate-300/80 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

