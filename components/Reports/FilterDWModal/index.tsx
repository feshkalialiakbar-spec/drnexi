import Calendar from '@/components/shared/Calendar'
import { ITransactionAll } from '@/services/reports'
import { CloseSquare } from 'iconsax-react'
import { useEffect, useRef, useState } from 'react'

const FilterableReports = ({
  initialData,
  setData,
  setShowFilter,
  showFilter,
  tab,
}: {
  initialData: ITransactionAll[]
  setData: (data: ITransactionAll[]) => void
  setShowFilter: (state: boolean) => void
  showFilter: boolean
  tab: number
}) => {
  const [defaultData, setDefaultData] = useState<{
    data: ITransactionAll[]
    tab: number
  }>()
  const [hasQuery,setHasQuery] =useState<boolean>(false)

  const filterRefs = useRef({
    status: '',
    payerName: '',
    mobile: '',
    sheba: '',
    fromPrice: '',
    toPrice: '',
    fromTime: '',
    toTime: '',
  })

  useEffect(() => {
    if (
      tab !== defaultData?.tab ||
      (initialData?.length && !defaultData?.data?.length)
    ) {
      setDefaultData({ data: initialData, tab })
    }
  }, [initialData, defaultData, tab])

  const compareJalaliDates = (date1: string, date2: string) => {
    const [year1, month1, day1] = date1.split('-').map(Number)
    const [year2, month2, day2] = date2.split('-').map(Number)

    if (year1 > year2) return 1
    if (year1 < year2) return -1

    if (month1 > month2) return 1
    if (month1 < month2) return -1

    if (day1 > day2) return 1
    if (day1 < day2) return -1
    // 1 date1 is later
    //-1 date1 is earlier
    return 0 // Dates are equal
  }
  const clearFilter = () => {
    setHasQuery(false)
    setData(defaultData?.data || [])
    filterRefs.current.status = ''
    filterRefs.current.payerName = ''
    filterRefs.current.mobile = ''
    filterRefs.current.sheba = ''
    filterRefs.current.fromPrice = ''
    filterRefs.current.toPrice = ''
    filterRefs.current.fromTime = ''
    filterRefs.current.toTime = ''
    setShowFilter(false)
  }

  const handleFilterSubmit = () => {
    location.hash = 'dwavsh'
    setData(defaultData?.data || [])

    let filteredData = defaultData?.data

    const {
      status,
      payerName,
      mobile,
      sheba,
      fromPrice,
      toPrice,
      fromTime,
      toTime,
    } = filterRefs.current

    if (status) {
      filteredData = filteredData?.filter(
        (item) => item.status.toString() === status
      )
    }

    if (payerName) {
      filteredData = filteredData?.filter((item) =>
        item.pan_name.toLowerCase().includes(payerName.toLowerCase())
      )
    }

    if (mobile) {
      filteredData = filteredData?.filter((item) =>
        item.mobile.includes(mobile)
      )
    }
    if (sheba) {
      filteredData = filteredData?.filter((item) => item.pan.includes(sheba))
    }
    if (fromPrice) {
      filteredData = filteredData?.filter(
        (item) =>
          item.originalAmount &&
          Number(item.originalAmount) >= Number(fromPrice)
      )
    }
    if (toPrice) {
      filteredData = filteredData?.filter(
        (item) =>
          item.originalAmount && Number(item.originalAmount) <= Number(toPrice)
      )
    }
    if (fromTime) {
      filteredData = filteredData?.filter(
        (item) => compareJalaliDates(item.transactionDate_pe, fromTime) != -1
      )
    }
    if (toTime) {
      filteredData = filteredData?.filter(
        (item) => compareJalaliDates(fromTime, item.transactionDate_pe) != -1
      )
    }
    setData(filteredData || [])
    setHasQuery(true)
    filterRefs.current.status = ''
    filterRefs.current.payerName = ''
    filterRefs.current.mobile = ''
    filterRefs.current.sheba = ''
    filterRefs.current.fromPrice = ''
    filterRefs.current.toPrice = ''
    filterRefs.current.fromTime = ''
    filterRefs.current.toTime = ''
    setShowFilter(false)
  }

  return (
    <>
      {showFilter && (
        <div
          className={`${
            showFilter ? 'animate-filter' : ''
          } bg-white px-1 py-2 absolute w-[93%] max-w-[850px] pb-40`}>
          <div className='flex items-center justify-between mb-8'>
            <p className='text-primary flex items-center gap-2'>
              <span className='text-base font-medium'>فیلتر</span>
            </p>
            <button
              className='!p-1 !min-w-0 !rounded-xl'
              onClick={handleFilterSubmit}>
              <CloseSquare size='32' color='#2f27ce' />
            </button>
          </div>
          {filterRefs.current.fromTime}
          <form className='space-y-4' onSubmit={handleFilterSubmit}>
            <label id='status-label'>وضعیت</label>
            <select
              defaultValue={filterRefs.current.status}
              className={`!w-full outline-none border rounded h-10 px-1 cursor-pointer `}
              onChange={(e) => {
                filterRefs.current.status = e.target.value
              }}>
              <option value=''> موفق/ تسویه شده/ در انتظار واریز </option>
              <option value='0'>موفق</option>
              <option value='1'>تسویه شده</option>
              <option value='7'>در انتظار</option>
              <option value='3'>حذف شده</option>
              <option value='2'>لغو شده</option>
            </select>

            <div className='flex-col flex gap-2'>
              <label id='payer-name-label'>نام و نام خانوادگی</label>
              <input
                id='payer_name'
                type='text'
                placeholder='علی اکبری'
                className='w-full !rounded-lg'
                defaultValue={filterRefs.current.payerName}
                onChange={(e) =>
                  (filterRefs.current.payerName = e.target.value)
                }
              />
            </div>

            <div className='flex-col flex gap-2'>
              <label id='mobile-label'>موبایل</label>
              <input
                id='mobile'
                type='text'
                placeholder='092377777777'
                className='w-full !rounded-lg'
                defaultValue={filterRefs.current.mobile}
                onChange={(e) => (filterRefs.current.mobile = e.target.value)}
              />
            </div>
            <div className='flex-col flex gap-2'>
              <label id='demo-simple-select-label !m-7'>شماره شبا</label>
              <input
                id='pan'
                type='number'
                placeholder='IR
1234-1123-4135-1312-1235-1456
12341123413513'
                className='w-full !rounded-lg'
                autoComplete='off'
                onChange={(e) => (filterRefs.current.sheba = e.target.value)}
                aria-autocomplete='none'
              />
            </div>
            <div className='flex-col flex gap-2'>
              <label id='demo-simple-select-label !m-7'>از مبلغ</label>

              <input
                id='amount_min'
                type='text'
                placeholder='10000 ریال'
                className='w-full !rounded-lg'
                autoComplete='off'
                // @ts-ignore
                onChange={(e) =>
                  (filterRefs.current.fromPrice = e.target.value)
                }
                defaultValue={filterRefs.current.fromPrice}
                aria-autocomplete='none'
              />
            </div>
            <div className='flex-col flex gap-2'>
              <label id='demo-simple-select-label !m-7'>تا مبلغ </label>

              <input
                id='amount_max'
                type='text'
                placeholder='1000000000 ریال'
                className='w-full !rounded-lg'
                autoComplete='off'
                onChange={(e) => (filterRefs.current.toPrice = e.target.value)}
                defaultValue={filterRefs.current.toPrice}
                aria-autocomplete='none'
              />
            </div>
            <div className='flex-col flex gap-2'>
              <label id='demo-simple-select-label !m-7'>از تاریخ</label>

              <Calendar
                setDate={(date) => (filterRefs.current.fromTime = date)}
              />
            </div>
            <div className='flex-col flex gap-2'>
              <label id='demo-simple-select-label !m-7'>تا تاریخ</label>
              <Calendar
                setDate={(date) => (filterRefs.current.toTime = date)}
              />
            </div>
            <div className='fixed flex gap-4 justify-center items-center pb-6 bottom-[1px] bg-white w-[91%] max-w-[840px]'>
              {hasQuery && (
                <button
                  className='w-full h-10 border-button flex justify-center items-center rounded cursor-pointer'
                  onClick={clearFilter}>
                  حذف فیلتر
                </button>
              )}
              <button
                className='h-10 !min-w-0 !rounded !bg-primary !text-white w-full'
                type='submit'>
                تایید
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default FilterableReports
