import { useMemo, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { Building2, ClipboardList, FlaskConical, Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge, type StatusKey } from '@/components/shared/StatusBadge'
import { DataTable } from '@/components/shared/DataTable'
import { FilterBar, SearchInput } from '@/components/shared/FilterBar'
import { FormField } from '@/components/shared/FormField'
import { ConfirmDialog, FormDialog } from '@/components/shared/dialogs'
import { EmptyState, ErrorState, LoadingState, SuccessState } from '@/components/shared/states'
import { ChartCard } from '@/components/charts/ChartParts'
import { DonutChart, SimpleBarChart, SimpleLineChart } from '@/components/charts/Charts'

/**
 * GALERI KOMPONEN — hanya tersedia saat `npm run dev`.
 * Semua data di halaman ini adalah CONTOH untuk memperlihatkan komponen,
 * bukan data dari API dan bukan hasil rekomendasi.
 */

interface SampleRow {
  id: string
  name: string
  city: string
  participants: number
  status: StatusKey
}

const SAMPLE_ROWS: SampleRow[] = Array.from({ length: 23 }, (_, i) => ({
  id: `row-${i + 1}`,
  name: `Institusi Contoh ${i + 1}`,
  city: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'][i % 5],
  participants: 40 + ((i * 37) % 260),
  status: (['pending', 'approved', 'rejected', 'active', 'inactive'] as const)[i % 5],
}))

const SAMPLE_BAR = [
  { month: 'Jan', ds: 32, net: 24 },
  { month: 'Feb', ds: 41, net: 30 },
  { month: 'Mar', ds: 38, net: 35 },
  { month: 'Apr', ds: 52, net: 33 },
  { month: 'Mei', ds: 47, net: 40 },
  { month: 'Jun', ds: 60, net: 44 },
]

const ALL_STATUSES: StatusKey[] = ['pending', 'approved', 'rejected', 'active', 'inactive', 'draft', 'published', 'in_progress', 'completed', 'failed']

const demoSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  track: z.string().min(1, 'Pilih salah satu track.'),
  notes: z.string().max(200, 'Maksimal 200 karakter.').optional(),
})
type DemoValues = z.infer<typeof demoSchema>

type TableMode = 'data' | 'loading' | 'empty' | 'error'

