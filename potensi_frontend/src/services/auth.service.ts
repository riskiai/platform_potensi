import { env } from '@/lib/env'
import { apiClient } from '@/services/api-client'
import { authMockService } from '@/mocks/auth.mock'
import type { AuthSession, AuthUser, LoginPayload } from '@/types/auth'

/** Kontrak yang dipakai UI. Implementasi HTTP dan mock wajib memenuhi interface ini. */
export interface AuthService {
  login(payload: LoginPayload): Promise<AuthSession>
  me(): Promise<AuthUser>
  logout(): Promise<void>
}

/**
 * ⚠️ Endpoint & bentuk respons di bawah masih ASUMSI.
 * Saat kontrak backend final, cukup ubah path & fungsi adapter di file ini.
 */
const ENDPOINTS = {
  login: '/auth/login',
  me: '/auth/me',
  logout: '/auth/logout',
} as const

const authHttpService: AuthService = {
  async login(payload) {
    const { data } = await apiClient.post(ENDPOINTS.login, payload)
    return adaptSession(data)
  },
  async me() {
    const { data } = await apiClient.get(ENDPOINTS.me)
    return adaptUser(data)
  },
  async logout() {
    await apiClient.post(ENDPOINTS.logout)
  },
}

// --- Adapter: ubah respons mentah backend → tipe frontend ---------------------
function adaptSession(raw: unknown): AuthSession {
  const body = unwrap(raw) as { token: string; user: unknown }
  return { token: body.token, user: adaptUser(body.user) }
}

function adaptUser(raw: unknown): AuthUser {
  return unwrap(raw) as AuthUser
}

/** Banyak API membungkus respons di `{ data: ... }`. */
function unwrap(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && 'data' in raw) return (raw as { data: unknown }).data
  return raw
}

export const authService: AuthService = env.useMock ? authMockService : authHttpService
