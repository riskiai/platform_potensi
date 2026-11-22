import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check, Eye, Inbox, X } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar, SearchInput } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/dialogs'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { env } from '@/lib/env'
import { formatDateTime } from '@/lib/format'
import type { InstitutionRequest, InstitutionRequestDecision } from '@/types/owner'
import { useInstitutionRequests, useReviewInstitutionRequest } from '../hooks/useOwnerData'

const statusLabels: Record<InstitutionRequest['status'], string> = { pending: 'Menunggu', in_review: 'Ditinjau', approved: 'Disetujui', rejected: 'Ditolak' }

export function InstitutionRequestsPage() {
  const query = useInstitutionRequests()
  const mutation = useReviewInstitutionRequest()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<InstitutionRequest | null>(null)
  const [confirmStatus, setConfirmStatus] = useState<InstitutionRequestDecision['status'] | null>(null)
  const [note, setNote] = useState('')

  const filtered = useMemo(() => (query.data ?? []).filter((request) => {
    const queryText = `${request.institutionName} ${request.registrationNumber} ${request.email}`.toLocaleLowerCase('id')
    return (!search || queryText.includes(search.trim().toLocaleLowerCase('id'))) && (status === 'all' || request.status === status)
  }), [query.data, search, status])
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns: ColumnDef<InstitutionRequest, unknown>[] = [
    { accessorKey: 'institutionName', header: 'Institusi', cell: ({ row }) => <div><p className="font-semibold">{row.original.institutionName}</p><p className="mt-0.5 text-xs text-muted-foreground">{row.original.registrationNumber}</p></div> },
    { accessorKey: 'city', header: 'Lokasi', cell: ({ row }) => `${row.original.city}, ${row.original.province}` },
    { accessorKey: 'submittedAt', header: 'Tanggal Masuk', cell: ({ row }) => formatDateTime(row.original.submittedAt) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} label={statusLabels[row.original.status]} /> },
    { id: 'action', header: 'Aksi', enableSorting: false, cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => { setSelected(row.original); setNote('') }}><Eye aria-hidden /> Tinjau</Button> },
  ]

  async function decide() {
    if (!selected || !confirmStatus) return
    try {
      await mutation.mutateAsync({ id: selected.id, decision: { status: confirmStatus, note: confirmStatus === 'rejected' ? note.trim() : undefined } })
      toast.success(confirmStatus === 'approved' ? 'Permintaan disetujui.' : 'Permintaan ditolak.')
      setConfirmStatus(null)
      setSelected(null)
      setNote('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Status permintaan gagal diperbarui.')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Permintaan Institusi" description="Tinjau pengajuan institusi dan catat keputusan verifikasi." />
      {env.useMock ? <Alert variant="warning"><Inbox aria-hidden /><span><strong>Mode simulasi.</strong> Daftar dan keputusan approval disimpan di browser ini, tidak dikirim ke server.</span></Alert> : null}
      <Card className="space-y-4 p-4 sm:p-5">
        <FilterBar>
          <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Cari institusi, nomor, atau email…" />
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1) }}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter status permintaan"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="in_review">Ditinjau</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>
        <DataTable
          caption="Daftar permintaan institusi"
          columns={columns}
          data={paged}
          isLoading={query.isLoading}
          error={query.isError ? { message: query.error instanceof Error ? query.error.message : 'Permintaan gagal dimuat.' } : null}
          onRetry={() => void query.refetch()}
          empty={<div className="flex flex-col items-center gap-2 p-8 text-center"><Inbox className="size-8 text-muted-foreground" aria-hidden /><p className="font-semibold">Belum ada permintaan</p><p className="text-sm text-muted-foreground">Permintaan institusi akan tampil di sini setelah tersedia.</p></div>}
        />
        {!query.isError ? <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} /> : null}
      </Card>

      <Dialog open={!!selected && !confirmStatus} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <DialogContent>
          {selected ? <>
            <DialogHeader>
              <DialogTitle>Tinjau Pengajuan</DialogTitle>
              <DialogDescription>{selected.registrationNumber} · Dikirim {formatDateTime(selected.submittedAt)}</DialogDescription>
            </DialogHeader>
            <dl className="grid gap-x-5 gap-y-4 rounded-xl bg-surface-muted/70 p-4 sm:grid-cols-2">
              <RequestField label="Nama institusi" value={selected.institutionName} />
              <RequestField label="Jenis" value={selected.institutionType} />
              <RequestField label="Penanggung jawab" value={selected.contactName ?? 'Belum tersedia'} />
              <RequestField label="Jabatan" value={selected.position ?? 'Belum tersedia'} />
              <RequestField label="Email penanggung jawab" value={selected.email} />
              <RequestField label="Telepon" value={selected.phone} />
              <RequestField label="Lokasi" value={`${selected.city}, ${selected.province}`} />
              <RequestField label="Status saat ini" value={<StatusBadge status={selected.status} label={statusLabels[selected.status]} />} />
            </dl>
            {selected.status === 'pending' || selected.status === 'in_review' ? (
              <div className="space-y-2">
                <Label htmlFor="review-note">Catatan keputusan <span className="font-normal text-muted-foreground">(wajib jika ditolak)</span></Label>
                <Textarea id="review-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Tuliskan catatan untuk institusi…" maxLength={500} />
                <p className="text-right text-xs text-muted-foreground">{note.length}/500</p>
              </div>
            ) : selected.note ? <Alert variant={selected.status === 'rejected' ? 'destructive' : 'success'}><span>{selected.note}</span></Alert> : null}
            <DialogFooter>
              {selected.status === 'pending' || selected.status === 'in_review' ? <>
                <Button variant="destructive" onClick={() => { if (!note.trim()) { toast.error('Catatan wajib diisi untuk penolakan.'); return } setConfirmStatus('rejected') }}><X aria-hidden /> Tolak</Button>
                <Button onClick={() => setConfirmStatus('approved')}><Check aria-hidden /> Setujui</Button>
              </> : <Button variant="outline" onClick={() => setSelected(null)}>Tutup</Button>}
            </DialogFooter>
          </> : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmStatus}
        onOpenChange={(open) => { if (!open) setConfirmStatus(null) }}
        title={confirmStatus === 'approved' ? 'Setujui institusi ini?' : 'Tolak pengajuan ini?'}
        description={confirmStatus === 'approved' ? `Pengajuan ${selected?.institutionName ?? ''} akan ditandai disetujui.` : `Pengajuan ${selected?.institutionName ?? ''} akan ditandai ditolak dengan catatan yang kamu masukkan.`}
        confirmLabel={confirmStatus === 'approved' ? 'Ya, setujui' : 'Ya, tolak'}
        variant={confirmStatus === 'rejected' ? 'destructive' : 'default'}
        loading={mutation.isPending}
        onConfirm={() => void decide()}
      />
    </div>
  )
}

function RequestField({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="min-w-0"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>
}
