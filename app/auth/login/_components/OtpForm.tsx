'use client'

import { useToggleOtpForm } from '@/hooks/useToggle'
import { useState } from 'react'
import InsertMobileForOtp from './InsertMobileForOtp'
import InsertOtpForLogin from './InsertOtpForLogin'

const OtpForm = () => {
  const { setShowOtpForm } = useToggleOtpForm()
  const [keepPhone, setKeepPhone] = useState<string>('')
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false)

  const keptPhoneHandler = (phone: string) => {
    setKeepPhone(phone)
  }

  const toggleInputHandler = (value: boolean) => {
    setShowOtpInput(value)
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col '>
        <div className='grow mb-8'>
          {!showOtpInput ? (
            <div>
              <InsertMobileForOtp
                setKeepPhone={keptPhoneHandler}
                setShowOtpInput={toggleInputHandler}
              />
            </div>
          ) : (
            <div >
              <InsertOtpForLogin phone={keepPhone} setShowOtpForm={setShowOtpInput}/>
            </div>
          )}
        </div>
      </div>

      <div className='mt-2 sm:mt-2 text-center'>
        <button
          className='text-primary hover:underline'
          onClick={() => setShowOtpForm(false)}>
          ورود با رمز عبور ثابت
        </button>
      </div>
    </div>
  )
}

export default OtpForm
