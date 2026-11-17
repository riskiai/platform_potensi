import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Accent = 'primary' | 'accent' | 'gold' | 'pink'

const ACCENT_CLASS: Record<Accent, string> = {
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent-strong',
  gold: 'bg-warning text-warning-foreground',
  pink: 'bg-pink-soft/60 text-pink-700',
}

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: Accent
  /** Perubahan dalam persen, mis. 12.5 atau -3. Kosongkan bila backend tidak menyediakan. */
  trend?: number
  hint?: string
  loading?: boolean
}

export function StatCard({ label, value, icon: Icon, accent = 'primary', trend, hint, loading }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', ACCENT_CLASS[accent])}>
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-heading text-[28px] leading-none font-bold text-foreground tabular-nums">{value}</p>
          {trend !== undefined || hint ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {trend !== undefined ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-semibold',
                    trend >= 0 ? 'text-success-foreground' : 'text-destructive',
                  )}
                >
                  {trend >= 0 ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
                  {trend >= 0 ? '+' : ''}
                  {trend}%
                </span>
              ) : null}
              {hint}
            </p>
          ) : null}
        </div>
      )}
    </Card>
  )
}