export function UiKitPage() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  // --- Tabel ---------------------------------------------------------------
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [mode, setMode] = useState<TableMode>('data')

  const filtered = useMemo(() => {
    let rows = SAMPLE_ROWS.filter(
      (r) => r.name.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || r.status === status),
    )
    const s = sorting[0]
    if (s) {
      rows = [...rows].sort((a, b) => {
        const av = a[s.id as keyof SampleRow]
        const bv = b[s.id as keyof SampleRow]
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
        return s.desc ? -cmp : cmp
      })
    }
    return rows
  }, [search, status, sorting])

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const columns = useMemo<ColumnDef<SampleRow, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama Institusi',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Building2 className="size-4" aria-hidden />
            </div>
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      { accessorKey: 'city', header: 'Kota' },
      {
        accessorKey: 'participants',
        header: 'Peserta',
        cell: ({ getValue }) => <span className="tabular-nums">{getValue<number>()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ getValue }) => <StatusBadge status={getValue<StatusKey>()} />,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              aria-label={`Hapus ${row.original.name}`}
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  // --- Form dialog ----------------------------------------------------------
  const form = useForm<DemoValues>({ resolver: zodResolver(demoSchema), defaultValues: { name: '', track: '', notes: '' } })
  const { errors, isSubmitting } = form.formState
  const trackValue = useWatch({ control: form.control, name: 'track' })

  const onSubmitDemo = form.handleSubmit(async (values) => {
    await new Promise((r) => setTimeout(r, 800))
    setFormOpen(false)
    form.reset()
    toast.success('Data berhasil disimpan', { description: `"${values.name}" ditambahkan (demo).` })
  })

  return (
    <>
      <PageHeader
        title="UI Kit"
        description="Galeri komponen bersama POTENSI. Semua data di halaman ini adalah contoh dan hanya tersedia saat development."
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus aria-hidden /> Tambah Data
          </Button>
        }
      />

      <Alert variant="warning" className="mb-6">
        <FlaskConical aria-hidden />
        <p>
          <strong>Halaman development.</strong> Angka, tabel, dan chart di bawah adalah data contoh untuk menguji tampilan
          komponen — bukan data API atau hasil rekomendasi.
        </p>
      </Alert>

      <div className="flex flex-col gap-10">
        {/* Stat cards */}
        <Section title="Statistic Cards">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Institusi" value={128} icon={Building2} trend={8.2} hint="vs bulan lalu" />
            <StatCard label="Total Peserta" value="4.512" icon={Users} accent="accent" trend={-2.1} hint="vs bulan lalu" />
            <StatCard label="Assessment Aktif" value={16} icon={ClipboardList} accent="gold" hint="3 berakhir minggu ini" />
            <StatCard label="Memuat…" value={0} icon={Users} accent="pink" loading />
          </div>
        </Section>

        {/* Badges & buttons */}
        <Section title="Status Badge & Button">
          <Card className="flex flex-col gap-5 p-5">
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button loading>Loading</Button>
              <Button onClick={() => toast.success('Berhasil disimpan')}>Toast sukses</Button>
              <Button variant="outline" onClick={() => toast.error('Gagal menyimpan', { description: 'Coba lagi nanti.' })}>
                Toast error
              </Button>
            </div>
          </Card>
        </Section>

        {/* Table */}
        <Section title="Data Table + Filter + Pagination">
          <div className="flex flex-col gap-4">
            <FilterBar
              actions={
                <Select value={mode} onValueChange={(v) => setMode(v as TableMode)}>
                  <SelectTrigger className="w-[170px]" aria-label="Simulasi state tabel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data">State: Ada data</SelectItem>
                    <SelectItem value="loading">State: Loading</SelectItem>
                    <SelectItem value="empty">State: Kosong</SelectItem>
                    <SelectItem value="error">State: Error</SelectItem>
                  </SelectContent>
                </Select>
              }
            >
              <SearchInput
                value={search}
                onChange={(v) => {
                  setSearch(v)
                  setPage(1)
                }}
                placeholder="Cari institusi…"
              />
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v)
                  setPage(1)
                }}
              >
                <SelectTrigger className="sm:w-[180px]" aria-label="Filter status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={mode === 'empty' ? [] : pageRows}
              isLoading={mode === 'loading'}
              error={mode === 'error' ? { message: 'Server tidak merespons (simulasi).' } : null}
              onRetry={() => setMode('data')}
              getRowId={(r) => r.id}
              sorting={sorting}
              onSortingChange={setSorting}
              empty={<EmptyState compact title="Tidak ada institusi" description="Coba ubah kata kunci atau filter." />}
              pagination={{
                page,
                pageSize,
                total: mode === 'empty' ? 0 : filtered.length,
                onPageChange: setPage,
                onPageSizeChange: (s) => {
                  setPageSize(s)
                  setPage(1)
                },
              }}
            />
          </div>
        </Section>

        {/* Charts */}
        <Section title="Charts">
          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard title="Peserta per Track" description="Contoh bar chart dua seri" className="lg:col-span-2">
              <SimpleBarChart
                data={SAMPLE_BAR}
                xKey="month"
                series={[
                  { key: 'ds', label: 'Data Science' },
                  { key: 'net', label: 'Network' },
                ]}
                ariaLabel="Contoh jumlah peserta per track per bulan"
              />
            </ChartCard>
            <ChartCard title="Distribusi Track" description="Contoh donut chart">
              <DonutChart
                data={[
                  { label: 'Data Science', value: 270 },
                  { label: 'Network', value: 206 },
                ]}
                centerValue={476}
                centerLabel="Peserta"
                ariaLabel="Contoh distribusi peserta per track"
              />
            </ChartCard>
            <ChartCard title="Assessment Selesai" description="Contoh line chart satu seri" className="lg:col-span-3">
              <SimpleLineChart
                data={SAMPLE_BAR.map((d) => ({ month: d.month, total: d.ds + d.net }))}
                xKey="month"
                series={[{ key: 'total', label: 'Assessment selesai' }]}
                height={220}
                ariaLabel="Contoh jumlah assessment selesai per bulan"
              />
            </ChartCard>
          </div>
        </Section>

        {/* States */}
        <Section title="Loading / Empty / Error / Success">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <LoadingState />
            </Card>
            <Card>
              <EmptyState
                title="Belum ada program akademik"
                description="Tambahkan program pertama untuk mulai menyusun track."
                action={
                  <Button size="sm">
                    <Plus aria-hidden /> Tambah Program
                  </Button>
                }
              />
            </Card>
            <Card>
              <ErrorState onRetry={() => toast.info('Mencoba lagi…')} />
            </Card>
            <Card>
              <SuccessState
                title="Pendaftaran terkirim"
                description="Pengajuan institusi Anda sedang ditinjau oleh Platform Owner."
                action={
                  <Button size="sm" variant="outline">
                    Cek status
                  </Button>
                }
              />
            </Card>
          </div>
        </Section>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Hapus institusi ini?"
        description="Data yang dihapus tidak dapat dikembalikan. (Demo — tidak ada data yang benar-benar dihapus.)"
        confirmLabel="Hapus"
        loading={confirmLoading}
        onConfirm={() => {
          setConfirmLoading(true)
          setTimeout(() => {
            setConfirmLoading(false)
            setConfirmOpen(false)
            toast.success('Institusi dihapus (demo)')
          }, 800)
        }}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o)
          if (!o) form.reset()
        }}
        title="Tambah Data"
        description="Contoh form dialog dengan React Hook Form + Zod."
        loading={isSubmitting}
        onSubmit={onSubmitDemo}
      >
        <FormField id="demo-name" label="Nama" required error={errors.name?.message}>
          <Input id="demo-name" placeholder="Mis. Program Informatika" {...form.register('name')} />
        </FormField>
        <FormField id="demo-track" label="Track" required error={errors.track?.message}>
          <Select value={trackValue} onValueChange={(v) => form.setValue('track', v, { shouldValidate: true })}>
            <SelectTrigger id="demo-track" aria-invalid={!!errors.track || undefined}>
              <SelectValue placeholder="Pilih track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="network">Network</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField id="demo-notes" label="Catatan" description="Opsional, maksimal 200 karakter." error={errors.notes?.message}>
          <Textarea id="demo-notes" placeholder="Tulis catatan…" {...form.register('notes')} />
        </FormField>
      </FormDialog>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">{title}</h2>
      {children}
    </section>
  )
}
