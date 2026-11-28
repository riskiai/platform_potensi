import type { AuthUser } from '@/types/auth'

/**
 * Akun DEMO khusus mode mock (VITE_USE_MOCK=true). Bukan data produksi.
 * Semua akun memakai kata sandi `MOCK_PASSWORD`.
 */
export const MOCK_PASSWORD = 'password'

export const MOCK_USERS: AuthUser[] = [
  {
    id: 'u-owner-1',
    name: 'Platform Owner (Demo)',
    email: 'owner@potensi.test',
    role: 'platform_owner',
  },
  {
    id: 'u-admin-1',
    name: 'Admin Institusi (Demo)',
    email: 'admin@kampus.test',
    role: 'institution_admin',
    institutionId: 'kampus-demo',
    institutionName: 'Universitas Demo',
  },
  {
    id: 'u-participant-1',
    name: 'Peserta (Demo)',
    email: 'peserta@kampus.test',
    role: 'participant',
    institutionId: 'kampus-demo',
    institutionName: 'Universitas Demo',
  },
]
