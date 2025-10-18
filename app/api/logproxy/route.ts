import { NextRequest, NextResponse } from 'next/server'
import { saveLogCSV } from '@/utils/Logger'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const {
      log,
      type = 'info',
      timestamp = new Date().toISOString(),
      filekoin,
    } = await req.json()
    let normalizedLog: any = log
    if (typeof normalizedLog === 'string') {
      const trimmed = normalizedLog.trim()
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          normalizedLog = JSON.parse(trimmed)
        } catch {
          // keep as string if not valid JSON
        }
      }
    }
    const logEntry = {
      timestamp,
      type,
      log: normalizedLog,
    }
    // keep server logs clean and single-line
    const preview = JSON.stringify(logEntry).slice(0, 300)
    console.log('📥 Incoming log:', preview)
    // normalize filename on server side as well; async write
    await saveLogCSV(logEntry, filekoin)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('logproxy POST error:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
