import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageLoader } from '@/components/shared/FullPageLoader'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/auth'
import { useAuth } from '../hooks/useAuth'
import { ROLE_HOME } from '../lib/role-home'

/** Halaman yang butuh login. `allow` membatasi role tertentu. */
export function ProtectedRoute({ allow }: { allow?: UserRole[] }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />
  if (!user) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  if (allow && !allow.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />
  return <Outlet />
}

/** Halaman tamu (login, dll.): user yang sudah login diarahkan ke dashboard-nya. */
export function GuestRoute() {
  const { status, user } = useAuth()
  if (status === 'loading') return <FullPageLoader />
  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />
  return <Outlet />
}
