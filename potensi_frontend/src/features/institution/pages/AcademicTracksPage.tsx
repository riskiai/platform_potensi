import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/dialogs'
import { EmptyState } from '@/components/shared/states'
import { SearchInput } from '@/components/shared/FilterBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { trackService } from '@/services/academic-program.service'
import type { AcademicTrack } from '@/types/academic-track'
import { ProgramWorkspace } from '../components/ProgramWorkspace'
import { TrackFormDialog } from '../components/TrackFormDialog'

export function AcademicTracksPage() {
  return <ProgramWorkspace title="Track Akademik" unavailable="Modul menunggu integrasi API track akademik.">
    {(institutionId, programId) => <TrackList key={institutionId + programId} institutionId={institutionId} programId={programId} />}
  </ProgramWorkspace>
}

function TrackList({ institutionId, programId }: { institutionId: string; programId: string }) {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<AcademicTrack | null | undefined>()
  const [deleting, setDeleting] = useState<AcademicTrack | null>(null)
  const client = useQueryClient()
  const key = ['academic-tracks', institutionId, programId]
  const query = useQuery({ queryKey: key, queryFn: () => trackService.list(institutionId, programId), retry: false })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const remove = useMutation({
    mutationFn: (id: string) => trackService.remove(institutionId, programId, id),
    onSuccess: async () => { setDeleting(null); toast.success('Track dihapus.'); await refresh() },
    onError: error => toast.error(error.message || 'Gagal menghapus track.'),
  })
  const term = search.trim().toLowerCase()
  const rows = query.data?.filter(track => track.name.toLowerCase().includes(term))
  return <div className="space-y-5">
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama track" />
        <Button onClick={() => setEditor(null)}><Plus aria-hidden /> Tambah track</Button>
      </div>
        <DataTable<AcademicTrack> caption="Track akademik institusi" data={rows} isLoading={query.isLoading}
          error={query.isError ? { message: 'Daftar track gagal dibaca.' } : null} onRetry={() => void query.refetch()}
          getRowId={row => row.id} empty={<EmptyState title={term ? 'Track tidak ditemukan' : 'Belum ada track akademik'}
            description={term ? 'Coba kata kunci lain.' : 'Tambahkan track pertama untuk program ini.'} />}
          columns={[
            { accessorKey: 'name', header: 'Nama track' },
            { accessorKey: 'description', header: 'Deskripsi', cell: ({ row }) => row.original.description || '—' },
            { id: 'actions', header: 'Tindakan', cell: ({ row }) => <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditor(row.original)}>Ubah</Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(row.original)}>Hapus</Button>
            </div> },
          ]} />
    </Card>
    {editor !== undefined && <TrackFormDialog track={editor} onClose={() => setEditor(undefined)} onSave={async values => {
      await trackService.save(institutionId, programId, values, editor?.id)
      setEditor(undefined)
      toast.success('Track tersimpan.')
      await refresh()
    }} />}
    <ConfirmDialog open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null) }}
      title="Hapus track akademik?" description={deleting?.name} variant="destructive" confirmLabel="Hapus track"
      loading={remove.isPending} onConfirm={() => { if (deleting) remove.mutate(deleting.id) }} />
  </div>
}
