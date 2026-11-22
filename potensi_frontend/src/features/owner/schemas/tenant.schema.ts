import { z } from 'zod'

export const tenantSchema = z.object({
  name: z.string().trim().min(2, 'Nama institusi minimal 2 karakter.'),
  phone: z.string().trim().max(30, 'Nomor telepon maksimal 30 karakter.'),
})

export type TenantFormValues = z.infer<typeof tenantSchema>
