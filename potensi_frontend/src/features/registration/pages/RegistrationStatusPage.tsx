import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, FileSearch, Hash, LogIn, Mail, RotateCcw, Search } from 'lucide-react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/shared/FormField'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState, ErrorState, SkeletonRows } from '@/components/shared/states'
import { ROUTES } from '@/constants/routes'
import { env } from '@/lib/env'
import { formatDate } from '@/lib/format'
import type { RegistrationLookup, RegistrationStatusResult } from '@/types/registration'
import { StatusTimeline } from '../components/StatusTimeline'
import { useRegistrationStatus } from '../hooks/useRegistration'

const lookupSchema = z.object({
  registrationNumber: z.string().trim().min(1, 'Nomor pengajuan wajib diisi.'),
  email: z.string().trim().min(1, 'Email wajib diisi.').email('Format email tidak valid.'),
})

export function RegistrationStatusPage() {
  // Diisi otomatis bila datang dari halaman sukses registrasi (lewat router state, bukan URL).
  const prefill = (useLocation().state as Partial<RegistrationLookup> | null) ?? null
  const [lookup, setLookup] = useState<RegistrationLookup | null>(
    prefill?.registrationNumber && prefill.email
      ? { registrationNumber: prefill.registrationNumber, email: prefill.email }
      : null,
  )
  const query = useRegistrationStatus(lookup)

  const form = useForm<RegistrationLookup>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { registrationNumber: prefill?.registrationNumber ?? '', email: prefill?.email ?? '' },
  })
  const { errors } = form.formState

  const onSubmit = form.handleSubmit((v) => setLookup({ registrationNumber: v.registrationNumber.trim(), email: v.email.trim() }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent-strong uppercase">Status Registrasi</p>
        <h1 className="text-3xl font-bold text-foreground">Cek status pengajuan</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Masukkan nomor pengajuan dan email penanggung jawab yang digunakan saat mendaftar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit p-5 sm:p-6">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <FormField id="reg-number" label="Nomor pengajuan" required error={errors.registrationNumber?.message}>
              <div className="relative">
                <Hash className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="reg-number"
                  placeholder="REG-20261117-1234"
                  className="pl-10 font-mono uppercase placeholder:font-sans placeholder:normal-case"
                  aria-invalid={!!errors.registrationNumber || undefined}
                  {...form.register('registrationNumber')}
                />
              </div>
            </FormField>
            <FormField id="reg-email" label="Email penanggung jawab" required error={errors.email?.message}>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@kampus.ac.id"
                  className="pl-10"
                  aria-invalid={!!errors.email || undefined}
                  {...form.register('email')}
                />
              </div>
            </FormField>
            <Button type="submit" className="mt-1 w-full" loading={query.isFetching}>
              {!query.isFetching ? <Search aria-hidden /> : null}
              Cek Status
            </Button>
          </form>

          {env.useMock && env.isDev ? (
            <p className="mt-4 rounded-lg border border-dashed border-brand-gold/60 bg-warning/50 p-3 text-xs text-warning-foreground">
              <strong>Mode mock:</strong> coba <span className="font-mono">REG-DEMO-0001</span> s/d{' '}
              <span className="font-mono">0004</span> dengan email <span className="font-mono">demo@kampus.test</span>.
            </p>
          ) : null}

          <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
            Belum mendaftar?{' '}
            <Link to={ROUTES.registerInstitution} className="font-semibold text-accent-strong hover:underline">
              Daftarkan institusi
            </Link>
          </p>
        </Card>

        <Card className="min-h-[320px] p-5 sm:p-6">
          <StatusResult query={query} hasLookup={!!lookup} onReset={() => setLookup(null)} />
        </Card>
      </div>
    </div>
  )
}

function StatusResult({
  query,
  hasLookup,
  onReset,
}: {
  query: ReturnType<typeof useRegistrationStatus>
  hasLookup: boolean
  onReset: () => void
}) {
  if (!hasLookup) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Belum ada pencarian"
        description="Hasil pengecekan status pengajuan akan tampil di sini."
      />
    )
  }
  if (query.isPending) return <SkeletonRows rows={5} />
  if (query.isError) {
    if (query.error.status === 404) {
      return (
        <EmptyState
          icon={FileSearch}
          title="Pengajuan tidak ditemukan"
          description={query.error.message}
          action={
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw aria-hidden /> Cari lagi
            </Button>
          }
        />
      )
    }
    return <ErrorState description={query.error.message} onRetry={() => void query.refetch()} retrying={query.isFetching} />
  }
  return <StatusDetail data={query.data} />
}

function StatusDetail({ data }: { data: RegistrationStatusResult }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted-foreground">{data.registrationNumber}</p>
          <h2 className="mt-1 text-xl font-bold break-words text-foreground">{data.institutionName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Diajukan {formatDate(data.submittedAt)}</p>
        </div>
        <StatusBadge status={data.status} className="self-start px-3 py-1 text-sm" />
      </div>

      {data.status === 'approved' ? (
        <Alert variant="success">
          <LogIn aria-hidden />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p>Institusi Anda telah disetujui. Masuk dengan email penanggung jawab.{env.useMock && ' Kata sandi demo: password.'}</p>
            <Button asChild size="sm" className="shrink-0">
              <Link to={ROUTES.login}>
                Masuk <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Alert>
      ) : null}

      {data.status === 'rejected' ? (
        <Alert variant="destructive">
          <RotateCcw aria-hidden />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p>Pengajuan belum dapat disetujui. Perbaiki data sesuai catatan, lalu ajukan kembali.</p>
            <Button asChild size="sm" variant="outline" className="shrink-0">
              <Link to={ROUTES.registerInstitution}>Ajukan ulang</Link>
            </Button>
          </div>
        </Alert>
      ) : null}

      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">Riwayat proses</h3>
        <StatusTimeline status={data.status} timeline={data.timeline} />
      </div>
    </div>
  )
}
