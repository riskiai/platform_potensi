import { useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { PageHeader } from '@/components/shared/PageHeader'
import { FormField } from '@/components/shared/FormField'
import { EmptyState, LoadingState, ErrorState } from '@/components/shared/states'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { programService } from '@/services/academic-program.service'

export function ProgramWorkspace({ title, unavailable, children }: { title: string; unavailable: string; children: (institutionId: string, programId: string) => ReactNode }) {
  const { user } = useAuth()
  const institutionId = user?.institutionId ?? ''
  const [selected, setSelected] = useState('')
  const available = programService.available && !!institutionId
  const programs = useQuery({
    queryKey: ['academic-programs', institutionId],
    queryFn: () => programService.list(institutionId),
    enabled: available,
    retry: false,
  })
  const items = programs.data ?? []
  const parent = items.find(program => program.id === selected) ?? items[0]
  return <div className="space-y-5">
    <PageHeader title={title} description={user?.institutionName} />
    {!available ? <Card><EmptyState title="Data belum tersedia" description={programService.available ? 'Akun belum terhubung ke institusi.' : unavailable} /></Card>
      : programs.isLoading ? <LoadingState label="Memuat program akademik…" />
      : programs.isError ? <ErrorState description="Daftar program gagal dimuat." onRetry={() => void programs.refetch()} />
      : !parent ? <Card><EmptyState title="Buat program akademik terlebih dahulu" description="Pilih program induk untuk mulai mengelola data."
        action={<Button asChild><Link to={ROUTES.admin.programs}>Kelola program akademik</Link></Button>} /></Card>
      : <>
        <FormField id="program-parent" label="Program akademik">
          <select id="program-parent" className="h-11 w-full rounded-md border border-border bg-surface px-3 sm:max-w-sm"
            value={parent.id} onChange={event => setSelected(event.target.value)}>
            {items.map(program => <option key={program.id} value={program.id}>{program.name}</option>)}
          </select>
        </FormField>
        {children(institutionId, parent.id)}
      </>}
  </div>
}
