import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Activity, ArrowRight, Building2, CheckCircle2, Clock3, PauseCircle } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatDate } from '@/lib/format'
import type { Tenant } from '@/types/owner'
import { useTenants } from '../hooks/useOwnerData'

const columns: ColumnDef<Tenant, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Institusi',
    cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Jenis',
    cell: ({ row }) => row.original.type === 'internal' ? 'Internal' : 'Mitra',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Terdaftar',
    cell: ({ row }) => formatDate(row.original.createdAt ?? undefined),
  },
  {
    id: 'detail',
    header: 'Aksi',
    enableSorting: false,
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm">
        <Link to={`/owner/institusi/${encodeURIComponent(row.original.id)}`}>Detail <ArrowRight aria-hidden /></Link>
      </Button>
    ),
  },
]
const EMPTY_TENANTS: Tenant[] = []

export function OwnerDashboardPage() {
  const { user } = useAuth()
  const query = useTenants()
  const tenants = query.data ?? EMPTY_TENANTS
  const metrics = useMemo(() => ({
    total: tenants.length,
    active: tenants.filter((tenant) => tenant.status === 'active').length,
    inactive: tenants.filter((tenant) => tenant.status === 'inactive').length,
    external: tenants.filter((tenant) => tenant.type === 'external').length,
  }), [tenants])

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description={`Ringkasan operasional POTENSI${user?.name ? `, ${user.name}` : ''}. Angka di bawah dihitung dari data institusi yang tersedia.`}
        actions={<Button asChild><Link to="/owner/permintaan-institusi">Tinjau Pengajuan <ArrowRight aria-hidden /></Link></Button>}
      />

      {query.isError ? (
        <Card className="p-5 text-sm text-destructive" role="alert">
          Data dashboard belum dapat dimuat: {query.error instanceof Error ? query.error.message : 'Terjadi kesalahan.'}
          <button className="ml-2 font-semibold underline" type="button" onClick={() => void query.refetch()}>Coba lagi</button>
        </Card>
      ) : null}

      <section aria-label="Statistik institusi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Institusi" value={query.isError ? '—' : metrics.total} icon={Building2} accent="primary" loading={query.isLoading} hint="Data tenant terdaftar" />
        <StatCard label="Institusi Aktif" value={query.isError ? '—' : metrics.active} icon={CheckCircle2} accent="accent" loading={query.isLoading} hint="Status aktif" />
        <StatCard label="Institusi Nonaktif" value={query.isError ? '—' : metrics.inactive} icon={PauseCircle} accent="pink" loading={query.isLoading} hint="Status nonaktif" />
        <StatCard label="Mitra Eksternal" value={query.isError ? '—' : metrics.external} icon={Clock3} accent="gold" loading={query.isLoading} hint="Tenant eksternal" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.5fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent-strong"><Activity className="size-5" aria-hidden /></span>
            <div>
              <h2 className="font-heading text-base font-bold">Status Institusi</h2>
              <p className="mt-1 text-xs text-muted-foreground">Distribusi dari daftar tenant saat ini</p>
            </div>
          </div>
          {query.isLoading ? <div className="h-24 animate-pulse rounded-lg bg-surface-muted" aria-label="Memuat distribusi status" /> : query.isError ? (
            <p className="rounded-lg bg-destructive-soft p-3 text-sm text-destructive">Distribusi belum tersedia karena data gagal dimuat.</p>
          ) : metrics.total === 0 ? (
            <p className="rounded-lg bg-surface-muted p-4 text-sm text-muted-foreground">Belum ada institusi untuk diringkas.</p>
          ) : (
            <div className="space-y-5" aria-label={`${metrics.active} aktif dan ${metrics.inactive} nonaktif dari ${metrics.total} institusi`}>
              <StatusMeter label="Aktif" count={metrics.active} total={metrics.total} tone="bg-primary" />
              <StatusMeter label="Nonaktif" count={metrics.inactive} total={metrics.total} tone="bg-slate-400" />
              <p className="border-t border-border pt-3 text-xs text-muted-foreground">Visualisasi ini hanya merangkum status saat ini, bukan tren historis.</p>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-heading text-base font-bold">Institusi Terbaru</h2>
              <p className="mt-1 text-xs text-muted-foreground">Institusi dengan tanggal pendaftaran paling baru</p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/owner/institusi">Lihat semua <ArrowRight aria-hidden /></Link></Button>
          </div>
          <div className="px-1 pb-2">
            <DataTable
              caption="Lima institusi terbaru"
              columns={columns}
              data={[...tenants].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')).slice(0, 5)}
              isLoading={query.isLoading}
              error={query.isError ? { message: query.error instanceof Error ? query.error.message : 'Data gagal dimuat.' } : null}
              onRetry={() => void query.refetch()}
              empty={<p className="p-4 text-center text-sm text-muted-foreground">Belum ada institusi terdaftar.</p>}
            />
          </div>
        </Card>
      </section>
    </div>
  )
}

function StatusMeter({ label, count, total, tone }: { label: string; count: number; total: number; tone: string }) {
  const percentage = total ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-medium">{label}</span><span className="text-muted-foreground">{count} <span className="text-xs">({percentage}%)</span></span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted" role="img" aria-label={`${label}: ${count} institusi`}>
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
