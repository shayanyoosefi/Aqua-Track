import React from 'react';
import { cn } from '@/lib/utils';

function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant === 'default' && 'border-transparent bg-gray-900 text-white',
        variant === 'secondary' && 'border-transparent bg-gray-100 text-gray-900',
        variant === 'success' && 'border-transparent bg-green-100 text-green-800',
        variant === 'warning' && 'border-transparent bg-yellow-100 text-yellow-800',
        variant === 'destructive' && 'border-transparent bg-red-100 text-red-800',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
