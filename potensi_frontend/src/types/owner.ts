import type { InstitutionRegistrationPayload } from './registration'
import type { Paginated } from '@/types/api'

export type TenantKind = 'internal' | 'external'
export type TenantStatus = 'active' | 'inactive'

export interface Tenant {
  id: string
  name: string
  phone: string | null
  type: TenantKind
  status: TenantStatus
  contact?: Partial<InstitutionRegistrationPayload['admin']>
  createdAt: string | null
}

export interface TenantInput {
  name: string
  phone?: string
}

export interface TenantAdminInput {
  name: string
  email: string
  password: string
}

export interface InstitutionRequest {
  id: string
  registrationNumber: string
  institutionName: string
  contactName?: string
  position?: string
  timeline: import("./registration").RegistrationTimelineItem[]
  institutionType: string
  email: string
  phone: string
  city: string
  province: string
  submittedAt: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  note?: string
}

export interface InstitutionRequestDecision {
  status: 'approved' | 'rejected'
  note?: string
}

export type TenantPage = Paginated<Tenant>

export interface BackendHealth {
  status: string
  message: string
  phpVersion?: string
}
