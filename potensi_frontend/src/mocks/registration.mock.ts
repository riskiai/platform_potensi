import type { RegistrationService } from '@/services/registration.service'
import type { ApiError } from '@/types/api'
import type { RegistrationStatusResult } from '@/types/registration'
import type { InstitutionRegistrationPayload } from '@/types/registration'
import type { InstitutionRequestDecision } from '@/types/owner'
import { participants } from './participants.mock'
import { MOCK_USERS } from './fixtures/users'
import { delay } from './utils'

/**
 * Mock registrasi institusi. Pengajuan baru disimpan di localStorage browser
 * supaya bisa langsung dicek di halaman Status Registrasi.
 */

const STORAGE_KEY = 'potensi.mock.registrations'

interface StoredRegistration extends RegistrationStatusResult {
  email: string
  details?: InstitutionRegistrationPayload
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

/** Contoh pengajuan untuk mencoba tiap status (email: demo@kampus.test). */
const DEMO_REGISTRATIONS: StoredRegistration[] = [
  {
    registrationNumber: 'REG-DEMO-0001',
    email: 'demo@kampus.test',
    institutionName: 'Universitas Demo Menunggu',
    status: 'pending',
    submittedAt: daysAgo(1),
    timeline: [{ status: 'pending', at: daysAgo(1) }],
  },
  {
    registrationNumber: 'REG-DEMO-0002',
    email: 'demo@kampus.test',
    institutionName: 'Institut Demo Ditinjau',
    status: 'in_review',
    submittedAt: daysAgo(4),
    timeline: [
      { status: 'pending', at: daysAgo(4) },
      { status: 'in_review', at: daysAgo(2) },
    ],
  },
  {
    registrationNumber: 'REG-DEMO-0003',
    email: 'demo@kampus.test',
    institutionName: 'Politeknik Demo Disetujui',
    status: 'approved',
    submittedAt: daysAgo(10),
    timeline: [
      { status: 'pending', at: daysAgo(10) },
      { status: 'in_review', at: daysAgo(8) },
      { status: 'approved', at: daysAgo(6), note: 'Admin institusi dapat masuk.' },
    ],
  },
  {
    registrationNumber: 'REG-DEMO-0004',
    email: 'demo@kampus.test',
    institutionName: 'Sekolah Tinggi Demo Ditolak',
    status: 'rejected',
    submittedAt: daysAgo(9),
    note: 'Data institusi belum lengkap. Silakan ajukan ulang dengan kode PT yang valid.',
    timeline: [
      { status: 'pending', at: daysAgo(9) },
      { status: 'in_review', at: daysAgo(7) },
      { status: 'rejected', at: daysAgo(5), note: 'Data institusi belum lengkap. Silakan ajukan ulang dengan kode PT yang valid.' },
    ],
  },
]

function readStored(): StoredRegistration[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as StoredRegistration[]
  } catch {
    return []
  }
}

function writeStored(list: StoredRegistration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function registrations() {
  const records = new Map(DEMO_REGISTRATIONS.map(item => [item.registrationNumber, item]))
  for (const item of readStored()) records.set(item.registrationNumber, item)
  return [...records.values()]
}

export function reviewRegistration(id: string, decision: InstitutionRequestDecision) {
  const item = registrations().find(record => record.registrationNumber === id)
  if (!item || !['pending', 'in_review'].includes(item.status)) throw new Error('Pengajuan sudah diputuskan atau tidak ditemukan.')
  if (decision.status === 'rejected' && !decision.note?.trim()) throw new Error('Isi alasan penolakan.')
  const updated = { ...item, ...decision, timeline: [...item.timeline, { ...decision, at: new Date().toISOString() }] }
  writeStored([...readStored().filter(row => row.registrationNumber !== id), updated])
}

function generateNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `REG-${ymd}-${crypto.randomUUID()}`
}

export const registrationMockService: RegistrationService = {
  async submit(payload) {
    await delay(1000)
    const all = registrations().filter(item => item.status !== 'rejected')
    const email = payload.admin.email.trim().toLowerCase()
    if (MOCK_USERS.some(user => user.role !== 'participant' && user.email === email) || participants().some(user => user.email === email) || all.some(item => item.email === email)) {
      throw { message: 'Email sudah digunakan.', fieldErrors: { 'admin.email': ['Gunakan email admin yang belum terdaftar.'] } }
    }
    if (all.some((r) => r.institutionName.toLowerCase() === payload.institution.name.trim().toLowerCase())) {
      throw {
        status: 422,
        message: 'Data tidak valid.',
        fieldErrors: { 'institution.name': ['Institusi dengan nama ini sudah pernah diajukan.'] },
      } satisfies ApiError
    }
    const submittedAt = new Date().toISOString()
    const record: StoredRegistration = {
      registrationNumber: generateNumber(),
      email,
      details: payload,
      institutionName: payload.institution.name.trim(),
      status: 'pending',
      submittedAt,
      timeline: [{ status: 'pending', at: submittedAt }],
    }
    writeStored([...readStored(), record])
    return { registrationNumber: record.registrationNumber, submittedAt }
  },

  async checkStatus({ registrationNumber, email }) {
    await delay(700)
    const found = registrations().find(
      (r) =>
        r.registrationNumber.toUpperCase() === registrationNumber.trim().toUpperCase() &&
        r.email === email.trim().toLowerCase(),
    )
    if (!found) {
      throw {
        status: 404,
        message: 'Pengajuan tidak ditemukan. Periksa kembali nomor pengajuan dan email penanggung jawab.',
      } satisfies ApiError
    }
    const result: RegistrationStatusResult = {
      registrationNumber: found.registrationNumber,
      institutionName: found.institutionName,
      status: found.status,
      submittedAt: found.submittedAt,
      note: found.note,
      timeline: found.timeline,
    }
    return result
  },
}
