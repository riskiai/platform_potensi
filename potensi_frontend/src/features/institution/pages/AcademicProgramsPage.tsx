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
import { programService } from '@/services/academic-program.service'
import type { AcademicProgram } from '@/types/academic-program'
import { ProgramFormDialog } from '../components/ProgramFormDialog'

export function AcademicProgramsPage() {
  const { user } = useAuth()
  const institutionId = user?.institutionId ?? ''
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<AcademicProgram | null | undefined>()
  const [deleting, setDeleting] = useState<AcademicProgram | null>(null)
  const client = useQueryClient()
  const key = ['academic-programs', institutionId]
  const available = programService.available && !!institutionId
  const query = useQuery({ queryKey: key, queryFn: () => programService.list(institutionId), enabled: available, retry: false })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const remove = useMutation({
    mutationFn: (id: string) => programService.remove(institutionId, id),
    onSuccess: async () => { setDeleting(null); toast.success('Program dihapus.'); await refresh() },
    onError: error => toast.error(error.message || 'Gagal menghapus program.'),
  })
  const term = search.trim().toLowerCase()
  const rows = query.data?.filter(program => program.name.toLowerCase().includes(term))
  return <div className="space-y-5">
    <PageHeader title="Program Akademik" description={user?.institutionName}
      actions={available && <Button onClick={() => setEditor(null)}><Plus aria-hidden /> Tambah program</Button>} />
    <Card>
      {available ? <>
        <div className="border-b border-border p-4"><SearchInput value={search} onChange={setSearch} placeholder="Cari nama program" /></div>
        <DataTable<AcademicProgram> caption="Program akademik institusi" data={rows} isLoading={query.isLoading}
          error={query.isError ? { message: 'Daftar program gagal dibaca.' } : null} onRetry={() => void query.refetch()}
          getRowId={row => row.id} empty={<EmptyState title={term ? 'Program tidak ditemukan' : 'Belum ada program akademik'}
            description={term ? 'Coba kata kunci lain.' : 'Tambahkan program pertama untuk institusi Anda.'} />}
          columns={[
            { accessorKey: 'name', header: 'Nama program' },
            { accessorKey: 'description', header: 'Deskripsi', cell: ({ row }) => row.original.description || '—' },
            { id: 'actions', header: 'Tindakan', cell: ({ row }) => <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditor(row.original)}>Ubah</Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(row.original)}>Hapus</Button>
            </div> },
          ]} />
      </> : <EmptyState title="Data program belum tersedia" description={programService.available ? 'Akun belum terhubung ke institusi.' : 'Modul menunggu integrasi API program akademik.'} />}
    </Card>
    {editor !== undefined && <ProgramFormDialog program={editor} onClose={() => setEditor(undefined)} onSave={async values => {
      await programService.save(institutionId, values, editor?.id)
      setEditor(undefined)
      toast.success('Program tersimpan.')
      await refresh()
    }} />}
    <ConfirmDialog open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null) }}
      title="Hapus program akademik?" description={deleting?.name} variant="destructive" confirmLabel="Hapus program"
      loading={remove.isPending} onConfirm={() => { if (deleting) remove.mutate(deleting.id) }} />
  </div>
}
