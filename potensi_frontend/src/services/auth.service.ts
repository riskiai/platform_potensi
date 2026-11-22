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

const ENDPOINTS = {
  login: '/login',
  me: '/me',
  logout: '/logout',
} as const

const authHttpService: AuthService = {
  async login(payload) {
    const { data } = await apiClient.post(ENDPOINTS.login, {
      email: payload.identifier,
      password: payload.password,
    })
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
  if (!body || typeof body.token !== 'string' || !body.user) {
    throw new Error('Respons login backend tidak sesuai kontrak.')
  }
  return { token: body.token, user: adaptUser(body.user) }
}

function adaptUser(raw: unknown): AuthUser {
  const body = unwrap(raw)
  if (!body || typeof body !== 'object') throw new Error('Respons profil backend tidak valid.')
  const user = body as { id?: string | number; name?: string; email?: string; role?: string; company?: string | null }
  const roles: Record<string, AuthUser['role']> = {
    owner: 'platform_owner',
    admin: 'institution_admin',
    admin_external: 'institution_admin',
    participant: 'participant',
  }
  const role = user.role ? roles[user.role] : undefined
  if (user.id === undefined || !user.name || !user.email || !role) {
    throw new Error('Profil backend memiliki field yang belum dikenali.')
  }
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role,
    ...(user.company ? { institutionName: user.company } : {}),
  }
}

/** Banyak API membungkus respons di `{ data: ... }`. */
function unwrap(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && 'data' in raw) return (raw as { data: unknown }).data
  return raw
}

export const authService: AuthService = env.useMock ? authMockService : authHttpService
