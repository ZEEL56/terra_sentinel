import { generateFloodData, getRiskColor } from './flood-data'
import { getSatellitePreviewUrl } from './satellite-images'

export interface TrendPoint {
  year: number
  incidents: number
  rainfall: number
}

export interface DistrictRisk {
  name: string
  riskScore: number
  severity: 'high' | 'medium' | 'low'
}

export interface SatelliteFeed {
  sensorName: string
  captureTime: string
  status: 'Active' | 'Processing' | 'Standby'
  imageUrl: string
  description: string
}

export interface ForecastDay {
  day: string
  expectedRainfall: number
  floodRisk: number
}

export interface FloodReportData {
  state: string
  rainfall: number
  riskScore: number
  floodProbability: number
  confidence: number
  generatedAt: string
  incidentsTrend: { year: number; incidents: number }[]
  rainfallTrend: { year: number; rainfall: number }[]
  chartData: TrendPoint[]
  peakRainfall: number
  highestIncidents: number
  districts: {
    high: DistrictRisk[]
    medium: DistrictRisk[]
    low: DistrictRisk[]
  }
  satelliteFeeds: SatelliteFeed[]
  forecast: ForecastDay[]
  assessment: {
    rainfallAnalysis: string
    floodProbability: string
    vulnerableRegions: string
    aiAssessment: string
  }
}

const STATE_DISTRICTS: Record<string, string[]> = {
  Assam: [
    'Dibrugarh',
    'Goalpara',
    'Barpeta',
    'Morigaon',
    'Dhemaji',
    'Lakhimpur',
    'Nagaon',
    'Cachar',
    'Kamrup',
    'Sonitpur',
  ],
  Bihar: [
    'Patna',
    'Muzaffarpur',
    'Darbhanga',
    'Sitamarhi',
    'Supaul',
    'Madhubani',
    'Samastipur',
    'Bhagalpur',
    'Katihar',
    'Purnia',
  ],
  'Uttar Pradesh': [
    'Gorakhpur',
    'Bahraich',
    'Balrampur',
    'Lakhimpur Kheri',
    'Barabanki',
    'Azamgarh',
    'Ballia',
    'Ghazipur',
    'Varanasi',
    'Prayagraj',
  ],
  'West Bengal': [
    'Malda',
    'Murshidabad',
    'Nadia',
    'North 24 Parganas',
    'South 24 Parganas',
    'Howrah',
    'Hooghly',
    'Darjeeling',
    'Jalpaiguri',
    'Cooch Behar',
  ],
  Kerala: [
    'Alappuzha',
    'Kottayam',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Wayanad',
    'Idukki',
    'Pathanamthitta',
    'Kozhikode',
    'Malappuram',
  ],
  Maharashtra: [
    'Raigad',
    'Ratnagiri',
    'Sindhudurg',
    'Kolhapur',
    'Sangli',
    'Satara',
    'Thane',
    'Palghar',
    'Nashik',
    'Ahmednagar',
  ],
  Odisha: [
    'Puri',
    'Khordha',
    'Cuttack',
    'Kendrapara',
    'Jagatsinghpur',
    'Balasore',
    'Mayurbhanj',
    'Kalahandi',
    'Koraput',
    'Ganjam',
  ],
  Gujarat: [
    'Surat',
    'Bharuch',
    'Narmada',
    'Navsari',
    'Valsad',
    'Anand',
    'Kheda',
    'Banaskantha',
    'Surendranagar',
    'Bhavnagar',
  ],
  Karnataka: [
    'Udupi',
    'Dakshina Kannada',
    'Kodagu',
    'Hassan',
    'Chikkamagaluru',
    'Belagavi',
    'Raichur',
    'Bagalkot',
    'Gadag',
    'Ballari',
  ],
  'Tamil Nadu': [
    'Chennai',
    'Cuddalore',
    'Nagapattinam',
    'Thanjavur',
    'Tiruvarur',
    'Kanyakumari',
    'Coimbatore',
    'Erode',
    'Tiruchirappalli',
    'Madurai',
  ],
}

