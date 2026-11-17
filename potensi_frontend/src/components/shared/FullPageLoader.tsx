import { Logo } from '@/components/brand/Logo'

export function FullPageLoader({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <Logo variant="mark" className="h-12 animate-pulse" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
