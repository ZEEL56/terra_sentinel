import FloodCharts from '@/app/report/[state]/FloodCharts'
import ReportDownloadButton from '@/app/report/[state]/ReportDownloadButton'
import { INDIAN_STATES } from '@/lib/flood-data'
import {
  districtSeverityClass,
  floodRiskColor,
  floodRiskLabel,
  getFloodReportData,
} from '@/lib/report-service'

function resolveStateName(param: string): string {
  const decoded = decodeURIComponent(param).replace(/-/g, ' ').trim()
  const match = INDIAN_STATES.find(
    (s) => s.toLowerCase() === decoded.toLowerCase()
  )
  if (match) return match
  return decoded
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-6 border-b border-cyan-500/20 pb-4">
      <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">{title}</h2>
      {subtitle ? (
        <p className="text-white/50 mt-2 text-sm md:text-base">{subtitle}</p>
      ) : null}
    </div>
  )
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div
      className={`bg-black/70 rounded-xl p-5 border shadow-lg ${accent}`}
    >
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="text-3xl md:text-4xl font-bold">{value}</div>
    </div>
  )
}

function DistrictList({
  title,
  districts,
  accent,
}: {
  title: string
  districts: { name: string; riskScore: number; severity: 'high' | 'medium' | 'low' }[]
  accent: string
}) {
  return (
    <div className="bg-black/50 rounded-xl border border-white/10 p-5 shadow-lg">
      <h3 className={`text-lg font-semibold mb-4 ${accent}`}>{title}</h3>
      <ul className="space-y-3">
        {districts.map((d) => (
          <li
            key={d.name}
            className={`flex items-center justify-between rounded-lg border px-4 py-3 ${districtSeverityClass(d.severity)}`}
          >
            <span className="font-medium">{d.name}</span>
            <span className="font-bold tabular-nums">{d.riskScore}</span>
          </li>
        ))}
        {districts.length === 0 ? (
          <li className="text-white/40 text-sm">No districts in this tier</li>
        ) : null}
      </ul>
    </div>
  )
}

