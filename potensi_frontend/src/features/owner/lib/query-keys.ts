export const ownerKeys = {
  all: ['owner'] as const,
  tenants: () => [...ownerKeys.all, 'tenants'] as const,
  tenant: (id: string) => [...ownerKeys.tenants(), id] as const,
  requests: () => [...ownerKeys.all, 'requests'] as const,
  health: () => [...ownerKeys.all, 'health'] as const,
}
