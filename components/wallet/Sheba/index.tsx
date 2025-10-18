'use client'
import ShebaButtonItem from './ShebaButtonItem'
import { getAccessToken } from '@/hooks/getAccessToken'
import {
  GetShabaDestinationList,
  IShabaDestinationList,
} from '@/services/withdraw'
import { ArrowRight2, SearchNormal, Slash } from 'iconsax-react'
import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import { useStates } from '@/Context'

const WithdrawSheba = () => {
  const [shebaList, setShebaList] = useState<IShabaDestinationList[]>([])
  const [filteredShebaList, setFilteredShebaList] = useState<
    IShabaDestinationList[]
  >([])
  const { permissions } = useStates()
  const [tab, setTab] = useState<number>(0)
  const getShebaList = useCallback(async () => {
    const accessToken = await getAccessToken()
    const sheba = await GetShabaDestinationList({ accessToken })
    if (sheba) {
      setShebaList(sheba)
      setFilteredShebaList(sheba)
    }
  }, [setShebaList])

  useEffect(() => {
    !shebaList.length && getShebaList()
  }, [getShebaList, shebaList])
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

  return (
    <>
      <Header />
      {permissions[1]?.includes('711') && (
        <>
          <div className='flex items-center justify-between gap-2 mb-8 lg:mb-10'>
            <button
              className='font-medium text-primary inline-flex items-center gap-2'
              onClick={() =>
                (location.href = `/wallet/withdraw`)
              }>
              <ArrowRight2 size='24' color='#2f27ce' />
              شماره شبا
            </button>

            <Slash
              className={`cursor-pointer text-[#2F27CE] `}
              onClick={() =>
                (location.href = `/wallet/sheba/disable-list`)
              }
            />
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
          <div className='flex mb-4 sm:mb-6'>
            <div
              className={`flex-1 border-b ${
                tab === 0 ? 'border-b-primary' : 'border-b-primary/15'
              }`}>
              <button
                className={`w-full flex justify-center !rounded-lg items-center gap-4 !py-3 ${
                  tab === 0 ? '!text-primary' : '!text-slate-400'
                }`}
                onClick={() => {
                  setTab(0)
                }}>
                مقصدهای اخیر
              </button>
            </div>

            <div
              className={`flex-1 border-b ${
                tab === 1 ? 'border-b-primary' : 'border-b-primary/15'
              }`}>
              <button
                className={`w-full text-center flex justify-center !rounded-lg items-center gap-2 !py-3 ${
                  tab === 1 ? '!text-primary' : '!text-slate-400'
                }`}
                onClick={() => {
                  setTab(1)
                }}>
                مقصدهای پر مراجعه
              </button>
            </div>
          </div>
          {filteredShebaList?.length ? (
            tab === 0 ? (
              filteredShebaList
                ?.slice(-5)
                .map((shaba, index) => (
                  <ShebaButtonItem
                    key={index}
                    bankCode={shaba.bank_code}
                    bankName={shaba.bank_name}
                    avatar='/images/sample-avatar.jpg'
                    username={shaba.fullname || ''}
                    shabaNumber={shaba.shaba || ''}
                    shabaId={shaba.sid || ''}
                    isDraggable={true}
                  />
                ))
            ) : (
              filteredShebaList.map((shaba, index) => (
                <ShebaButtonItem
                  key={index}
                  bankCode={shaba.bank_code}
                  bankName={shaba.bank_name}
                  avatar='/images/sample-avatar.jpg'
                  username={shaba.fullname || ''}
                  shabaNumber={shaba.shaba || ''}
                  shabaId={shaba.sid || ''}
                  isDraggable={true}
                />
              ))
            )
          ) : (
            <p>هنوز موردی ثبت نشده است.</p>
          )}
        </>
      )}
    </>
  )
}

export default WithdrawSheba
