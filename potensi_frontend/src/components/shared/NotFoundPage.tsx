import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <p className="font-heading text-6xl font-extrabold text-primary">404</p>
        <h1 className="text-xl font-bold">Halaman tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground">Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.</p>
        <Button asChild className="mt-3">
          <Link to="/">Ke beranda</Link>
        </Button>
      </div>
    </div>
  )
}
