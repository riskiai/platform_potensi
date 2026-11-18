import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Clock, SearchCheck, XCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { RegistrationStatus, RegistrationTimelineItem } from '@/types/registration'

const STEP_META: Record<RegistrationStatus, { label: string; icon: LucideIcon; tone: string }> = {
  pending: { label: 'Pengajuan diterima', icon: Clock, tone: 'bg-warning text-warning-foreground' },
  in_review: { label: 'Sedang ditinjau', icon: SearchCheck, tone: 'bg-accent-soft text-accent-strong' },
  approved: { label: 'Disetujui', icon: CheckCircle2, tone: 'bg-success text-success-foreground' },
  rejected: { label: 'Ditolak', icon: XCircle, tone: 'bg-destructive-soft text-destructive' },
}

/** Urutan tahap yang diharapkan; tahap akhir (setuju/tolak) mengikuti status aktual. */
function expectedFlow(current: RegistrationStatus): RegistrationStatus[] {
  const end = current === 'rejected' ? 'rejected' : 'approved'
  return ['pending', 'in_review', end]
}

export function StatusTimeline({ status, timeline }: { status: RegistrationStatus; timeline: RegistrationTimelineItem[] }) {
  const reached = new Map(timeline.map((t) => [t.status, t]))
  const flow = expectedFlow(status)

  return (
    <ol className="flex flex-col">
      {flow.map((s, i) => {
        const item = reached.get(s)
        const meta = STEP_META[s]
        const done = !!item
        const last = i === flow.length - 1
        return (
          <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className={cn('absolute top-10 bottom-0 left-[19px] w-0.5', reached.get(flow[i + 1]) ? 'bg-primary/40' : 'bg-border')}
              />
            ) : null}
            <span
              className={cn(
                'relative flex size-10 shrink-0 items-center justify-center rounded-full',
                done ? meta.tone : 'border-2 border-dashed border-border bg-surface text-muted-foreground/60',
              )}
            >
              <meta.icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 pt-1.5">
              <p className={cn('text-sm font-semibold', done ? 'text-foreground' : 'text-muted-foreground')}>
                {done ? meta.label : `${meta.label} (menunggu)`}
              </p>
              {item ? <p className="text-xs text-muted-foreground">{formatDateTime(item.at)}</p> : null}
              {item?.note ? <p className="mt-2 rounded-lg bg-surface-muted px-3 py-2 text-sm text-foreground">{item.note}</p> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
