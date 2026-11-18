import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, CheckCircle2, Inbox, Loader2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Empat state wajib di setiap halaman (brief): Loading, Empty, Error, Success.
 * Semua memakai kerangka visual yang sama supaya konsisten.
 */

interface StateShellProps {
  icon: LucideIcon
  iconClassName: string
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  compact?: boolean
}

function StateShell({ icon: Icon, iconClassName, title, description, action, className, compact }: StateShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        compact ? 'px-4 py-8' : 'px-6 py-14',
        className,
      )}
    >
      <div className={cn('flex size-12 items-center justify-center rounded-2xl', iconClassName)}>
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}

export interface EmptyStateProps {
  title?: string
  description?: ReactNode
  icon?: LucideIcon
  action?: ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({
  title = 'Belum ada data',
  description = 'Data akan muncul di sini setelah tersedia.',
  icon = Inbox,
  ...rest
}: EmptyStateProps) {
  return <StateShell icon={icon} iconClassName="bg-surface-muted text-muted-foreground" title={title} description={description} {...rest} />
}

export interface ErrorStateProps {
  title?: string
  description?: ReactNode
  onRetry?: () => void
  retrying?: boolean
  className?: string
  compact?: boolean
}

export function ErrorState({
  title = 'Gagal memuat data',
  description = 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.',
  onRetry,
  retrying,
  ...rest
}: ErrorStateProps) {
  return (
    <div role="alert">
      <StateShell
        icon={AlertTriangle}
        iconClassName="bg-destructive-soft text-destructive"
        title={title}
        description={description}
        action={
          onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry} loading={retrying}>
              {!retrying ? <RotateCw aria-hidden /> : null} Coba lagi
            </Button>
          ) : undefined
        }
        {...rest}
      />
    </div>
  )
}

export interface SuccessStateProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  compact?: boolean
}

export function SuccessState(props: SuccessStateProps) {
  return (
    <div role="status">
      <StateShell icon={CheckCircle2} iconClassName="bg-success text-success-foreground" {...props} />
    </div>
  )
}

export function LoadingState({ label = 'Memuat data…', className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn('flex items-center justify-center gap-2.5 px-6 py-14 text-sm text-muted-foreground', className)}>
      <Loader2 className="size-5 animate-spin text-primary" aria-hidden />
      {label}
    </div>
  )
}

/** Skeleton generik: beberapa baris placeholder. */
export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div role="status" aria-label="Memuat" className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
