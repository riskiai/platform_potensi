import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepperStep {
  title: string
  description?: string
}

/** Indikator langkah untuk form multi-step. `current` dimulai dari 0. */
export function Stepper({ steps, current, className }: { steps: StepperStep[]; current: number; className?: string }) {
  return (
    <ol className={cn('flex items-start', className)} aria-label="Langkah pengisian">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step.title} className="flex flex-1 items-start last:flex-none" aria-current={active ? 'step' : undefined}>
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary bg-primary-soft text-primary',
                  !done && !active && 'border-border bg-surface text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className={cn('block text-sm font-semibold', active || done ? 'text-foreground' : 'text-muted-foreground')}>
                  {step.title}
                </span>
                {step.description ? <span className="block text-xs text-muted-foreground">{step.description}</span> : null}
              </span>
              <span className="sr-only">{done ? '(selesai)' : active ? '(sedang diisi)' : ''}</span>
            </div>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn('mx-3 mt-[17px] h-0.5 flex-1 rounded-full sm:mx-4', i < current ? 'bg-primary' : 'bg-border')}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
