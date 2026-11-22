import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { ArrowRight, Building2 } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar, SearchInput } from '@/components/shared/FilterBar'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/format'
import type { Tenant } from '@/types/owner'
import { useTenants } from '../hooks/useOwnerData'

const columns: ColumnDef<Tenant, unknown>[] = [
  { accessorKey: 'name', header: 'Nama Institusi', cell: ({ row }) => <span className="font-semibold">{row.original.name}</span> },
  { accessorKey: 'type', header: 'Jenis', cell: ({ row }) => row.original.type === 'internal' ? 'Internal' : 'Mitra eksternal' },
  { accessorKey: 'phone', header: 'Telepon', cell: ({ row }) => row.original.phone || '—' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: 'createdAt', header: 'Terdaftar', cell: ({ row }) => formatDate(row.original.createdAt ?? undefined) },
  { id: 'detail', header: 'Aksi', enableSorting: false, cell: ({ row }) => <Button asChild variant="outline" size="sm"><Link to={`/owner/institusi/${encodeURIComponent(row.original.id)}`}>Buka detail <ArrowRight aria-hidden /></Link></Button> },
]

export function InstitutionsPage() {
  const query = useTenants()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('id')
    const items = (query.data ?? []).filter((tenant) => {
      const matchesSearch = !normalizedSearch || `${tenant.name} ${tenant.phone ?? ''}`.toLocaleLowerCase('id').includes(normalizedSearch)
      const matchesStatus = status === 'all' || tenant.status === status
      return matchesSearch && matchesStatus
    })
    const sort = sorting[0]
    if (sort) {
      const factor = sort.desc ? -1 : 1
      items.sort((a, b) => {
        const aValue = String(a[sort.id as keyof Tenant] ?? '')
        const bValue = String(b[sort.id as keyof Tenant] ?? '')
        return factor * new Intl.Collator('id', { numeric: true, sensitivity: 'base' }).compare(aValue, bValue)
      })
    }
    return items
  }, [query.data, search, status, sorting])

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const changeSearch = (value: string) => { setSearch(value); setPage(1) }
  const changeStatus = (value: string) => { setStatus(value); setPage(1) }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manajemen Institusi"
        description="Lihat dan kelola tenant institusi yang tercatat di platform."
      />
      <Card className="space-y-4 p-4 sm:p-5">
        <FilterBar>
          <SearchInput value={search} onChange={changeSearch} placeholder="Cari nama atau telepon…" />
          <Select value={status} onValueChange={changeStatus}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter status institusi"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>
        <DataTable
          caption="Daftar institusi"
          columns={columns}
          data={paged}
          sorting={sorting}
          onSortingChange={(updater) => setSorting((current) => typeof updater === 'function' ? updater(current) : updater)}
          isLoading={query.isLoading}
          error={query.isError ? { message: query.error instanceof Error ? query.error.message : 'Data institusi gagal dimuat.' } : null}
          onRetry={() => void query.refetch()}
          empty={<div className="flex flex-col items-center gap-2 p-7 text-center"><Building2 className="size-8 text-muted-foreground" aria-hidden /><p className="font-semibold">Tidak ada institusi ditemukan</p><p className="text-sm text-muted-foreground">Periksa filter atau tinjau pengajuan yang menunggu.</p></div>}
        />
        {!query.isError ? (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          />
        ) : null}
      </Card>
    </div>
  )
}
