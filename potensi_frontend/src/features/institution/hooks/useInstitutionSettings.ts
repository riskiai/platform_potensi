import { useQuery } from '@tanstack/react-query'
import { institutionSettingsService } from '@/services/institution-settings.service'

export const institutionSettingsKey = (institutionId: string) => ['institution-settings', institutionId] as const

export function useInstitutionSettings(institutionId: string) {
  const available = institutionSettingsService.available && !!institutionId
  const query = useQuery({
    queryKey: institutionSettingsKey(institutionId),
    queryFn: () => institutionSettingsService.get(institutionId),
    enabled: available,
    retry: false,
  })
  return { available, query }
}
