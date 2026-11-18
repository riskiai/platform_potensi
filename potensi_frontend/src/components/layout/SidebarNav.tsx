import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { NavGroup } from './navigation'

interface SidebarNavProps {
  groups: NavGroup[]
  /** Path dashboard role — dipakai agar menu Dashboard hanya aktif tepat di path itu. */
  homePath: string
  collapsed?: boolean
  onToggleCollapse?: () => void
  /** Dipanggil saat link diklik (menutup drawer di mobile). */
  onNavigate?: () => void
  footer?: ReactNode
}

export function SidebarNav({ groups, homePath, collapsed = false, onToggleCollapse, onNavigate, footer }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={cn('flex h-16 shrink-0 items-center border-b border-border', collapsed ? 'justify-center px-2' : 'px-5')}>
        {collapsed ? <Logo variant="mark" className="h-8" /> : <Logo className="h-12" />}
      </div>

      {/* Menu */}
      <nav aria-label="Navigasi utama" className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-5">
          {groups.map((group, gi) => (
            <li key={group.label ?? gi}>
              {group.label && !collapsed ? (
                <p className="mb-1.5 px-3 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                  {group.label}
                </p>
              ) : null}
              {group.label && collapsed && gi > 0 ? <div className="mx-3 mb-2 h-px bg-border" aria-hidden /> : null}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const link = (
                    <NavLink
                      to={item.path}
                      end={item.path === homePath}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-colors focus-visible:ring-4 focus-visible:ring-ring/25',
                          collapsed ? 'size-11 justify-center' : 'h-10 px-3',
                          isActive
                            ? 'bg-primary-soft font-semibold text-primary'
                            : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive ? (
                            <span aria-hidden className="absolute top-2 bottom-2 -left-3 w-1 rounded-r-full bg-primary" />
                          ) : null}
                          <item.icon className="size-[18px] shrink-0" aria-hidden />
                          {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  )
                  return (
                    <li key={item.path}>
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        link
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {footer && !collapsed ? <div className="border-t border-border px-4 py-3">{footer}</div> : null}

      {onToggleCollapse ? (
        <div className={cn('border-t border-border p-3', collapsed && 'flex justify-center')}>
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex items-center gap-2 rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25',
              collapsed ? 'size-10 justify-center' : 'h-9 w-full px-3',
            )}
            aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!collapsed ? 'Ciutkan' : null}
          </button>
        </div>
      ) : null}
    </div>
  )
}
