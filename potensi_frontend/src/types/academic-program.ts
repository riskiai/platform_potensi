import { z } from 'zod'

export const programSchema = z.object({
  name: z.string().trim().min(1, 'Masukkan nama program.').max(120, 'Maksimal 120 karakter.'),
  description: z.string().trim().max(500, 'Maksimal 500 karakter.'),
})

export type ProgramInput = z.infer<typeof programSchema>
export interface AcademicProgram extends ProgramInput {
  id: string
}
