/**
 * ⚠️ SEMENTARA — dibuat dari brief, belum dari kontrak API backend.
 * Sesuaikan di sini + adapter `services/registration.service.ts` saat kontrak final.
 */

export type InstitutionType = 'universitas' | 'institut' | 'politeknik' | 'sekolah_tinggi' | 'akademi' | 'lainnya'

export interface InstitutionRegistrationPayload {
  institution: {
    name: string
    type: InstitutionType
    code?: string
    email: string
    phone: string
    website?: string
    address: string
    city: string
    province: string
  }
  admin: {
    fullName: string
    position: string
    email: string
    phone: string
  }
}

export interface RegistrationReceipt {
  registrationNumber: string
  submittedAt: string
}

export type RegistrationStatus = 'pending' | 'in_review' | 'approved' | 'rejected'

export interface RegistrationTimelineItem {
  status: RegistrationStatus
  at: string
  note?: string
}

export interface RegistrationStatusResult {
  registrationNumber: string
  institutionName: string
  status: RegistrationStatus
  submittedAt: string
  /** Catatan dari Platform Owner, terutama saat ditolak. */
  note?: string
  timeline: RegistrationTimelineItem[]
}

export interface RegistrationLookup {
  registrationNumber: string
  email: string
}
