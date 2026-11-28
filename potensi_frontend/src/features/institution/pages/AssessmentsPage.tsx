import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable } from '@/components/shared/DataTable'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/dialogs'
import { EmptyState } from '@/components/shared/states'
import { SearchInput } from '@/components/shared/FilterBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { assessmentService } from '@/services/academic-program.service'
import type { AssessmentDefinition } from '@/types/assessment-definition'
import { ProgramWorkspace } from '../components/ProgramWorkspace'
import { AssessmentFormDialog } from '../components/AssessmentFormDialog'

export function AssessmentsPage() {
  return <ProgramWorkspace title="Manajemen Asesmen" unavailable="Modul menunggu integrasi API asesmen.">
    {(institutionId, programId) => <AssessmentList key={institutionId + programId} institutionId={institutionId} programId={programId} />}
  </ProgramWorkspace>
}

function AssessmentList({ institutionId, programId }: { institutionId: string; programId: string }) {
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<AssessmentDefinition | null | undefined>()
  const [decision, setDecision] = useState<{ row: AssessmentDefinition; action: 'delete' | 'draft' | 'published' } | null>(null)
  const client = useQueryClient()
  const key = ['assessment-definitions', institutionId, programId]
  const query = useQuery({ queryKey: key, queryFn: () => assessmentService.list(institutionId, programId), retry: false })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const change = useMutation({
    mutationFn: async ({ row, action }: NonNullable<typeof decision>) => {
      if (action === 'delete') await assessmentService.remove(institutionId, programId, row.id)
      else await assessmentService.setStatus(institutionId, programId, row.id, action)
    },
    onSuccess: async () => { setDecision(null); toast.success('Perubahan asesmen tersimpan.'); await refresh() },
    onError: error => toast.error(error.message || 'Perubahan gagal disimpan.'),
  })
  const confirmLabel = decision?.action === 'delete' ? 'Hapus asesmen' : decision?.action === 'draft' ? 'Kembalikan ke draf' : 'Publikasikan'
  const term = search.trim().toLowerCase()
  const rows = query.data?.filter(asesmen => asesmen.name.toLowerCase().includes(term))
  return <div className="space-y-5">
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama asesmen" />
        <Button onClick={() => setEditor(null)}><Plus aria-hidden /> Tambah asesmen</Button>
      </div>
        <DataTable<AssessmentDefinition> caption="Asesmen program" data={rows} isLoading={query.isLoading}
          error={query.isError ? { message: 'Daftar asesmen gagal dibaca.' } : null} onRetry={() => void query.refetch()}
          getRowId={row => row.id} empty={<EmptyState title={term ? 'Asesmen tidak ditemukan' : 'Belum ada asesmen'}
            description={term ? 'Coba kata kunci lain.' : 'Tambahkan asesmen pertama untuk program ini.'} />}
          columns={[
            { accessorKey: 'name', header: 'Nama asesmen' },
            { accessorKey: 'instructions', header: 'Petunjuk', cell: ({ row }) => <span className="block max-w-sm whitespace-normal break-words">{row.original.instructions || '—'}</span> },
            { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
            { id: 'actions', header: 'Tindakan', cell: ({ row }) => <div className="flex gap-2">
              {row.original.status === 'draft' ? <>
                <Button size="sm" variant="outline" onClick={() => setEditor(row.original)}>Ubah</Button>
                <Button size="sm" onClick={() => setDecision({ row: row.original, action: 'published' })}>Publikasikan</Button>
                <Button size="sm" variant="ghost" onClick={() => setDecision({ row: row.original, action: 'delete' })}>Hapus</Button>
              </> : <Button size="sm" variant="outline" onClick={() => setDecision({ row: row.original, action: 'draft' })}>Kembalikan ke draf</Button>}
            </div> },
          ]} />
    </Card>
    {editor !== undefined && <AssessmentFormDialog asesmen={editor} onClose={() => setEditor(undefined)} onSave={async values => {
      await assessmentService.save(institutionId, programId, values, editor?.id)
      setEditor(undefined)
      toast.success('Asesmen tersimpan.')
      await refresh()
    }} />}
    <ConfirmDialog open={!!decision} onOpenChange={open => { if (!open) setDecision(null) }}
      title={confirmLabel + '?'} description={decision?.row.name} variant={decision?.action === 'delete' ? 'destructive' : 'default'}
      confirmLabel={confirmLabel} loading={change.isPending} onConfirm={() => { if (decision) change.mutate(decision) }} />
  </div>
}
