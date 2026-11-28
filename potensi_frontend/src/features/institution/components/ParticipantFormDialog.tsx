import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialog } from '@/components/shared/dialogs'
import { FormField } from '@/components/shared/FormField'
import { Input } from '@/components/ui/input'
import { MOCK_PASSWORD } from '@/mocks/fixtures/users'
import { participantInputSchema, type Participant, type ParticipantInput } from '@/types/participant'

interface Props {
  peserta: Participant | null
  onSave: (values: ParticipantInput) => Promise<void>
  onClose: () => void
}

export function ParticipantFormDialog({ peserta, onSave, onClose }: Props) {
  const form = useForm<ParticipantInput>({
    resolver: zodResolver(participantInputSchema),
    mode: 'onTouched',
    defaultValues: peserta ?? { name: '', email: '' },
  })
  const { errors, isSubmitting } = form.formState
  return <FormDialog open onOpenChange={open => { if (!open) onClose() }}
    title={peserta ? 'Ubah peserta' : 'Tambah peserta'}
    loading={isSubmitting} onSubmit={form.handleSubmit(async values => {
      try { await onSave(values) }
      catch (error) { form.setError('root', { message: error instanceof Error ? error.message : 'Gagal menyimpan peserta.' }) }
    })}>
    <FormField id="peserta-name" label="Nama peserta" required error={errors.name?.message}>
      <Input id="peserta-name" required placeholder="Nama lengkap peserta" {...form.register('name')} />
    </FormField>
    <FormField id="peserta-email" label="Email login" required error={errors.email?.message}>
      <Input id="peserta-email" required type="email" {...form.register('email')} />
    </FormField>
    <p className="text-sm text-muted-foreground">Login demo menggunakan email peserta dan sandi <strong>{MOCK_PASSWORD}</strong>.</p>
    {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
  </FormDialog>
}
