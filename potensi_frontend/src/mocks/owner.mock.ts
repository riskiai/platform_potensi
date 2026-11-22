import type { OwnerService } from '@/services/owner.service'
import type { Tenant, TenantAdminInput, TenantInput } from '@/types/owner'
import { registrations, reviewRegistration } from './registration.mock'
import { delay } from './utils'

const TENANTS_KEY = 'potensi.mock.owner.tenants'

const today = new Date()
const daysAgo = (days: number) => new Date(today.getTime() - days * 86_400_000).toISOString()

const seedTenants: Tenant[] = [
  { id: 'tenant-1001', name: 'Universitas Nusantara', phone: '(021) 555 0101', type: 'external', status: 'active', createdAt: daysAgo(45) },
  { id: 'tenant-1002', name: 'Institut Teknologi Cendekia', phone: '(022) 555 0102', type: 'external', status: 'active', createdAt: daysAgo(27) },
  { id: 'tenant-1003', name: 'Politeknik Digital Mandiri', phone: '(031) 555 0103', type: 'external', status: 'inactive', createdAt: daysAgo(16) },
  { id: 'tenant-1004', name: 'POTENSI Internal', phone: null, type: 'internal', status: 'active', createdAt: daysAgo(90),
    contact: { fullName: 'Admin Internal (Demo)', position: 'Koordinator institusi', email: 'internal@potensi.test' },
  },
]

function readList<T>(key: string, seed: T[]): T[] {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T[]) : seed
  } catch {
    return seed
  }
}

function writeList<T>(key: string, items: T[]) {
  try { localStorage.setItem(key, JSON.stringify(items)) } catch { /* storage is optional in mock mode */ }
}

export function mockTenantStatus(id: string, fallback: Tenant['status']) {
  const saved = localStorage.getItem('potensi.mock.tenant.status.' + id)
  return saved === 'active' || saved === 'inactive' ? saved : fallback
}

function allTenants(): Tenant[] {
  const approved = registrations().filter(item => item.status === 'approved').map(item => ({
    id: item.registrationNumber, name: item.institutionName, phone: item.details?.institution.phone ?? null,
    contact: item.details?.admin ?? { email: item.email },
    type: 'external' as const, status: 'active' as const, createdAt: item.timeline.at(-1)?.at ?? item.submittedAt,
  }))
  return [...readList(TENANTS_KEY, seedTenants), ...approved].map(item => ({ ...item, status: mockTenantStatus(item.id, item.status) }))
}

function nextId() {
  return `tenant-${Date.now()}`
}

function validateTenant(payload: TenantInput) {
  if (!payload.name.trim()) throw { message: 'Nama institusi wajib diisi.', fieldErrors: { name: ['Nama institusi wajib diisi.'] } }
  if (payload.phone && payload.phone.length > 30) throw { message: 'Nomor telepon maksimal 30 karakter.', fieldErrors: { phone: ['Nomor telepon maksimal 30 karakter.'] } }
}

export const ownerMockService: OwnerService = {
  async listTenants() {
    await delay(450)
    return allTenants().sort((a, b) => a.name.localeCompare(b.name, 'id'))
  },
  async getTenant(id) {
    await delay(250)
    const tenant = allTenants().find((item) => item.id === id)
    if (!tenant) throw new Error('Institusi tidak ditemukan.')
    return tenant
  },
  async createTenant(payload) {
    await delay(550)
    validateTenant(payload)
    const tenants = readList(TENANTS_KEY, seedTenants)
    if (tenants.some((item) => item.name.toLowerCase() === payload.name.trim().toLowerCase())) {
      throw { message: 'Nama institusi sudah terdaftar.', fieldErrors: { name: ['Nama institusi sudah terdaftar.'] } }
    }
    const tenant: Tenant = { id: nextId(), name: payload.name.trim(), phone: payload.phone?.trim() || null, type: 'external', status: 'active', createdAt: new Date().toISOString() }
    writeList(TENANTS_KEY, [tenant, ...tenants])
    return tenant
  },
  async updateTenant(id, payload) {
    await delay(450)
    validateTenant(payload)
    const tenants = readList(TENANTS_KEY, seedTenants)
    const index = tenants.findIndex((item) => item.id === id)
    if (index < 0) throw new Error('Institusi tidak ditemukan.')
    const updated = { ...tenants[index]!, name: payload.name.trim(), phone: payload.phone?.trim() || null }
    tenants[index] = updated
    writeList(TENANTS_KEY, tenants)
    return updated
  },
  async createTenantAdmin(_id: string, _payload: TenantAdminInput) {
    await delay(500)
    // Mock never stores or exposes the supplied password.
  },
  async setTenantStatus(id, status) {
    const tenant = await this.getTenant(id)
    localStorage.setItem('potensi.mock.tenant.status.' + id, status)
    return { ...tenant, status }
  },
  async listRequests() {
    await delay(400)
    return registrations().map(row => ({
      ...row,
      id: row.registrationNumber,
      contactName: row.details?.admin.fullName,
      position: row.details?.admin.position,
      institutionType: row.details?.institution.type ?? '—',
      phone: row.details?.admin.phone ?? '—',
      city: row.details?.institution.city ?? '—',
      province: row.details?.institution.province ?? '—',
    })).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  },
  async reviewRequest(id, decision) {
    await delay(500)
    reviewRegistration(id, decision)
  },
  async getHealth() {
    await delay(300)
    return { status: 'success', message: 'Backend POTENSI berjalan (respons simulasi).' }
  },
}
