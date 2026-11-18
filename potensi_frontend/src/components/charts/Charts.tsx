import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_THEME, numberFormat, seriesColor, type ChartSeries } from './chart-theme'
import { ChartLegend, ChartTooltipContent } from './ChartParts'

type Datum = Record<string, string | number>

interface CartesianChartProps {
  data: Datum[]
  /** Key kategori di sumbu X (mis. 'month'). */
  xKey: string
  series: ChartSeries[]
  height?: number
  /** Ringkasan teks untuk pembaca layar. */
  ariaLabel: string
}

const axisProps = {
  stroke: CHART_THEME.axis,
  tick: { fill: CHART_THEME.axisText, fontSize: 12, fontFamily: CHART_THEME.font },
  tickLine: false,
  axisLine: false,
} as const

function legendFor(series: ChartSeries[]) {
  // Legend hanya untuk ≥ 2 seri; satu seri cukup dinamai oleh judul chart.
  return series.length >= 2 ? (
    <ChartLegend items={series.map((s, i) => ({ label: s.label, color: seriesColor(i) }))} />
  ) : null
}

export function SimpleBarChart({ data, xKey, series, height = 280, ariaLabel }: CartesianChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {legendFor(series)}
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v: number) => numberFormat.format(v)} width={48} />
            <Tooltip cursor={{ fill: '#F4F7FB' }} content={<ChartTooltipContent />} />
            {series.map((s, i) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={seriesColor(i)} radius={[4, 4, 0, 0]} maxBarSize={36} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function SimpleLineChart({ data, xKey, series, height = 280, ariaLabel }: CartesianChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {legendFor(series)}
      <div role="img" aria-label={ariaLabel} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_THEME.grid} />
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} tickFormatter={(v: number) => numberFormat.format(v)} width={48} />
            <Tooltip cursor={{ stroke: CHART_THEME.axis, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
            {series.map((s, i) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={seriesColor(i)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: CHART_THEME.surface }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface DonutChartProps {
  data: { label: string; value: number }[]
  height?: number
  ariaLabel: string
  /** Teks di tengah donut, mis. total. */
  centerLabel?: string
  centerValue?: string | number
}

export function DonutChart({ data, height = 240, ariaLabel, centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <ChartLegend items={data.map((d, i) => ({ label: d.label, color: seriesColor(i) }))} />
      <div role="img" aria-label={ariaLabel} className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={2}
              stroke={CHART_THEME.surface}
              strokeWidth={2}
            >
              {data.map((d, i) => (
                <Cell key={d.label} fill={seriesColor(i)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerValue !== undefined ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-bold text-foreground tabular-nums">{centerValue}</span>
            {centerLabel ? <span className="text-xs text-muted-foreground">{centerLabel}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
