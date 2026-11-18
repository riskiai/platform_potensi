import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorState } from './states'
import { NotFoundPage } from './NotFoundPage'

/** Penangkap error tingkat route — pengganti layar error bawaan React Router. */
export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  if (import.meta.env.DEV) console.error(error)

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <ErrorState
        title="Terjadi kesalahan"
        description="Halaman tidak dapat ditampilkan. Muat ulang halaman atau coba beberapa saat lagi."
        onRetry={() => window.location.reload()}
      />
    </div>
  )
}
