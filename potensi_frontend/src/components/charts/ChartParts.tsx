import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { numberFormat } from './chart-theme'

interface ChartCardProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Kartu pembungkus chart: judul, deskripsi, aksi/filter, lalu chart. */
export function ChartCard({ title, description, actions, children, className }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4 p-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  )
}

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: it.color }} aria-hidden />
          {it.label}
        </li>
      ))}
    </ul>
  )
}

interface TooltipPayloadItem {
  name?: string | number
  value?: number | string
  color?: string
  payload?: { fill?: string }
}

/** Tooltip chart konsisten: teks memakai warna teks, warna seri hanya di penanda. */
export function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-[140px] rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-elevated">
      {label !== undefined && label !== '' ? <p className="mb-1.5 font-semibold text-foreground">{label}</p> : null}
      <ul className="flex flex-col gap-1">
        {payload.map((p) => (
          <li key={String(p.name)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-sm" style={{ background: p.color ?? p.payload?.fill }} aria-hidden />
              {p.name}
            </span>
            <span className="font-semibold text-foreground tabular-nums">
              {typeof p.value === 'number' ? numberFormat.format(p.value) : p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
