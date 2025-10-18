import { NextRequest, NextResponse } from 'next/server'
import { callLogAPI } from '../logproxy/callLog'
export async function GET(req: NextRequest) {
  try {
    const params = {
      status: req.nextUrl.searchParams.get('status') || '',
      order_id: req.nextUrl.searchParams.get('order_id') || '',
      ref_num: req.nextUrl.searchParams.get('ref_num') || '',
      transaction_id: req.nextUrl.searchParams.get('transaction_id') || '',
      card_number: req.nextUrl.searchParams.get('card_number') || '',
      tracking_code: req.nextUrl.searchParams.get('tracking_code') || '',
    }
    console.info('my received params in api paymay getoghli')
    console.table(params)
    console.warn('_ '.repeat(30)) 
    await callLogAPI({ 
      message: `orderId = ${ 
        params.order_id 
      } my received params in api paymay getoghli \n ${JSON.stringify(params)}`,
      type: 'info',
      filekoin: 'verifyResult.csv',
    })
    if (!params.order_id || !params.status) {
      return NextResponse.json(
        {
          error: 'Missing required fields:!params.order_id || !params.status  ',
        },
        { status: 400 }
      )
    }
    const backRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pardakhtpayment?status=${params.status}&order_id=${params.order_id}&ref_num=${params.ref_num}&tracking_code=${params.tracking_code}&card_number=${params.card_number}`,
      //  '${process.env.NEXT_PUBLIC_API_URL}http://212.23.201.146:5702/pardakhtpayment?status=2&order_id=test'
      // `${process.env.NEXT_PUBLIC_API_URL}/pardakhtpayment?status=${params.status}&order_id=${params.order_id}&ref_num=${params.ref_num}&tracking_code=${params.tracking_code}&card_number=${params.card_number}`,
      // `${process.env.NEXT_PUBLIC_API_URL}/pardakhtpayment?status=${params.status}&order_id=${params.order_id}&ref_num=${params.ref_num}&tracking_code=${params.tracking_code}&card_number=${params.card_number}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
    const backResponse = await backRes.json()
    console.info('back response in pardakhtpayment - api callback - pay apiese')
    console.table(backResponse)
    console.warn('_ '.repeat(30))
    await callLogAPI({
      message: `orderId = ${
        params.order_id
      } back response in pardakhtpayment api callback pay apiese \n ${JSON.stringify(
        backResponse
      )}`,
      type: 'info',
      filekoin: 'pardakhtpayment.csv',
    })
   
    const paystarRes = await fetch(
      'https://core.paystar.ir/api/pardakht/verify',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${backResponse.gateway_id.trim()}`,
          'Content-Type': 'application/json',
          referer_host: 'https://arzeshyar.com',
        },
        body: JSON.stringify({
          amount: backResponse.amount,
          ref_num: backResponse.ref_num,
          sign: backResponse.sign,
        }),
      }
    )
    const verifyResult = await paystarRes.json()
    console.info(
      'verifyResult response in paystar - api callback - pardakht/verify apiese'
    )
    console.table(verifyResult)
    console.warn('_ '.repeat(30))
    await callLogAPI({
      message: `verifyResult response in paystar - api callback - pardakht/verify apiese  \n ${JSON.stringify(
        verifyResult
      )}`,
      type: 'info',
      filekoin: 'verifyResult.csv',
    })
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pardakhtpayment_result?vstatus=${verifyResult.status}&order_id=${backResponse.order_id}&vref_num=${backResponse.ref_num}&vmessage=N`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then(async (result) => {
      console.info(
        'back response in pardakhtpayment_result - api callback - pay apiese'
      )
      console.table(result)
      console.warn('_ '.repeat(30))
      await callLogAPI({
        message: `orderId = ${
          params.order_id
        } back response in pardakhtpayment_result - api callback - pay apiese \n ${JSON.stringify(
          result
        )}`,
        type: 'info',
        filekoin: 'pardakhtpayment_result.csv',
      })
    })

    return NextResponse.redirect(
      new URL(
        `/api/get-receipt?payment_status=${verifyResult.status}`,
        process?.env?.NEXT_PUBLIC_APP_URL
      ),
      302
    )
  } catch (err) {
    console.error('back Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      amount,
      order_id,
      callback,
      sign,
      gateway_id,
      callback_method,
      name,
      phone,
      mail,
      description,
      wallet_hashid,
      national_code,
      card_number,
    } = body

    console.info(
      'body of request  in  club/api - postoghlo in paymay - create api '
    )
    console.table(body)
    console.warn('_ '.repeat(30))
    await callLogAPI({
      message: `order_id = ${order_id} body of request  in  club/api - postoghlo in paymay - create api  \n ${JSON.stringify(
        body
      )}`,
      type: 'info',
      filekoin: 'create-ipg.csv',
    })

    if (!gateway_id) {
      return NextResponse.json(
        { message: 'گیت وی موجود نیست' },
        { status: 400 }
      )
    }

    if (!amount || !order_id || !callback || !sign) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: amount, order_id, callback, sign_key',
        },
        { status: 400 }
      )
    }

    const paystarRes = await fetch(
      'https://core.paystar.ir/api/pardakht/create',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${gateway_id.trim()}`,
          'Content-Type': 'application/json',
          referer_host: 'https://arzeshyar.com',
        },
        body: JSON.stringify({
          amount,
          order_id,
          callback,
          sign,
          gateway_id,
          callback_method,
          name,
          phone,
          mail,
          description,
          wallet_hashid,
          national_code,
          card_number,
        }),
      }
    )
    const paystarResult = await paystarRes.json()
    console.log(paystarRes)
    console.info(
      'back response in api/pardakht/create  - postoghlo in paymay - pay apiese'
    )
    console.table(paystarResult)
    console.warn('_ '.repeat(30))
    await callLogAPI({
      message: `order_id = ${order_id} back response in pardakhtpayment_result - api callback - pay apiese \n ${JSON.stringify(
        paystarResult
      )}`,
      type: 'info',
      filekoin: 'create-ipg.csv.csv',
    })

    return NextResponse.json(paystarResult)
  } catch (err) {
    console.error('Paystar Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
