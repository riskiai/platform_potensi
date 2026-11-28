import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialog } from '@/components/shared/dialogs'
import { FormField } from '@/components/shared/FormField'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { assessmentInputSchema, type AssessmentDefinition, type AssessmentInput } from '@/types/assessment-definition'

interface Props {
  asesmen: AssessmentDefinition | null
  onSave: (values: AssessmentInput) => Promise<void>
  onClose: () => void
}

export function AssessmentFormDialog({ asesmen, onSave, onClose }: Props) {
  const form = useForm<AssessmentInput>({
    resolver: zodResolver(assessmentInputSchema),
    mode: 'onTouched',
    defaultValues: asesmen ?? { name: '', instructions: '' },
  })
  const { errors, isSubmitting } = form.formState
  return <FormDialog open onOpenChange={open => { if (!open) onClose() }}
    title={asesmen ? 'Ubah asesmen' : 'Tambah asesmen'}
    loading={isSubmitting} onSubmit={form.handleSubmit(async values => {
      try { await onSave(values) }
      catch (error) { form.setError('root', { message: error instanceof Error ? error.message : 'Gagal menyimpan asesmen.' }) }
    })}>
    <FormField id="asesmen-name" label="Nama asesmen" required error={errors.name?.message}>
      <Input id="asesmen-name" required placeholder="Mis. Asesmen Peminatan Informatika" {...form.register('name')} />
    </FormField>
    <FormField id="asesmen-instructions" label="Petunjuk untuk peserta (opsional)" error={errors.instructions?.message}>
      <Textarea id="asesmen-instructions" rows={3} {...form.register('instructions')} />
    </FormField>
    {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
  </FormDialog>
}
