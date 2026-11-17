import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  Check,
  ClipboardCheck,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { HeroPreview } from '../components/HeroPreview'
import { Reveal } from '../components/Reveal'

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Building2,
    title: 'Institusi mendaftar',
    desc: 'Perguruan tinggi mengajukan kemitraan. Platform Owner meninjau dan mengaktifkan akun institusi.',
  },
  {
    icon: ClipboardCheck,
    title: 'Admin menyiapkan assessment',
    desc: 'Admin institusi mengatur program, track peminatan, bank soal, dan mendaftarkan peserta.',
  },
  {
    icon: UserRound,
    title: 'Peserta mengerjakan',
    desc: 'Peserta masuk dengan akun dari institusinya dan mengerjakan assessment secara online.',
  },
  {
    icon: Sparkles,
    title: 'Rekomendasi peminatan',
    desc: 'Model yang dilatih dan dievaluasi institusi menghasilkan rekomendasi track untuk ditinjau.',
  },
]

const ROLES: { icon: LucideIcon; title: string; desc: string; points: string[] }[] = [
  {
    icon: ShieldCheck,
    title: 'Platform Owner',
    desc: 'Mengelola ekosistem institusi mitra.',
    points: ['Meninjau & menyetujui pendaftaran institusi', 'Mengelola institusi terdaftar', 'Memantau aktivitas platform'],
  },
  {
    icon: Building2,
    title: 'Admin Institusi',
    desc: 'Mengelola assessment dan model rekomendasi.',
    points: [
      'Program akademik, track & bank soal',
      'Manajemen peserta dan assessment',
      'Dataset, training & evaluasi model',
      'Meninjau hasil rekomendasi',
    ],
  },
  {
    icon: Users,
    title: 'Peserta',
    desc: 'Mengikuti assessment dan melihat hasilnya.',
    points: ['Daftar assessment yang tersedia', 'Mengerjakan assessment online', 'Melihat hasil & riwayat assessment'],
  },
]

export function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-48 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-28">
          <Reveal>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary shadow-card">
              <span className="size-1.5 rounded-full bg-brand-gold" aria-hidden />
              Platform Rekomendasi Peminatan Akademik
            </span>
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl">
              Bantu mahasiswa menemukan <span className="text-primary">peminatan</span> yang tepat.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              POTENSI membantu institusi pendidikan mengelola assessment peserta dan menghasilkan rekomendasi peminatan
              akademik berbasis data — dimulai dari jurusan Informatika dengan track Data Science dan Network.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={ROUTES.registerInstitution}>
                  Daftarkan Institusi <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={ROUTES.login}>Masuk ke Akun</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {['Satu platform untuk tiga peran', 'Rekomendasi ditinjau institusi', 'Akses dari perangkat apa pun'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <HeroPreview />
          </Reveal>
        </div>
      </section>

      {/* CARA KERJA */}
      <Section id="cara-kerja" eyebrow="Cara Kerja" title="Dari pendaftaran sampai rekomendasi" className="bg-surface">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="relative flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                    <s.icon className="size-5" aria-hidden />
                  </div>
                  <span className="font-heading text-3xl font-extrabold text-border">0{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* FITUR PER ROLE */}
      <Section id="fitur" eyebrow="Fitur" title="Dirancang untuk setiap peran">
        <div className="grid gap-5 lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <Card className="flex h-full flex-col gap-4 p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <r.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <ul className="mt-1 flex flex-col gap-2.5">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TRACK */}
      <Section
        id="track"
        eyebrow="Track Peminatan"
        title="Dimulai dari Informatika"
        description="Kasus awal POTENSI berfokus pada mahasiswa Informatika yang memilih antara dua track berikut."
        className="bg-surface"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TrackCard
            icon={BrainCircuit}
            title="Data Science"
            desc="Analisis data, statistik, machine learning, dan pengambilan keputusan berbasis data."
            tone="primary"
          />
          <TrackCard
            icon={Network}
            title="Network"
            desc="Infrastruktur jaringan, administrasi sistem, keamanan jaringan, dan komputasi terdistribusi."
            tone="accent"
          />
        </div>
      </Section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center shadow-elevated sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/20 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 -left-24 size-72 rounded-full bg-brand-gold/15 blur-3xl" />
            <BarChart3 className="mx-auto mb-4 size-10 text-accent" aria-hidden />
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Siap menerapkan POTENSI di institusi Anda?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 sm:text-base">
              Ajukan pendaftaran institusi. Tim Platform Owner akan meninjau pengajuan Anda.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary shadow-none hover:bg-white/90">
                <Link to={ROUTES.registerInstitution}>
                  Daftarkan Institusi <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link to={ROUTES.registrationStatus}>Cek Status Pengajuan</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`scroll-mt-20 px-4 py-20 sm:px-6 ${className ?? ''}`}>
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-accent-strong uppercase">{eyebrow}</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-[34px]">{title}</h2>
          {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function TrackCard({
  icon: Icon,
  title,
  desc,
  tone,
}: {
  icon: LucideIcon
  title: string
  desc: string
  tone: 'primary' | 'accent'
}) {
  return (
    <Reveal>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-7 transition-shadow hover:shadow-elevated">
        <div
          className={
            tone === 'primary'
              ? 'mb-5 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground'
              : 'mb-5 flex size-12 items-center justify-center rounded-xl bg-accent text-white'
          }
        >
          <Icon className="size-6" aria-hidden />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </Reveal>
  )
}
