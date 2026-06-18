import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)

  return NextResponse.json({
    success: true,
    message: 'TerraSentinel API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: {
      status: hasDatabaseUrl ? 'configured' : 'not_configured',
      connected: hasDatabaseUrl,
    },
    endpoints: [
      'GET /api/sources',
      'GET /api/flood-alerts',
      'GET /api/monitoring-zones',
      'POST /api/save-user',
      'GET /api/health',
    ],
  })
}
