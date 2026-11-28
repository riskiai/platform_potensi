import { Building2, ChevronRight, GitBranch, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function InstitutionDashboardPage() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Institusi" description={user?.name && `Selamat datang, ${user.name}.`} />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-primary p-6 text-white sm:p-8">
          <Building2 className="size-9 shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm text-white/80">Institusi Anda</p>
            <h2 className="mt-1 break-words text-2xl font-bold">{user?.institutionName || 'Institusi belum tercantum'}</h2>
          </div>
        </div>
        <Link to={ROUTES.admin.institutionProfile} className="flex items-center justify-between gap-3 px-6 py-4 text-sm font-semibold text-primary hover:underline focus-visible:outline-offset-[-3px]">
          Lihat profil institusi <ChevronRight className="size-4" aria-hidden />
        </Link>
      </Card>
      <section aria-labelledby="academic-heading">
        <h2 id="academic-heading" className="mb-3 text-lg font-bold">Persiapan akademik</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <GraduationCap className="mb-3 size-6 text-primary" aria-hidden />
            <h3 className="font-semibold">Program Akademik</h3>
            <Link to={ROUTES.admin.programs} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">Kelola program akademik</Link>
          </Card>
          <Card className="p-5">
            <GitBranch className="mb-3 size-6 text-primary" aria-hidden />
            <h3 className="font-semibold">Track Akademik</h3>
            <Link to={ROUTES.admin.tracks} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">Kelola track akademik</Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
