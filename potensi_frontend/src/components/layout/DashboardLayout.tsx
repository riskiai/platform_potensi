import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Dialog, DialogTitle, SheetContent } from '@/components/ui/dialog'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_HOME } from '@/features/auth/lib/role-home'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { cn } from '@/lib/utils'
import { NAVIGATION, PROFILE_PATH } from './navigation'
import { SidebarNav } from './SidebarNav'
import { Topbar } from './Topbar'

/** Kerangka semua halaman dashboard: Sidebar + Topbar + konten. Dipakai ketiga role. */
export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useLocalStorageState('potensi.sidebar-collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const groups = NAVIGATION[user.role]
  const homePath = ROLE_HOME[user.role]
  const institutionFooter = user.institutionName ? (
    <div className="flex items-center gap-2.5 rounded-lg bg-surface-muted px-3 py-2.5">
      <Building2 className="size-4 shrink-0 text-primary" aria-hidden />
      <span className="truncate text-xs font-semibold text-foreground">{user.institutionName}</span>
    </div>
  ) : null

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-svh bg-background">
        {/* Sidebar desktop */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface transition-[width] duration-200 lg:block',
            collapsed ? 'w-[76px]' : 'w-[264px]',
          )}
        >
          <SidebarNav
            groups={groups}
            homePath={homePath}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            footer={institutionFooter}
          />
        </aside>

        {/* Sidebar mobile (drawer) */}
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent aria-describedby={undefined}>
            <DialogTitle className="sr-only">Menu navigasi</DialogTitle>
            <SidebarNav groups={groups} homePath={homePath} onNavigate={() => setMobileOpen(false)} footer={institutionFooter} />
          </SheetContent>
        </Dialog>

        <div className={cn('flex min-h-svh flex-col transition-[padding] duration-200', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]')}>
          <Topbar
            user={user}
            homePath={homePath}
            profilePath={PROFILE_PATH[user.role]}
            onOpenMenu={() => setMobileOpen(true)}
            onSignOut={() => void signOut()}
          />
          <main id="main-content" className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
