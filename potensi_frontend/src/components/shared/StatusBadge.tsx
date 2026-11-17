import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, CircleDashed, Clock, Loader2, PauseCircle, SearchCheck, XCircle } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/badge'

/**
 * Status umum di POTENSI. Selalu tampil dengan ikon + label (tidak hanya warna).
 * ⚠️ Key status menyesuaikan nilai dari backend — tambahkan bila ada status baru.
 */
const PRESETS = {
  pending: { label: 'Menunggu', tone: 'warning', icon: Clock },
  in_review: { label: 'Sedang Ditinjau', tone: 'info', icon: SearchCheck },
  approved: { label: 'Disetujui', tone: 'success', icon: CheckCircle2 },
  rejected: { label: 'Ditolak', tone: 'danger', icon: XCircle },
  active: { label: 'Aktif', tone: 'success', icon: CheckCircle2 },
  inactive: { label: 'Nonaktif', tone: 'neutral', icon: PauseCircle },
  draft: { label: 'Draf', tone: 'neutral', icon: CircleDashed },
  published: { label: 'Dipublikasi', tone: 'info', icon: CheckCircle2 },
  in_progress: { label: 'Berjalan', tone: 'info', icon: Loader2 },
  completed: { label: 'Selesai', tone: 'success', icon: CheckCircle2 },
  failed: { label: 'Gagal', tone: 'danger', icon: XCircle },
} satisfies Record<string, { label: string; tone: BadgeTone; icon: LucideIcon }>

export type StatusKey = keyof typeof PRESETS

interface StatusBadgeProps {
  status: StatusKey
  /** Ganti label default bila perlu, mis. "Sedang dilatih". */
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const preset = PRESETS[status]
  const Icon = preset.icon
  return (
    <Badge tone={preset.tone} className={className}>
      <Icon className={status === 'in_progress' ? 'animate-spin' : undefined} aria-hidden />
      {label ?? preset.label}
    </Badge>
  )
}
