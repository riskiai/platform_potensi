import { z } from 'zod'

export const assessmentInputSchema = z.object({
  name: z.string().trim().min(1, 'Masukkan nama asesmen.').max(120, 'Maksimal 120 karakter.'),
  instructions: z.string().trim().max(2000, 'Maksimal 2.000 karakter.'),
})

export const questionInputSchema = z.object({
  text: z.string().trim().min(1, 'Masukkan teks pertanyaan.').max(1000, 'Maksimal 1.000 karakter.'),
})
export type QuestionInput = z.infer<typeof questionInputSchema>

export const assessmentDefinitionSchema = assessmentInputSchema.extend({
  id: z.string(),
  questions: z.array(questionInputSchema.extend({ id: z.string() })).default([]),
  status: z.enum(['draft', 'published']),
})

export type AssessmentInput = z.infer<typeof assessmentInputSchema>
export type AssessmentDefinition = z.infer<typeof assessmentDefinitionSchema>
