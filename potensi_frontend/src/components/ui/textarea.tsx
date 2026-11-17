import * as React from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'flex min-h-24 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-xs transition-colors',
        'placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-ring/20',
        'aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
