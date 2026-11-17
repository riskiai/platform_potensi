import type { RegistrationService } from '@/services/registration.service'
import type { ApiError } from '@/types/api'
import type { RegistrationStatusResult } from '@/types/registration'
import { delay } from './utils'

/**
 * Mock registrasi institusi. Pengajuan baru disimpan di localStorage browser
 * supaya bisa langsung dicek di halaman Status Registrasi.
 */

const STORAGE_KEY = 'potensi.mock.registrations'

interface StoredRegistration extends RegistrationStatusResult {
  email: string
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
      { status: 'approved', at: daysAgo(6), note: 'Akun admin institusi telah dikirim ke email penanggung jawab.' },
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // abaikan
  }
}

function generateNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `REG-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`
}

export const registrationMockService: RegistrationService = {
  async submit(payload) {
    await delay(1000)
    const all = [...DEMO_REGISTRATIONS, ...readStored()]
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
      email: payload.admin.email.toLowerCase(),
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
    const found = [...DEMO_REGISTRATIONS, ...readStored()].find(
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
