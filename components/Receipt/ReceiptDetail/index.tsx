'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAddCommasToNumber } from '@/hooks/useSharedHooks'
import { IReceiptParams } from '@/hooks/useReceipt'
import toast, { CheckmarkIcon } from 'react-hot-toast'
import {
  ArrowRight,
  CloseCircle,
  ExportCurve,
  InfoCircle,
  MinusCirlce,
  TickCircle,
} from 'iconsax-react'

const ReceiptDetail = ({
  data,
  setState,
}: {
  data: IReceiptParams
  setState: (state: 0 | 1) => void
}) => {
  const formattedAmount = useAddCommasToNumber(Number(data?.amount))
  const formattedOriginalAmount = useAddCommasToNumber(
    Number(data?.originalAmount)
  )
  const formattedRemain = useAddCommasToNumber(Number(data?.remain))
  const formattedWageCost = useAddCommasToNumber(Number(data?.wage_cost))

  const [html2canvasLoaded, setHtml2canvasLoaded] = useState(false)
  const handleShare = async () => {
    if (!html2canvasLoaded) {
      const html2canvas = await import('html2canvas')
      setHtml2canvasLoaded(true)

      const element = document.getElementById('capture')
      if (!element) {
        console.error('Element to capture not found.')
        return
      }
      document.getElementById('status')?.classList.add('pb-5')
      const canvas = await html2canvas.default(element)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create Blob from canvas.')
          return
        }

        if (navigator.share) {
          try {
            const file = new File([blob], 'receipt.png', { type: 'image/png' })

            await navigator.share({
              files: [file],
              title: 'رسید تراکنش',
              text: 'رسید تراکنش',
            })
            setHtml2canvasLoaded(false)
            // console.log('Receipt shared successfully');
          } catch (error) {
            setHtml2canvasLoaded(false)
            console.error('Error sharing receipt:', error)
          }
        } else {
          const file = new File([blob], 'receipt.png', { type: 'image/png' })
          const link = document.createElement('a')

          link.href = URL.createObjectURL(file)
          link.download = `${data?.transactionTime}.png`

          link.click()

          URL.revokeObjectURL(link.href)
          toast.error('دستگاه شما از قابلیت اشتراک گذاری پشتیبانی نمی‌کند.')
        }
      })
      document.getElementById('status')?.classList.remove('pb-5')
    }
  }

  return (
    <div className='flex flex-col'>
      <button
        className='font-medium text-primary inline-flex items-center gap-2'
        onClick={() => setState(0)}>
        <ArrowRight className='sm:text-lg' />
        {data?.ttype === 1 ? 'جزئیات واریز' : 'رسید برداشت'}
      </button>

      <div className='grow p-5' id='capture'>
        <div className='text-center border-b-2 border-dashed border-zinc-300 mb-7 sm:mb-8'>
          {data?.user_uid && (
            <>
              <Image
                src={`${
                  ['N', 'undefined', 'null', undefined, null].includes(
                    data?.avatarUrl
                  )
                    ? '/images/sample-avatar.jpg'
                    : data?.avatarUrl || '/images/sample-avatar.jpg'
                }`}
                alt={data?.user_uid || ''}
                title={data?.user_uid || ''}
                width={55}
                height={55}
                className='inline-block mb-2 sm:mb-3 rounded-full w-14 h-14 object-cover object-center'
              />
              <p className='text-zinc-800 mb-1'>{data?.user_uid || ''}</p>
              <p className='mb-2 text-zinc-500 font-light' dir='ltr'>
                {data?.withdrawal_address ||
                  (data?.pan !== 'N' &&
                    String(data?.pan).replace(/(\d{4})(?=\d)/g, '$1 '))}
              </p>
            </>
          )}
          <div className='flex w-full justify-center'>
            {data?.tstatus && (
              <div
                className={`flex justify-center w-fit px-4 py-1 rounded-md text-white mb-2 ${
                  data?.tstatus === '7'
                    ? 'bg-yellow-600'
                    : data?.tstatus === '0'
                    ? 'bg-green-600'
                    : data?.tstatus === '1'
                    ? data.ttype === 2
                      ? 'bg-blue-600'
                      : 'bg-yellow-600'
                    : ['2', '3'].includes(`${data?.tstatus}`) && 'bg-red-600'
                }`}>
                {['4', '7'].includes(`${data?.tstatus}`) ? (
                  <div className='flex items-center px-7 h-10 gap-2'>
                    <InfoCircle className='' />
                    <p id='status'>
                      {data.ttype === 1
                        ? ' واریز ' + '  در انتظار'
                        : '  برداشت '}
                    </p>
                  </div>
                ) : data?.tstatus === '0' ? (
                  <div className='flex items-center px-7 h-10 justify-center gap-5'>
                    <TickCircle className='' />
                    <p id='status'>موفق</p>
                  </div>
                ) : data?.tstatus === '1' ? (
                  <div className='flex items-center w- px-720 1ustify-center gap-5'>
                    <CheckmarkIcon className='' />
                    <p id='status'>تسویه شده</p>
                  </div>
                ) : data?.tstatus === '3' ? (
                  <div className='flex items-center  px-7h-21 justify-center gap-5'>
                    <CloseCircle className='' />
                    <p id='status'>حذف شده</p>
                  </div>
                ) : (
                  data?.tstatus === '2' && (
                    <div className='flex items-center  px-7h-21 justify-center gap-5'>
                      <MinusCirlce className='' />
                      <p id='status'>لغو شده</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {data?.amount && (
            <p
              className={`mb-4 sm:mb-5 text-xl sm:text-2xl ${
                data?.ttype === 1 ? 'text-green-600' : 'text-slate-600'
              }`}>
              {/* <span dir='ltr' className='font-bold'>{useAddCommasToNumber(Number(amount))}</span> */}
              <span dir='ltr' className={`font-bold`}>
                {formattedOriginalAmount}
              </span>
              <small className='ms-1'>ریال</small>
            </p>
          )}
        </div>

        <ul>
          <li className='flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
            <span className='text-zinc-500 font-light'>
              {data?.ttype === 1
                ? 'مبلغ واریزی به کیف پول'
                : 'مبلغ برداشتی از کیف پول'}
            </span>
            {/* <span className='text-zinc-800'>{useAddCommasToNumber(Number(amount.split('.')[0])) || ""} <small>ریال</small></span> */}
            <span className='text-zinc-800'>
              {data?.ttype === 2 ? formattedOriginalAmount : formattedAmount}
              <small>ریال</small>
            </span>
          </li>
          {data?.remain && (
            <li className='flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
              <span className='text-zinc-500 font-light'>
                موجودی بعد از تراکنش
              </span>
              {/* <span className='text-zinc-800'>{useAddCommasToNumber(Number(remain.split('.')[0])) || ""} <small>ریال</small></span> */}
              <span className='text-zinc-800'>
                {formattedRemain || ''} <small>ریال</small>
              </span>
            </li>
          )}
          <li className='flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
            <span className='text-zinc-500 font-light'>شماره کارت/شبا</span>
            <span className='text-zinc-800'>
              {data?.withdrawal_address || (data?.pan !== 'N' && data?.pan)}
            </span>
          </li>
          <li className='flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
            <span className='text-zinc-500 font-light'>کدپیگیری</span>
            <span className='text-zinc-800'>
              {data?.transaction_code || ''}
            </span>
          </li>
          {data?.ttype === 1 && (
            <li className='flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
              <span className='text-zinc-500 font-light'>هزینه کارمزد</span>
              <span className='text-zinc-800'>
                {formattedWageCost || 0} <small>ریال</small>
              </span>
            </li>
          )}{' '}
          <li className='flex items-center justify-between pb-2 mb-3  last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0'>
            <span className='text-zinc-500 font-light'>زمان</span>
            <span className='text-zinc-800'>
              {data?.transactionDate_pe || ''} {data?.transactionTime || ''}
            </span>
          </li>
        </ul>
      </div>

      <button
        className='!text-primary flex justify-center h-10 items-center rounded my-5 !border-primary  w-full  border-button'
        onClick={handleShare}>
        <ExportCurve className='me-2' />
        اشتراک گذاری
      </button>
    </div>
  )
}

export default ReceiptDetail
