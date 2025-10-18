import Image from 'next/image'
import { useAddCommasToNumber } from '@/hooks/useSharedHooks'
import { IReceiptParams } from '@/hooks/useReceipt'
import { ArrowRight, Receipt21, Sort } from 'iconsax-react'

const Receipt = ({
  data,
  setState,
}: {
  data: IReceiptParams
  setState: (state: 0 | 1) => void
}) => {
  const formattedOriginalAmount = useAddCommasToNumber(
    Number(data?.originalAmount)
  )
  const formattedAmount = useAddCommasToNumber(Number(data?.amount))
  const formattedWageCost = useAddCommasToNumber(Number(data?.wage_cost))
  const formattedTransactionCost = useAddCommasToNumber(
    Number(data?.transaction_cost)
  )
  const goToPreviusPage = () => {
    const tag = location.hash.substring(1)
    if (tag === 'deposite') location.href = `/reports#deposite`
    if (tag === 'withdraw') location.href = `/reports#withdraw`
    if (tag === '' || tag === 'payment') location.href = `/wallet`
  }

  return (
    <div className="flex flex-col">
      <button
        className="font-medium text-primary inline-flex items-center gap-2"
        onClick={goToPreviusPage}
      >
        <ArrowRight className="sm:text-lg" />
        {data?.ttype === 1 ? 'واریز به کیف پول' : 'برداشت از کیف پول'}
      </button>
      <div className="grow">
        <div className="text-center mb-7 sm:mb-8">
          <>
            <Image
              src={`${
                ['N', 'undefined', 'null', undefined, null].includes(
                  data?.avatarUrl
                )
                  ? '/images/sample-avatar.jpg'
                  : data?.avatarUrl || '/images/sample-avatar.jpg'
              }`}
              alt={''}
              title={''}
              width={555}
              height={555}
              className="inline-block mb-2 sm:mb-3 rounded-full w-14 h-14 object-cover object-center"
            />
          </>
          <p>{data?.pan_name || data?.user_uid}</p>
          <p
            className={`mb-4 sm:mb-5 text-xl sm:text-2xl 
                ${data?.ttype === 2 ? 'text-slate-600' : 'text-green-600'}
                `}
          >
            <span dir="ltr" className={`font-bold`}>
              {data?.ttype === 2 ? '-' : '+'}
              {Number(data?.originalAmount) > 0
                ? formattedOriginalAmount.split('.')[0]
                : formattedAmount.split('.')[0]}
            </span>
            <small className="ms-1">ریال</small>
          </p>
        </div>

        <ul className=" border-b-2 border-dashed border-zinc-300 pb-7">
          <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
            <span className="text-zinc-500 font-light">وضعیت</span>
            <span
              className="text-zinc-800"
              style={{
                color: `${
                  data?.tstatus === '0'
                    ? data.ttype !== 1
                      ? '#0cad41'
                      : '#B17E1D'
                    : data?.tstatus === '1'
                    ? '#2F27CE'
                    : data?.tstatus === '7'
                    ? '#B17E1D'
                    : ['2', '3'].includes(`${data?.tstatus}`)
                    ? '#D42620'
                    : ['4', '7'].includes(`${data?.tstatus}`) &&
                      data?.ttype !== 1 &&
                      '#3fd951'
                }`,
              }}
            >
              {data?.tstatus === '0'
                ? data?.ttype !== 1
                  ? 'در انتظار تایید بانک'
                  : 'موفق'
                : data?.tstatus === '1'
                ? 'تسویه شده'
                : data?.tstatus === '2'
                ? 'لغو شده'
                : data?.tstatus === '3'
                ? 'حذف شده'
                : ['4', '7'].includes(`${data?.tstatus}`) && data?.ttype === 1
                ? 'در انتظار واریز  '
                : 'در انتظار برداشت '}
            </span>
          </li>

          <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
            <span className="text-zinc-500 font-light">
              {data?.ttype === 1
                ? 'مبلغ واریزی به کیف پول'
                : 'مبلغ برداشتی از کیف پول'}
            </span>
            <span className="text-zinc-800">
              {/* data?.ttype === 1 ? formattedOriginalAmount :  */}
              {formattedAmount}
              <small>ریال</small>
            </span>
          </li>

          <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200  last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
            <span className="text-zinc-500 font-light">کارمزد بانک</span>
            <span className="text-zinc-800">
              {formattedTransactionCost || 0}
              <small>ریال</small>
            </span>
          </li>
          {data?.ttype === 1 && (
            <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
              <span className="text-zinc-500 font-light">شناسه پرداخت</span>
              <span className="text-zinc-800">
                {data?.transaction_code || ''}
              </span>
            </li>
          )}
          <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
            <span className="text-zinc-500 font-light">زمان</span>
            <span className="text-zinc-800">
              {data?.transactionDate_pe || ''}
            </span>
          </li>
          {data?.transactionTime && (
            <li className="flex items-center justify-between pb-2 mb-3 border-b border-b-zinc-200 last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
              <span className="text-zinc-500 font-light">ساعت تراکنش</span>
              <span className="text-zinc-800">
                {data?.transactionTime || ''}
              </span>
            </li>
          )}
          <li className="flex items-center justify-between pb-2 mb-3  last-of-type:pb-0 last-of-type:mb-0 last-of-type:border-b-0">
            <span className="text-zinc-500 font-light">کارمزد خدمات</span>
            <span className="text-zinc-800">
              {formattedWageCost || 0}
              <small>ریال</small>
            </span>
          </li>
        </ul>
        <div className="!text-primary font-bold mt-5">شرح تراکنش</div>
        <div className="mt-5">{data?.description}</div>
      </div>
      <button
        className="!text-primary flex justify-center h-10 items-center rounded my-5 !border-primary  w-full  border-button"
        onClick={() => setState(1)}
      >
        <p>{data?.ttype === 1 ? <Sort /> : <Receipt21 />}</p>
        <p>{data?.ttype === 1 ? 'جزئیات واریز' : 'رسید برداشت'}</p>
      </button>
    </div>
  )
}

export default Receipt
