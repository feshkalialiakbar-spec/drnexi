import { numberToWords } from '@persian-tools/persian-tools'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const value = request.nextUrl.searchParams.get('value')
    if (value) {
      const tomanValue = Math.floor(parseInt(value) / 10)
      const tomanText =
        Number.isSafeInteger(tomanValue) && tomanValue > 0
          ? numberToWords(tomanValue)
          : ''
      return NextResponse.json({ tomanText })
    } else {
      return NextResponse.json({ tomanText: '' })
    }
  } catch (err) {
    return NextResponse.json({ message: 'Error', err }, { status: 500 })
  }
}
