/**
 * ⚠️ SEMENTARA — tipe ini dibuat dari brief, belum dari kontrak API backend.
 * Saat kontrak final tersedia, sesuaikan di sini dan di adapter `services/auth.service.ts`.
 * Komponen UI tidak perlu ikut diubah.
 */

export type UserRole = 'platform_owner' | 'institution_admin' | 'participant'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  institutionId?: string
  institutionName?: string
}

export interface LoginPayload {
  /** Email, NIM, atau NIDN — backend yang menentukan jenis akun & role. */
  identifier: string
  password: string
  remember: boolean
}

export interface AuthSession {
  token: string
  user: AuthUser
}
