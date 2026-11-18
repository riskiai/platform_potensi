import { useMutation, useQuery } from '@tanstack/react-query'
import { registrationService } from '@/services/registration.service'
import type { ApiError } from '@/types/api'
import type {
  InstitutionRegistrationPayload,
  RegistrationLookup,
  RegistrationReceipt,
  RegistrationStatusResult,
} from '@/types/registration'

export function useSubmitRegistration() {
  return useMutation<RegistrationReceipt, ApiError, InstitutionRegistrationPayload>({
    mutationFn: registrationService.submit,
  })
}

/** Query cek status; berjalan hanya setelah pengguna mengirim nomor + email. */
export function useRegistrationStatus(lookup: RegistrationLookup | null) {
  return useQuery<RegistrationStatusResult, ApiError>({
    queryKey: ['registration-status', lookup?.registrationNumber, lookup?.email],
    queryFn: () => registrationService.checkStatus(lookup!),
    enabled: !!lookup,
    retry: false,
    staleTime: 0,
  })
}
