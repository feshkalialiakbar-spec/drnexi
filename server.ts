import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public/static-landing/index.html')
  const fileContents = await fs.readFile(filePath, 'utf8')

  return new NextResponse(fileContents, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
