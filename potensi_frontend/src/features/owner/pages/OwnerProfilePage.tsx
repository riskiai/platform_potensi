import { Building2, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_LABEL } from '@/features/auth/lib/role-home'

export function OwnerProfilePage() {
  const { user } = useAuth()
  return (
    <div className="space-y-5">
      <PageHeader title="Profil" description="Informasi akun Platform Owner yang sedang digunakan." />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-5 bg-primary px-6 py-7 text-white sm:flex-row sm:items-center sm:px-8">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><UserRound className="size-8" aria-hidden /></div>
          <div><p className="text-sm text-white/75">Akun aktif</p><h2 className="mt-1 font-heading text-2xl font-bold">{user?.name ?? 'Platform Owner'}</h2><p className="mt-1 text-sm text-white/80">{user?.email ?? 'Email belum tersedia'}</p></div>
        </div>
        <dl className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <ProfileField icon={UserRound} label="Nama" value={user?.name ?? '—'} />
          <ProfileField icon={Mail} label="Email" value={user?.email ?? '—'} />
          <ProfileField icon={ShieldCheck} label="Peran" value={user ? ROLE_LABEL[user.role] : '—'} />
          <ProfileField icon={Building2} label="Institusi" value={user?.institutionName ?? 'Platform POTENSI'} />
        </dl>
      </Card>
      <p className="text-xs text-muted-foreground">Pengubahan profil belum tersedia pada API backend saat ini.</p>
    </div>
  )
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-muted-foreground"><Icon className="size-4" aria-hidden /></span><div><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd></div></div>
}
