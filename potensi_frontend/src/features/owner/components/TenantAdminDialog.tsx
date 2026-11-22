import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormField } from '@/components/shared/FormField'
import { FormDialog } from '@/components/shared/dialogs'
import { Input } from '@/components/ui/input'
import { useCreateTenantAdmin } from '../hooks/useOwnerData'

const schema = z.object({ name: z.string().trim().min(2, 'Masukkan nama minimal 2 karakter.'), email: z.email('Masukkan email yang valid.'), password: z.string().min(8, 'Kata sandi minimal 8 karakter.') })
type Values = z.infer<typeof schema>

export function TenantAdminDialog({ tenantId, open, onOpenChange }: { tenantId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } })
  const mutation = useCreateTenantAdmin(tenantId)

  useEffect(() => { if (!open) form.reset({ name: '', email: '', password: '' }) }, [open, form])

  async function onSubmit(values: Values) {
    try {
      await mutation.mutateAsync(values)
      toast.success('Akun admin institusi berhasil dibuat.')
      onOpenChange(false)
    } catch (error) {
      const apiError = error as { message?: string; fieldErrors?: Record<string, string[]> }
      for (const [field, messages] of Object.entries(apiError.fieldErrors ?? {})) {
        if (field === 'name' || field === 'email' || field === 'password') form.setError(field, { message: messages[0] })
      }
      if (!apiError.fieldErrors) toast.error(apiError.message ?? 'Akun admin gagal dibuat.')
    }
  }

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="Buat Akun Admin" description="Backend akan membuat akun Admin External untuk institusi ini." submitLabel="Buat Akun" loading={mutation.isPending} onSubmit={form.handleSubmit(onSubmit)}>
      <FormField id="new-admin-name" label="Nama lengkap" required error={form.formState.errors.name?.message}>
        <Input id="new-admin-name" autoComplete="name" {...form.register('name')} />
      </FormField>
      <FormField id="new-admin-email" label="Email" required error={form.formState.errors.email?.message}>
        <Input id="new-admin-email" type="email" autoComplete="email" {...form.register('email')} />
      </FormField>
      <FormField id="new-admin-password" label="Kata sandi sementara" required description="Minimal 8 karakter. Gunakan kata sandi sementara dan sampaikan secara aman kepada admin." error={form.formState.errors.password?.message}>
        <Input id="new-admin-password" type="password" autoComplete="new-password" {...form.register('password')} />
      </FormField>
    </FormDialog>
  )
}
