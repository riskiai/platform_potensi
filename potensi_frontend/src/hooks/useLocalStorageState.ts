import { useCallback, useState } from 'react'

/** State yang diingat di localStorage. Aman bila storage diblokir (private mode). */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // abaikan — state tetap berjalan di memori
        }
        return resolved
      })
    },
    [key],
  )

  return [value, update] as const
}
