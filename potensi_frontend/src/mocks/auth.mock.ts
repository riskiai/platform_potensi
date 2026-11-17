import { tokenStorage } from '@/lib/token-storage'
import type { AuthService } from '@/services/auth.service'
import type { ApiError } from '@/types/api'
import { MOCK_PASSWORD, MOCK_USERS } from './fixtures/users'
import { delay } from './utils'

const TOKEN_PREFIX = 'mock-token:'

export const authMockService: AuthService = {
  async login({ identifier, password }) {
    await delay()
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === identifier.trim().toLowerCase())
    if (!user || password !== MOCK_PASSWORD) {
      throw { status: 401, message: 'Email/nomor induk atau kata sandi salah.' } satisfies ApiError
    }
    return { token: TOKEN_PREFIX + user.id, user }
  },

  async me() {
    await delay(300)
    const token = tokenStorage.get()
    const user = MOCK_USERS.find((u) => token === TOKEN_PREFIX + u.id)
    if (!user) throw { status: 401, message: 'Sesi berakhir. Silakan masuk kembali.' } satisfies ApiError
    return user
  },

  async logout() {
    await delay(200)
  },
}
