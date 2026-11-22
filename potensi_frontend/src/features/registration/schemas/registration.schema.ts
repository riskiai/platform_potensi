import { PROVINCES } from '@/constants/indonesia'
import { z } from 'zod'
import type { InstitutionType } from '@/types/registration'

const PHONE_RE = /^[0-9+()\-\s]{8,20}$/
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]+$/i

const requiredText = (label: string, min = 1) =>
  z.string().trim().min(min, min > 1 ? `${label} minimal ${min} karakter.` : `${label} wajib diisi.`)

const email = (label: string) => z.string().trim().min(1, `${label} wajib diisi.`).email('Format email tidak valid.')

const phone = (label: string) =>
  z.string().trim().min(1, `${label} wajib diisi.`).regex(PHONE_RE, 'Nomor telepon tidak valid.')

export const INSTITUTION_TYPES: { value: InstitutionType; label: string }[] = [
  { value: 'universitas', label: 'Universitas' },
  { value: 'institut', label: 'Institut' },
  { value: 'politeknik', label: 'Politeknik' },
  { value: 'sekolah_tinggi', label: 'Sekolah Tinggi' },
  { value: 'akademi', label: 'Akademi' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const registrationSchema = z.object({
  institution: z.object({
    name: requiredText('Nama institusi', 3),
    type: z.string().min(1, 'Pilih jenis institusi.'),
    code: z.string().trim().max(20, 'Maksimal 20 karakter.'),
    email: email('Email institusi'),
    phone: phone('Telepon institusi'),
    website: z
      .string()
      .trim()
      .refine((v) => v === '' || URL_RE.test(v), 'URL harus diawali http:// atau https://'),
    address: requiredText('Alamat', 10),
    city: requiredText('Kota/Kabupaten'),
    province: z.string().refine(value => PROVINCES.some(province => province === value), 'Pilih provinsi dari daftar yang tersedia.'),
  }),
  admin: z.object({
    fullName: requiredText('Nama lengkap', 3),
    position: requiredText('Jabatan'),
    email: email('Email penanggung jawab'),
    phone: phone('Nomor HP'),
  }),
  agreement: z.boolean().refine((v) => v, 'Anda harus menyetujui pernyataan ini.'),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export const EMPTY_REGISTRATION: RegistrationFormValues = {
  institution: { name: '', type: '', code: '', email: '', phone: '', website: '', address: '', city: '', province: '' },
  admin: { fullName: '', position: '', email: '', phone: '' },
  agreement: false,
}

/** Field yang divalidasi di tiap langkah sebelum boleh lanjut. */
export const STEP_FIELDS = [
  [
    'institution.name',
    'institution.type',
    'institution.code',
    'institution.email',
    'institution.phone',
    'institution.website',
    'institution.address',
    'institution.city',
    'institution.province',
  ],
  ['admin.fullName', 'admin.position', 'admin.email', 'admin.phone'],
  ['agreement'],
] as const satisfies readonly (readonly string[])[]
