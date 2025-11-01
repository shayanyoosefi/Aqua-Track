import React from 'react';
import { cn } from '@/lib/utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'default' && 'bg-cyan-600 text-white hover:bg-cyan-700',
        variant === 'ghost' && 'hover:bg-gray-100',
        size === 'default' && 'h-10 py-2 px-4',
        size === 'icon' && 'h-10 w-10',
        size === 'sm' && 'h-9 px-3',
        size === 'lg' && 'h-11 px-8',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button };
