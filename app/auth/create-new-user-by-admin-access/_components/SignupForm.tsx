'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import {
  MobileValidatorOtp,
  MobileValidatorRequest,
  SignupUser,
  UserLoginAPI,
} from '@/services/user'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useToggleSignupOtp } from '@/hooks/useToggle'
import { getAccessToken } from '@/hooks/getAccessToken'
import { Eye, EyeSlash, Key } from 'iconsax-react'
import OTPInput from '@/components/shared/OTPinput'
import { CheckMark } from '@/components/shared/IconGenerator'

export interface ISignupForm {
  subsys_id: 3
  auth_method: string
  identifier: string
  credential: string
  referral_code: string
  first_name: string
  last_name: string
  email: string

}
interface ILoginWithOtpHandler {
  otp_code: string
}

const SignupForm = () => {
  const { signupOTPForm, setSignupOTPForm } = useToggleSignupOtp()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [otp, setOtp] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)
  const secondInputRef = useRef<HTMLInputElement>(null)
  const [showRePassword, setShowRePassword] = useState(false)
  const [referrerCode, setReferrerCode] = useState<string>()
  const [validate, setValidate] = useState<{
    words: boolean
    number: boolean
    length: boolean
  }>({ words: false, number: false, length: false })

  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting},
  } = useForm<ISignupForm>()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const referrer = params.get('referrer')
    if (referrer) {
      setReferrerCode(referrer)
    }
  }, [setReferrerCode])

  const onSubmit: SubmitHandler<ISignupForm> = async (data: ISignupForm) => {
    try {
      if (Object.values(validate).includes(false)) {
        toast.error('لطفا شرط های مربوط به رمز را رعایت کنید')
        return
      }
      if (firstInputRef.current?.value !== secondInputRef.current?.value) {
        toast.error('عدم تطابق رمز')
      }
      const regirsterScheme: ISignupForm = {
        subsys_id: 3,
        auth_method: 'username_password',
        identifier: `${data.identifier}`,
        credential: `${firstInputRef?.current?.value}`,
        referral_code: `${data.referral_code}`,
        first_name: `${data.first_name}`,
        last_name: `${data.last_name}`,
        email: `user@example.com`,

      }
      const response = await SignupUser({ data: regirsterScheme })

      if (!response) {
        toast.error('خطای رخ داد، لطفا چند دقیقه دیگر تلاش کنید.')
        return
      }

      if (response.status == '-1') {
        toast.error(response.message)
        return
      }

      if (response.status == '1') {
        toast.success('ثبت نام با موفقیت انجام شد! لطفا وارد شوید.')
        router.push('/auth/login')
        return true
      }
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const {
    control: controlOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors, isSubmitting: otpIsSubmitting },
  } = useForm<ILoginWithOtpHandler>()

  const loginWithOtpHandler: SubmitHandler<ILoginWithOtpHandler> = async (
    data
  ) => {
    try {
      const accessToken = await getAccessToken()
      if (otp.length < 5) {
        toast.error('لطفا کد را وارد کنید')
        return
      }
      const response = await MobileValidatorRequest({
        otp_code: otp,
        accessToken: accessToken as string,
      })

      if (!response || response.status === '-1') {
        toast.error(response?.message || 'خطای پیش آمد! لطفا دوباره تلاش کنید.')
        return
      }

      toast.success('با موفقیت وارد شدید!')
      setTimeout(() => {
        router.push('/wallet')
        return true
      }, 700)
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const validator = () => {
    if (firstInputRef.current?.value.match(/(?=.*[a-z])(?=.*[A-Z])/)) {
      setValidate((prv) => ({
        words: true,
        number: prv.number,
        length: prv.length,
      }))
    } else {
      setValidate((prv) => ({
        words: false,
        number: prv.number,
        length: prv.length,
      }))
    }
    if (firstInputRef.current?.value.match(/(?=.*\d)(?=.*[!@#)`_(/$%^&*])/)) {
      setValidate((prv) => ({
        words: prv.words,
        number: true,
        length: prv.length,
      }))
    } else {
      setValidate((prv) => ({
        words: prv.words,
        number: false,
        length: prv.length,
      }))
    }
    if (`${firstInputRef.current?.value}`.length > 7) {
      setValidate((prv) => ({
        words: prv.words,
        number: prv.number,
        length: true,
      }))
    } else {
      setValidate((prv) => ({
        words: prv.words,
        number: prv.number,
        length: false,
      }))
    }
  }
  return (
    <>
      {referrerCode}
      {signupOTPForm ? (
        <>
          <p className='text-zinc-600 text-center mb-3'>
            رمز یکبار مصرف اس ام اس شده به موبایل تان را وارد کنید.
          </p>

          <form onSubmit={handleSubmitOtp(loginWithOtpHandler)}>
            <Controller
              control={controlOtp}
              name='otp_code'
              rules={{
                required: {
                  value: true,
                  message: 'لطفا کد ورود را وارد کنید.',
                },
              }}
              render={({ field: { onChange, value, ref } }) => (
                <div dir='ltr'>
                  <OTPInput setResult={setOtp} />
                </div>
              )}
            />
            {otpErrors?.otp_code && (
              <p className='mt-2 text-red-400'>
                {otpErrors?.otp_code?.message}
              </p>
            )}

            <div className='text-center mt-8'>
              <button
                className='w-full !rounded-lg'
                type='submit'
                disabled={otpIsSubmitting}>
                {otpIsSubmitting ? (
                  <svg
                    aria-hidden='true'
                    className='w-6 h-6 text-gray-200 animate-spin fill-white'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                ) : (
                  'ورود به دکترنکسی'
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <div className='grow mb-8'>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'این فیلد اجباری است.',
                  },
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <>
                    <label htmlFor='first_name'>نام</label>
                    <input
                      className='w-full !rounded-lg'
                      id='first_name'
                      onChange={onChange}
                      placeholder='نام'
                    />
                  </>
                )}
                name='first_name'
              />
              {errors?.first_name && (
                <p className='mt-2 text-red-400'>
                  {errors?.first_name?.message}
                </p>
              )}
            </div>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'این فیلد اجباری است.',
                  },
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <>
                    <label htmlFor='last_name'>نام خانوادگی</label>
                    <input
                      id='last_name'
                      placeholder='نام خانوادگی'
                      className='w-full !rounded-lg'
                      onChange={onChange}
                    />
                  </>
                )}
                name='last_name'
              />
              {errors?.last_name && (
                <p className='mt-2 text-red-400'>
                  {errors?.last_name?.message}
                </p>
              )}
            </div>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
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
                  <>
                    <label htmlFor='mobile'> موبایل</label>
                    <input
                      style={{ direction: 'ltr' }}
                      id='identifier'
                      type='tel'
                      placeholder='شماره موبایل'
                      className='w-full !rounded-lg'
                      onChange={onChange}
                    />
                  </>
                )}
                name='identifier'
              />
              {errors?.identifier && (
                <p className='mt-2 text-red-400'>{errors?.identifier?.message}</p>
              )}
            </div>
            <div className='mt-5'>
              <b>رمز عبور </b>
            </div>
            <div
              className='border rounded-lg p-1 mt-2 flex items-center'
              onClick={() => firstInputRef.current?.focus()}>
              <div className='absolute'>
                <Key />
              </div>
              <input
                className='w-full outline-none h-10 pr-7 border-none'
                placeholder='رمز عبور '
                autoFocus
                type={showPassword ? 'text' : 'password'}
                onChange={validator}
                ref={firstInputRef}
              />
              <div
                className='cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(event) => event.preventDefault()}>
                {showPassword ? (
                  <EyeSlash size='24' color='#111111' />
                ) : (
                  <Eye size='24' color='#111111' />
                )}
              </div>
            </div>
            <div className='flex flex-col my-6'>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.words ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل حروف کوچک و بزرگ انگلیسی</p>
              </div>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.length ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل حداقل ۸ کاراکتر</p>
              </div>
              <div className='flex items-center gap-3 my-2'>
                <CheckMark
                  color={`${validate.number ? '#2F27CE' : '#747B8E'}`}
                />
                <p>شامل عدد و کاراکتر خاص</p>
              </div>
            </div>
            <b className='mt-5'>تکرار رمز عبور جدید</b>
            <div
              className='border rounded-lg p-1 mt-2 flex items-center mb-8'
              onClick={() => secondInputRef.current?.focus()}>
              <div className='absolute'>
                <Key />
              </div>
              <input
                className='w-full outline-none h-10 border-none pr-7'
                placeholder='تکرار رمز عبور جدید'
                autoFocus
                type={showRePassword ? 'text' : 'password'}
                ref={secondInputRef}
              />
              <div
                className='cursor-pointer'
                onClick={() => setShowRePassword(!showRePassword)}
                onMouseDown={(event) => event.preventDefault()}>
                {showRePassword ? (
                  <EyeSlash size='24' color='#111111' />
                ) : (
                  <Eye size='24' color='#111111' />
                )}
              </div>
            </div>
            <div className='mb-6 sm:mb-8'>
              <Controller
                control={control}
                rules={{
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
                  <>
                    <label htmlFor='last_name'>شماره موبایل معرف</label>
                    <input
                      id='referral_code'
                      type='number'
                      placeholder='شماره موبایل معرف'
                      value={referrerCode || value}
                      disabled={
                        referrerCode && referrerCode?.length > 0 ? true : false
                      }
                      className={`w-full !rounded-lg ${referrerCode && referrerCode?.length < 0
                        ? 'reopacity-50'
                        : ''
                        }`}
                      onChange={onChange}
                    />
                  </>
                )}
                name='referral_code'
              />
              {errors?.referral_code && (
                <p className='mt-2 text-red-400'>
                  {errors?.referral_code?.message}
                </p>
              )}
            </div>
          </div>
          <div className='flex gap-4'>
            <button className='w-full border-button h-10 rounded'>ورود</button>
            <button
              className='w-full fill-button h-10 rounded'
              type='submit'
              disabled={isSubmitting}>
              {isSubmitting ? (
                <svg
                  aria-hidden='true'
                  className='w-6 h-6 text-gray-200 animate-spin fill-white'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
              ) : (
                'ثبت نام'
              )}
            </button>
          </div>
        </form>
      )}
    </>
  )
}

export default SignupForm
