'use client'

import { CardTick, MusicPlay, ReceiptSearch } from 'iconsax-react'

const SupportModal = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <>
      <div
        className={`fixed z-50 left-[20vw] top-[1vh] max-md:left-[0] max-md:w-[100%] max-md:h-[70vh] w-[60vw] h-[75vh] bg-white border border-gray-300 rounded-t-[30px] shadow-lg transition-transform duration-300 ease-in-out
      animate-slideUp 
      `}>
        <div className='flex flex-col items-center justify-center mt-6'>
          <span className='font-medium'>دکترنکسی</span>
          <span className='text-slate-400'>راه ارتباطی سریع ما با شما</span>

          <div className='w-full border-t border-slate-400 my-4'></div>

          <div className='flex flex-col mt-4 w-full'>
            {isAuthenticated && (
              <div
                className='flex  pr-5 mt-5 h-10  items-center cursor-pointer hover:bg-[#D9EDFF]'
                onClick={() => window.Goftino.open()}>
                <MusicPlay size='20' color='#125AE3' className='ml-3' />
                <span>پشتیبانی آنلاین</span>
              </div>
            )}
            <div
              className='flex  pr-5 mt-5  h-10 items-center cursor-pointer hover:bg-[#D9EDFF]'
              onClick={() => (location.href = '/questions')}>
              <ReceiptSearch size='20' color='#125AE3' className='ml-3' />
              <span>سوالات متداول</span>
            </div>

            {isAuthenticated && (
              <div
                className='flex  pr-5 mt-5  h-10 items-center cursor-pointer hover:bg-[#D9EDFF]'
                onClick={() => (location.href = '/questions#timeTable')}>
                <CardTick size='20' color='#125AE3' className='ml-3' />
                <span>جدول زمان بندی تسویه ها</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SupportModal
