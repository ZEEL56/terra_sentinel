import { prisma } from '@/lib/prisma'
import { mockSources, type SatelliteSource } from '@/lib/dashboard-mock-data'

type FloodAlert = Record<string, unknown>
type MonitoringZone = Record<string, unknown>

async function withDatabase<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; source: 'database' | 'mock' }> {
  if (!process.env.DATABASE_URL) {
    return { data: fallback, source: 'mock' }
  }

  try {
    const data = await query()
    return { data, source: 'database' }
  } catch {
    return { data: fallback, source: 'mock' }
  }
}

export async function getSatelliteSources(): Promise<{
  data: SatelliteSource[]
  source: 'database' | 'mock'
}> {
  return withDatabase(
    () =>
      prisma.$queryRaw<SatelliteSource[]>`
        SELECT * FROM satellite_sources ORDER BY name
      `,
    mockSources,
  )
}

export async function getFloodAlerts(): Promise<{
  data: FloodAlert[]
  source: 'database' | 'mock'
}> {
  return withDatabase(
    () =>
      prisma.$queryRaw<FloodAlert[]>`
        SELECT * FROM flood_alerts ORDER BY created_at DESC
      `,
    [],
  )
}

export async function getMonitoringZones(): Promise<{
  data: MonitoringZone[]
  source: 'database' | 'mock'
}> {
  return withDatabase(
    () =>
      prisma.$queryRaw<MonitoringZone[]>`
        SELECT * FROM monitoring_zones WHERE is_active = true ORDER BY name
      `,
    [],
  )
}
