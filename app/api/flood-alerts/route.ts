import { getFloodAlerts } from '@/lib/dashboard-db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const { data, source } = await getFloodAlerts()

  return NextResponse.json({
    success: true,
    data,
    message: `Successfully fetched flood alerts (from ${source})`,
  })
}
