'use client'

import {

  deleteAllCookies,
  setCurrentUsertoCookie,
  setTokenIntoCookie,
} from '@/actions/cookieToken'
import LoadingComponent from '@/components/Loading/page'
import OTPInput from '@/components/shared/OTPinput'
import {
  GetCurrentUser,
  GetUserPermissions,
  LoginWithOtpAndMobile,
  RequestOTP,
  UserLoginAPI,
} from '@/services/user'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const InsertOtpForLogin = ({
  phone,
  setShowOtpForm,
}: {
  phone: string
  setShowOtpForm: (state: boolean) => void
}) => {
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(120) // 120 seconds (2 minutes)
  const [showSendOtpButton, setShowSendOtpButton] = useState(false)
  const [otpButtonLoading, setOtpButtonLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setShowSendOtpButton(true)
    }
  }, [timeLeft])

  const loginWithOtpHandler = async (e: React.FormEvent) => {
    await deleteAllCookies()
    e.preventDefault()
    if (otp.length < 5) {
      setError('این فیلد اجباری است')
      return
    }
    setLoading(true)
    setIsSubmitting(true)
    setError('')
    try {
      const response = await UserLoginAPI({
        credential: otp,
        identifier: phone,
        auth: 'mobile_otp'
      })

      if (!response) {
        toast.error('خطایی پیش آمد!')
        setLoading(false)
        return
      }
      if (response.detail) toast.error(`${response.detail}`)
      if (response.message) toast.success(`${response.message}`)

      const currentUser = await GetCurrentUser({
        accessToken: response.access_token,
      })
      if (currentUser) await setCurrentUsertoCookie({ data: currentUser })
      if (response.status === '-1') {
        toast.error(response.message)
        setError(response.message)
        setLoading(false)
        return
      }
      if (!currentUser) return

      if (currentUser.user_status === 'INACTIVE') {
        location.href = '/auth/validator'
        return
      }
      if (
        currentUser.approve_status !== 1
        // ||
        // currentUser.user_approve_status !== 1
      ) {
        setLoading(false)
        toast.error('کاربر در انتظار تایید می باشد')
        return
      }
      if (currentUser.user_status === 'DISABLED') {
        setLoading(false)
        toast.error('کاربر غیر فعال می باشد')
        return
      }

      if (response.access_token) {
        await setTokenIntoCookie({
          data: response,
          mobile: phone,
        })
        toast.success(
          'هویت شما تایید شد. لطفا برای ورود چند لحظه منتظر بمانید!'
        )
        if (currentUser?.user_role_id) {
          await GetUserPermissions({
            accessToken: response.access_token,
            role_id: currentUser.user_role_id,
          }).then((result) => {
            if (result) {
              const value = JSON.stringify(
                result?.reduce(
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
          })
        }
        if (currentUser.role_count > 1) {
          location.href = '/select-wallet'
        } else {
          location.href = '/wallet'
        }
      }
    } catch (err: unknown) {
      console.log(err)
      setLoading(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setOtpButtonLoading(true)

    const response = await RequestOTP({ mobile: phone, otptype: 'login' })

    if (!response) {
      toast.error('خطایی رخ داد!')
      setOtpButtonLoading(false)
      return
    }

    if (response.message === 'mobile not found') {
      toast.error('کاربری با این شماره موبایل وجود ندارد!')
      setOtpButtonLoading(false)
      return
    }

    document.cookie =
      'otpchecktimetosendnewone=sendonotpandwaitforexpire; max-age=60;'

    toast.success('پیامک رمز مجددا با موفقیت برای شما ارسال شد.')
    setOtpButtonLoading(false)
    setTimeLeft(120)
    setShowSendOtpButton(false)
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
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <p className="text-zinc-600 text-center mb-3">
            رمز یکبار مصرف ارسال شده به شماره همراه {phone} را وارد کنید.
          </p>
          <form
            onSubmit={loginWithOtpHandler}
            className={`flex flex-col justify-between mt-5 ${isMobile && inputFocus ? '' : ' min-h-[50vh] '
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="my-2"
                onKeyDown={(e) => e.key === 'enter' && loginWithOtpHandler}
              >
                <OTPInput setResult={setOtp} />
              </div>
              {error && <div className="mt-2 text-red-500 mb-5">{error}</div>}
              <div className="text-center">
                {showSendOtpButton ? (
                  <button
                    className="text-primary"
                    onClick={handleResendOTP}
                    type="button"
                  >
                    {otpButtonLoading ? (
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200 animate-spin fill-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      'ارسال مجدد کد'
                    )}
                  </button>
                ) : (
                  <p className="text-amber-700">
                    {Math.floor(timeLeft / 60)}:
                    {('0' + (timeLeft % 60)).slice(-2)}
                  </p>
                )}
              </div>
              <button
                className="text-primary hover:underline"
                onClick={() => setShowOtpForm(false)}
              >
                ویرایش شماره همراه
              </button>
            </div>
            <div className="text-center">
              <button
                className="w-full !rounded-lg fill-button h-10 flex justify-center items-center"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  'ورود'
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </>
  )
}

export default InsertOtpForLogin