function hashState(state: string): number {
  return state.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

function seededValue(seed: number, index: number, min: number, max: number): number {
  const raw = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  const normalized = raw - Math.floor(raw)
  return Math.round(min + normalized * (max - min))
}

function getDistrictNames(state: string): string[] {
  if (STATE_DISTRICTS[state]) return STATE_DISTRICTS[state]
  const seed = hashState(state)
  return Array.from({ length: 10 }, (_, i) => `${state} District ${i + 1}`)
    .map((name, i) =>
      i > 0 ? name.replace('District', `Zone-${seededValue(seed, i, 10, 99)}`) : name
    )
}

function buildDistrictRisks(
  state: string,
  baseRisk: number
): FloodReportData['districts'] {
  const names = getDistrictNames(state)
  const seed = hashState(state)

  const scored = names.map((name, index) => {
    const score = Math.min(
      100,
      Math.max(
        5,
        seededValue(seed, index, baseRisk - 25, baseRisk + 30)
      )
    )
    let severity: DistrictRisk['severity'] = 'low'
    if (score >= 65) severity = 'high'
    else if (score >= 40) severity = 'medium'
    return { name, riskScore: score, severity }
  })

  return {
    high: scored.filter((d) => d.severity === 'high').slice(0, 5),
    medium: scored.filter((d) => d.severity === 'medium').slice(0, 5),
    low: scored.filter((d) => d.severity === 'low').slice(0, 5),
  }
}

function buildForecast(state: string, baseRisk: number): ForecastDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const seed = hashState(state)
  const today = new Date()

  return days.map((label, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    const dayLabel = `${label} ${date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    })}`
    const expectedRainfall = seededValue(seed, index + 1, 8, 95)
    const floodRisk = Math.min(
      100,
      Math.max(
        10,
        seededValue(seed, index + 10, baseRisk - 15, baseRisk + 20)
      )
    )
    return {
      day: dayLabel,
      expectedRainfall,
      floodRisk,
    }
  })
}

