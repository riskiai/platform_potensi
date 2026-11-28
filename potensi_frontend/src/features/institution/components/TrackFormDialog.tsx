import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialog } from '@/components/shared/dialogs'
import { FormField } from '@/components/shared/FormField'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackSchema, type AcademicTrack, type TrackInput } from '@/types/academic-track'

interface Props {
  track: AcademicTrack | null
  onSave: (values: TrackInput) => Promise<void>
  onClose: () => void
}

export function TrackFormDialog({ track, onSave, onClose }: Props) {
  const form = useForm<TrackInput>({
    resolver: zodResolver(trackSchema),
    mode: 'onTouched',
    defaultValues: track ?? { name: '', description: '' },
  })
  const { errors, isSubmitting } = form.formState
  return <FormDialog open onOpenChange={open => { if (!open) onClose() }}
    title={track ? 'Ubah track akademik' : 'Tambah track akademik'}
    loading={isSubmitting} onSubmit={form.handleSubmit(async values => {
      try { await onSave(values) }
      catch (error) { form.setError('root', { message: error instanceof Error ? error.message : 'Gagal menyimpan track.' }) }
    })}>
    <FormField id="track-name" label="Nama track" required error={errors.name?.message}>
      <Input id="track-name" required placeholder="Mis. Data Science" {...form.register('name')} />
    </FormField>
    <FormField id="track-description" label="Deskripsi (opsional)" error={errors.description?.message}>
      <Textarea id="track-description" rows={3} {...form.register('description')} />
    </FormField>
    {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
  </FormDialog>
}
