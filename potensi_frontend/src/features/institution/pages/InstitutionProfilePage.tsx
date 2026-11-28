import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState } from '@/components/shared/states'
import { useInstitutionSettings } from '../hooks/useInstitutionSettings'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function InstitutionProfilePage() {
  const { user } = useAuth()
  const { available, query } = useInstitutionSettings(user?.institutionId ?? '')
  return (
    <>
      <PageHeader title="Profil Institusi" description="Informasi institusi dan akun admin yang sedang masuk." />
      <Card className="p-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Nama institusi</dt>
            <dd className="mt-1 break-words text-xl font-bold">{user?.institutionName || 'Belum tersedia'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Nama admin</dt>
            <dd className="mt-1 break-words font-medium">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email admin</dt>
            <dd className="mt-1 break-all font-medium">{user?.email}</dd>
          </div>
        </dl>
      </Card>
      {available && (
        <Card className="mt-5 space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Kontak resmi institusi</h2>
            <Button asChild variant="outline" size="sm"><Link to={ROUTES.admin.settings}>Ubah kontak</Link></Button>
          </div>
          {query.isError ? (
            <ErrorState compact description="Kontak institusi gagal dimuat." onRetry={() => void query.refetch()} />
          ) : query.data ? (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="text-sm text-muted-foreground">Email</dt><dd className="mt-1 wrap-anywhere">{query.data.email || 'Belum diisi'}</dd></div>
              <div><dt className="text-sm text-muted-foreground">Telepon</dt><dd className="mt-1 wrap-anywhere">{query.data.phone || 'Belum diisi'}</dd></div>
              <div><dt className="text-sm text-muted-foreground">Situs web</dt><dd className="mt-1 wrap-anywhere">{query.data.website || 'Belum diisi'}</dd></div>
            </dl>
          ) : <LoadingState label="Memuat kontak institusi…" />}
        </Card>
      )}
    </>
  )
}
