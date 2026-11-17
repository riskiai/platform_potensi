import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground shadow-xs transition-colors',
        'placeholder:text-muted-foreground/70',
        'focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-ring/20',
        'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/15',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
