'use client'

import Loading from '@/components/shared/LoadingSpinner'
import { RequestOTP } from '@/services/user'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

interface ISendSmsToMobile {
  mobile: string
}

interface IProps {
  setKeepPhone: (phone: string) => void
  setShowOtpInput: (value: boolean) => void
}

const InsertMobileForOtp = ({ setKeepPhone, setShowOtpInput }: IProps) => {
  const {
    control: controlSms,
    handleSubmit: handleSubmitSms,
    formState: { errors: smsErrors, isSubmitting: smsIsSubmitting },
  } = useForm<{ mobile: string }>()
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const sendSmsToMobileHandler: SubmitHandler<ISendSmsToMobile> = async (
    data
  ) => {
    console.log('Submitting:', data) // Check if this is logged
    try {
      const response = await RequestOTP({
        mobile: data.mobile,
        otptype: 'login'
      })

      if (!response) {
        return
      }

      if (response.message === 'mobile not found') {
        toast.error('کاربری با این شماره موبایل وجود ندارد!')
        return
      }

      setKeepPhone(data.mobile)
      setShowOtpInput(true)
      toast.success('پیامک رمز برای شما ارسال شد!')
    } catch (err: unknown) {
      console.log(err)
      toast.error('Error sending SMS. Please try again.')
    }
  }
  useEffect(() => {
    setIsMobile(window.innerWidth < 555)

    const handleViewportResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height

        // اگر ارتفاع viewport کمتر از مقدار اولیه باشد، نشان‌دهنده باز شدن کیبورد است
        if (viewportHeight < window.innerHeight) {
          setInputFocus(true)
        } else {
          setInputFocus(false)
        }
      }
    }

    window.visualViewport &&
      window.visualViewport.addEventListener('resize', handleViewportResize)
    return () => {
      window.visualViewport &&
        window.visualViewport.removeEventListener(
          'resize',
          handleViewportResize
        )
    }
  }, [])

  return (
    <form
      className={`flex flex-col justify-between mt-5 ${isMobile && inputFocus ? '' : ' min-h-[50vh] '
        }`}
      onSubmit={handleSubmitSms(sendSmsToMobileHandler)}>
      {/* {`${typingMode.inputFocus + '  ' + typingMode.isMobile } `} */}
      <div className='mb-6 sm:mb-8'>
        <label htmlFor='mobile'> شماره همراه</label>
        <Controller
          control={controlSms}
          name='mobile'
          rules={{
            required: {
              value: true,
              message: 'لطفا شماره موبایل خود را وارد کنید.',
            },
            minLength: {
              value: 11,
              message: 'شماره موبایل نباید کمتر از ۱۱ رقم باشد.',
            },
            maxLength: {
              value: 11,
              message: 'شماره موبایل نباید بیشتر از ۱۱ رقم باشد.',
            },
            pattern: {
              value: /^09\d{9}$/,
              message: 'شماره موبایل باید با ۰۹ شروع شود.',
            },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <input
              autoFocus
              id='mobile'
              type='tel'
              className='w-full !rounded-lg mt-4'
              autoComplete='off'
              onChange={onChange}
              ref={ref}
              value={value || ''}
            />
          )}
        />
        {smsErrors.mobile && (
          <p className='text-red-500'>{smsErrors.mobile.message}</p>
        )}
      </div>
      <button
        className='w-full !rounded-lg fill-button h-10 flex justify-center items-center'
        type='submit'
        disabled={smsIsSubmitting}>
        {smsIsSubmitting ? <Loading /> : 'ارسال کد'}
      </button>
    </form>
  )
}

export default InsertMobileForOtp
