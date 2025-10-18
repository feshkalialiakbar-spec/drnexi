import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const logFilePath = path.join(process.cwd(), 'logs', 'logs.json')

function toCSV(logs: any[]) {
  const header = [
    'timestamp',
    'url',
    'method',
    'status',
    'request_body',
    'response',
  ]
  const rows = logs.map((log) => [
    log.timestamp,
    log.url,
    log.method,
    log.status,
    JSON.stringify(log.request.body),
    JSON.stringify(log.response),
  ])

  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  return csv
}

export async function GET(req: NextRequest) {
  try {
    const start = req.nextUrl.searchParams.get('start')
    const end = req.nextUrl.searchParams.get('end')

    if (!start || !end) {
      return NextResponse.json(
        { error: 'start and end query params are required' },
        { status: 400 }
      )
    }

    const logs = fs.existsSync(logFilePath)
      ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8'))
      : []

    const filteredLogs = logs.filter((log: any) => {
      const date = new Date(log.timestamp)
      return date >= new Date(start) && date <= new Date(end)
    })

    const csv = toCSV(filteredLogs)

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="logs-${
          (new Date(), 'yyyyMMdd-HHmmss')
        }.csv"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
