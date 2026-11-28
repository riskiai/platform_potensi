import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormField } from '@/components/shared/FormField'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { institutionSettingsService } from '@/services/institution-settings.service'
import { institutionSettingsSchema, type InstitutionSettings } from '@/types/institution-settings'
import { institutionSettingsKey, useInstitutionSettings } from '../hooks/useInstitutionSettings'

export function InstitutionSettingsPage() {
  const { user } = useAuth()
  const institutionId = user?.institutionId ?? ''
  const { available, query } = useInstitutionSettings(institutionId)

  return (
    <div className="space-y-5">
      <PageHeader title="Pengaturan Institusi" description={user?.institutionName} />
      <Card>
        {!available ? (
          <EmptyState title="Pengaturan belum tersedia" description={institutionSettingsService.available
            ? 'Hanya akun admin yang terhubung ke institusi yang dapat mengubah kontak.'
            : 'Pengubahan kontak menunggu integrasi API pengaturan institusi.'} />
        ) : query.isError ? (
          <ErrorState description="Kontak institusi gagal dimuat." onRetry={() => void query.refetch()} />
        ) : query.data ? (
          <InstitutionContactForm key={institutionId} institutionId={institutionId} initialValues={query.data} />
        ) : (
          <LoadingState label="Memuat kontak institusi…" />
        )}
      </Card>
    </div>
  )
}

function InstitutionContactForm({ institutionId, initialValues }: { institutionId: string; initialValues: InstitutionSettings }) {
  const client = useQueryClient()
  const form = useForm<InstitutionSettings>({
    resolver: zodResolver(institutionSettingsSchema),
    mode: 'onTouched',
    defaultValues: initialValues,
  })
  const { errors, isDirty, isSubmitting } = form.formState

  const save = form.handleSubmit(async values => {
    try {
      const settings = await institutionSettingsService.save(institutionId, values)
      client.setQueryData(institutionSettingsKey(institutionId), settings)
      form.reset(settings)
      toast.success('Kontak institusi tersimpan.')
    } catch {
      form.setError('root', { message: 'Kontak gagal disimpan. Coba lagi.' })
    }
  })

  return (
    <form noValidate onSubmit={save} className="max-w-2xl space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="font-semibold">Kontak resmi</h2>
        <p className="mt-1 text-sm text-muted-foreground">Kontak ini tampil di Profil Institusi. Di mode demo, perubahan tersimpan di browser ini.</p>
      </div>
      <fieldset disabled={isSubmitting} className="grid gap-4 sm:grid-cols-2">
        <FormField id="institution-contact-email" label="Email institusi" error={errors.email?.message}>
          <Input id="institution-contact-email" type="email" {...form.register('email')} />
        </FormField>
        <FormField id="institution-contact-phone" label="Telepon institusi" error={errors.phone?.message}>
          <Input id="institution-contact-phone" type="tel" {...form.register('phone')} />
        </FormField>
        <FormField id="institution-contact-website" label="Situs web" error={errors.website?.message} className="sm:col-span-2">
          <Input id="institution-contact-website" type="url" placeholder="https://kampus.ac.id" {...form.register('website')} />
        </FormField>
      </fieldset>
      {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
      <Button type="submit" disabled={!isDirty} loading={isSubmitting}>Simpan perubahan</Button>
    </form>
  )
}
