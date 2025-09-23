import Link from 'next/link';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quarternary'
    | 'success'
    | 'danger';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  isExternal?: boolean;
  href?: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-secondary',
  secondary: 'bg-secondary text-white hover:bg-primary',
  tertiary: 'bg-white text-black hover:bg-secondary hover:text-white',
  quarternary: 'bg-white text-black hover:bg-primary hover:text-white',

  success: 'bg-green-500',
  danger: 'text-red-500',
};

const borderRadiusStyles = {
  none: '',
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
  full: 'rounded-full',
};

function Button({
  variant = 'primary',
  borderRadius = 'medium',
  isExternal = false,
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = `transition-all inline-flex items-center gap-2 px-8 py-3 ${variantStyles[variant]} ${borderRadiusStyles[borderRadius]} ${className}`;

  if (isExternal) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type='button' className={buttonClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
