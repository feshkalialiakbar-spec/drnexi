'use client'

import { useEffect, useState } from 'react'
import {
  GetCurrentUser,
  GetUserPermissions,
  LoginWithOtpAndMobile,
  RequestOTP,
  UserLoginAPI,
} from '@/services/user'
import {
  IAccessTokenResponse,
  setCurrentUsertoCookie,
  setTokenIntoCookie,
} from '@/actions/cookieToken'
import { ArrowRight2 } from 'iconsax-react'
import Loading from '../shared/Loading'
import OTPInput from '../../shared/OTPinput'
import Captcha from '../shared/Captcha'
import toast from 'react-hot-toast'

const Loginatimnage = () => {
  const [inputState, setInputState] = useState<'otp' | 'password'>('password')
  const [mobile, setMobile] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [captchaPass, setCaptchaPass] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    phone?: string
    password?: string
    captcha?: string
  }>({})

  const validateInputs = () => {
    const newErrors: typeof errors = {}
    if (!mobile || !/^09\d{9}$/.test(mobile))
      newErrors.phone = 'شماره معتبر نیست'
    if (inputState === 'password' && (!password || password.length < 6))
      newErrors.password = 'رمز عبور حداقل ۶ کاراکتر'
    if (!captchaPass) newErrors.captcha = 'کد امنیتی تایید نشده'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateInputs()) return

    try {
      setLoading(true)
      const response =
        inputState === 'password'
          ? await UserLoginAPI({ username: mobile, password })
          : await LoginWithOtpAndMobile({ mobile, otp })

      if (!response?.access_token) {
        setLoading(false)
        toast.error('ورود ناموفق')
        return
      }

      await setTokenIntoCookie({
        data: response as IAccessTokenResponse,
        mobile,
      })
      const currentUser = await GetCurrentUser({
        accessToken: response.access_token,
      })
      if (!currentUser) return

      await setCurrentUsertoCookie({ data: currentUser })

      if (currentUser?.user_role_id) {
        const result = await GetUserPermissions({
          accessToken: response.access_token,
          role_id: currentUser.user_role_id,
        })
        if (result) {
          const value = JSON.stringify(
            result.reduce(
              (acc, row) => {
                acc[0].push(row.menu_code)
                acc[1].push(row.form_code)
                acc[2].push(row.action_type)
                return acc
              },
              [[], [], []] as [string[], string[], number[]]
            )
          )
          document.cookie = `uzrprm=${encodeURIComponent(
            value
          )}; path=/; max-age=4200; SameSite=Lax`
        }
      }

      toast.success('ورود موفق')
      if (currentUser.user_status === 'INACTIVE')
        return (location.href = '/auth/validator')
      if (currentUser.approve_status !== 1)
        return toast.error('کاربر تأیید نشده')
      if (currentUser.user_status === 'DISABLED')
        return toast.error('کاربر غیرفعال است')

      localStorage.setItem('mobile', mobile)
      location.href = '/atministiyaramiyeytor/withdraw'
    } catch (err) {
      setLoading(false)
      console.error(err)
    }
  }

  useEffect(() => {
    const lastPhone = localStorage.getItem('mobile') || ''
    setMobile(lastPhone)
  }, [])

  return loading ? (
    <div className='flex justify-center items-center h-screen bg-white'>
      <Loading />
    </div>
  ) : (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0099A8] to-[#007d8f] px-4'>
      <div
        className={`w-full max-w-md md:max-w-[90%] ${inputState === 'otp' ? 'bg-blue-300' : 'bg-white'
          } rounded-2xl shadow-xl p-6`}
      >
        {inputState !== 'password' && (
          <button
            onClick={() => setInputState('password')}
            className='flex items-center text-[#0099A8] mb-4 hover:underline outline-none'
          >
            <ArrowRight2 size={20} />
            <span className='mr-2'>بازگشت</span>
          </button>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {inputState === 'password' && (
            <>
              <p className='text-center mb-6 text-gray-700 font-semibold'>
                ورود یا ثبت‌نام
              </p>

              <div className='flex flex-col gap-4'>
                <div className='flex gap-2 flex-col sm:flex-row'>
                  <input
                    type='tel'
                    placeholder='شماره موبایل'
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className='w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0099A8] transition'
                  />
                  <input
                    type='password'
                    placeholder='رمز عبور'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0099A8] transition'
                  />
                </div>
                {errors.phone && (
                  <p className='text-red-600 text-sm'>{errors.phone}</p>
                )}
                {errors.password && (
                  <p className='text-red-600 text-sm'>{errors.password}</p>
                )}

                <Captcha
                  setResult={(val: boolean) => {
                    setCaptchaPass(val)
                    if (val)
                      setErrors((prev) => {
                        const { captcha, ...rest } = prev
                        return rest
                      })
                  }}
                />
                {errors.captcha && (
                  <p className='text-red-600 text-sm'>{errors.captcha}</p>
                )}

                <div className='flex flex-col gap-2 mt-2'>
                  {inputState === 'password' && (
                    <div className='mt-4 flex flex-col gap-4'>
                      <button
                        type='submit'
                        onClick={handleLogin}
                        className='bg-[#0099A8] text-white py-2 rounded-lg hover:bg-[#007d8f] transition'
                      >
                        ورود
                      </button>
                    </div>
                  )}

                  <button
                    type='button'
                    onClick={async () => {
                      if (!validateInputs()) return
                      await RequestOTP({ mobile, otptype: 'login' })
                      setInputState('otp')
                    }}
                    className='border border-[#0099A8] text-[#0099A8] py-2 rounded-lg hover:bg-[#e6f8f9] transition'
                  >
                    دریافت کد یکبار مصرف
                  </button>
                </div>
              </div>
            </>
          )}

          {inputState === 'otp' && (
            <div className='mt-4'>
              <OTPInput setResult={setOtp} />
              <button
                onClick={handleLogin}
                className='mt-4 w-full bg-[#0099A8] text-white py-2 rounded-lg hover:bg-[#007d8f] transition'
              >
                تأیید کد
              </button>
            </div>
          )}

          <p className='mt-6 text-center text-sm text-[#555]'>
            حساب کاربری ندارید؟{' '}
            <span
              onClick={() => (location.href = '/auth/sign-up')}
              className='text-[#0099A8] cursor-pointer hover:underline'
            >
              ثبت‌نام کنید
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Loginatimnage
