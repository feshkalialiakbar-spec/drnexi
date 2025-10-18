import fs from 'fs'
import path from 'path'

const ONE_GB_IN_BYTES = 1024 * 1024 * 1024
const SIZE_CHECK_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour
let lastSizeAlertAt = 0

function formatDateYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function flattenObject(obj: any, parentKey = '', result: any = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}_${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, fullKey, result)
    } else {
      result[fullKey] = value
    }
  }
  return result
}

function toCSVRow(obj: Record<string, any>, orderedKeys: string[]): string {
  return orderedKeys
    .map((key) => {
      const value = obj[key]
      const stringified =
        typeof value === 'string' ? value : value == null ? '' : JSON.stringify(value)
      const sanitized = String(stringified)
        .replace(/[\r\n]+/g, ' ') // single-line
        .replace(/\s+/g, ' ') // collapse whitespace
      return `"${sanitized.replace(/"/g, '""')}"`
    })
    .join(',')
}

function normalizeCsvFileName(inputName: string | undefined | null): string {
  const fallback = 'application.log.csv'
  if (!inputName || typeof inputName !== 'string') return fallback
  const trimmed = inputName.trim()
  if (!trimmed) return fallback
  // remove directory separators to avoid path traversal and ensure a flat logs dir
  const safe = trimmed.replace(/[\\/]/g, '')
  // ensure single .csv extension
  const withoutCsv = safe.replace(/\.csv$/i, '')
  return `${withoutCsv}.csv`
}

function buildDatedFileName(baseCsvName: string): string {
  const withoutCsv = baseCsvName.replace(/\.csv$/i, '')
  const today = formatDateYYYYMMDD(new Date())
  return `${withoutCsv}-${today}.csv`
}

function getDirectorySizeBytes(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0
  let total = 0
  for (const entry of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, entry)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      total += getDirectorySizeBytes(full)
    } else if (stat.isFile()) {
      total += stat.size
    }
  }
  return total
}

async function triggerSizeWebhook(totalBytes: number) {
  try {
    const webhookUrl = process.env.LOGS_SIZE_WEBHOOK_URL
    if (!webhookUrl) return
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'logs_folder_threshold_exceeded',
        totalBytes,
        totalGB: Number((totalBytes / ONE_GB_IN_BYTES).toFixed(3)),
        hostname: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'unknown',
        ts: new Date().toISOString(),
      }),
    })
  } catch (err: any) {
    console.error('[×] logs size webhook error:', err.message)
  }
}

async function checkLogsFolderSizeAndAlert(logsDir: string) {
  try {
    const now = Date.now()
    if (now - lastSizeAlertAt < SIZE_CHECK_COOLDOWN_MS) return
    const totalBytes = getDirectorySizeBytes(logsDir)
    if (totalBytes > ONE_GB_IN_BYTES) {
      lastSizeAlertAt = now
      console.warn('[!] logs folder exceeded 1GB. Triggering webhook...')
      await triggerSizeWebhook(totalBytes)
    }
  } catch (err: any) {
    console.error('[×] logs size check error:', err.message)
  }
}

export async function saveLogCSV(log: any, fileName: string) {
  try {
    const normalized = normalizeCsvFileName(fileName)
    const datedName = buildDatedFileName(normalized)
    const logsDir = path.join(process.cwd(), 'logs')
    const logFilePath = path.join(logsDir, datedName)

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      console.log('[+] logs directory created at:', logsDir)
    }

    const flatLog = flattenObject(log)
    const headerKeys = Object.keys(flatLog)
    const headers = headerKeys.join(',')
    const row = toCSVRow(flatLog, headerKeys)

    const isNewFile = !fs.existsSync(logFilePath)
    const csvContent = isNewFile ? `${headers}\n${row}\n` : `${row}\n`

    fs.appendFileSync(logFilePath, csvContent, 'utf-8')
    console.info('[✔] CSV log saved:', datedName)

    // background size check with cooldown
    // fire and forget; no await to avoid blocking hot paths
    // but we still catch inside the function
    checkLogsFolderSizeAndAlert(logsDir)
  } catch (err: any) {
    console.error('[×] CSV log save error:', err.message)
  }
}
