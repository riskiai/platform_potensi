import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormField } from '@/components/shared/FormField'
import { FormDialog } from '@/components/shared/dialogs'
import { Input } from '@/components/ui/input'
import { useCreateTenant } from '../hooks/useOwnerData'
import { tenantSchema, type TenantFormValues } from '../schemas/tenant.schema'

export function TenantFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<TenantFormValues>({ resolver: zodResolver(tenantSchema), defaultValues: { name: '', phone: '' } })
  const createTenant = useCreateTenant()

  useEffect(() => {
    if (!open) form.reset({ name: '', phone: '' })
  }, [open, form])

  async function onSubmit(values: TenantFormValues) {
    try {
      await createTenant.mutateAsync({ name: values.name, phone: values.phone || undefined })
      toast.success('Institusi berhasil ditambahkan.')
      onOpenChange(false)
    } catch (error) {
      const apiError = error as { message?: string; fieldErrors?: Record<string, string[]> }
      for (const [field, messages] of Object.entries(apiError.fieldErrors ?? {})) {
        if (field === 'name' || field === 'phone') form.setError(field, { message: messages[0] })
      }
      if (!apiError.fieldErrors) toast.error(apiError.message ?? 'Institusi gagal ditambahkan.')
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Institusi"
      description="Tambahkan tenant institusi baru. Backend akan menyimpannya sebagai institusi eksternal aktif."
      submitLabel="Tambah Institusi"
      loading={createTenant.isPending}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormField id="tenant-name" label="Nama institusi" required error={form.formState.errors.name?.message}>
        <Input id="tenant-name" autoComplete="organization" placeholder="Contoh: Universitas Nusantara" {...form.register('name')} />
      </FormField>
      <FormField id="tenant-phone" label="Nomor telepon" error={form.formState.errors.phone?.message}>
        <Input id="tenant-phone" type="tel" autoComplete="tel" placeholder="(021) 555 0101" {...form.register('phone')} />
      </FormField>
    </FormDialog>
  )
}
