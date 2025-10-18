'use client'

import { useCallback, useEffect, useState } from 'react'
import { ITransactionAll } from '@/services/reports'
import {
  ArrangeVerticalSquare,
  Filter,
  ReceiveSquare,
  TransmitSquare,
} from 'iconsax-react'
import ExcelGenerator from '../../shared/GenerateExcel'
import Reports from '../Reports'
import Loading from '@/components/shared/LoadingSpinner'
import FilterableReports from '../FilterDWModal'
import { useStates } from '@/Context'

interface IProps {
  reports: { data: ITransactionAll[]; tabName: string }[]
  tab: number
  setTab: (tab: number) => void
  setData: (data: ITransactionAll[]) => void
  loading: boolean
}

const ShowAllReports = ({ reports, tab, setTab, setData, loading }: IProps) => {
  const { permissions } = useStates()
  const [generateExcelData, setGenerateExcelData] = useState<any[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)

  const transformData = useCallback((dataArray: ITransactionAll[]) => {
    return dataArray?.map((data) => {
      const resultArray: any[] = []

      let statusText = ''
      if (data.status === 1) {
        statusText = 'تسویه شده'
      } else if (data.status === 0) {
        statusText = 'موفق'
      } else if (data.status === 7) {
        statusText = 'در انتظار'
      } else if (data.status === 2) {
        statusText = 'لغو شده'
      } else if (data.status === 3) {
        statusText = 'حذف شده'
      } else if ([87, 8].includes(data.status)) statusText = ' منقضی شده'

      let ttypeText = ''
      if (data.ttype === '1') ttypeText = 'واریز'
      else if (data.ttype === '2') ttypeText = 'برداشت'

      resultArray[0] = data.pan_name
      resultArray[1] = data.mobile
      resultArray[2] = parseInt(`${data.originalAmount}`)
      resultArray[3] = permissions[1]?.includes('720')
        ? parseInt(`${data.amount}`)
        : data.transactionDate_pe + ' ' + data.transactionTime
      resultArray[4] = permissions[1]?.includes('720')
        ? data.transactionDate_pe + ' ' + data.transactionTime
        : statusText
      resultArray[5] = permissions[1]?.includes('720') ? statusText : ttypeText
      resultArray[6] = permissions[1]?.includes('720')
        ? ttypeText
        : data.transaction_code
      resultArray[7] = permissions[1]?.includes('720')
        ? data.transaction_code
        : data.description
      resultArray[8] = permissions[1]?.includes('720')
        ? data.wage_cost?.split('.')[0]
        : data.pan

      if (permissions[1]?.includes('720')) {
        resultArray[9] = data.transaction_cost?.split('.')[0]
        resultArray[10] = data.description
        resultArray[11] = data.pan
      }

      return resultArray
    })
  }, [permissions])
  useEffect(() => {
    if (reports[tab]?.data)
      setGenerateExcelData(transformData(reports[tab]?.data))
  }, [setGenerateExcelData, reports, tab, transformData])
  const changeTab = (index: number) => {
    setGenerateExcelData(transformData(reports[index]?.data))
    setTab(index)
  }
  return (
    <>
      <FilterableReports
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        initialData={reports[tab]?.data}
        setData={setData}
        tab={tab}
      />
      {showFilter ? (
        ''
      ) : (
        <>
          <div className='flex w-full justify-between'>
            <button
              className='!text-primary !mb-4 !rounded-lg items-center gap-1 flex '
              onClick={() => {
                setShowFilter(!showFilter)
                location.hash = 'nvdwavshoh'
              }}>
              <Filter size='24' color='#2f27ce' />
              فیلتر
            </button>
            <div
              className='cursor-pointer items-center gap-2'
              // onClick={() => alert('exportiad')}
            >
              {generateExcelData.length > 0 && (
                <ExcelGenerator rows={generateExcelData} />
              )}
            </div>
          </div>
          <div className='flex mb-4 sm:mb-6'>
            {!loading ? (
              reports?.map(
                (report, index) =>
                  reports.length > 1 && (
                    <div
                      key={index}
                      className={`flex-1 border-b ${
                        tab === index
                          ? 'border-b-primary'
                          : 'border-b-primary/15'
                      }`}>
                      <button
                        className={`w-full flex justify-center !rounded-lg items-center gap-4 !py-3 ${
                          tab === index ? '!text-primary' : '!text-slate-400'
                        }`}
                        onClick={() => {
                          changeTab(index)
                        }}>
                        {report.tabName === 'همه' ? (
                          <ArrangeVerticalSquare
                            size='24'
                            color={tab === index ? '#2f27ce' : '#94a3b8'}
                          />
                        ) : report.tabName === 'واریزی' ? (
                          <TransmitSquare
                            size='24'
                            color={tab === index ? '#2f27ce' : '#94a3b8'}
                          />
                        ) : (
                          report.tabName === 'برداشتی' && (
                            <ReceiveSquare
                              size='24'
                              color={tab === index ? '#2f27ce' : '#94a3b8'}
                            />
                          )
                        )}
                        {report.tabName}
                      </button>
                    </div>
                  )
              )
            ) : (
              <button
                className={`w-full flex justify-center items-center gap-4 !py-3 border-b border-b-blue-400 ${'!text-slate-400'}`}>
                در حال بارگیری اطلاعات
              </button>
            )}
          </div>
          {!loading ? (
            reports?.map(
              (report, index) =>
                tab === index && (
                  <Reports
                    key={index}
                    type={
                      ['واریزی', 'برداشتی'].includes(report.tabName)
                        ? report.tabName
                        : 'گزارشی'
                    }
                    withdrawData={report.data || []}
                  />
                )
            )
          ) : (
            <div className='w-full flex justify-center mt-40 '>
              <Loading />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ShowAllReports
