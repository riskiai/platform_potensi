import { Link } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, UserRound } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared/states'
import { ROLE_LABEL } from '@/features/auth/lib/role-home'
import type { AuthUser } from '@/types/auth'
import { Breadcrumbs } from './Breadcrumbs'

interface TopbarProps {
  user: AuthUser
  homePath: string
  profilePath: string
  onOpenMenu: () => void
  onSignOut: () => void
}

const iconButton =
  'relative flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25'

export function Topbar({ user, homePath, profilePath, onOpenMenu, onSignOut }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button type="button" onClick={onOpenMenu} className={`${iconButton} -ml-2 lg:hidden`} aria-label="Buka menu navigasi">
        <Menu className="size-5" />
      </button>

      <Link to={homePath} className="sm:hidden" aria-label="Ke dashboard">
        <Logo variant="mark" className="h-8" />
      </Link>

      <Breadcrumbs homePath={homePath} className="hidden sm:block" />

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifikasi — disambungkan ke API notifikasi saat endpoint tersedia */}
        <DropdownMenu>
          <DropdownMenuTrigger className={iconButton} aria-label="Notifikasi">
            <Bell className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0">
            <div className="border-b border-border px-4 py-3">
              <p className="font-heading text-sm font-semibold">Notifikasi</p>
            </div>
            <EmptyState compact title="Belum ada notifikasi" description="Pemberitahuan terbaru akan muncul di sini." icon={Bell} />
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2.5 rounded-lg p-1 pr-2 transition-colors hover:bg-surface-muted focus-visible:ring-4 focus-visible:ring-ring/25"
            aria-label="Menu akun"
          >
            <Avatar name={user.name} />
            <span className="hidden min-w-0 text-left md:block">
              <span className="block max-w-[160px] truncate text-sm font-semibold text-foreground">{user.name}</span>
              <span className="block text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</span>
            </span>
            <ChevronDown className="hidden size-4 text-muted-foreground md:block" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={profilePath}>
                <UserRound /> Profil saya
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={onSignOut}>
              <LogOut /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
