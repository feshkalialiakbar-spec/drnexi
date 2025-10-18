import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
const logFilePath = path.join(process.cwd(), 'logs', 'logs.json')
function saveLog(log: any) {
  try {
    const logsDir = path.dirname(logFilePath)

    // اطمینان از وجود پوشه logs
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      console.log('[+] logs directory created at:', logsDir)
    }

    // اگر فایل وجود دارد بخوان، وگرنه آرایه خالی
    const logs = fs.existsSync(logFilePath)
      ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8') || '[]')
      : []

    // اضافه کردن لاگ جدید
    logs.push(log)

    // ذخیره لاگ‌ها در فایل
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8')

    console.info('[✔] Log saved successfully.')
  } catch (err: any) {
    console.error('[×] Error while saving log:', err.message)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, method = 'POST', body = {}, headers = {} } = await req.json()

    const res = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    })

    const responseData = await res.json()

    const logData = {
      timestamp: new Date().toISOString(),
      url,
      method,
      request: {
        headers,
        body,
      },
      response: responseData,
      status: res.status,
    }

    saveLog(logData)

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
export const dynamic = 'force-dynamic'
