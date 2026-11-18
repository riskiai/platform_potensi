import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Placeholder untuk halaman yang dijadwalkan di fase berikutnya. */
export function ComingSoonPage({ title, backTo = '/login' }: { title: string; backTo?: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Construction className="size-7" aria-hidden />
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">Halaman ini sedang dalam pengembangan.</p>
        <Button asChild variant="outline" className="mt-2">
          <Link to={backTo}>
            <ArrowLeft aria-hidden /> Kembali
          </Link>
        </Button>
      </div>
    </div>
  )
}
