import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, LayoutDashboard, Menu } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTitle, SheetContent } from '@/components/ui/dialog'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROLE_HOME } from '@/features/auth/lib/role-home'
import { cn } from '@/lib/utils'

const SECTION_LINKS = [
  { label: 'Cara Kerja', hash: '#cara-kerja' },
  { label: 'Fitur', hash: '#fitur' },
  { label: 'Track', hash: '#track' },
] as const

const CURRENT_YEAR = new Date().getFullYear()

/** Kerangka halaman publik: navbar + konten + footer. */
export function PublicLayout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll ke anchor (#cara-kerja, dst.) setelah navigasi; ke atas bila tanpa hash.
  useEffect(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location.pathname, location.hash])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to={ROUTES.home} aria-label={`${APP_NAME} — Beranda`} className="shrink-0">
            <Logo className="h-11" />
          </Link>

          <nav aria-label="Navigasi publik" className="hidden items-center gap-1 md:flex">
            {SECTION_LINKS.map((l) => (
              <Link
                key={l.hash}
                to={{ pathname: ROUTES.home, hash: l.hash }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <NavLink
              to={ROUTES.registrationStatus}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              Cek Status
            </NavLink>
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <AuthActions />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="ml-auto flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25 md:hidden"
            aria-label="Buka menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" aria-describedby={undefined} className="p-5">
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <Logo className="mb-6 h-10 self-start" />
          <nav className="flex flex-col gap-1" aria-label="Navigasi publik">
            {SECTION_LINKS.map((l) => (
              <Link
                key={l.hash}
                to={{ pathname: ROUTES.home, hash: l.hash }}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={ROUTES.registrationStatus}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              Cek Status Registrasi
            </Link>
          </nav>
          <div className="mt-auto flex flex-col gap-2" onClick={() => setMenuOpen(false)}>
            <AuthActions stacked />
          </div>
        </SheetContent>
      </Dialog>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Logo className="h-11 self-start" />
            <p className="max-w-xs text-sm text-muted-foreground">{APP_TAGLINE}.</p>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              { label: 'Cara Kerja', to: `${ROUTES.home}#cara-kerja` },
              { label: 'Fitur', to: `${ROUTES.home}#fitur` },
              { label: 'Track Peminatan', to: `${ROUTES.home}#track` },
            ]}
          />
          <FooterColumn
            title="Institusi"
            links={[
              { label: 'Daftar Institusi', to: ROUTES.registerInstitution },
              { label: 'Cek Status Registrasi', to: ROUTES.registrationStatus },
              { label: 'Masuk', to: ROUTES.login },
            ]}
          />
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
            © {CURRENT_YEAR} {APP_NAME}. Platform Rekomendasi Peminatan Akademik.
          </p>
        </div>
      </footer>
    </div>
  )
}

function AuthActions({ stacked = false }: { stacked?: boolean }) {
  const { user } = useAuth()
  const cls = stacked ? 'w-full' : undefined

  if (user) {
    return (
      <Button asChild className={cls}>
        <Link to={ROLE_HOME[user.role]}>
          <LayoutDashboard aria-hidden /> Ke Dashboard
        </Link>
      </Button>
    )
  }
  return (
    <>
      <Button asChild variant="outline" className={cls}>
        <Link to={ROUTES.login}>Masuk</Link>
      </Button>
      <Button asChild className={cls}>
        <Link to={ROUTES.registerInstitution}>
          Daftar Institusi <ArrowRight aria-hidden />
        </Link>
      </Button>
    </>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
