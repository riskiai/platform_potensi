import { z } from 'zod'

export const institutionSettingsSchema = z.object({
  email: z.string().trim().pipe(z.union([z.literal(''), z.email('Masukkan alamat email yang valid.')])),
  phone: z.string().trim().refine(
    value => value === '' || /^[+()0-9 .-]{8,25}$/.test(value) && /[0-9]/.test(value),
    'Masukkan nomor telepon yang valid.',
  ),
  website: z.string().trim().pipe(z.union([
    z.literal(''),
    z.url({ protocol: /^https?$/, message: 'Masukkan alamat situs dengan http:// atau https://.' }),
  ])),
})

export type InstitutionSettings = z.infer<typeof institutionSettingsSchema>
