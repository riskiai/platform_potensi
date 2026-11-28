import { z } from 'zod'

export const participantInputSchema = z.object({
  name: z.string().trim().min(1, 'Masukkan nama peserta.').max(120, 'Maksimal 120 karakter.'),
  email: z.string().trim().email('Masukkan email yang valid.').toLowerCase(),
})

export const participantSchema = participantInputSchema.extend({
  id: z.string(),
  institutionId: z.string(),
  institutionName: z.string(),
  active: z.boolean(),
})

export type Participant = z.infer<typeof participantSchema>
export type ParticipantInput = z.infer<typeof participantInputSchema>
