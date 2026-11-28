import { env } from '@/lib/env'
import { registrations } from '@/mocks/registration.mock'
import { institutionSettingsSchema, type InstitutionSettings } from '@/types/institution-settings'

function storageKey(institutionId: string) {
  if (!env.useMock || !institutionId) throw new Error('Pengaturan institusi belum tersedia.')
  return 'potensi.mock.institution-settings.' + institutionId
}

export const institutionSettingsService = {
  available: env.useMock,
  async get(institutionId: string): Promise<InstitutionSettings> {
    const stored = localStorage.getItem(storageKey(institutionId))
    if (stored !== null) return institutionSettingsSchema.parse(JSON.parse(stored))

    const approved = registrations().find(item => item.registrationNumber === institutionId && item.status === 'approved')
    const institution = approved?.details?.institution
    return {
      email: institution?.email ?? '',
      phone: institution?.phone ?? '',
      website: institution?.website ?? '',
    }
  },
  async save(institutionId: string, input: InstitutionSettings): Promise<InstitutionSettings> {
    const key = storageKey(institutionId)
    const settings = institutionSettingsSchema.parse(input)
    localStorage.setItem(key, JSON.stringify(settings))
    return settings
  },
}
