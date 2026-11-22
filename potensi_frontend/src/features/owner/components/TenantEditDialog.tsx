import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormField } from '@/components/shared/FormField'
import { FormDialog } from '@/components/shared/dialogs'
import { Input } from '@/components/ui/input'
import type { Tenant } from '@/types/owner'
import { useUpdateTenant } from '../hooks/useOwnerData'
import { tenantSchema, type TenantFormValues } from '../schemas/tenant.schema'

export function TenantEditDialog({ tenant, open, onOpenChange }: { tenant: Tenant; open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<TenantFormValues>({ resolver: zodResolver(tenantSchema), defaultValues: { name: tenant.name, phone: tenant.phone ?? '' } })
  const updateTenant = useUpdateTenant(tenant.id)

  useEffect(() => {
    if (open) form.reset({ name: tenant.name, phone: tenant.phone ?? '' })
  }, [open, tenant, form])

  async function onSubmit(values: TenantFormValues) {
    try {
      await updateTenant.mutateAsync({ name: values.name, phone: values.phone || undefined })
      toast.success('Data institusi berhasil diperbarui.')
      onOpenChange(false)
    } catch (error) {
      const apiError = error as { message?: string; fieldErrors?: Record<string, string[]> }
      for (const [field, messages] of Object.entries(apiError.fieldErrors ?? {})) {
        if (field === 'name' || field === 'phone') form.setError(field, { message: messages[0] })
      }
      if (!apiError.fieldErrors) toast.error(apiError.message ?? 'Data institusi gagal diperbarui.')
    }
  }

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="Ubah Data Institusi" description="Perubahan akan disimpan pada data tenant." submitLabel="Simpan Perubahan" loading={updateTenant.isPending} onSubmit={form.handleSubmit(onSubmit)}>
      <FormField id="edit-tenant-name" label="Nama institusi" required error={form.formState.errors.name?.message}>
        <Input id="edit-tenant-name" autoComplete="organization" {...form.register('name')} />
      </FormField>
      <FormField id="edit-tenant-phone" label="Nomor telepon" error={form.formState.errors.phone?.message}>
        <Input id="edit-tenant-phone" type="tel" autoComplete="tel" {...form.register('phone')} />
      </FormField>
    </FormDialog>
  )
}
