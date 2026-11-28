import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDialog } from '@/components/shared/dialogs'
import { FormField } from '@/components/shared/FormField'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { programSchema, type AcademicProgram, type ProgramInput } from '@/types/academic-program'

interface Props {
  program: AcademicProgram | null
  onSave: (values: ProgramInput) => Promise<void>
  onClose: () => void
}

export function ProgramFormDialog({ program, onSave, onClose }: Props) {
  const form = useForm<ProgramInput>({
    resolver: zodResolver(programSchema),
    mode: 'onTouched',
    defaultValues: program ?? { name: '', description: '' },
  })
  const { errors, isSubmitting } = form.formState
  return <FormDialog open onOpenChange={open => { if (!open) onClose() }}
    title={program ? 'Ubah program akademik' : 'Tambah program akademik'}
    loading={isSubmitting} onSubmit={form.handleSubmit(async values => {
      try { await onSave(values) }
      catch (error) { form.setError('root', { message: error instanceof Error ? error.message : 'Gagal menyimpan program.' }) }
    })}>
    <FormField id="program-name" label="Nama program" required error={errors.name?.message}>
      <Input id="program-name" required placeholder="Mis. Peminatan Informatika" {...form.register('name')} />
    </FormField>
    <FormField id="program-description" label="Deskripsi (opsional)" error={errors.description?.message}>
      <Textarea id="program-description" rows={3} {...form.register('description')} />
    </FormField>
    {errors.root && <p role="alert" className="text-sm text-destructive">{errors.root.message}</p>}
  </FormDialog>
}