export default async function ReportPage({
  params,
}: {
  params: { state: string }
}) {
  const stateName = resolveStateName(params.state)

  const report = await getFloodReportData(stateName)
  const generatedLabel = new Date(report.generatedAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-cyan-950 text-white">
      <div id="flood-report" className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
        {/* Executive Summary */}
        <header className="rounded-2xl border border-cyan-500/25 bg-zinc-900/80 p-8 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-cyan-accent/80 text-sm font-semibold tracking-widest uppercase mb-2">
                TerraSentinel Intelligence
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                Flood Intelligence Report
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {report.state}
              </p>
              <p className="text-white/50 mt-3 text-sm">
                Generated: {generatedLabel}
              </p>
              <p className="text-white/40 text-sm mt-1">
                AI-powered flood monitoring · Satellite + rainfall fusion
              </p>
            </div>
            <ReportDownloadButton stateName={report.state} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <MetricCard
              label="Risk Score"
              value={`${report.riskScore}`}
              accent="border-red-500/25 text-red-400"
            />
            <MetricCard
              label="Flood Probability"
              value={`${report.floodProbability}%`}
              accent="border-cyan-500/25 text-cyan-400"
            />
            <MetricCard
              label="AI Confidence"
              value={`${report.confidence}%`}
              accent="border-green-500/25 text-green-400"
            />
            <MetricCard
              label="Current Rainfall"
              value={`${Math.round(report.rainfall)} mm`}
              accent="border-blue-500/25 text-blue-400"
            />
          </div>
        </header>

        {/* Historical Analysis */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl">
          <SectionHeader
            title="Historical Analysis"
            subtitle="Decadal incident and rainfall trends from TerraSentinel archives"
          />
          <FloodCharts yearlyData={report.chartData} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-black/50 rounded-xl p-4 border border-cyan-500/15">
              <div className="text-white/50 text-sm">Peak Rainfall</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {report.peakRainfall} mm
              </div>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-red-500/15">
              <div className="text-white/50 text-sm">Highest Incidents</div>
              <div className="text-2xl font-bold text-red-400 mt-1">
                {report.highestIncidents}
              </div>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-amber-500/15">
              <div className="text-white/50 text-sm">Composite Risk</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {report.riskScore}%
              </div>
            </div>
          </div>
        </section>

        {/* Satellite Monitoring */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl">
          <SectionHeader
            title="Satellite Monitoring"
            subtitle="Multi-sensor Earth observation feeds — ESA & ISRO"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.satelliteFeeds.map((feed) => (
              <article
                key={feed.sensorName}
                className="bg-black/60 rounded-xl border border-white/10 overflow-hidden shadow-lg hover:border-cyan-500/30 transition-colors"
              >
                <div className="aspect-video relative">
                  <img
                    src={feed.imageUrl}
                    alt={feed.sensorName}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                      feed.status === 'Active'
                        ? 'bg-green-500/90 text-black'
                        : feed.status === 'Processing'
                          ? 'bg-amber-500/90 text-black'
                          : 'bg-zinc-600 text-white'
                    }`}
                  >
                    {feed.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-cyan-400">
                    {feed.sensorName}
                  </h3>
                  <p className="text-white/50 text-sm mt-1">
                    Capture: {feed.captureTime}
                  </p>
                  <p className="text-white/60 text-sm mt-3 leading-relaxed">
                    {feed.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* District Risk Analysis */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl">
          <SectionHeader
            title="District Risk Analysis"
            subtitle="Administrative unit risk scoring · Updated with latest model run"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DistrictList
              title="High Risk Districts"
              districts={report.districts.high}
              accent="text-red-400"
            />
            <DistrictList
              title="Medium Risk Districts"
              districts={report.districts.medium}
              accent="text-amber-400"
            />
            <DistrictList
              title="Low Risk Districts"
              districts={report.districts.low}
              accent="text-green-400"
            />
          </div>
        </section>

        {/* Flood Assessment */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl">
          <SectionHeader
            title="Flood Assessment"
            subtitle="Integrated hydrological and AI narrative"
          />
          <div className="space-y-6 text-white/75 leading-8 text-base md:text-lg">
            <div className="bg-black/40 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-cyan-300 font-semibold mb-3">
                Rainfall Analysis
              </h3>
              <p>{report.assessment.rainfallAnalysis}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-cyan-300 font-semibold mb-3">
                Flood Probability
              </h3>
              <p>{report.assessment.floodProbability}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-cyan-300 font-semibold mb-3">
                Vulnerable Regions
              </h3>
              <p>{report.assessment.vulnerableRegions}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-6 border border-cyan-500/10">
              <h3 className="text-cyan-300 font-semibold mb-3">
                AI Assessment
              </h3>
              <p>{report.assessment.aiAssessment}</p>
            </div>
          </div>
        </section>

        {/* 7-Day Forecast */}
        <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-xl">
          <SectionHeader
            title="7-Day Forecast"
            subtitle="Expected rainfall and flood risk outlook"
          />
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm md:text-base">
              <thead>
                <tr className="bg-black/60 text-cyan-400 border-b border-white/10">
                  <th className="px-5 py-4 font-semibold">Day</th>
                  <th className="px-5 py-4 font-semibold">
                    Expected Rainfall (mm)
                  </th>
                  <th className="px-5 py-4 font-semibold">Flood Risk</th>
                </tr>
              </thead>
              <tbody>
                {report.forecast.map((row) => (
                  <tr
                    key={row.day}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4 text-white/90 font-medium">
                      {row.day}
                    </td>
                    <td className="px-5 py-4 text-blue-300 tabular-nums">
                      {row.expectedRainfall} mm
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="font-bold tabular-nums"
                        style={{ color: floodRiskColor(row.floodRisk) }}
                      >
                        {row.floodRisk}% — {floodRiskLabel(row.floodRisk)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-white/40 text-sm pb-8 pt-4 border-t border-white/10">
          Generated by TerraSentinel AI Flood Intelligence Engine · Real-time
          satellite and weather analysis · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}
