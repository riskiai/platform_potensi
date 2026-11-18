import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, AtSign, Eye, EyeOff, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert } from '@/components/ui/alert'
import { ROUTES } from '@/constants/routes'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'

const LOGIN_FIELDS = ['identifier', 'password'] as const

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', remember: false },
  })
  const { errors } = form.formState

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onError(error) {
        // Error validasi per field dari backend ditampilkan di bawah input terkait.
        for (const field of LOGIN_FIELDS) {
          const msg = error.fieldErrors?.[field]?.[0]
          if (msg) form.setError(field, { message: msg })
        }
      },
    })
  })

  const hasFieldErrors = LOGIN_FIELDS.some((f) => login.error?.fieldErrors?.[f]?.length)

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {login.isError && !hasFieldErrors ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden />
          <p className="font-medium">{login.error.message}</p>
        </Alert>
      ) : null}

      {/* Email / nomor induk */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="identifier">Email / NIM / NIDN</Label>
        <div className="relative">
          <AtSign
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="identifier"
            autoComplete="username"
            autoFocus
            placeholder="nama@kampus.ac.id"
            className="pl-11"
            aria-invalid={!!errors.identifier}
            aria-describedby={errors.identifier ? 'identifier-error' : undefined}
            {...form.register('identifier')}
          />
        </div>
        {errors.identifier ? (
          <p id="identifier-error" className="text-xs font-medium text-destructive">
            {errors.identifier.message}
          </p>
        ) : null}
      </div>

      {/* Kata sandi */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Kata Sandi</Label>
          <Link
            to={ROUTES.forgotPassword}
            className="text-xs font-semibold text-accent-strong hover:underline focus-visible:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            className="px-11"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...form.register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {/* Ingat saya */}
      <Controller
        control={form.control}
        name="remember"
        render={({ field }) => (
          <div className="mt-0.5 flex items-center gap-2.5">
            <Checkbox
              id="remember"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
            />
            <label htmlFor="remember" className="cursor-pointer text-xs text-muted-foreground select-none">
              Ingat saya di perangkat ini
            </label>
          </div>
        )}
      />

      <Button type="submit" size="lg" className="mt-2 w-full" loading={login.isPending}>
        {login.isPending ? 'Memproses…' : 'Masuk'}
        {!login.isPending ? <ArrowRight aria-hidden /> : null}
      </Button>
    </form>
  )
}
