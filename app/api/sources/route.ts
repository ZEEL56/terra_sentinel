import { getSatelliteSources } from '@/lib/dashboard-db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const { data, source } = await getSatelliteSources()

  return NextResponse.json({
    success: true,
    data,
    message: `Successfully fetched satellite sources (from ${source})`,
  })
}