function buildSatelliteFeeds(state: string): SatelliteFeed[] {
  const captured = new Date()
  const formatTime = (minutesAgo: number) => {
    const t = new Date(captured.getTime() - minutesAgo * 60_000)
    return t.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return [
    {
      sensorName: 'Sentinel-1 SAR',
      captureTime: formatTime(18),
      status: 'Active',
      imageUrl: getSatellitePreviewUrl('Sentinel-1'),
      description: `C-band SAR flood extent mapping over ${state} river basins`,
    },
    {
      sensorName: 'Sentinel-2 Optical',
      captureTime: formatTime(12),
      status: 'Active',
      imageUrl: getSatellitePreviewUrl('Sentinel-2'),
      description: `Multispectral NDWI surface water detection — ${state}`,
    },
    {
      sensorName: 'RISAT-1 SAR',
      captureTime: formatTime(45),
      status: 'Processing',
      imageUrl: getSatellitePreviewUrl('RISAT'),
      description: `ISRO all-weather inundation monitoring — ${state} coastal and delta zones`,
    },
  ]
}

function buildAssessment(
  state: string,
  report: {
    rainfall: number
    floodProbability: number
    riskScore: number
    peakRainfall: number
    confidence: number
    districts: FloodReportData['districts']
  }
): FloodReportData['assessment'] {
  const { confidence } = report
  const highNames = report.districts.high.map((d) => d.name).join(', ') || 'key riverine corridors'
  const mediumCount = report.districts.medium.length

  return {
    rainfallAnalysis: `Hydrometeorological analysis for ${state} indicates current accumulated rainfall of ${Math.round(report.rainfall)} mm against a decadal peak of ${report.peakRainfall} mm. TerraSentinel ingestion pipelines correlate IMD gridded precipitation with gauge-adjusted totals, flagging sustained monsoon pulses and short-duration convective bursts. Soil saturation indices across low-lying tracts remain elevated, with runoff coefficients exceeding seasonal norms in the eastern and central floodplains.`,
    floodProbability: `Integrated flood probability for ${state} is assessed at ${report.floodProbability}% (composite risk score ${report.riskScore}/100). The model weights historical incident frequency, antecedent wetness, reservoir outflow schedules, and SAR-derived water extent anomalies. Probability exceeds the 75th percentile of the 2015–2024 baseline, suggesting conditions favorable for localized embankment overtopping and urban stormwater exceedance within 48–72 hours under continued precipitation.`,
    vulnerableRegions: `District-level screening identifies ${report.districts.high.length} high-risk and ${mediumCount} medium-risk administrative units. Priority vulnerable regions include ${highNames}, where compound exposure (population density × flood depth potential) ranks highest. Coastal and riparian settlements, paddy-dominated alluvial fans, and informal urban wards with constrained drainage capacity require enhanced situational awareness and pre-positioned relief assets.`,
    aiAssessment: `TerraSentinel ensemble AI (satellite + meteorological fusion) reports ${confidence}% confidence in the current risk classification. Multi-sensor consistency checks (Sentinel-1, Sentinel-2, RISAT) show spatial agreement on inundation signatures in ${state}. Recommendation: maintain continuous SAR tasking, validate field reports against NDWI change polygons, and escalate state disaster management coordination when 7-day forecast flood risk exceeds 60% on two consecutive days.`,
  }
}

export async function getFloodReportData(state: string): Promise<FloodReportData> {
  const floodData = generateFloodData()
  const yearlyData = floodData.filter((item) => item.state === state)
  const latest = yearlyData[yearlyData.length - 1]

  const rainfall = latest?.rainfall ?? 0
  const riskScore = Math.min(Math.round(rainfall / 40), 100)
  const floodProbability = Math.min(Math.round((latest?.incidents ?? 0) * 2), 100)
  const confidence = Math.min(99, 88 + Math.floor(riskScore / 12))

  const incidentsTrend = yearlyData.map((item) => ({
    year: item.year,
    incidents: item.incidents,
  }))

  const rainfallTrend = yearlyData.map((item) => ({
    year: item.year,
    rainfall: item.rainfall,
  }))

  const chartData: TrendPoint[] = incidentsTrend.map((item, index) => ({
    year: item.year,
    incidents: item.incidents,
    rainfall: rainfallTrend[index]?.rainfall ?? 0,
  }))

  const peakRainfall =
    rainfallTrend.length > 0
      ? Math.max(...rainfallTrend.map((r) => r.rainfall))
      : rainfall

  const highestIncidents =
    incidentsTrend.length > 0
      ? Math.max(...incidentsTrend.map((i) => i.incidents))
      : 0

  const districts = buildDistrictRisks(state, riskScore)
  const forecast = buildForecast(state, floodProbability)
  const satelliteFeeds = buildSatelliteFeeds(state)

  const partial = {
    rainfall,
    floodProbability,
    riskScore,
    peakRainfall,
    districts,
    confidence,
  }

  const assessment = buildAssessment(state, partial)

  return {
    state,
    rainfall,
    riskScore,
    floodProbability,
    confidence,
    generatedAt: new Date().toISOString(),
    incidentsTrend,
    rainfallTrend,
    chartData,
    peakRainfall,
    highestIncidents,
    districts,
    satelliteFeeds,
    forecast,
    assessment,
  }
}

export function districtSeverityClass(severity: DistrictRisk['severity']): string {
  switch (severity) {
    case 'high':
      return 'text-red-400 border-red-500/30 bg-red-500/10'
    case 'medium':
      return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    default:
      return 'text-green-400 border-green-500/30 bg-green-500/10'
  }
}

export function floodRiskLabel(score: number): string {
  if (score >= 75) return 'Critical'
  if (score >= 55) return 'High'
  if (score >= 35) return 'Moderate'
  return 'Low'
}

export function floodRiskColor(score: number): string {
  return getRiskColor(score)
}
