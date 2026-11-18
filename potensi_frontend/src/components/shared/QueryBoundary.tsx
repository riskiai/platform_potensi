import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ApiError } from '@/types/api'
import { EmptyState, ErrorState, SkeletonRows } from './states'

interface QueryBoundaryProps<T> {
  query: UseQueryResult<T, ApiError>
  /** Tentukan kapan data dianggap kosong, mis. `(d) => d.items.length === 0`. */
  isEmpty?: (data: T) => boolean
  loading?: ReactNode
  empty?: ReactNode
  /** Override tampilan error; default ErrorState dengan tombol coba lagi. */
  error?: (error: ApiError, retry: () => void) => ReactNode
  children: (data: T) => ReactNode
}

/**
 * Menangani loading / error / empty / success dari satu query TanStack.
 * Halaman cukup fokus pada tampilan saat data tersedia.
 */
export function QueryBoundary<T>({ query, isEmpty, loading, empty, error, children }: QueryBoundaryProps<T>) {
  if (query.isPending) return <>{loading ?? <SkeletonRows />}</>

  if (query.isError) {
    const retry = () => void query.refetch()
    return <>{error ? error(query.error, retry) : <ErrorState description={query.error.message} onRetry={retry} retrying={query.isFetching} />}</>
  }

  if (isEmpty?.(query.data)) return <>{empty ?? <EmptyState />}</>

  return <>{children(query.data)}</>
}
