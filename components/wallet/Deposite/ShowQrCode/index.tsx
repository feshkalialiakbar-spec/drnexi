'use client'

import { useToggleDepositForm } from '@/hooks/useWalletHooks'
import QRCode from 'react-qr-code'
import { useAddCommasToNumber } from '@/hooks/useSharedHooks'
import {
  useDepositInformation,
  usePaymentLinkData,
} from '@/hooks/useDepositHooks'
import { useCallback, useEffect, useState } from 'react'
import SendLinkModal from '../SendLinkModal'
import { ArrowRight2 } from 'iconsax-react'
import { SendSMS } from '@/services/sendSMS'
import { callLogAPI } from '@/app/api/logproxy/callLog'
import { getAllCookies, getCookieByKey } from '@/actions/cookieToken'
import { CreateVisit } from '@/services/deposit'

const DepositShowQrCode = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [QR, setQR] = useState<string>('')
  const { setShowDepositForm } = useToggleDepositForm()
  const { paymentLinkData: paymentData } = usePaymentLinkData()
  const { depositInformation: depositData } = useDepositInformation()
  const [sent, setSent] = useState<boolean>()
  const sendLink = async () => {
    if (!sent) return
    setSent(true)
    const fullPaymentUrl = `${process.env.NEXT_PUBLIC_SMS_URL}/pay?order_id=${depositData?.order_id}`
    try {
      const res = await CreateVisit({
        pay_id: fullPaymentUrl,
        accessToken: (await getCookieByKey('access_token')) || '',
        order_id: depositData?.order_id || '',
      })
      const shortUrl = res?.data?.short_url || fullPaymentUrl
      setQR(shortUrl)
      await SendSMS(
        `${depositData?.mobile}`,
        `${shortUrl}`,
        `${depositData?.cust_name}`
      )
    } catch (err) {
      // Fallback to full URL if shortener fails
      setQR(fullPaymentUrl)
      await SendSMS(
        `${depositData?.mobile}`,
        `${fullPaymentUrl}`,
        `${depositData?.cust_name}`
      )
    }
    await callLogAPI({
      message: `new request in wallet for deposit sent SMS SECOND-FORM_
data: ${JSON.stringify(depositData)}
user: ${JSON.stringify(await getAllCookies())}`,
      type: 'info',
      filekoin: 'depositformero',
    })

    setShowModal(true)
  }
  const fetchPaymentLink = useCallback(async () => {
    setQR(
      `${process.env.NEXT_PUBLIC_SMS_URL}/api/payment?order_id=${depositData?.order_id}`
      // `${process.env.NEXT_PUBLIC_SMS_URL}/api/payment?order_id=${depositData?.order_id}`
    )
  }, [depositData])
  useEffect(() => {
    fetchPaymentLink()
  }, [fetchPaymentLink])
  return (
    <>
      <button
        className="!font-medium !text-primary !inline-flex !items-center !gap-2 !mb-4 lg:!mb-6 !rounded-lg"
        onClick={() => setShowDepositForm(true)}
      >
        <ArrowRight2 size="24" color="#2f27ce" />
        واریز
      </button>
      <ul className="mb-8 sm:mb-10">
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">مبلغ</span>
          <span className="text-slate-900">
            {useAddCommasToNumber(depositData?.amount as number) || ''}
            <small>ریال</small>
          </span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">شماره موبایل</span>
          <span className="text-slate-900">{depositData?.mobile || ''}</span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">نام و نام خانوادگی</span>
          <span className="text-slate-900">{depositData?.cust_name || ''}</span>
        </li>
        <li className="flex items-center justify-between border-b border-b-slate-200 pb-3 mb-4 last-of-type:border-b-0">
          <span className="text-slate-500 font-light">شرح</span>
          <span className="text-slate-900">
            {depositData?.description || ''}
          </span>
        </li>
      </ul>

      <div className="flex items-center justify-center mb-12 sm:mb-14">
        <QRCode value={QR} size={220} bgColor="#ffffff" fgColor="#2F27CE" />
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex-1" onClick={sendLink}>
          <button className="w-full h-10 rounded bg-[#0CAD41] text-[#ffffff]">
            ارسال لینک واریز
          </button>
        </div>
        {paymentData?.payment_url && (
          <div className="flex-1">
            <button
              onClick={async () => {
                await callLogAPI({
                  message: ` new request in wallet for deposit redirected to paypage _FIRST-FORM_\n  
data: ${JSON.stringify(paymentData)}
user: ${JSON.stringify(await getAllCookies())}`,
                  type: 'info',
                  filekoin: 'depositformero',
                })

                window.location.href = `${process.env.NEXT_PUBLIC_SMS_URL}/pay?order_id=${depositData?.order_id}`
              }}
              className="w-full  h-10 rounded border border-[#0CAD41] text-[#0CAD41]"
            >
              ورود به درگاه پرداخت
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <SendLinkModal
          showModal={showModal}
          setShowModal={setShowModal}
          mobile={depositData?.mobile || ''}
        />
      )}
    </>
  )
}

export default DepositShowQrCode
