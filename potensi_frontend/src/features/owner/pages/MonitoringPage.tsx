import { Activity, CheckCircle2, Database, Server, TriangleAlert } from 'lucide-react'
import { ErrorState, LoadingState } from '@/components/shared/states'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { env } from '@/lib/env'
import { formatDateTime } from '@/lib/format'
import { useInstitutionRequests, useBackendHealth, useTenants } from '../hooks/useOwnerData'

export function MonitoringPage() {
  const health = useBackendHealth()
  const tenants = useTenants()

  return (
    <div className="space-y-6">
      <PageHeader title="Monitoring" description="Pantau konektivitas API dan ketersediaan data yang dilaporkan backend." actions={<Button variant="outline" onClick={() => { void health.refetch(); void tenants.refetch() }}>Segarkan Status</Button>} />
      {env.useMock ? <Alert variant="warning"><Activity aria-hidden /><span>Mode simulasi aktif. Nilai status API di bawah bukan pemeriksaan server nyata.</span></Alert> : null}

      <section className="grid gap-4 md:grid-cols-2" aria-label="Status sistem">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Server className="size-5" aria-hidden /></span><div><h2 className="font-heading font-bold">API Backend</h2><p className="text-xs text-muted-foreground">Pemeriksaan endpoint /ping</p></div></div>
            {!health.isLoading && !health.isError && health.data?.status === 'success' ? <StatusBadge status="active" label="Terhubung" /> : null}
            {!health.isLoading && (health.isError || health.data?.status !== 'success') ? <StatusBadge status="failed" label="Tidak tersedia" /> : null}
          </div>
          <div className="mt-5 border-t border-border pt-4">
            {health.isLoading ? <LoadingState label="Memeriksa koneksi API…" className="py-5" /> : health.isError ? <ErrorState compact title="Pemeriksaan gagal" description={health.error instanceof Error ? health.error.message : 'Tidak dapat menghubungi API.'} onRetry={() => void health.refetch()} /> : (
              health.data?.status === 'success' ? <div className="space-y-2 text-sm"><p className="flex items-center gap-2 text-success-foreground"><CheckCircle2 className="size-4" aria-hidden /> {health.data.message}</p>{health.data.phpVersion ? <p className="text-muted-foreground">PHP {health.data.phpVersion}</p> : null}</div> : <p className="text-sm text-destructive">{health.data?.message ?? 'Backend melaporkan status tidak normal.'}</p>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-strong"><Database className="size-5" aria-hidden /></span><div><h2 className="font-heading font-bold">Data Tenant</h2><p className="text-xs text-muted-foreground">Ketersediaan endpoint /tenants</p></div></div>
          <div className="mt-5 border-t border-border pt-4">
            {tenants.isLoading ? <LoadingState label="Memeriksa data tenant…" className="py-5" /> : tenants.isError ? <ErrorState compact title="Data belum tersedia" description={tenants.error instanceof Error ? tenants.error.message : 'Tidak dapat mengambil daftar tenant.'} onRetry={() => void tenants.refetch()} /> : <div className="flex items-end gap-2"><p className="font-heading text-3xl font-bold tabular-nums">{tenants.data?.length ?? 0}</p><p className="pb-1 text-sm text-muted-foreground">tenant dapat dibaca oleh akun ini</p></div>}
          </div>
        </Card>
      </section>

      {env.useMock && <RegistrationActivity />}

      <Card className="flex gap-4 p-5 sm:p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning text-warning-foreground"><TriangleAlert className="size-5" aria-hidden /></span>
        <div><h2 className="font-heading font-bold">Metrik sistem lainnya belum tersedia</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">Backend belum menyediakan endpoint untuk status database, antrean proses, penggunaan resource, maupun riwayat uptime. Halaman ini tidak menampilkan nilai perkiraan agar status operasional tetap akurat.</p></div>
      </Card>
    </div>
  )
}

function RegistrationActivity() {
  const requests = useInstitutionRequests()
  const labels = { pending: 'Diajukan', in_review: 'Ditinjau', approved: 'Disetujui', rejected: 'Ditolak' }
  const events = (requests.data ?? []).flatMap(request => request.timeline.map(event => ({
    ...event, name: request.institutionName, id: request.id,
  }))).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 10)

  return <Card className="space-y-4 p-5 sm:p-6">
    <h2 className="font-heading font-bold">Aktivitas pengajuan terbaru</h2>
    {requests.isLoading ? <LoadingState /> : requests.isError ? <ErrorState compact onRetry={() => void requests.refetch()} />
      : events.length === 0 ? <p>Belum ada aktivitas pengajuan.</p>
      : <ul className="divide-y divide-border">{events.map(event =>
        <li key={event.id + event.status + event.at} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
          <span>{event.name} · {labels[event.status]}</span><time dateTime={event.at}>{formatDateTime(event.at)}</time>
        </li>)}</ul>}
  </Card>
}
