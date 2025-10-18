'use client'
import ShebaButtonItem from '../ShebaButtonItem'
import { getAccessToken } from '@/hooks/getAccessToken'
import {
  EnableShebaDestination,
  GetDisableShabaList,
  IShabaDestinationList,
} from '@/services/withdraw'
import { ArrowRight2, SearchNormal, Slash } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import toast from 'react-hot-toast'
import Loading from '@/components/shared/LoadingSpinner'

const WithdrawSheba = () => {
  const [shebaList, setShebaList] = useState<IShabaDestinationList[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [filteredShebaList, setFilteredShebaList] = useState<
    IShabaDestinationList[]
  >([])

  const getShebaList = useCallback(async () => {
    const accessToken = await getAccessToken()
    const sheba = await GetDisableShabaList({ accessToken })
    if (sheba) {
      setShebaList(sheba)
      setFilteredShebaList(sheba)
    }
    setLoading(false)
  }, [setShebaList])

  useEffect(() => {
     getShebaList()
  }, [getShebaList])
  const searching = (value: string) => {
    const filteredData = shebaList?.filter(
      (item) =>
        item.shaba.toString().includes(value) ||
        item.bank_name.toString().includes(value) ||
        item.fullname.toString().includes(value) ||
        item.mobile.toString().includes(value) ||
        item.sdtitle.toString().includes(value)
    )
    setFilteredShebaList(filteredData)
  }
  const toggleAssistantStatus = async (sid: string, name: string) => {
    setFilteredShebaList((prv) => prv.filter((id) => id.sid !== sid))
    const accessToken = (await getAccessToken()) || ''
    await EnableShebaDestination({
      id: sid,
      accessToken,
    })

    toast.success(`شماره شبای ${name} با موفقیت فعال شد`)
  }

  return (
    <>
      <Header />
      <div className='flex items-center justify-between gap-2 mb-8 lg:mb-10'>
        <button
          className='font-medium text-primary inline-flex items-center gap-2'
          onClick={() =>
            (location.href = `/wallet/sheba`)
          }>
          <ArrowRight2 size='24' color='#2f27ce' />
          شباهای غیر فعال
        </button>
      </div>

      <div className='relative w-full flex items-center'>
        <div className='absolute right-2 cursor-pointer text-[#50545F]'>
          <SearchNormal />
        </div>
        <input
          type='search'
          className='w-full h-10 pl-10 pr-9 '
          placeholder='جستجو'
          onChange={(e) => searching(e.target.value)}
        />
      </div>

      {loading ? (
       <div className="m-5">
         <Loading />
       </div>
      ) : filteredShebaList?.length > 0 ? (
        filteredShebaList.map((shaba, index) => (
          <div className='flex justify-between items-center' key={index}>
            <ShebaButtonItem
              key={index}
              bankCode={shaba.bank_code}
              avatar='/images/sample-avatar.jpg'
              username={shaba.fullname || ''}
              shabaNumber={shaba.shaba || ''}
              shabaId={shaba.sid || ''}
            />
            <div className='flex items-center'>
              <input
                type='checkbox'
                className='sr-only'
                id={`checkbox-${index}`}
                checked={true}
                onChange={() =>
                  toggleAssistantStatus(shaba.sid || '', shaba.fullname)
                }
              />
              <label htmlFor={`checkbox-${index}`} className='cursor-pointer'>
                <div
                  className={`w-10 h-5 ${
                    shaba.sid ? 'bg-[#878FA4]' : 'bg-[#2F27CE]'
                  } rounded-full p-1 flex items-center`}>
                  <div
                    className={`w-4 h-4 bg-[#ffffff] rounded-full transition-transform transform ${
                      shaba.sid ? 'translate-x-[-100%]' : ''
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        ))
      ) : (
        <p className='m-5'>هنوز موردی ثبت نشده است.</p>
      )}
    </>
  )
}

export default WithdrawSheba
