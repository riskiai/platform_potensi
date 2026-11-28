import { z } from 'zod'

export const trackSchema = z.object({
  name: z.string().trim().min(1, 'Masukkan nama track.').max(120, 'Maksimal 120 karakter.'),
  description: z.string().trim().max(500, 'Maksimal 500 karakter.'),
})

export type TrackInput = z.infer<typeof trackSchema>
export interface AcademicTrack extends TrackInput {
  id: string
}
