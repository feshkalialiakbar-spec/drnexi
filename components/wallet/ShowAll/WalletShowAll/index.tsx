'use client'
import FilterReportsModal from '../FilterReportsModal'
import { useEffect, useState } from 'react'
import { ITransactionAll } from '@/services/reports'
import { ArrowRight2, Filter } from 'iconsax-react'
import ExcelGenerator from '@/components/shared/GenerateExcel'
import Reports from '@/components/Reports/Reports'
import { useStates } from '@/Context'

const WalletShowAll = ({
  transactions,
  setData,
}: {
  transactions: ITransactionAll[]
  setData: (data: ITransactionAll[]) => void
}) => {
  const [generateExcelData, setGenerateExcelData] = useState<any[]>([])
  const [title, setTitle] = useState<string>('')
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const { permissions } = useStates()
  useEffect(() => {
    const locName = location.pathname.includes('income')
      ? 'واریزی‌ های اخیر'
      : location.pathname.includes('outcome')
      ? 'برداشت‌ های اخیر'
      : location.pathname.includes('charging')
      ? 'موجودی در حال شارژ'
      : 'گزارش های اخیر'
    locName && setTitle(locName)
  }, [])

  useEffect(() => {
    const transformData = (dataArray: ITransactionAll[]) => {
      return dataArray?.map((data) => {
        const resultArray: any[] = []

        let statusText = ''
        if (data.status === 1) statusText = 'تسویه شده'
        else if (data.status === 0) statusText = 'موفق'
        else if (data.status === 7) statusText = 'تسویه شده'
        else if (data.status === 2) statusText = 'لغو شده'
        else if (data.status === 3) statusText = 'حذف شده'
        else if ([87, 8].includes(data.status)) statusText = ' منقضی شده'

        let ttypeText = ''
        if (data.ttype === '1') ttypeText = 'واریز'
        else if (data.ttype === '2') ttypeText = 'برداشت'

        resultArray[0] = data.pan
        resultArray[1] = data.pan_name
        resultArray[2] = data.mobile
        resultArray[3] = data.originalAmount?.split('.')[0]
        resultArray[4] = permissions[1]?.includes('720')
          ? data.amount?.split('.')[0]
          : data.transactionDate_pe + ' ' + data.transactionTime
        resultArray[5] = permissions[1]?.includes('720')
          ? data.transactionDate_pe + ' ' + data.transactionTime
          : statusText
        resultArray[6] = permissions[1]?.includes('720')
          ? statusText
          : data.transaction_code
        resultArray[7] = permissions[1]?.includes('720')
          ? data.transaction_code
          : ttypeText
        resultArray[8] = permissions[1]?.includes('720')
          ? ttypeText
          : data.description

        if (permissions[1]?.includes('720')) {
          resultArray[9] = data.wage_cost?.split('.')[0]
          resultArray[10] = data.transaction_cost?.split('.')[0]
          resultArray[11] = data.description
        }

        return resultArray
      })
    }
    setGenerateExcelData(transformData(transactions))
  }, [permissions, transactions])

  return (
    <>
      <FilterReportsModal
        showFilter={showFilter}
        setData={setData}
        initialData={transactions}
        setShowFilter={setShowFilter}
      />
      {showFilter ? (
        ''
      ) : (
        <>
          <div className='sticky top-0 bg-white z-10 flex items-center justify-between mb-8 lg:mb-10'>
            <button
              className='!font-medium !text-primary !inline-flex !items-center !gap-2 !rounded-lg'
              onClick={() => (location.href = `/wallet`)}>
              <ArrowRight2 size='24' color='#2f27ce' />
              {title}
            </button>
            <div className='flex gap-3'>
              {/* <Tooltip title='فیلتر' arrow placement='bottom'> */}
              <button
                onClick={() => {
                  setShowFilter(true)
                  location.hash = 'nvdwavshoh'
                }}>
                <Filter size='24' color='#2f27ce' />
              </button>
              {/* </Tooltip> */}
              {/* <Tooltip title='خروجی اکسل' arrow placement='bottom'> */}
              <button>
                <ExcelGenerator rows={generateExcelData} />
              </button>
              {/* </Tooltip> */}
            </div>
          </div>
          <div className='mb-8'>
            <Reports
              type={
                ['موجودی در حال شارژ', 'گزارش های اخیر'].includes(title)
                  ? 'گزارشی'
                  : title === 'واریزی‌ های اخیر'
                  ? 'واریزی'
                  : title === 'برداشت‌ های خیر'
                  ? 'برداشتی'
                  : ''
              }
              withdrawData={transactions || []}
            />
          </div>
        </>
      )}
    </>
  )
}

export default WalletShowAll
