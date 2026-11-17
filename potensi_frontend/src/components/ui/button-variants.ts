import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-hover',
        outline: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
        ghost: 'text-foreground hover:bg-surface-muted',
        link: 'text-accent-strong underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-5',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
