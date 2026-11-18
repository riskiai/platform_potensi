import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/states'

/**
 * Halaman sementara untuk modul yang belum dibangun.
 * Diganti satu per satu dengan halaman asli di Fase 3–7.
 */
export function ModulePlaceholder({ title, phase }: { title: string; phase?: string }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        <EmptyState
          icon={Construction}
          title="Modul sedang dikembangkan"
          description={phase ? `Halaman ini dijadwalkan pada ${phase}.` : 'Halaman ini akan segera tersedia.'}
        />
      </Card>
    </>
  )
}
