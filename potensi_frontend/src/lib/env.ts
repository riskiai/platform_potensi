/** Akses environment variable yang terketik dan tervalidasi di satu tempat. */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  /** true = semua service memakai mock, bukan API backend. */
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  isDev: import.meta.env.DEV,
} as const
