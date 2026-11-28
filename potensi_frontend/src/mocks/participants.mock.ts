import { participantSchema, type Participant } from '@/types/participant'
import { MOCK_USERS } from './fixtures/users'

const key = 'potensi.mock.participants'

export function participants(): Participant[] {
  const stored = localStorage.getItem(key)
  if (stored !== null) return participantSchema.array().parse(JSON.parse(stored))
  return MOCK_USERS.filter(user => user.role === 'participant').map(user => participantSchema.parse({ ...user, active: true }))
}

export function storeParticipants(rows: Participant[]) {
  localStorage.setItem(key, JSON.stringify(rows))
}
