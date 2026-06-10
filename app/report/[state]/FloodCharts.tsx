'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import type { TrendPoint } from '@/lib/report-service'

interface Props {
  yearlyData: TrendPoint[]
}

const tooltipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid rgba(0, 245, 255, 0.25)',
  borderRadius: '8px',
  color: '#fff',
}

export default function FloodCharts({ yearlyData }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-black/60 p-6 rounded-xl border border-cyan-500/20 shadow-lg shadow-black/40">
        <h3 className="text-xl font-semibold mb-1 text-cyan-400">
          Incident Trend
        </h3>
        <p className="text-white/50 text-sm mb-4">
          Annual flood incidents (2015–present)
        </p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="year" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line
                type="monotone"
                dataKey="incidents"
                name="Incidents"
                stroke="#00F5FF"
                strokeWidth={3}
                dot={{ fill: '#00F5FF', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-black/60 p-6 rounded-xl border border-cyan-500/20 shadow-lg shadow-black/40">
        <h3 className="text-xl font-semibold mb-1 text-cyan-400">
          Rainfall Trend
        </h3>
        <p className="text-white/50 text-sm mb-4">
          Annual rainfall totals (mm)
        </p>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="year" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar
                dataKey="rainfall"
                name="Rainfall (mm)"
                fill="#22d3ee"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
