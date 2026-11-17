import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/auth'

/** Halaman tujuan setelah login, ditentukan dari role yang dikirim backend. */
export const ROLE_HOME: Record<UserRole, string> = {
  platform_owner: ROUTES.owner.dashboard,
  institution_admin: ROUTES.admin.dashboard,
  participant: ROUTES.participant.dashboard,
}

export const ROLE_LABEL: Record<UserRole, string> = {
  platform_owner: 'Platform Owner',
  institution_admin: 'Admin Institusi',
  participant: 'Peserta',
}
