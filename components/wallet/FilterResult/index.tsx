'use client'
import { useStates } from '@/Context'
import { CardReceive, CardSend } from 'iconsax-react'
import toast from 'react-hot-toast'

const FilterResult = () => {
  const { permissions } = useStates()

  return (
    <>
      <div className='flex gap-6 sm:gap-8 mb-10 sm:mb-12'>
        {permissions[1]?.includes('778') && (
          <button
            className='flex justify-center h-10 w-full text-white bg-red-500 rounded-lg items-center gap-1'
            onClick={
              () =>
                // toast.error(
                //   // 'سیستم در حال به‌روزرسانی است. لطفاً بعدا تلاش کنید. \nاز صبر و شکیبایی شما سپاسگزاریم.'
                //   'ضمن عرض پوزش سیستم بانکی با اختلال موقت همراه است.'
                // )
              location.pathname.includes('secretary/my-wallet')
                ? (location.href = `/${
                    location.pathname.split('/')[1]
                  }/wallet/withdraw#my`)
                : (location.href = 'wallet/withdraw')
            }
          >
            <CardSend size='24' color='#ffffff' />
            <span className='ms-1'>برداشت</span>
          </button>
        )}
        {permissions[1]?.includes('775') && (
          <button
            className='flex justify-center h-10 w-full text-white !bg-green-600 !rounded-lg items-center gap-1'
            onClick={() =>
               (location.href = 'wallet/deposit')

              // toast.error(
              //   'سیستم در حال به‌روزرسانی است. لطفاً بعدا تلاش کنید. \nاز صبر و شکیبایی شما سپاسگزاریم.'
              // )
            }
          >
            <CardReceive size='24' color='#ffffff' />
            <span className='ms-1'>واریز</span>
          </button>
        )}
      </div>
    </>
  )
}

export default FilterResult
