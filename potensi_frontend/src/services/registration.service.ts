import { env } from '@/lib/env'
import { apiClient } from '@/services/api-client'
import { registrationMockService } from '@/mocks/registration.mock'
import type {
  InstitutionRegistrationPayload,
  RegistrationLookup,
  RegistrationReceipt,
  RegistrationStatusResult,
} from '@/types/registration'

export interface RegistrationService {
  submit(payload: InstitutionRegistrationPayload): Promise<RegistrationReceipt>
  /** Cek status memakai nomor pengajuan + email (dikirim via body, bukan URL). */
  checkStatus(lookup: RegistrationLookup): Promise<RegistrationStatusResult>
}

/** ⚠️ Endpoint masih ASUMSI — sesuaikan dengan kontrak backend. */
const ENDPOINTS = {
  submit: '/institution-registrations',
  status: '/institution-registrations/status',
} as const

function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && 'data' in raw) return (raw as { data: T }).data
  return raw as T
}

const registrationHttpService: RegistrationService = {
  async submit(payload) {
    const { data } = await apiClient.post(ENDPOINTS.submit, payload)
    return unwrap<RegistrationReceipt>(data)
  },
  async checkStatus(lookup) {
    const { data } = await apiClient.post(ENDPOINTS.status, lookup)
    return unwrap<RegistrationStatusResult>(data)
  },
}

export const registrationService: RegistrationService = env.useMock ? registrationMockService : registrationHttpService
