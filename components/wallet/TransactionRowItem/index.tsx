'use client'

import { setCookieByTagAndValue } from '@/actions/cookieToken'
import { useStates } from '@/Context'
import { getAccessToken } from '@/hooks/getAccessToken'
import {
  useDepositInformation,
  usePaymentLinkData,
} from '@/hooks/useDepositHooks'
import { IReceiptParams, useKeepReceiptData } from '@/hooks/useReceipt'
import { useAddCommasToNumber } from '@/hooks/useSharedHooks'
import { useToggleDepositForm } from '@/hooks/useWalletHooks'
import { CreateNewIPG } from '@/services/deposit'
import { ReceiveSquare, Refresh, TransmitSquare } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

const TransactionRowItem = ({
  amount,
  originalAmount,
  pan,
  pan_name,
  remain,
  transactionDate_pe,
  transactionTime,
  tstatus,
  user_uid,
  wage_cost,
  description,
  ttype,
  transaction_cost,
  transaction_code,
  mobile,
  hasRecapture = false,
  ref_id,
}: IReceiptParams) => {
  const router = useRouter()
  const { setReceiptData } = useKeepReceiptData()
  const { setDepositInformation } = useDepositInformation()
  const { setShowDepositForm } = useToggleDepositForm()
  const { setPaymentLinkData } = usePaymentLinkData()
  const { permissions } = useStates()
  const saveReceiptDataHandler = async () => {
    // if (!permissions[1]?.includes('721')) return
    if (!permissions[1]?.includes('717')) return
    setReceiptData({
      amount,
      originalAmount,
      pan,
      remain,
      transaction_cost,
      transactionDate_pe,
      transactionTime,
      tstatus,
      user_uid,
      wage_cost,
      description,
      ttype,
      transaction_code,
    })
    if (location.hash.substring(1) === 'deposite') {
      router.push(`/receipt#deposite`)
    } else if (location.hash.substring(1) === 'withdraw') {
      router.push(`/receipt#withdraw`)
    } else if (location.hash.substring(1) === 'charging') {
      router.push(`/receipt#charging`)
    } else if (location.hash.substring(1) === 'recent') {
      router.push(`/receipt#recent`)
    } else {
      router.push(`/receipt`)
    }
  }

  const ReCaptureLink = async (
    mobile: string,
    cust_name: string,
    amount: number,
    description: string,
    ref_id: string
  ) => {
    toast.success('در حال ایجاد درخواست واریز مجدد ...')
    const order_id = uuidv4()
    const accessToken = (await getAccessToken()) || ''
    setDepositInformation({
      mobile,
      cust_name,
      amount,
      order_id,
      description,
    })
    setShowDepositForm(false)
    const response = await CreateNewIPG({
      data: {
        mobile,
        cust_name,
        amount,
        description,
        order_id,
        ref_order_id: ref_id,
      },
      accessToken,
    })
    if (response?.status === '-1' && typeof response.message === 'string') {
      toast.error(`${response?.message}`)
      return
    }
    if (!response) {
      toast.error('مشکلی پیش آمد! لطفا دوباره تلاش کنید.')
      return
    }
    if (response.status === '1' && response.payment_url) {
      setCookieByTagAndValue({
        key: 'deposit-amount',
        value: String(response.payment_amount),
      })
      setCookieByTagAndValue({
        key: 'deposit-token',
        value: response.token,
      })
      setPaymentLinkData(response)
      router.push(`/wallet/deposit#recaptur`)
    }
  }

  return (
    <div className='flex items-center max-md:text-[12px] overflow-hidden my-2'>
      <button
        className='!flex !w-full !items-center !justify-between !last-of-type:mb-0 !rounded-lg'
        onClick={saveReceiptDataHandler}
      >
        <div className='flex gap-3 '>
          {!hasRecapture && (
            <span
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                ttype === 1
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {ttype === 1 ? (
                <ReceiveSquare size='22' />
              ) : (
                <TransmitSquare size='22' />
              )}
            </span>
          )}
          <div className='text-start'>
            <div className='flex items-center mb-2'>
              <p className='block text-zinc-800 text-nowrap'>
                {user_uid !== 'N' ? user_uid : 'پورسانت'}
              </p>
              <span
                className={`ms-2 py-[0.1rem] rounded-md px-2 text-[10px] font-light text-nowrap ${
                  tstatus === '0'
                    ? ttype === 1
                      ? 'bg-green-200 text-green-800'
                      : 'bg-green-200 text-green-700'
                    : tstatus === '7'
                    ? 'bg-yellow-200 text-yellow-800'
                    : tstatus === '1'
                    ? 'bg-blue-200 text-blue-800'
                    : ['3', '2', '8', '87'].includes(`${tstatus}`) &&
                      'bg-red-200 text-red-800'
                }`}
              >
                {tstatus === '0'
                  ? ttype === 1
                    ? 'موفق'
                    : 'در انتظار تایید بانک'
                  : ['4', '7'].includes(`${tstatus}`)
                  ? ` در انتظار${ttype === 1 ? ' واریز ' : ' برداشت '}`
                  : tstatus === '1'
                  ? 'تسویه شده'
                  : tstatus === '2'
                  ? 'لغو شده'
                  : tstatus === '3'
                  ? 'حذف شده'
                  : ['8', '87'].includes(`${tstatus}`) && 'منقضی شده'}
              </span>
            </div>
            <p className='block text-xs text-zinc-600 font-light'>
              <span dir='ltr'>
                {transactionDate_pe} | {transactionTime}
              </span>
            </p>
          </div>
        </div>
      </button>

      <div className='flex gap-4  items-center justify-center'>
        <p className={`text-zinc-700 `}>
          <span
            dir='ltr'
            className={`font-medium ${
              ttype === 2 ? 'text-red-500' : 'text-green-600'
            }`}
          >
            {ttype === 1 ? '+' : '-'}
            {useAddCommasToNumber(Math.abs(parseInt(`${originalAmount}`)))}
          </span>
          <small
            className={`ms-1 ${
              ttype === 2 ? 'text-red-500' : 'text-green-600'
            }`}
          >
            ریال
          </small>
        </p>
        {tstatus === '8' && hasRecapture && (
          <div
            onClick={() =>
              ReCaptureLink(
                `${mobile}`,
                `${user_uid}`,
                parseInt(`${originalAmount}`),
                `${description}`,
                `${ref_id}`
              )
            }
            className='text-nowrap flex justify-center items-center rounded-lg p-1 cursor-pointer'
            // className='w-[32px] h-[32px] bg-[#2F27CE] text-white flex justify-center items-center rounded-lg p-1 cursor-pointer'
          >
            <p className='bg-primary text-white max-md:text-[10px] p-1 rounded-lg'>
              ارسال مجدد
            </p>
            {/* <Refresh size={'100%'} /> */}
          </div>
        )}
      </div>
    </div>
  )
}
export default TransactionRowItem
