import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Info } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Alert } from '@/components/ui/alert'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { env } from '@/lib/env'
import { LoginForm } from '../components/LoginForm'
import { MockAccountsHint } from '../components/MockAccountsHint'

const CURRENT_YEAR = new Date().getFullYear()

export function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
      {/* Dekorasi latar yang halus */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-160px] h-[360px] w-[360px] rounded-full bg-accent/[0.08] blur-3xl" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-[460px] flex-col items-center"
      >
        {/* Identitas brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-surface shadow-elevated ring-1 ring-border/60">
            <Logo variant="mark" className="h-10" />
          </div>
          <h1 className="flex items-center gap-1.5 text-[28px] leading-9 font-extrabold text-primary">
            {APP_NAME}
            <span className="mt-1 size-2 rounded-full bg-accent" aria-hidden />
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        {/* Kartu login */}
        <section
          aria-labelledby="login-title"
          className="w-full rounded-2xl border border-border/60 bg-surface p-6 shadow-elevated sm:p-8"
        >
          <div className="mb-5">
            <h2 id="login-title" className="text-xl font-bold text-foreground">
              Masuk ke akun Anda
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gunakan akun yang terdaftar di institusi Anda.
            </p>
          </div>

          <Alert variant="info" className="mb-5">
            <Info aria-hidden />
            <p className="text-muted-foreground">
              <strong className="font-semibold text-primary">Catatan:</strong> Peserta tidak melakukan
              registrasi mandiri. Akun peserta dibuat dan diaktivasi oleh institusi masing-masing.
            </p>
          </Alert>

          <LoginForm />

          {env.useMock && env.isDev ? <MockAccountsHint /> : null}

          {/* Onboarding institusi */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5 text-center">
            <p className="text-xs text-muted-foreground">Belum mendaftarkan institusi Anda?</p>
            <Link
              to={ROUTES.registerInstitution}
              className="inline-flex items-center gap-1 text-sm font-semibold text-accent-strong hover:underline focus-visible:underline"
            >
              Daftar sebagai mitra institusi
              <ExternalLink className="size-3.5" aria-hidden />
            </Link>
            <Link
              to={ROUTES.registrationStatus}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:underline"
            >
              Cek status pengajuan registrasi
            </Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground/80">
          © {CURRENT_YEAR} {APP_NAME}. Platform Rekomendasi Peminatan Akademik.
        </p>
      </motion.main>
    </div>
  )
}
