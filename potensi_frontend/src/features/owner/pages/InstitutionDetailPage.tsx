import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ownerService } from '@/services/owner.service'
import { ownerKeys } from '../lib/query-keys'
import { ConfirmDialog } from '@/components/shared/dialogs'
import type { TenantStatus } from '@/types/owner'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, CalendarDays, Hash, Phone, UserRound } from 'lucide-react'
import { ErrorState, LoadingState } from '@/components/shared/states'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTenant } from '../hooks/useOwnerData'
import { formatDate } from '@/lib/format'

export function InstitutionDetailPage() {
  const { tenantId = '' } = useParams()
  const query = useTenant(tenantId)

  const [confirm, setConfirm] = useState(false)
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: (status: TenantStatus) => {
      if (!ownerService.setTenantStatus) throw new Error('Perubahan status belum tersedia.')
      return ownerService.setTenantStatus(tenantId, status)
    },
    onSuccess: async tenant => {
      client.setQueryData(ownerKeys.tenant(tenantId), tenant)
      setConfirm(false)
      toast.success('Status institusi diperbarui.')
      await client.invalidateQueries({ queryKey: ownerKeys.tenants() })
    },
    onError: () => toast.error('Gagal menyimpan status institusi. Silakan coba kembali.'),
  })

  if (query.isLoading) return <><PageHeader title="Detail Institusi" /><Card><LoadingState label="Memuat detail institusi…" /></Card></>
  if (query.isError || !query.data) return <><PageHeader title="Detail Institusi" /><Card><ErrorState description={query.error instanceof Error ? query.error.message : 'Detail institusi tidak tersedia.'} onRetry={() => void query.refetch()} /></Card></>

  const tenant = query.data
  const active = tenant.status === 'active'
  const action = active ? 'Nonaktifkan' : 'Aktifkan'
  return (
    <div className="space-y-5">
      <PageHeader
        title={tenant.name}
        description="Profil institusi dan kontak penanggung jawab."
        actions={<>
          <Button asChild variant="outline"><Link to="/owner/institusi"><ArrowLeft aria-hidden /> Kembali</Link></Button>
          {ownerService.setTenantStatus && <Button onClick={() => setConfirm(true)}>{action} institusi</Button>}
        </>}
      />

      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title={action + ' ' + tenant.name + '?'}
        description="Perubahan status berlaku pada data simulasi di browser ini." confirmLabel={action}
        loading={mutation.isPending} variant={active ? 'destructive' : 'default'}
        onConfirm={() => mutation.mutate(active ? 'inactive' : 'active')} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Informasi institusi">
        <InfoCard icon={Building2} label="Jenis Institusi"><span>{tenant.type === 'internal' ? 'Internal' : 'Mitra eksternal'}</span></InfoCard>
        <InfoCard icon={Building2} label="Status"><StatusBadge status={tenant.status} /></InfoCard>
        <InfoCard icon={CalendarDays} label="Terdaftar"><span>{formatDate(tenant.createdAt ?? undefined)}</span></InfoCard>
        <InfoCard icon={Phone} label="Telepon"><span>{tenant.phone || 'Belum tersedia'}</span></InfoCard>
        <InfoCard icon={Hash} label="ID Tenant"><span className="break-all font-mono text-xs">{tenant.id}</span></InfoCard>
        <InfoCard icon={UserRound} label="Penanggung Jawab Institusi">
          {tenant.contact ? (
            <div className="space-y-1 [overflow-wrap:anywhere]">
              <p>{tenant.contact.fullName || 'Nama belum tersedia'}</p>
              {tenant.contact.position && <p className="text-xs font-normal text-muted-foreground">{tenant.contact.position}</p>}
              {tenant.contact.email && <p><a className="text-xs text-primary underline" href={`mailto:${tenant.contact.email}`}>{tenant.contact.email}</a></p>}
              {tenant.contact.phone && <p><a className="text-xs text-primary underline" href={`tel:${tenant.contact.phone}`}>{tenant.contact.phone}</a></p>}
            </div>
          ) : <span>Belum tersedia</span>}
        </InfoCard>
      </section>


    </div>
  )
}

function InfoCard({ icon: Icon, label, children }: { icon: typeof Building2; label: string; children: React.ReactNode }) {
  return <Card className="flex items-center gap-4 p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" aria-hidden /></span><div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="mt-1 text-sm font-semibold text-foreground">{children}</div></div></Card>
}
