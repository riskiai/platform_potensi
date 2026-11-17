const dateTimeFmt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
const dateFmt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })

/** Format tanggal ISO → "17 Nov 2026, 14.30". Mengembalikan "—" bila tidak valid. */
export function formatDateTime(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateTimeFmt.format(d)
}

/** Format tanggal ISO → "17 November 2026". */
export function formatDate(iso?: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d)
}
