import axios, { AxiosError } from 'axios'
import { env } from '@/lib/env'
import { tokenStorage } from '@/lib/token-storage'
import type { ApiError } from '@/types/api'

/** Satu-satunya instance Axios. Semua service wajib memakai ini. */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 20_000,
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null

/** Dipasang oleh AuthProvider supaya 401 di mana pun otomatis logout. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler
}

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) onUnauthorized?.()
    return Promise.reject(toApiError(error))
  },
)

/**
 * Normalisasi error menjadi `ApiError`.
 * Format `{ message, errors }` adalah asumsi umum (mis. Laravel) — sesuaikan bila kontrak berbeda.
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return { message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.' }
    }
    const data = error.response.data as { message?: string; errors?: Record<string, string[]> } | undefined
    return {
      status: error.response.status,
      message: data?.message ?? 'Terjadi kesalahan pada server. Silakan coba lagi.',
      fieldErrors: data?.errors,
    }
  }
  return { message: 'Terjadi kesalahan yang tidak terduga.' }
}

function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'message' in value && !axios.isAxiosError(value)
}
