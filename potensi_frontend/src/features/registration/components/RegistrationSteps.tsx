import type { ReactNode } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/shared/FormField'
import { PROVINCES } from '@/constants/indonesia'
import { INSTITUTION_TYPES, type RegistrationFormValues } from '../schemas/registration.schema'

/* -------------------------------------------------------------------------- */
/* Langkah 1 — Data institusi                                                 */
/* -------------------------------------------------------------------------- */
export function InstitutionStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()
  const e = errors.institution

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField id="inst-name" label="Nama institusi" required error={e?.name?.message} className="sm:col-span-2">
        <Input id="inst-name" placeholder="Mis. Universitas Nusantara" autoComplete="organization" {...register('institution.name')} />
      </FormField>

      <FormField id="inst-type" label="Jenis institusi" required error={e?.type?.message}>
        <Controller
          control={control}
          name="institution.type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="inst-type" aria-invalid={!!e?.type || undefined} onBlur={field.onBlur}>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                {INSTITUTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField id="inst-code" label="Kode PT / NPSN" description="Opsional, bila ada." error={e?.code?.message}>
        <Input id="inst-code" placeholder="Mis. 001234" {...register('institution.code')} />
      </FormField>

      <FormField id="inst-email" label="Email resmi institusi" required error={e?.email?.message}>
        <Input id="inst-email" type="email" placeholder="info@kampus.ac.id" autoComplete="email" {...register('institution.email')} />
      </FormField>

      <FormField id="inst-phone" label="Telepon institusi" required error={e?.phone?.message}>
        <Input id="inst-phone" type="tel" placeholder="(021) 1234567" autoComplete="tel" {...register('institution.phone')} />
      </FormField>

      <FormField id="inst-web" label="Website" description="Opsional." error={e?.website?.message} className="sm:col-span-2">
        <Input id="inst-web" type="url" placeholder="https://kampus.ac.id" autoComplete="url" {...register('institution.website')} />
      </FormField>

      <FormField id="inst-address" label="Alamat lengkap" required error={e?.address?.message} className="sm:col-span-2">
        <Textarea
          id="inst-address"
          rows={3}
          placeholder="Nama jalan, nomor, kelurahan, kecamatan"
          autoComplete="street-address"
          {...register('institution.address')}
        />
      </FormField>

      <FormField id="inst-city" label="Kota / Kabupaten" required error={e?.city?.message}>
        <Input id="inst-city" placeholder="Mis. Kota Bandung" autoComplete="address-level2" {...register('institution.city')} />
      </FormField>

      <FormField id="inst-province" label="Provinsi" required error={e?.province?.message}>
        <Input
          id="inst-province"
          list="inst-province-options"
          placeholder="Ketik atau pilih provinsi"
          autoComplete="off"
          aria-required="true"
          {...register('institution.province', {
            setValueAs: (text: string) => PROVINCES.find(
              province => province.toLowerCase() === text.trim().toLowerCase(),
            ) ?? text.trim(),
          })}
        />
      </FormField>
      <datalist id="inst-province-options">
        {PROVINCES.map(province => <option key={province} value={province} />)}
      </datalist>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Langkah 2 — Penanggung jawab                                              */
/* -------------------------------------------------------------------------- */
export function AdminStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()
  const e = errors.admin

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <p className="text-sm text-muted-foreground sm:col-span-2">
        Penanggung jawab akan menjadi <strong className="text-foreground">Admin Institusi</strong> pertama. Informasi akun
        dikirim ke email ini setelah pengajuan disetujui.
      </p>
      <FormField id="adm-name" label="Nama lengkap" required error={e?.fullName?.message}>
        <Input id="adm-name" placeholder="Nama sesuai identitas" autoComplete="name" {...register('admin.fullName')} />
      </FormField>
      <FormField id="adm-position" label="Jabatan" required error={e?.position?.message}>
        <Input id="adm-position" placeholder="Mis. Kepala Program Studi" autoComplete="organization-title" {...register('admin.position')} />
      </FormField>
      <FormField id="adm-email" label="Email" required error={e?.email?.message}>
        <Input id="adm-email" type="email" placeholder="nama@kampus.ac.id" autoComplete="email" {...register('admin.email')} />
      </FormField>
      <FormField id="adm-phone" label="Nomor HP" required error={e?.phone?.message}>
        <Input id="adm-phone" type="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" {...register('admin.phone')} />
      </FormField>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Langkah 3 — Tinjau & kirim                                                 */
/* -------------------------------------------------------------------------- */
export function ReviewStep({ onEdit }: { onEdit: (step: number) => void }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>()
  const values = useWatch({ control })
  const inst = values.institution ?? {}
  const adm = values.admin ?? {}
  const typeLabel = INSTITUTION_TYPES.find((t) => t.value === inst.type)?.label

  return (
    <div className="flex flex-col gap-5">
      <ReviewBlock title="Data Institusi" onEdit={() => onEdit(0)}>
        <ReviewRow label="Nama" value={inst.name} />
        <ReviewRow label="Jenis" value={typeLabel} />
        <ReviewRow label="Kode PT / NPSN" value={inst.code} />
        <ReviewRow label="Email" value={inst.email} />
        <ReviewRow label="Telepon" value={inst.phone} />
        <ReviewRow label="Website" value={inst.website} />
        <ReviewRow label="Alamat" value={[inst.address, inst.city, inst.province].filter(Boolean).join(', ')} />
      </ReviewBlock>

      <ReviewBlock title="Penanggung Jawab" onEdit={() => onEdit(1)}>
        <ReviewRow label="Nama" value={adm.fullName} />
        <ReviewRow label="Jabatan" value={adm.position} />
        <ReviewRow label="Email" value={adm.email} />
        <ReviewRow label="Nomor HP" value={adm.phone} />
      </ReviewBlock>

      <Controller
        control={control}
        name="agreement"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4">
              <Checkbox
                id="agreement"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={!!errors.agreement || undefined}
                aria-describedby={errors.agreement ? 'agreement-error' : undefined}
                className="mt-0.5"
              />
              <label htmlFor="agreement" className="cursor-pointer text-sm leading-relaxed text-foreground">
                Saya menyatakan bahwa data yang diisi adalah benar dan saya berwenang mengajukan pendaftaran atas nama
                institusi ini.
              </label>
            </div>
            {errors.agreement ? (
              <p id="agreement-error" className="text-xs font-medium text-destructive">
                {errors.agreement.message}
              </p>
            ) : null}
          </div>
        )}
      />
    </div>
  )
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-strong hover:underline focus-visible:underline"
        >
          <Pencil className="size-3" aria-hidden /> Ubah
        </button>
      </div>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1 px-4 py-2.5 text-sm sm:grid-cols-[160px_1fr] sm:gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words text-foreground">{value || <span className="text-muted-foreground">—</span>}</dd>
    </div>
  )
}
