import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ownerService } from '@/services/owner.service'
import type { InstitutionRequestDecision, TenantAdminInput, TenantInput } from '@/types/owner'
import { ownerKeys } from '../lib/query-keys'

export function useTenants() {
  return useQuery({ queryKey: ownerKeys.tenants(), queryFn: ownerService.listTenants })
}

export function useTenant(id: string) {
  return useQuery({ queryKey: ownerKeys.tenant(id), queryFn: () => ownerService.getTenant(id), enabled: !!id })
}

export function useInstitutionRequests() {
  return useQuery({ queryKey: ownerKeys.requests(), queryFn: ownerService.listRequests, retry: false })
}

export function useBackendHealth() {
  return useQuery({ queryKey: ownerKeys.health(), queryFn: ownerService.getHealth, retry: false, refetchInterval: 60_000 })
}

export function useCreateTenant() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (payload: TenantInput) => ownerService.createTenant(payload), onSuccess: () => client.invalidateQueries({ queryKey: ownerKeys.tenants() }) })
}

export function useUpdateTenant(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (payload: TenantInput) => ownerService.updateTenant(id, payload), onSuccess: (tenant) => {
    client.setQueryData(ownerKeys.tenant(id), tenant)
    return client.invalidateQueries({ queryKey: ownerKeys.tenants() })
  } })
}

export function useCreateTenantAdmin(id: string) {
  return useMutation({ mutationFn: (payload: TenantAdminInput) => ownerService.createTenantAdmin(id, payload) })
}

export function useReviewInstitutionRequest() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: InstitutionRequestDecision }) => ownerService.reviewRequest(id, decision),
    onSuccess: () => client.invalidateQueries({ queryKey: ownerKeys.all }),
  })
}
