import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Pagination, type PaginationProps } from './Pagination'
import { EmptyState, ErrorState } from './states'

interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[] | undefined
  isLoading?: boolean
  error?: { message: string } | null
  onRetry?: () => void
  empty?: ReactNode
  /** Pagination server-side; kosongkan bila tidak perlu. */
  pagination?: PaginationProps
  /** Sorting server-side (opsional). Kolom bisa diurutkan bila `enableSorting` tidak false. */
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  getRowId?: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
}

/**
 * Tabel data standar POTENSI.
 * Data, pagination & sorting dikendalikan dari luar (server-side), jadi tabel ini
 * tidak tahu apa pun tentang API — cukup terima array & callback.
 */
export function DataTable<T>({
  columns,
  data,
  isLoading,
  error,
  onRetry,
  empty,
  pagination,
  sorting,
  onSortingChange,
  getRowId,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableSorting: !!onSortingChange,
    state: sorting ? { sorting } : undefined,
    onSortingChange,
    getRowId,
  })

  const colCount = columns.length
  const rows = table.getRowModel().rows

  let body: ReactNode
  if (isLoading) {
    body = Array.from({ length: pagination?.pageSize ? Math.min(pagination.pageSize, 6) : 5 }, (_, i) => (
      <TableRow key={`s-${i}`} className="hover:bg-transparent">
        {Array.from({ length: colCount }, (_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-5 w-full max-w-[180px]" />
          </TableCell>
        ))}
      </TableRow>
    ))
  } else if (error) {
    body = (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colCount}>
          <ErrorState compact description={error.message} onRetry={onRetry} />
        </TableCell>
      </TableRow>
    )
  } else if (rows.length === 0) {
    body = (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colCount}>{empty ?? <EmptyState compact />}</TableCell>
      </TableRow>
    )
  } else {
    body = rows.map((row) => (
      <TableRow
        key={row.id}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        className={onRowClick ? 'cursor-pointer' : undefined}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-card', className)}>
      <Table aria-busy={isLoading || undefined}>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const dir = header.column.getIsSorted()
                const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="-mx-1 inline-flex items-center gap-1 rounded px-1 uppercase hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/25"
                      >
                        {content}
                        {dir === 'asc' ? (
                          <ArrowUp className="size-3.5" aria-hidden />
                        ) : dir === 'desc' ? (
                          <ArrowDown className="size-3.5" aria-hidden />
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-50" aria-hidden />
                        )}
                      </button>
                    ) : (
                      content
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{body}</TableBody>
      </Table>

      {pagination && !error && (pagination.total > 0 || isLoading) ? (
        <div className="border-t border-border px-4 py-3">
          <Pagination {...pagination} />
        </div>
      ) : null}
    </div>
  )
}
