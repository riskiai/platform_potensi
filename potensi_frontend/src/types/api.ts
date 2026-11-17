/**
 * Bentuk error yang sudah dinormalisasi untuk dipakai UI.
 * Komponen hanya bergantung pada tipe ini, tidak pada format error mentah dari backend.
 */
export interface ApiError {
  message: string
  status?: number
  /** Error per field form, contoh: { identifier: ['Email tidak terdaftar'] } */
  fieldErrors?: Record<string, string[]>
}

/**
 * Bentuk data berhalaman yang dipakai UI (DataTable, Pagination).
 * ⚠️ Respons backend dipetakan ke bentuk ini di adapter tiap service,
 * jadi format pagination backend boleh berbeda.
 */
export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  [filter: string]: string | number | undefined
}
