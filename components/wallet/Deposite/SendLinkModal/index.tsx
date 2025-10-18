'use client'
import { CloseSquare, TickSquare } from 'iconsax-react'

interface IProps {
  showModal: boolean
  setShowModal: (value: boolean) => void
  mobile: string
}

const SendLinkModal = ({ showModal, setShowModal, mobile }: IProps) => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      <div className='bg-gray-900 absolute inset-0 opacity-30' onClick={() => location.reload()}></div>
      <div className='bg-white max-md:text-[12px] p-10 relative w-[90%] sm:w-full sm:mx-auto sm:max-w-[550px] rounded-2xl shadow-xl'>
        <button
          className='!p-1 !min-w-0 !rounded-xl'
          onClick={() => location.reload()}>
          <CloseSquare size='36' color='red' />
        </button>
        <div className='flex justify-center items-center flex-col text-green-600 gap-3'>
          {/* <CheckCircleIcon className="mb-3" style={{ fontSize: "3em" }} /> */}
          <span className='bg-green-600 rounded-xl'>
            <TickSquare size='40' color='#fff' />
          </span>
          <p className=' leading-relaxed'>
            پیامک واریز جهت پرداخت، به شماره {` ${mobile} `} ارسال شد.
            <br />
            <br />
            لطفاً توجه فرمایید:
            <br />
            مهلت پرداخت این لینک تا ساعت
            <span className='font-bold text-green-700 mx-1'>
              {new Date(Date.now() + 8 * 60 * 60 * 1000).toLocaleTimeString(
                'fa-IR',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }
              )}
            </span>
            می‌باشد.
            <br />
            پس از پایان مهلت، در صورت نیاز می‌توانید از بخش
            <br />
            <span className='font-semibold text-blue-600 mx-1'>
              «واریزی‌های منقضی‌شده»
            </span>
            نسبت به ارسال مجدد لینک اقدام فرمایید.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SendLinkModal
