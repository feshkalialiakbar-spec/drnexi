import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = {
      payment_status: request.nextUrl.searchParams.get('payment_status'),
    }
    console.log(params)

    cookies().set('payment-status', JSON.stringify(params.payment_status))
    const redirectUrl = `${
      params.payment_status === '1'
     ?'https://arzeshyar.com/success':
     'https://arzeshyar.com/failed'
      // ? 'https://message-manager.liara.run/#success'
        // : 'https://message-manager.liara.run#unsuccess'
    }`
    return NextResponse.redirect(
      new URL(redirectUrl, process?.env?.NEXT_PUBLIC_APP_URL),
      302
    )
  } catch (err) {
    return NextResponse.json({ message: 'Error', err }, { status: 500 })
  }
}
