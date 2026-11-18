import { useEffect, useState } from 'react'
import { FormProvider, useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Copy, FileSearch, Mail, Save, Send, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Stepper } from '@/components/shared/Stepper'
import { SuccessState } from '@/components/shared/states'
import { ROUTES } from '@/constants/routes'
import type { InstitutionRegistrationPayload, InstitutionType, RegistrationReceipt } from '@/types/registration'
import { AdminStep, InstitutionStep, ReviewStep } from '../components/RegistrationSteps'
import { useSubmitRegistration } from '../hooks/useRegistration'
import { clearDraft, loadDraft, saveDraft } from '../lib/draft'
import { registrationSchema, STEP_FIELDS, type RegistrationFormValues } from '../schemas/registration.schema'

const STEPS = [
  { title: 'Data Institusi', description: 'Identitas & alamat' },
  { title: 'Penanggung Jawab', description: 'Calon admin institusi' },
  { title: 'Tinjau & Kirim', description: 'Periksa kembali' },
]

function toPayload(v: RegistrationFormValues): InstitutionRegistrationPayload {
  return {
    institution: {
      ...v.institution,
      type: v.institution.type as InstitutionType,
      code: v.institution.code || undefined,
      website: v.institution.website || undefined,
    },
    admin: v.admin,
  }
}

export function RegisterInstitutionPage() {
  const [initial] = useState(loadDraft)
  const [step, setStep] = useState(0)
  const [receipt, setReceipt] = useState<(RegistrationReceipt & { email: string }) | null>(null)
  const submit = useSubmitRegistration()

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: initial.values,
    mode: 'onTouched',
  })

  // Simpan draf otomatis setiap ada perubahan.
  useEffect(() => {
    return form.subscribe({
      formState: { values: true },
      callback: ({ values }) => saveDraft(values),
    })
  }, [form])

  const goTo = (next: number) => {
    setStep(next)
    document.getElementById('registration-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = async () => {
    const ok = await form.trigger([...STEP_FIELDS[step]] as FieldPath<RegistrationFormValues>[], { shouldFocus: true })
    if (ok) goTo(step + 1)
  }

  const onSubmit = form.handleSubmit((values) => {
    submit.mutate(toPayload(values), {
      onSuccess(res) {
        clearDraft()
        setReceipt({ ...res, email: values.admin.email })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      onError(error) {
        // Error per field dari backend → tampilkan & lompat ke langkah terkait.
        const entries = Object.entries(error.fieldErrors ?? {})
        let firstStep: number | null = null
        for (const [path, messages] of entries) {
          form.setError(path as FieldPath<RegistrationFormValues>, { message: messages[0] })
          const idx = STEP_FIELDS.findIndex((fields) => (fields as readonly string[]).includes(path))
          if (idx >= 0 && (firstStep === null || idx < firstStep)) firstStep = idx
        }
        if (firstStep !== null) goTo(firstStep)
      },
    })
  })

  const resetDraft = () => {
    clearDraft()
    form.reset(loadDraft().values)
    goTo(0)
    toast.success('Draf dihapus')
  }

  if (receipt) return <RegistrationSuccess receipt={receipt} />

  const isLast = step === STEPS.length - 1
  const hasFieldErrors = Object.keys(submit.error?.fieldErrors ?? {}).length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-bold tracking-widest text-accent-strong uppercase">Registrasi Institusi</p>
        <h1 className="text-3xl font-bold text-foreground">Daftarkan institusi Anda</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Isi data berikut untuk mengajukan kemitraan. Pengajuan akan ditinjau oleh Platform Owner POTENSI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card id="registration-card" className="scroll-mt-24 overflow-hidden">
          <div className="border-b border-border px-5 py-5 sm:px-8">
            <Stepper steps={STEPS} current={step} />
            <p className="mt-3 text-sm font-semibold text-foreground sm:hidden">
              Langkah {step + 1} dari {STEPS.length}: {STEPS[step].title}
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={onSubmit} noValidate>
              <div className="px-5 py-6 sm:px-8 sm:py-7">
                {submit.isError && !hasFieldErrors ? (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle aria-hidden />
                    <p className="font-medium">{submit.error.message}</p>
                  </Alert>
                ) : null}

                {step === 0 ? <InstitutionStep /> : null}
                {step === 1 ? <AdminStep /> : null}
                {step === 2 ? <ReviewStep onEdit={goTo} /> : null}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border bg-background/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Save className="size-3.5" aria-hidden /> Draf tersimpan otomatis di browser ini.
                  {initial.hasDraft || form.formState.isDirty ? (
                    <button type="button" onClick={resetDraft} className="font-semibold text-accent-strong hover:underline">
                      Hapus draf
                    </button>
                  ) : null}
                </p>
                <div className="flex gap-2">
                  {step > 0 ? (
                    <Button type="button" variant="outline" onClick={() => goTo(step - 1)} disabled={submit.isPending}>
                      <ArrowLeft aria-hidden /> Kembali
                    </Button>
                  ) : null}
                  {isLast ? (
                    <Button type="submit" loading={submit.isPending} className="flex-1 sm:flex-none">
                      {!submit.isPending ? <Send aria-hidden /> : null}
                      {submit.isPending ? 'Mengirim…' : 'Kirim Pengajuan'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => void next()} className="flex-1 sm:flex-none">
                      Lanjut <ArrowRight aria-hidden />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Setelah Anda mendaftar</h2>
            <ol className="flex flex-col gap-4">
              {[
                { icon: FileSearch, text: 'Platform Owner meninjau data institusi Anda.' },
                { icon: Mail, text: 'Hasil peninjauan dikirim ke email penanggung jawab.' },
                { icon: ShieldCheck, text: 'Jika disetujui, akun Admin Institusi diaktifkan.' },
              ].map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <s.icon className="size-4" aria-hidden />
                  </span>
                  <span className="pt-1.5">{s.text}</span>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-5 text-sm">
            <p className="text-muted-foreground">Sudah pernah mengajukan?</p>
            <Link to={ROUTES.registrationStatus} className="mt-1 inline-flex items-center gap-1 font-semibold text-accent-strong hover:underline">
              Cek status pengajuan <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function RegistrationSuccess({ receipt }: { receipt: RegistrationReceipt & { email: string } }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.registrationNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin. Salin nomor secara manual.')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="p-2 sm:p-4">
        <SuccessState
          title="Pengajuan berhasil dikirim"
          description={
            <>
              Simpan nomor pengajuan di bawah. Hasil peninjauan akan dikirim ke{' '}
              <strong className="text-foreground">{receipt.email}</strong>.
            </>
          }
        />
        <div className="mx-auto -mt-4 mb-6 flex max-w-sm items-center justify-between gap-3 rounded-xl border border-dashed border-primary/40 bg-primary-soft px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Nomor pengajuan</p>
            <p className="font-mono text-lg font-bold text-primary">{receipt.registrationNumber}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void copy()} aria-label="Salin nomor pengajuan">
            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
            {copied ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <div className="mb-4 flex flex-col justify-center gap-2 px-4 sm:flex-row">
          <Button asChild>
            <Link
              to={ROUTES.registrationStatus}
              state={{ registrationNumber: receipt.registrationNumber, email: receipt.email }}
            >
              Cek Status Pengajuan
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.home}>Kembali ke Beranda</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
