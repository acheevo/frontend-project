import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/utils/cn';

export interface ContainerProps extends ComponentPropsWithRef<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function Container({ ref, className, size = 'lg', children, ...props }: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
