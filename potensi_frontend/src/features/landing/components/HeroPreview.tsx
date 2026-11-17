import { CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

/**
 * Ilustrasi dekoratif alur produk (form assessment → rekomendasi siap ditinjau).
 * Sengaja TANPA angka/skor agar tidak terbaca sebagai hasil rekomendasi nyata.
 */
export function HeroPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md select-none lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-2xl" />

      {/* Kartu assessment */}
      <div className="rounded-2xl border border-border/70 bg-surface p-5 shadow-elevated">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo variant="mark" className="h-7" />
            <span className="font-heading text-sm font-semibold text-foreground">Assessment Peminatan</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent-strong">
            <Clock className="size-3" /> Berlangsung
          </span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full w-3/5 rounded-full bg-primary" />
        </div>
        <p className="mb-3 text-sm font-medium text-foreground">Aktivitas mana yang paling Anda nikmati?</p>
        <div className="flex flex-col gap-2">
          {['Menganalisis pola dari kumpulan data', 'Mengonfigurasi dan mengamankan jaringan', 'Keduanya sama menariknya'].map(
            (opt, i) => (
              <div
                key={opt}
                className={
                  i === 0
                    ? 'flex items-center gap-2.5 rounded-lg border border-primary bg-primary-soft px-3 py-2.5 text-xs font-medium text-primary'
                    : 'flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground'
                }
              >
                <span
                  className={
                    i === 0 ? 'size-3.5 rounded-full border-4 border-primary bg-surface' : 'size-3.5 rounded-full border border-border'
                  }
                />
                {opt}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Kartu rekomendasi mengambang */}
      <div className="absolute -right-3 -bottom-10 w-60 rounded-2xl border border-border/70 bg-surface p-4 shadow-elevated sm:-right-8">
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-warning-foreground">
            <Sparkles className="size-4" />
          </div>
          <p className="text-xs font-semibold text-foreground">Rekomendasi siap ditinjau</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">Data Science</span>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-strong">Network</span>
        </div>
        <p className="mt-2.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <CheckCircle2 className="size-3 text-success-foreground" /> Ditinjau oleh admin institusi
        </p>
      </div>
    </div>
  )
}
