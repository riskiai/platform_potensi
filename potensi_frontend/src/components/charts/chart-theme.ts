/**
 * Palet chart POTENSI — urutan TETAP, tidak di-cycle.
 * Divalidasi (lightness, chroma, buta warna/CVD, normal-vision) terhadap surface putih.
 * Kontras sky & emas < 3:1 → wajib ada legend/tooltip/label (sudah ditangani komponen chart).
 */
export const CHART_SERIES_COLORS = ['#2B4FB8', '#0EA5E9', '#D9A400', '#DB2777'] as const

export const CHART_THEME = {
  grid: '#EEF0F3',
  axis: '#9CA3AF',
  axisText: '#6B7280',
  surface: '#FFFFFF',
  font: 'Inter, ui-sans-serif, system-ui, sans-serif',
} as const

export interface ChartSeries {
  /** Key di objek data. */
  key: string
  label: string
}

export function seriesColor(index: number) {
  // Maksimal 4 seri. Lebih dari itu → gabungkan ke "Lainnya" atau pecah jadi beberapa chart.
  return CHART_SERIES_COLORS[Math.min(index, CHART_SERIES_COLORS.length - 1)]
}

export const numberFormat = new Intl.NumberFormat('id-ID')
