import { useEffect, useState, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  /** Dipanggil setelah pengguna berhenti mengetik (debounce). */
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Cari…', className }: SearchInputProps) {
  const [draft, setDraft] = useState(value)
  const debounced = useDebouncedValue(draft)

  useEffect(() => {
    if (debounced !== value) onChange(debounced)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <div className={cn('relative w-full sm:max-w-xs', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {draft ? (
        <button
          type="button"
          onClick={() => setDraft('')}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          aria-label="Hapus pencarian"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

/** Baris filter di atas tabel/chart: pencarian di kiri, filter lain & aksi di kanan. */
export function FilterBar({ children, actions, className }: { children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
