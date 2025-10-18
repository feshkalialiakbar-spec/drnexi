'use client'

import TransactionRowItem from '../TransactionRowItem'
import { ITransactionAll } from '@/services/reports'
import { ArrowLeft2 } from 'iconsax-react'
import { useState } from 'react'
import { useStates } from '@/Context'

const IncomeOutgo = ({
  allTransactions,
  ttype,
  label,
  showTab,
}: {
  allTransactions: ITransactionAll[]
  ttype: 1 | 2
  label: string
  showTab: boolean
}) => {
  const [tab, setTab] = useState<number>(0)
  const { permissions } = useStates()

  return (
    <>
      <div className="rounded-lg bg-primary/5 p-4 mt-10 mb-20">
        <p className="mb-6 sm:mb-8 flex justify-between items-center">
          <span className="font-bold text-primary">{label}</span>
          <button
            className="text-primary !rounded-lg inline-flex items-center gap-1"
            onClick={() =>
              (location.href =
                ttype === 1
                  ? `/wallet/all/income`
                  : ttype === 2
                  ? `/wallet/all/outcome`
                  : `/wallet/all`)
            }
          >
            مشاهده همه
            <ArrowLeft2 size="18" color="#2f27ce" />
          </button>
        </p>
        <div className="max-h-96 overflow-auto">
          {permissions[1]?.includes('712') && showTab && (
            <div className="flex sticky bg-gray-100 top-0 mb-4 sm:mb-6">
              {['واریزی‌ها', 'واریز‌های منقضی شده']?.map((report, index) => (
                <div
                  key={index}
                  className={`flex-1 border-b ${
                    tab === index ? 'border-b-primary' : 'border-b-primary/15'
                  }`}
                >
                  <button
                    className={`w-full flex justify-center !rounded-lg items-center gap-4 !py-3 ${
                      tab === index ? '!text-primary' : '!text-slate-400'
                    }`}
                    onClick={() => {
                      setTab(index)
                    }}
                  >
                    {report}
                  </button>
                </div>
              ))}
            </div>
          )}
          {tab === 1 &&
            allTransactions?.length &&
            allTransactions?.map(
              (item, index) =>
                item.status === 8 && (
                  <TransactionRowItem
                    key={index}
                    hasRecapture={true}
                    user_uid={item?.pan_name || ''}
                    originalAmount={item?.originalAmount || ''}
                    transactionDate_pe={item?.transactionDate_pe || ''}
                    transactionTime={item?.transactionTime || ''}
                    transaction_cost={item?.transaction_cost || ''}
                    amount={item?.amount || ''}
                    pan={item?.pan || ''}
                    remain={''}
                    transaction_code={item.transaction_code || '0'}
                    tstatus={`${item.status}` || ''}
                    description={item.description || ''}
                    wage_cost={item.wage_cost || ''}
                    mobile={item?.mobile || ''}
                    ttype={Number(item?.ttype)}
                    ref_id={item?.ref_id}
                  />
                )
            )}
          {allTransactions?.length ? (
            allTransactions
              .filter((transaction) => transaction.status !== 8)
              .slice(0, 13)
              ?.map(
                (item, index) =>
                  item.status !== 8 &&
                  tab !== 1 && (
                    <TransactionRowItem
                      key={index}
                      user_uid={item?.pan_name || ''}
                      originalAmount={item?.originalAmount || ''}
                      transactionDate_pe={item?.transactionDate_pe || ''}
                      transactionTime={item?.transactionTime || ''}
                      transaction_cost={item?.transaction_cost || ''}
                      amount={item?.amount || ''}
                      pan={item?.pan || ''}
                      remain={''}
                      transaction_code={item.transaction_code || '0'}
                      tstatus={`${item.status}` || ''}
                      description={item.description || ''}
                      wage_cost={item.wage_cost || ''}
                      mobile={item?.mobile || ''}
                      ttype={Number(item?.ttype)}
                    />
                  )
              )
          ) : (
            <p className="text-center">موردی ثبت نشده است.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default IncomeOutgo
