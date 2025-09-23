import { PropsWithChildren } from 'react';

type Props = {
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
  className?: string;
} & PropsWithChildren;

function Pill({ variant = 'neutral', children, className = '' }: Props) {
  const variantStyles = {
    neutral: 'bg-stone-200 text-stone-500 rounded-full',
    success: 'bg-green-200 text-primary rounded-full',
    warning: 'bg-yellow-200 text-yellow-600 rounded-full',
    danger: 'bg-red-200 text-red-600 rounded-full',
  };
  const pillClasses = `my-1 mr-1 text-sm inline-flex items-center self-start px-6 py-1 font-semibold ${variantStyles[variant]} ${className}`;
  return <div className={pillClasses}>{children}</div>;
}

export default Pill;
