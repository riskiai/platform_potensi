import { StatusBadge } from '@/components/shared/StatusBadge'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { DataTable } from '@/components/shared/DataTable'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/dialogs'
import { EmptyState } from '@/components/shared/states'
import { SearchInput } from '@/components/shared/FilterBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { participantService } from '@/services/participant.service'
import type { Participant } from '@/types/participant'
import { ParticipantFormDialog } from '../components/ParticipantFormDialog'

export function ParticipantsPage() {
  const { user } = useAuth()
  const institutionId = user?.institutionId ?? ''
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Participant | null | undefined>()
  const [changing, setChanging] = useState<Participant | null>(null)
  const client = useQueryClient()
  const key = ['participants', institutionId]
  const available = participantService.available && !!institutionId
  const query = useQuery({ queryKey: key, queryFn: () => participantService.list(institutionId), enabled: available, retry: false })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const toggle = useMutation({
    mutationFn: (row: Participant) => participantService.setActive(institutionId, row.id, !row.active),
    onSuccess: async () => { setChanging(null); toast.success('Status peserta diperbarui.'); await refresh() },
    onError: error => toast.error(error.message || 'Gagal mengubah status peserta.'),
  })
  const term = search.trim().toLowerCase()
  const rows = query.data?.filter(peserta => (peserta.name + ' ' + peserta.email).toLowerCase().includes(term))
  return <div className="space-y-5">
    <PageHeader title="Manajemen Peserta" description={user?.institutionName}
      actions={available && <Button onClick={() => setEditor(null)}><Plus aria-hidden /> Tambah peserta</Button>} />
    <Card>
      {available ? <>
        <div className="border-b border-border p-4"><SearchInput value={search} onChange={setSearch} placeholder="Cari nama atau email peserta" /></div>
        <DataTable<Participant> caption="Peserta akademik institusi" data={rows} isLoading={query.isLoading}
          error={query.isError ? { message: 'Daftar peserta gagal dibaca.' } : null} onRetry={() => void query.refetch()}
          getRowId={row => row.id} empty={<EmptyState title={term ? 'Peserta tidak ditemukan' : 'Belum ada peserta'}
            description={term ? 'Coba kata kunci lain.' : 'Tambahkan peserta pertama untuk institusi Anda.'} />}
          columns={[
            { accessorKey: 'name', header: 'Nama peserta' },
            { accessorKey: 'email', header: 'Email login' },
            { accessorKey: 'active', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.active ? 'active' : 'inactive'} /> },
            { id: 'actions', header: 'Tindakan', cell: ({ row }) => <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditor(row.original)}>Ubah</Button>
              <Button size="sm" variant="ghost" onClick={() => setChanging(row.original)}>{row.original.active ? 'Nonaktifkan' : 'Aktifkan'}</Button>
            </div> },
          ]} />
      </> : <EmptyState title="Data peserta belum tersedia" description={participantService.available ? 'Akun belum terhubung ke institusi.' : 'Modul menunggu integrasi API peserta.'} />}
    </Card>
    {editor !== undefined && <ParticipantFormDialog peserta={editor} onClose={() => setEditor(undefined)} onSave={async values => {
      await participantService.save(institutionId, user?.institutionName ?? '', values, editor?.id)
      setEditor(undefined)
      toast.success('Peserta tersimpan.')
      await refresh()
    }} />}
    <ConfirmDialog open={!!changing} onOpenChange={open => { if (!open) setChanging(null) }}
      title={changing?.active ? 'Nonaktifkan akun peserta?' : 'Aktifkan akun peserta?'}
      description={changing?.email} variant={changing?.active ? 'destructive' : 'default'}
      confirmLabel={changing?.active ? 'Nonaktifkan' : 'Aktifkan'}
      loading={toggle.isPending} onConfirm={() => { if (changing) toggle.mutate(changing) }} />
  </div>
}
