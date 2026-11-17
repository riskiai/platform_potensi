import { useEffect, useState } from 'react'

/** Menunda perubahan nilai (mis. input pencarian) agar tidak memanggil API di setiap ketikan. */
export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
