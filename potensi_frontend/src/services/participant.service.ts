import { env } from '@/lib/env'
import { participants, storeParticipants } from '@/mocks/participants.mock'
import { registrations } from '@/mocks/registration.mock'
import { MOCK_USERS } from '@/mocks/fixtures/users'
import { participantInputSchema, type ParticipantInput } from '@/types/participant'

function scopedRows(institutionId: string) {
  if (!env.useMock || !institutionId) throw new Error('Pengelolaan peserta belum tersedia.')
  return participants()
}

export const participantService = {
  available: env.useMock,
  async list(institutionId: string) {
    return scopedRows(institutionId).filter(row => row.institutionId === institutionId)
      .sort((a, b) => a.name.localeCompare(b.name, 'id'))
  },
  async save(institutionId: string, institutionName: string, input: ParticipantInput, id?: string) {
    const rows = scopedRows(institutionId)
    const existing = rows.find(row => row.institutionId === institutionId && row.id === id)
    if (id && !existing) throw new Error('Peserta tidak ditemukan.')
    const values = participantInputSchema.parse(input)
    const reserved = MOCK_USERS.some(user => user.role !== 'participant' && user.email === values.email)
      || registrations().some(row => row.status !== 'rejected' && row.email.toLowerCase() === values.email)
    if (reserved || rows.some(row => row.id !== id && row.email === values.email)) throw new Error('Email sudah digunakan.')
    if (existing) Object.assign(existing, values)
    else rows.push({ ...values, id: crypto.randomUUID(), institutionId, institutionName, active: true })
    storeParticipants(rows)
  },
  async setActive(institutionId: string, id: string, active: boolean) {
    const rows = scopedRows(institutionId)
    const row = rows.find(item => item.institutionId === institutionId && item.id === id)
    if (!row) throw new Error('Peserta tidak ditemukan.')
    row.active = active
    storeParticipants(rows)
  },
}
