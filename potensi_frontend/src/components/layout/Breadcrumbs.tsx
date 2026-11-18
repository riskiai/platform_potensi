import { Fragment } from 'react'
import { Link, useMatches } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Diisi di definisi route: `handle: { crumb: 'Program Akademik' }`. */
export interface RouteHandle {
  crumb?: string
}

export function Breadcrumbs({ homePath, className }: { homePath: string; className?: string }) {
  const matches = useMatches()
  const crumbs = matches
    .filter((m) => (m.handle as RouteHandle | undefined)?.crumb && m.pathname !== homePath)
    .map((m) => ({ label: (m.handle as RouteHandle).crumb!, path: m.pathname }))

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          {crumbs.length ? (
            <Link
              to={homePath}
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="size-4" aria-hidden />
              <span>Dashboard</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-foreground" aria-current="page">
              <Home className="size-4" aria-hidden /> Dashboard
            </span>
          )}
        </li>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <Fragment key={c.path}>
              <li aria-hidden>
                <ChevronRight className="size-3.5 text-muted-foreground/60" />
              </li>
              <li className="min-w-0">
                {last ? (
                  <span className="block truncate font-semibold text-foreground" aria-current="page">
                    {c.label}
                  </span>
                ) : (
                  <Link to={c.path} className="truncate text-muted-foreground hover:text-foreground">
                    {c.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
