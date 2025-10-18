import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { gateway_id, amount, ref_num, sign } = body

    if (!gateway_id) {
      return NextResponse.json(
        { message: 'گیت وی موجود نیست' },
        { status: 400 }
      )
    }

    if (!amount || !gateway_id || !sign) {
      return NextResponse.json(
        {
          error: 'Missing required fields: amount,   gateway_id ||  sign',
        },
        { status: 400 }
      )
    }
    console.warn('body-mody-new-mew-request')
    console.table(body)
    const paystarRes = await fetch(
      'https://core.paystar.ir/api/pardakht/verify',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${gateway_id.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          ref_num,
          sign,
        }),
      }
    )
    const verifyResult = await paystarRes.json()
    console.warn('paysstaresponsooooosoooooosoooos')
    console.table(verifyResult)
    return NextResponse.redirect(
      new URL(
        `/api/get-receipt?payment_status=${verifyResult.status}`,
        process?.env?.NEXT_PUBLIC_APP_URL
      ),
      302
    )
  } catch (err) {
    console.error('Paystar Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

