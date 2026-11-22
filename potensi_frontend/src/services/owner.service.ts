import { env } from '@/lib/env'
import { apiClient } from '@/services/api-client'
import { ownerMockService } from '@/mocks/owner.mock'
import type { BackendHealth, InstitutionRequest, InstitutionRequestDecision, Tenant, TenantAdminInput, TenantInput } from '@/types/owner'

export interface OwnerService {
  listTenants(): Promise<Tenant[]>
  getTenant(id: string): Promise<Tenant>
  createTenant(payload: TenantInput): Promise<Tenant>
  updateTenant(id: string, payload: TenantInput): Promise<Tenant>
  createTenantAdmin(id: string, payload: TenantAdminInput): Promise<void>
  setTenantStatus?(id: string, status: Tenant["status"]): Promise<Tenant>
  listRequests(): Promise<InstitutionRequest[]>
  reviewRequest(id: string, decision: InstitutionRequestDecision): Promise<void>
  getHealth(): Promise<BackendHealth>
}

const ownerHttpService: OwnerService = {
  async listTenants() {
    const { data } = await apiClient.get('/tenants')
    const body = data?.data?.tenants
    if (!Array.isArray(body)) throw new Error('Format respons /tenants tidak sesuai kontrak backend.')
    return body.map(adaptTenant)
  },
  async getTenant(id) {
    const tenants = await this.listTenants()
    const tenant = tenants.find((item) => item.id === id)
    if (!tenant) throw new Error('Institusi tidak ditemukan atau tidak dapat diakses.')
    return tenant
  },
  async createTenant(payload) {
    const { data } = await apiClient.post('/tenants', payload)
    return adaptTenant(data?.data)
  },
  async updateTenant(id, payload) {
    const { data } = await apiClient.put(`/tenants/${encodeURIComponent(id)}`, payload)
    return adaptTenant(data?.data)
  },
  async createTenantAdmin(id, payload) {
    await apiClient.post(`/tenants/${encodeURIComponent(id)}/admins`, payload)
  },
  async listRequests() {
    throw new Error('Backend belum menyediakan endpoint daftar permintaan institusi. Aktifkan mode mock untuk demo approval.')
  },
  async reviewRequest() {
    throw new Error('Backend belum menyediakan endpoint approval permintaan institusi.')
  },
  async getHealth() {
    const { data } = await apiClient.get('/ping')
    return {
      status: String(data?.status ?? 'unknown'),
      message: String(data?.message ?? 'Respons health check diterima.'),
      ...(data?.php_version ? { phpVersion: String(data.php_version) } : {}),
    }
  },
}

function adaptTenant(raw: unknown): Tenant {
  if (!raw || typeof raw !== 'object') throw new Error('Data institusi dari backend tidak valid.')
  const item = raw as Record<string, unknown>
  if (item.id === undefined || typeof item.name !== 'string') throw new Error('Data institusi tidak memiliki id atau nama.')
  const type = item.type === 'internal' ? 'internal' : 'external'
  const status = item.status === 'inactive' ? 'inactive' : 'active'
  return {
    id: String(item.id),
    name: item.name,
    phone: typeof item.phone === 'string' ? item.phone : null,
    type,
    status,
    createdAt: typeof item.created_at === 'string' ? item.created_at : null,
  }
}

export const ownerService: OwnerService = env.useMock ? ownerMockService : ownerHttpService
