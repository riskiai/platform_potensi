import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email atau nomor induk wajib diisi.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
