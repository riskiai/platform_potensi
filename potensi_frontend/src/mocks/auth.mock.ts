import { tokenStorage } from '@/lib/token-storage'
import type { AuthService } from '@/services/auth.service'
import type { ApiError } from '@/types/api'
import { MOCK_PASSWORD, MOCK_USERS } from './fixtures/users'
import { mockTenantStatus } from './owner.mock'
import { participants } from './participants.mock'
import { registrations } from './registration.mock'
import { delay } from './utils'

const TOKEN_PREFIX = 'mock-token:'

function users() {
  const admins = registrations().filter(item => item.status === 'approved' && mockTenantStatus(item.registrationNumber, 'active') === 'active').map(item => ({
    id: 'admin-' + item.registrationNumber,
    role: 'institution_admin' as const,
    name: item.details?.admin.fullName ?? item.institutionName,
    institutionId: item.registrationNumber,
    institutionName: item.institutionName,
    email: item.email,
  }))
  const learners = participants()
    .filter(row => row.active && mockTenantStatus(row.institutionId, 'active') === 'active')
    .map(({ id, name, email, institutionId, institutionName }) => ({
      id, name, email, institutionId, institutionName, role: 'participant' as const,
    }))
  return [...MOCK_USERS.filter(user => user.role !== 'participant'), ...admins, ...learners]
}

export const authMockService: AuthService = {
  async login({ identifier, password }) {
    await delay()
    const user = users().find((u) => u.email.toLowerCase() === identifier.trim().toLowerCase())
    if (!user || password !== MOCK_PASSWORD) {
      throw { status: 401, message: 'Email/nomor induk atau kata sandi salah.' } satisfies ApiError
    }
    return { token: TOKEN_PREFIX + user.id, user }
  },

  async me() {
    await delay(300)
    const token = tokenStorage.get()
    const user = users().find((u) => token === TOKEN_PREFIX + u.id)
    if (!user) throw { status: 401, message: 'Sesi berakhir. Silakan masuk kembali.' } satisfies ApiError
    return user
  },

  async logout() {
    await delay(200)
  },
}
