import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { RegisterInstitutionPage } from '@/features/registration/pages/RegisterInstitutionPage'
import { RegistrationStatusPage } from '@/features/registration/pages/RegistrationStatusPage'
import { NAVIGATION } from '@/components/layout/navigation'
import { ComingSoonPage } from '@/components/shared/ComingSoonPage'
import { NotFoundPage } from '@/components/shared/NotFoundPage'
import { RouteErrorPage } from '@/components/shared/RouteErrorPage'
import { GuestRoute, ProtectedRoute } from '@/features/auth/components/RouteGuards'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ROLE_HOME } from '@/features/auth/lib/role-home'
import { ModulePlaceholder } from '@/features/dashboard/pages/ModulePlaceholder'

/** Fase pengerjaan tiap role — hanya untuk teks placeholder. */
const ROLE_PHASE: Record<UserRole, string> = {
  platform_owner: 'Fase 4',
  institution_admin: 'Fase 5–6',
  participant: 'Fase 7',
}

/**
 * Route dashboard dibuat dari konfigurasi NAVIGATION.
 * Saat halaman asli selesai, ganti `ModulePlaceholder` di `PAGE_OVERRIDES`.
 */
const PAGE_LAZY: Partial<Record<string, NonNullable<RouteObject['lazy']>>> = {
  [ROUTES.admin.settings]: async () => ({ Component: (await import('@/features/institution/pages/InstitutionSettingsPage')).InstitutionSettingsPage }),
  [ROUTES.admin.participants]: async () => ({ Component: (await import('@/features/institution/pages/ParticipantsPage')).ParticipantsPage }),
  [ROUTES.admin.questions]: async () => ({ Component: (await import('@/features/institution/pages/QuestionBankPage')).QuestionBankPage }),
  [ROUTES.admin.assessments]: async () => ({ Component: (await import('@/features/institution/pages/AssessmentsPage')).AssessmentsPage }),
  [ROUTES.admin.tracks]: async () => ({ Component: (await import('@/features/institution/pages/AcademicTracksPage')).AcademicTracksPage }),
  [ROUTES.admin.programs]: async () => ({ Component: (await import('@/features/institution/pages/AcademicProgramsPage')).AcademicProgramsPage }),
  [ROUTES.admin.dashboard]: async () => ({ Component: (await import('@/features/institution/pages/InstitutionDashboardPage')).InstitutionDashboardPage }),
  [ROUTES.admin.institutionProfile]: async () => ({ Component: (await import('@/features/institution/pages/InstitutionProfilePage')).InstitutionProfilePage }),
  [ROUTES.owner.dashboard]: async () => ({ Component: (await import('@/features/owner/pages/OwnerDashboardPage')).OwnerDashboardPage }),
  [ROUTES.owner.institutionRequests]: async () => ({ Component: (await import('@/features/owner/pages/InstitutionRequestsPage')).InstitutionRequestsPage }),
  [ROUTES.owner.institutions]: async () => ({ Component: (await import('@/features/owner/pages/InstitutionsPage')).InstitutionsPage }),
  [ROUTES.owner.monitoring]: async () => ({ Component: (await import('@/features/owner/pages/MonitoringPage')).MonitoringPage }),
  [ROUTES.owner.profile]: async () => ({ Component: (await import('@/features/owner/pages/OwnerProfilePage')).OwnerProfilePage }),
}

function roleRoutes(role: UserRole): RouteObject {
  const home = ROLE_HOME[role]
  const items = NAVIGATION[role].flatMap((g) => g.items)
  return {
    element: <ProtectedRoute allow={[role]} />,
    children: [
      {
        path: home,
        element: <DashboardLayout />,
        children: [
          ...items.map((item) => {
            const lazyPage = PAGE_LAZY[item.path]
            return item.path === home
              ? lazyPage
                ? { index: true as const, lazy: lazyPage }
                : { index: true as const, element: <ModulePlaceholder title="Dashboard" phase={ROLE_PHASE[role]} /> }
              : {
                  path: item.path.slice(home.length + 1),
                  handle: { crumb: item.label },
                  ...(lazyPage ? { lazy: lazyPage } : { element: <ModulePlaceholder title={item.label} phase={ROLE_PHASE[role]} /> }),
                }
          }),
          ...(role === 'platform_owner'
            ? [{
                path: 'institusi/:tenantId',
                handle: { crumb: 'Detail Institusi' },
                lazy: async () => ({ Component: (await import('@/features/owner/pages/InstitutionDetailPage')).InstitutionDetailPage }),
              }]
            : []),
        ],
      },
    ],
  }
}

export const router = createBrowserRouter([
  { errorElement: <RouteErrorPage />, children: appRoutes() },
])

function appRoutes(): RouteObject[] {
  return [
  // Halaman publik (navbar + footer)
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home, element: <LandingPage /> },
      { path: ROUTES.registerInstitution, element: <RegisterInstitutionPage /> },
      { path: ROUTES.registrationStatus, element: <RegistrationStatusPage /> },
    ],
  },

  {
    element: <GuestRoute />,
    children: [{ path: ROUTES.login, element: <LoginPage /> }],
  },

  { path: ROUTES.forgotPassword, element: <ComingSoonPage title="Lupa Kata Sandi" /> },

  roleRoutes('platform_owner'),
  roleRoutes('institution_admin'),
  roleRoutes('participant'),

  // Galeri komponen — hanya saat development.
  ...(import.meta.env.DEV
    ? [
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <DashboardLayout />,
              children: [
                {
                  path: ROUTES.uiKit,
                  handle: { crumb: 'UI Kit' },
                  lazy: async () => ({ Component: (await import('@/features/dev/pages/UiKitPage')).UiKitPage }),
                },
              ],
            },
          ],
        },
      ]
    : []),

  { path: '*', element: <NotFoundPage /> },
  ]
}
