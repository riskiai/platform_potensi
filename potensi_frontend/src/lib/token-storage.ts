const TOKEN_KEY = 'potensi.token'

/**
 * "Ingat saya" = localStorage (bertahan setelah browser ditutup),
 * selain itu sessionStorage (hilang saat tab ditutup).
 */
function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export const tokenStorage = {
  get(): string | null {
    return safe(() => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY), null)
  },
  set(token: string, remember: boolean) {
    safe(() => {
      this.clear()
      ;(remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
    }, undefined)
  },
  clear() {
    safe(() => {
      localStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
    }, undefined)
  },
}
